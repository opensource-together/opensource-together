"use client";
import ProjectDetailContent from "../components/ProjectDetailContent";


export default function ProjectDetailView({ projectId }: { projectId: string }) {
  return <ProjectDetailContent projectId={projectId} />;
}
