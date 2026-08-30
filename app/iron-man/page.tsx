import type { Metadata } from "next";
import { IronManCinematic } from "@/components/IronManCinematic";

export const metadata: Metadata = {
  title: "Iron Man | Marvel Nexus",
  description: "Secuencia cinematográfica original inspirada en una interfaz de armadura.",
};

export default function IronManPage() {
  return <IronManCinematic />;
}
