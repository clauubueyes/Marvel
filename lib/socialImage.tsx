import { ImageResponse } from "next/og";

export const socialImageSize = { width: 1200, height: 630 };

export function createSocialImage({ kicker, title, subtitle, accent = "#b9d737" }: { kicker: string; title: string; subtitle: string; accent?: string }) {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", padding: "65px 75px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#edf1e5", background: "#080b07", fontFamily: "Arial, sans-serif", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", width: 520, height: 520, right: -130, top: -180, border: `2px solid ${accent}`, borderRadius: "50%", opacity: .35, boxShadow: `0 0 0 70px ${accent}18, 0 0 0 140px ${accent}0d` }} />
    <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 18, letterSpacing: 4, color: accent }}><span style={{ width: 45, height: 4, background: accent }} />{kicker}</div>
    <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}><div style={{ fontSize: title.length > 32 ? 70 : 92, lineHeight: .92, fontWeight: 900, textTransform: "uppercase", letterSpacing: -3 }}>{title}</div><div style={{ maxWidth: 800, marginTop: 28, color: "#aab3a1", fontSize: 22, lineHeight: 1.45 }}>{subtitle}</div></div>
    <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 27, fontWeight: 900, letterSpacing: 3 }}><span style={{ width: 42, height: 48, display: "flex", alignItems: "center", justifyContent: "center", color: "white", background: accent }}>N</span>NEXUS</div>
  </div>, socialImageSize);
}
