"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import Icon from "@/shared/components/ui/icon";

interface ProjectReadmeProps {
  readme?: string;
}

export default function ProjectReadme({ readme }: ProjectReadmeProps) {
  if (!readme) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="fileText" size="sm" />
          README
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="markdown-content max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Style des liens
              a: ({ node, ...props }) => (
                <a {...props} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" />
              ),
              // Style des titres
              h1: ({ node, ...props }) => (
                <h1 {...props} className="text-2xl font-bold mt-6 mb-4" />
              ),
              h2: ({ node, ...props }) => (
                <h2 {...props} className="text-xl font-semibold mt-5 mb-3" />
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} className="text-lg font-medium mt-4 mb-2" />
              ),
              h4: ({ node, ...props }) => (
                <h4 {...props} className="text-base font-medium mt-3 mb-2" />
              ),
              // Style des paragraphes
              p: ({ node, ...props }) => (
                <p {...props} className="mb-4 leading-relaxed" />
              ),
              // Style des blocs de code
              pre: ({ node, ...props }) => (
                <pre {...props} className="bg-muted p-4 rounded-md overflow-x-auto mb-4" />
              ),
              code: ({ node, inline, ...props }) => (
                inline ? (
                  <code {...props} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" />
                ) : (
                  <code {...props} className="text-sm font-mono" />
                )
              ),
              // Style des listes
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc pl-6 mb-4 space-y-1" />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal pl-6 mb-4 space-y-1" />
              ),
              li: ({ node, ...props }) => (
                <li {...props} className="leading-relaxed" />
              ),
              // Style des blockquotes
              blockquote: ({ node, ...props }) => (
                <blockquote {...props} className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" />
              ),
              // Style des images
              img: ({ node, ...props }) => (
                <img {...props} className="rounded-md max-w-full h-auto my-4" />
              ),
              // Style des tableaux
              table: ({ node, ...props }) => (
                <table {...props} className="border-collapse w-full my-4" />
              ),
              thead: ({ node, ...props }) => (
                <thead {...props} className="border-b" />
              ),
              th: ({ node, ...props }) => (
                <th {...props} className="border border-border px-4 py-2 text-left font-semibold bg-muted/50" />
              ),
              td: ({ node, ...props }) => (
                <td {...props} className="border border-border px-4 py-2" />
              ),
              // Style des lignes horizontales
              hr: ({ node, ...props }) => (
                <hr {...props} className="my-6 border-border" />
              ),
              // Style des éléments strong et em
              strong: ({ node, ...props }) => (
                <strong {...props} className="font-semibold" />
              ),
              em: ({ node, ...props }) => (
                <em {...props} className="italic" />
              ),
            }}
          >
            {readme}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}