"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Sparkles, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function Armor() {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/iron-man/iron-man-flight.glb");
  const model = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 3.4 / Math.max(size.y, size.x * 1.4, 0.01);
    model.scale.setScalar(scale);
    model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }, [model]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = (clock.elapsedTime % 10.5) / 10.5;
    const smooth = t * t * (3 - 2 * t);
    group.current.position.set(THREE.MathUtils.lerp(7.4, -7.2, smooth), -0.1 + Math.sin(t * Math.PI) * 0.55, 0.3 + Math.sin(t * Math.PI) * 1.2);
    group.current.rotation.set(-0.28 + Math.sin(t * Math.PI) * 0.11, -0.78, 0.26 - Math.sin(t * Math.PI) * 0.18);
  });

  return <group ref={group}><primitive object={model} /></group>;
}

function Scene() {
  return <>
    <color attach="background" args={["#080304"]} />
    <fog attach="fog" args={["#080304", 7, 19]} />
    <ambientLight intensity={0.65} />
    <directionalLight position={[5, 7, 6]} intensity={3.4} color="#ffe1c0" />
    <directionalLight position={[-5, 2, 3]} intensity={2.2} color="#bc141d" />
    <pointLight position={[0, 0, 4]} intensity={14} distance={9} color="#c8f7ff" />
    <Sparkles count={130} scale={[16, 8, 6]} size={2.1} speed={0.32} color="#ffb46b" />
    <Suspense fallback={null}><Armor /><Environment preset="warehouse" /></Suspense>
  </>;
}

export function IronManFlight() {
  return <div className="ironman-flight" aria-hidden="true"><Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 7], fov: 36 }} gl={{ antialias: true, powerPreference: "high-performance" }}><Scene /></Canvas><div className="ironman-flight-vignette" /></div>;
}

useGLTF.preload("/iron-man/iron-man-flight.glb");
