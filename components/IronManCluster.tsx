"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type ClusterFace = {
  mesh: THREE.Mesh;
  direction: THREE.Vector3;
  phase: number;
};

const FACE_EXTRUSION = 0.28;

function createFaceGeometry(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) {
  const centroid = a.clone().add(b).add(c).divideScalar(3);
  const direction = centroid.clone().normalize();
  const outerA = a.clone().addScaledVector(direction, FACE_EXTRUSION);
  const outerB = b.clone().addScaledVector(direction, FACE_EXTRUSION);
  const outerC = c.clone().addScaledVector(direction, FACE_EXTRUSION);
  const vertices = [
    a, c, b, outerA, outerB, outerC,
    a, b, outerA, b, outerB, outerA,
    b, c, outerB, c, outerC, outerB,
    c, a, outerC, a, outerA, outerC,
  ];
  const positions = new Float32Array(vertices.flatMap((vertex) => [
    vertex.x - centroid.x,
    vertex.y - centroid.y,
    vertex.z - centroid.z,
  ]));
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return { geometry, centroid, direction };
}

export function IronManCluster() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 5.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearAlpha(0);
    host.appendChild(renderer.domElement);

    const cluster = new THREE.Group();
    cluster.rotation.set(-0.14, -0.35, -0.08);
    scene.add(cluster);

    const faceMaterial = new THREE.MeshStandardMaterial({
      color: 0xb20d18,
      metalness: 0.86,
      roughness: 0.25,
      emissive: 0x310006,
      emissiveIntensity: 0.45,
      side: THREE.DoubleSide,
    });
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc247,
      emissive: 0xff3508,
      emissiveIntensity: 2.2,
      metalness: 0.25,
      roughness: 0.2,
      flatShading: true,
    });
    const sourceGeometry = new THREE.IcosahedronGeometry(1.35, 1).toNonIndexed();
    const positions = sourceGeometry.getAttribute("position");
    const faces: ClusterFace[] = [];

    for (let index = 0; index < positions.count; index += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(positions, index);
      const b = new THREE.Vector3().fromBufferAttribute(positions, index + 1);
      const c = new THREE.Vector3().fromBufferAttribute(positions, index + 2);
      const { geometry, centroid, direction } = createFaceGeometry(a, b, c);
      const mesh = new THREE.Mesh(geometry, faceMaterial);
      mesh.position.copy(centroid);
      cluster.add(mesh);
      faces.push({ mesh, direction, phase: index * 0.371 });
    }

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.08, 2), coreMaterial);
    cluster.add(core);
    scene.add(new THREE.HemisphereLight(0xffe3b0, 0x160005, 2.2));
    const keyLight = new THREE.PointLight(0xffe1a1, 24, 12);
    keyLight.position.set(2.4, 2.1, 3.6);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xe20b1d, 18, 10);
    rimLight.position.set(-3, -1.2, 1.5);
    scene.add(rimLight);

    const pointer = new THREE.Vector2();
    const targetPointer = new THREE.Vector2();
    const clock = new THREE.Clock();
    let frame = 0;

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      targetPointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -(((event.clientY - bounds.top) / bounds.height) * 2 - 1),
      );
    };
    const handlePointerLeave = () => targetPointer.set(0, 0);
    host.addEventListener("pointermove", handlePointerMove);
    host.addEventListener("pointerleave", handlePointerLeave);

    const render = () => {
      const elapsed = clock.getElapsedTime();
      pointer.lerp(targetPointer, 0.055);
      const interaction = Math.min(pointer.length(), 1);
      cluster.rotation.y = -0.35 + elapsed * (reduceMotion ? 0 : 0.12) + pointer.x * 0.2;
      cluster.rotation.x = -0.14 - pointer.y * 0.14;
      faces.forEach(({ mesh, direction, phase }) => {
        const pulse = reduceMotion ? 0.15 : (Math.sin(elapsed * 1.15 + phase) + 1) * 0.5;
        const distance = 0.03 + pulse * 0.22 + interaction * 0.17;
        mesh.position.copy(direction).multiplyScalar(1.35 + distance);
        const scale = 0.82 + pulse * 0.16 + interaction * 0.08;
        mesh.scale.setScalar(scale);
      });
      core.rotation.y = -elapsed * (reduceMotion ? 0 : 0.16);
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", handlePointerMove);
      host.removeEventListener("pointerleave", handlePointerLeave);
      sourceGeometry.dispose();
      core.geometry.dispose();
      faceMaterial.dispose();
      coreMaterial.dispose();
      faces.forEach(({ mesh }) => mesh.geometry.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="iron-cluster" aria-hidden="true" />;
}
