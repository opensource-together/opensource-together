export interface Chapter {
  slug: string;
  title: string;
  description?: string;
  order: number;
}

export const learnChapters: Chapter[] = [
  {
    slug: "getting-started",
    title: "Getting started with Open Source",
    order: 1,
  },
  {
    slug: "oss-as-a-system",
    title: "Open Source as a System",
    order: 2,
  },
  {
    slug: "exploring-oss-ecosystem",
    title: "Exploring the Open Source Ecosystem",
    order: 3,
  },
];

export const handsOnChapters: Chapter[] = [
  {
    slug: "finding-first-oss-project",
    title: "Finding your First Open Source Project",
    order: 1,
  },
  {
    slug: "understanding-oss-repository",
    title: "Understanding an Open Source Repository",
    order: 2,
  },
  {
    slug: "reading-and-understanding-issues",
    title: "Reading and Understanding Issues",
    order: 3,
  },
];

// Helper functions to get sorted chapters
export const getLearnChapters = () =>
  [...learnChapters].sort((a, b) => a.order - b.order);

export const getHandsOnChapters = () =>
  [...handsOnChapters].sort((a, b) => a.order - b.order);
