"use client";

import Image from "next/image";
import { useState } from "react";
import { RiCheckLine, RiDownloadLine, RiFileCopyLine } from "react-icons/ri";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export default function LogoDropdown() {
  const [copiedSvg, setCopiedSvg] = useState(false);

  const handleCopySvg = async () => {
    try {
      const res = await fetch("/ostogether-logo.svg");
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopiedSvg(true);
      toast.success("SVG copied to clipboard");
      setTimeout(() => setCopiedSvg(false), 2000);
    } catch {
      toast.error("Failed to copy SVG");
    }
  };

  const handleDownloadPng = async () => {
    try {
      const res = await fetch("/ostogether-logo.svg");
      const svgText = await res.text();

      const img = new window.Image();
      const scale = 2;
      const w = 420;
      const h = 100;

      const svgBlob = new Blob([svgText], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = w * scale;
        canvas.height = h * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);

        canvas.toBlob((blob) => {
          if (!blob) return;
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "ostogether-logo.png";
          a.click();
          URL.revokeObjectURL(a.href);
          toast.success("PNG downloaded");
        }, "image/png");
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        toast.error("Failed to download PNG");
      };

      img.src = url;
    } catch {
      toast.error("Failed to download PNG");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="cursor-pointer rounded-md outline-none"
          aria-label="OpenSource Together Home"
        >
          <Image
            src="/ostogether-logo.svg"
            alt="ost-logo"
            width={210}
            height={50}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={10}
        className="hidden w-[200px] p-2 shadow-sm md:block"
      >
        <DropdownMenuItem onClick={handleCopySvg}>
          {copiedSvg ? (
            <RiCheckLine className="size-4 text-primary" />
          ) : (
            <RiFileCopyLine className="size-4 text-primary" />
          )}
          {copiedSvg ? "Copied!" : "Copy as SVG"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadPng}>
          <RiDownloadLine className="size-4 text-primary" />
          Download as PNG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
