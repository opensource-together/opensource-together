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
  {
    slug: "licensing-and-legal-foundations",
    title: "Chapter 5: Licensing and Legal Foundations",
    order: 5,
  },
  {
    slug: "structuring-an-open-source-repository",
    title: "Chapter 6: Structuring an Open Source Repository",
    order: 6,
  },
  {
    slug: "writing-documentation-that-scales",
    title: "Chapter 7: Writing Documentation That Scales",
    order: 7,
  },
  {
    slug: "contributing-to-existing-projects",
    title: "Chapter 8: Contributing to Existing Projects",
    order: 8,
  },
  {
    slug: "designing-a-contributor-experience",
    title: "Chapter 9: Designing a Contributor Experience",
    order: 9,
  },
  {
    slug: "community-governance-and-trust",
    title: "Chapter 10: Community, Governance, and Trust",
    order: 10,
  },
  {
    slug: "security-maintenance-and-long-term-ownership",
    title: "Chapter 11: Security, Maintenance, and Long-Term Ownership",
    order: 11,
  },
  {
    slug: "launching-and-growing-an-oss-project",
    title: "Chapter 12: Launching and Growing an Open Source Project",
    order: 12,
  },
  {
    slug: "open-source-and-career-growth",
    title: "Chapter 13: Open Source and Career Growth",
    order: 13,
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
  {
    slug: "forking-repository-and-setting-up-locally",
    title: "Chapter 5: Forking a Repository and Setting Up Locally",
    order: 5,
  },
  {
    slug: "making-your-first-code-change",
    title: "Chapter 6: Making Your First Code Change",
    order: 6,
  },
  {
    slug: "creating-a-pull-request",
    title: "Chapter 7: Creating a Pull Request",
    order: 7,
  },
  {
    slug: "responding-to-code-reviews",
    title: "Chapter 8: Responding to Code Reviews",
    order: 8,
  },
  {
    slug: "when-a-pull-request-is-not-accepted",
    title: "Chapter 9: When a Pull Request Is Not Accepted",
    order: 9,
  },
  {
    slug: "contributing-without-writing-code",
    title: "Chapter 10: Contributing Without Writing Code",
    order: 10,
  },
  {
    slug: "becoming-a-regular-contributor",
    title: "Chapter 11: Becoming a Regular Contributor",
    order: 11,
  },
  {
    slug: "understanding-maintainer-responsibilities",
    title: "Chapter 12: Understanding Maintainer Responsibilities",
    order: 12,
  },
  {
    slug: "maintaining-your-first-oss-project",
    title: "Chapter 13: Maintaining Your First Open Source Project",
    order: 13,
  },
];

// Helper functions to get sorted chapters
export const getLearnChapters = () =>
  [...learnChapters].sort((a, b) => a.order - b.order);

export const getHandsOnChapters = () =>
  [...handsOnChapters].sort((a, b) => a.order - b.order);
