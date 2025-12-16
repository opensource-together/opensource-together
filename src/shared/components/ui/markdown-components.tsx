"use client";

import type { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import { useState } from "react";
import { HiMiniCheck } from "react-icons/hi2";
import { LuCopy } from "react-icons/lu";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
  [key: string]: unknown;
}

interface MarkdownElementProps {
  children: ReactNode;
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href?: string;
}

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface CopyButtonProps {
  text: string;
}

function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded bg-accent p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-ost-blue-three"
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
      title={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <HiMiniCheck className="h-4 w-4" />
      ) : (
        <LuCopy className="h-4 w-4" />
      )}
    </button>
  );
}

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const codeText = String(children).replace(/\n$/, "");

  if (language) {
    return (
      <div className="relative rounded-md bg-accent pr-2">
        <div className="flex flex-row">
          <SyntaxHighlighter
            style={oneLight}
            language={language}
            PreTag="div"
            className="m-0 w-full overflow-x-auto whitespace-pre pr-10"
            customStyle={{
              margin: "0",
              fontSize: "0.875rem",
              lineHeight: "1.5",
              background: "transparent",
              color: "hsl(var(--accent-foreground))",
              padding: "0.5rem",
            }}
            {...props}
          >
            {codeText}
          </SyntaxHighlighter>
          <div className="absolute inset-y-0 right-2 flex items-center">
            <CopyButton text={codeText} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <code className="rounded bg-accent px-1 py-0.5 font-mono text-accent-foreground text-sm">
      {children}
    </code>
  );
}

export const issueMarkdownComponents = {
  h1: ({ children }: MarkdownElementProps) => (
    <h1 className="mb-4 font-semibold text-xl">{children}</h1>
  ),
  h2: ({ children }: MarkdownElementProps) => (
    <h2 className="mt-6 mb-3 font-semibold text-lg">{children}</h2>
  ),
  h3: ({ children }: MarkdownElementProps) => (
    <h3 className="mt-4 mb-2 font-medium text-base">{children}</h3>
  ),
  p: ({ children }: MarkdownElementProps) => (
    <p className="mb-3 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: MarkdownElementProps) => (
    <ul className="mb-3 list-disc space-y-1 pl-6">{children}</ul>
  ),
  ol: ({ children }: MarkdownElementProps) => (
    <ol className="mb-3 list-decimal space-y-1 pl-6">{children}</ol>
  ),
  li: ({ children }: MarkdownElementProps) => (
    <li className="leading-relaxed">{children}</li>
  ),
  code: CodeBlock,
  pre: ({ children }: MarkdownElementProps) => <>{children}</>,
  blockquote: ({ children }: MarkdownElementProps) => (
    <blockquote className="mb-3 border-border border-l-4 pl-4 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: LinkProps) => (
    <a
      href={href}
      className="text-ost-blue-three underline hover:text-ost-blue-four"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  img: ({ src, alt, width, height }: ImageProps) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="my-3 inline-block h-auto max-w-full rounded border-border"
    />
  ),
  table: ({ children }: MarkdownElementProps) => (
    <div className="mb-3 overflow-x-auto">
      <table className="min-w-full border-collapse border border-border">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: MarkdownElementProps) => (
    <th className="border border-border bg-accent px-3 py-2 text-left font-medium text-accent-foreground text-sm">
      {children}
    </th>
  ),
  td: ({ children }: MarkdownElementProps) => (
    <td className="border border-border px-3 py-2 text-sm">{children}</td>
  ),
};

export const readmePreviewMarkdownComponents = {
  h1: ({ children }: MarkdownElementProps) => (
    <h1 className="mb-2 font-medium text-lg">{children}</h1>
  ),
  h2: ({ children }: MarkdownElementProps) => (
    <h2 className="mb-1 font-medium text-base">{children}</h2>
  ),
  h3: ({ children }: MarkdownElementProps) => (
    <h3 className="mb-1 font-medium text-base">{children}</h3>
  ),
  p: ({ children }: MarkdownElementProps) => (
    <p className="mb-2 text-muted-foreground text-sm">{children}</p>
  ),
  ul: ({ children }: MarkdownElementProps) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 text-muted-foreground text-sm">
      {children}
    </ul>
  ),
  ol: ({ children }: MarkdownElementProps) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 text-muted-foreground text-sm">
      {children}
    </ol>
  ),
  li: ({ children }: MarkdownElementProps) => (
    <li className="text-muted-foreground leading-relaxed">{children}</li>
  ),
  code: CodeBlock,
  pre: ({ children }: MarkdownElementProps) => (
    <pre className="mb-2 overflow-x-auto rounded-lg bg-accent p-3 text-accent-foreground text-xs">
      {children}
    </pre>
  ),
  blockquote: ({ children }: MarkdownElementProps) => (
    <blockquote className="mb-2 border-border border-l-4 pl-3 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  a: ({ children }: MarkdownElementProps) => (
    <span
      className="pointer-events-none cursor-default select-text font-medium text-muted-foreground text-sm"
      aria-disabled
    >
      {children}
    </span>
  ),
  img: ({ src, alt, width, height }: ImageProps) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="my-3 inline-block h-auto max-w-full rounded border-border"
    />
  ),
  table: ({ children }: MarkdownElementProps) => (
    <div className="mb-2 overflow-x-auto">
      <table className="min-w-full border-collapse border border-border">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: MarkdownElementProps) => (
    <th className="border border-border bg-accent px-3 py-2 text-left font-medium text-accent-foreground text-sm">
      {children}
    </th>
  ),
  td: ({ children }: MarkdownElementProps) => (
    <td className="border border-border px-3 py-2 text-muted-foreground text-sm">
      {children}
    </td>
  ),
};

export const readmeFullMarkdownComponents = {
  h1: ({ children }: MarkdownElementProps) => (
    <h1 className="mb-4 font-semibold text-2xl">{children}</h1>
  ),
  h2: ({ children }: MarkdownElementProps) => (
    <h2 className="mt-6 mb-3 font-semibold text-xl">{children}</h2>
  ),
  h3: ({ children }: MarkdownElementProps) => (
    <h3 className="mt-4 mb-2 font-medium text-lg">{children}</h3>
  ),
  p: ({ children }: MarkdownElementProps) => (
    <p className="mb-3 leading-relaxed">{children}</p>
  ),
  ul: ({ children }: MarkdownElementProps) => (
    <ul className="mb-3 list-disc space-y-1 pl-6">{children}</ul>
  ),
  ol: ({ children }: MarkdownElementProps) => (
    <ol className="mb-3 list-decimal space-y-1 pl-6">{children}</ol>
  ),
  li: ({ children }: MarkdownElementProps) => (
    <li className="leading-relaxed">{children}</li>
  ),
  code: CodeBlock,
  pre: ({ children }: MarkdownElementProps) => <>{children}</>,
  blockquote: ({ children }: MarkdownElementProps) => (
    <blockquote className="mb-3 border-border border-l-4 pl-4 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: LinkProps) => (
    <a
      href={href}
      className="text-ost-blue-three underline hover:text-ost-blue-four"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  img: ({ src, alt, width, height }: ImageProps) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="my-3 inline-block h-auto max-w-full rounded border-border"
    />
  ),
  table: ({ children }: MarkdownElementProps) => (
    <div className="mb-3 overflow-x-auto">
      <table className="min-w-full border-collapse border border-border">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: MarkdownElementProps) => (
    <th className="border border-border bg-accent px-3 py-2 text-left font-medium text-accent-foreground text-sm">
      {children}
    </th>
  ),
  td: ({ children }: MarkdownElementProps) => (
    <td className="border border-border px-3 py-2 text-sm">{children}</td>
  ),
};
