export interface Chapter {
  slug: string;
  title: string;
  description?: string;
  order: number;
}

export const learnChapters: Chapter[] = [
  {
    slug: "getting-started",
    title: "Chapter 1: Getting started with Open Source",
    order: 1,
  },
  {
    slug: "oss-as-a-system",
    title: "Chapter 2: Open Source as a System",
    order: 2,
  },
  {
    slug: "exploring-oss-ecosystem",
    title: "Chapter 3: Exploring the Open Source Ecosystem",
    order: 3,
  },
  {
    slug: "preparing-project-for-open-source",
    title: "Chapter 4: Preparing a Project for Open Source",
    order: 4,
  },
];

export const handsOnChapters: Chapter[] = [
  {
    slug: "finding-first-oss-project",
    title: "Chapter 1: Finding your First Open Source Project",
    order: 1,
  },
  {
    slug: "understanding-oss-repository",
    title: "Chapter 2: Understanding an Open Source Repository",
    order: 2,
  },
  {
    slug: "reading-and-understanding-issues",
    title: "Chapter 3: Reading and Understanding Issues",
    order: 3,
  },
  {
    slug: "creating-your-first-issue",
    title: "Chapter 4: Creating Your First Issue",
    order: 4,
  },
];

// Helper functions to get sorted chapters
export const getLearnChapters = () =>
  [...learnChapters].sort((a, b) => a.order - b.order);

export const getHandsOnChapters = () =>
  [...handsOnChapters].sort((a, b) => a.order - b.order);
