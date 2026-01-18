"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { RiDeleteBinLine, RiImageAddLine } from "react-icons/ri";

import { Button } from "@/shared/components/ui/button";
import { useCacheBustingImage } from "@/shared/hooks/use-cache-busting-image.hook";
import { cn } from "@/shared/lib/utils";

interface BannerUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  subtitle?: string;
  className?: string;
  disabled?: boolean;
  currentImageUrl?: string | null;
  updatedAt?: Date | string | null;
}

export function BannerUpload({
  onFileSelect,
  accept = "image/*",
  maxSize = 5,
  className,
  disabled = false,
  currentImageUrl,
  updatedAt,
}: BannerUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derive preview from file using Object URL
  const preview = useMemo(() => {
    return file ? URL.createObjectURL(file) : null;
  }, [file]);

  // Cleanup Object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Determine accept format for dropzone
  const dropzoneAccept = useMemo(() => {
    if (accept === "image/*") {
      return { "image/*": [] };
    }
    // Handle specific MIME types or extensions
    const mimeTypes = accept.split(",").map((type) => type.trim());
    const acceptObj: Record<string, string[]> = {};
    mimeTypes.forEach((type) => {
      acceptObj[type] = [];
    });
    return acceptObj;
  }, [accept]);

  const handleAcceptedFiles = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        setError(null);
        setFile(selectedFile);
        onFileSelect(selectedFile);
      }
    },
    [onFileSelect]
  );

  const handleRejectedFiles = useCallback(
    (rejectedFiles: FileRejection[]) => {
      const rejection = rejectedFiles[0];
      if (rejection?.errors?.length > 0) {
        const error = rejection.errors[0];
        switch (error.code) {
          case "file-too-large":
            setError(`The file size must be less than ${maxSize}MB`);
            break;
          case "file-invalid-type":
            setError("File type not supported");
            break;
          default:
            setError("Error uploading file");
        }
      }
    },
    [maxSize]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleAcceptedFiles,
    onDropRejected: handleRejectedFiles,
    accept: dropzoneAccept,
    maxFiles: 1,
    maxSize: maxSize * 1024 * 1024,
    disabled,
    multiple: false,
  });

  const bannerUrlWithCacheBusting = useCacheBustingImage(
    currentImageUrl,
    updatedAt
  );
  const displayImage =
    preview || bannerUrlWithCacheBusting || "/ost-profile-banner.png";
  const defaultBannerUrl = "/ost-profile-banner.png";
  const isDefaultBanner = (url: string | null | undefined): boolean => {
    if (!url) return true;
    return url === defaultBannerUrl || url.endsWith("ost-profile-banner.png");
  };
  const hasCustomBanner =
    currentImageUrl && !preview && !isDefaultBanner(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = async () => {
    try {
      setError(null);
      const response = await fetch("/ost-profile-banner.png");
      const blob = await response.blob();
      const defaultBannerFile = new File([blob], "ost-profile-banner.png", {
        type: blob.type || "image/png",
      });
      setFile(defaultBannerFile);
      onFileSelect(defaultBannerFile);
    } catch (error) {
      console.error("Error loading default banner:", error);
      setError("Failed to load default banner");
    }
  };

  const { onClick: rootOnClick, ...rootProps } = getRootProps();

  return (
    <div className={cn("w-full", className)}>
      <div
        {...rootProps}
        className={cn(
          "group relative w-full overflow-hidden rounded-lg transition-all duration-200",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <input {...getInputProps()} ref={fileInputRef} />
        <div className="relative h-36 w-full">
          <Image
            src={displayImage}
            alt="Banner preview"
            fill
            className="rounded-[20px] object-cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="size-10 rounded-full bg-black/60 text-white hover:bg-black/80"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                handleUploadClick();
              }}
            >
              <RiImageAddLine className="size-5" />
            </Button>
            {hasCustomBanner && (
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="size-10 rounded-full bg-black/60 text-white hover:bg-black/80"
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <RiDeleteBinLine className="size-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
        {file && (
          <>
            <span className="truncate">
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
            </span>
            <span className="text-muted-foreground/50">•</span>
          </>
        )}
        <span>Recommended: 1986 × 420 px</span>
      </div>

      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
    </div>
  );
}
