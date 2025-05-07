"use client";

import React from 'react';
import ProjectDetailView from '@/features/projects/views/ProjectDetailView';

interface ProjectPageProps {
  params: {
    slug: string;
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return <ProjectDetailView slug={params.slug} />;
} 