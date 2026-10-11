import { ImageResponse } from "next/og";
import { getProject, publicProjects } from "@/content/projects";
import { site } from "@/content/site";
import { OgFrame, ogFonts, ogSize } from "@/lib/og";

export const alt = "Case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return publicProjects().map((p) => ({ slug: p.slug }));
}

export default async function CaseOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  const title = project?.title ?? "Case study";
  return new ImageResponse(
    (
      <OgFrame kicker={`Case study ${project?.index ?? ""} · ${project?.category ?? ""}`} footer={`${site.name} · ${site.role}`}>
        <div style={{ fontSize: title.length > 24 ? 92 : 112, lineHeight: 1, letterSpacing: -4, fontWeight: 500, maxWidth: 1000 }}>{title}</div>
        <div style={{ marginTop: 28, fontSize: 30, color: "#a9b3c6", maxWidth: 980, lineHeight: 1.35 }}>{project?.tagline ?? ""}</div>
      </OgFrame>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
