import fs from "node:fs";
import path from "node:path";

interface ChapterContent {
  content: string;
  frontmatter: {
    title?: string;
    description?: string;
  };
}

function parseFrontmatter(content: string): ChapterContent {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const markdownContent = frontmatterMatch ? frontmatterMatch[2] : content;

  const frontmatter: { title?: string; description?: string } = {};
  if (frontmatterMatch) {
    const frontmatterText = frontmatterMatch[1];
    const titleMatch = frontmatterText.match(/^title:\s*["'](.+?)["']/m);
    const descriptionMatch = frontmatterText.match(
      /^description:\s*["'](.+?)["']/m
    );

    if (titleMatch) {
      frontmatter.title = titleMatch[1];
    }
    if (descriptionMatch) {
      frontmatter.description = descriptionMatch[1];
    }
  }

  return { content: markdownContent, frontmatter };
}

function loadContentFromDir(
  dir: string,
  type: "learn" | "hands-on"
): Record<string, ChapterContent> {
  const map: Record<string, ChapterContent> = {};

  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith(".mdx")) {
        const slug = file.replace(".mdx", "");
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, "utf-8");
        map[`${type}:${slug}`] = parseFrontmatter(content);
      }
    }
  } catch (error) {
    console.warn(`Could not load content from ${dir}:`, error);
  }

  return map;
}

const contentDir = path.join(process.cwd(), "content");
const learnDir = path.join(contentDir, "learn");
const handsOnDir = path.join(contentDir, "hands-on");

const learnContent = loadContentFromDir(learnDir, "learn");
const handsOnContent = loadContentFromDir(handsOnDir, "hands-on");

const contentMap: Record<string, ChapterContent> = {
  ...learnContent,
  ...handsOnContent,
};

export function getChapterContent(
  slug: string,
  type: "learn" | "hands-on"
): ChapterContent | null {
  const key = `${type}:${slug}`;
  return contentMap[key] || null;
}
