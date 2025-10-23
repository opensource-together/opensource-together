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
      className="bg-accent text-muted-foreground hover:bg-muted hover:text-ost-blue-three rounded p-1.5 transition-colors"
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
      <div className="bg-accent relative rounded-md pr-2">
        <div className="flex flex-row">
          <SyntaxHighlighter
            style={oneLight}
            language={language}
            PreTag="div"
            className="m-0 w-full overflow-x-auto pr-10 whitespace-pre"
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
    <code className="bg-accent text-accent-foreground rounded px-1 py-0.5 font-mono text-sm">
      {children}
    </code>
  );
}

export const issueMarkdownComponents = {
  h1: ({ children }: MarkdownElementProps) => (
    <h1 className="mb-4 text-xl font-semibold">{children}</h1>
  ),
  h2: ({ children }: MarkdownElementProps) => (
    <h2 className="mt-6 mb-3 text-lg font-semibold">{children}</h2>
  ),
  h3: ({ children }: MarkdownElementProps) => (
    <h3 className="mt-4 mb-2 text-base font-medium">{children}</h3>
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
    <blockquote className="border-border text-muted-foreground mb-3 border-l-4 pl-4 italic">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: LinkProps) => (
    <a
      href={href}
      className="text-ost-blue-three hover:text-ost-blue-four underline"
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
      className="border-border my-3 inline-block h-auto max-w-full rounded"
    />
  ),
  table: ({ children }: MarkdownElementProps) => (
    <div className="mb-3 overflow-x-auto">
      <table className="border-border min-w-full border-collapse border">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: MarkdownElementProps) => (
    <th className="bg-accent text-accent-foreground border-border border px-3 py-2 text-left text-sm font-medium">
      {children}
    </th>
  ),
  td: ({ children }: MarkdownElementProps) => (
    <td className="border-border border px-3 py-2 text-sm">{children}</td>
  ),
};

export const readmePreviewMarkdownComponents = {
  h1: ({ children }: MarkdownElementProps) => (
    <h1 className="mb-2 text-lg font-medium">{children}</h1>
  ),
  h2: ({ children }: MarkdownElementProps) => (
    <h2 className="mb-1 text-base font-medium">{children}</h2>
  ),
  h3: ({ children }: MarkdownElementProps) => (
    <h3 className="mb-1 text-base font-medium">{children}</h3>
  ),
  p: ({ children }: MarkdownElementProps) => (
    <p className="text-muted-foreground mb-2 text-sm">{children}</p>
  ),
  ul: ({ children }: MarkdownElementProps) => (
    <ul className="text-muted-foreground mb-2 list-disc space-y-1 pl-5 text-sm">
      {children}
    </ul>
  ),
  ol: ({ children }: MarkdownElementProps) => (
    <ol className="text-muted-foreground mb-2 list-decimal space-y-1 pl-5 text-sm">
      {children}
    </ol>
  ),
  li: ({ children }: MarkdownElementProps) => (
    <li className="text-muted-foreground leading-relaxed">{children}</li>
  ),
  code: CodeBlock,
  pre: ({ children }: MarkdownElementProps) => (
    <pre className="bg-accent text-accent-foreground mb-2 overflow-x-auto rounded-lg p-3 text-xs">
      {children}
    </pre>
  ),
  blockquote: ({ children }: MarkdownElementProps) => (
    <blockquote className="border-border text-muted-foreground mb-2 border-l-4 pl-3 italic">
      {children}
    </blockquote>
  ),
  a: ({ children }: MarkdownElementProps) => (
    <span
      className="text-muted-foreground pointer-events-none cursor-default text-sm font-medium select-text"
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
      className="border-border my-3 inline-block h-auto max-w-full rounded"
    />
  ),
  table: ({ children }: MarkdownElementProps) => (
    <div className="mb-2 overflow-x-auto">
      <table className="border-border min-w-full border-collapse border">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: MarkdownElementProps) => (
    <th className="bg-accent text-accent-foreground border-border border px-3 py-2 text-left text-sm font-medium">
      {children}
    </th>
  ),
  td: ({ children }: MarkdownElementProps) => (
    <td className="border-border text-muted-foreground border px-3 py-2 text-sm">
      {children}
    </td>
  ),
};

export const readmeFullMarkdownComponents = {
  h1: ({ children }: MarkdownElementProps) => (
    <h1 className="mb-4 text-2xl font-semibold">{children}</h1>
  ),
  h2: ({ children }: MarkdownElementProps) => (
    <h2 className="mt-6 mb-3 text-xl font-semibold">{children}</h2>
  ),
  h3: ({ children }: MarkdownElementProps) => (
    <h3 className="mt-4 mb-2 text-lg font-medium">{children}</h3>
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
    <blockquote className="border-border text-muted-foreground mb-3 border-l-4 pl-4 italic">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: LinkProps) => (
    <a
      href={href}
      className="text-ost-blue-three hover:text-ost-blue-four underline"
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
      className="border-border my-3 inline-block h-auto max-w-full rounded"
    />
  ),
  table: ({ children }: MarkdownElementProps) => (
    <div className="mb-3 overflow-x-auto">
      <table className="border-border min-w-full border-collapse border">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: MarkdownElementProps) => (
    <th className="bg-accent text-accent-foreground border-border border px-3 py-2 text-left text-sm font-medium">
      {children}
    </th>
  ),
  td: ({ children }: MarkdownElementProps) => (
    <td className="border-border border px-3 py-2 text-sm">{children}</td>
  ),
};
