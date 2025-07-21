"use client";

import { useCallback, useState } from "react";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

import Icon from "./icon";

interface AvatarUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  subtitle?: string;
  className?: string;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  name?: string; // For fallback initials
  fallback?: string;
  currentImageUrl?: string;
}

export function AvatarUpload({
  onFileSelect,
  accept = "image/*",
  maxSize = 5,
  subtitle = "JPG, PNG. Taille max : 5MB",
  className,
  disabled = false,
  size = "2xl",
  name,
  fallback,
  currentImageUrl,
}: AvatarUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (selectedFile: File) => {
      const validateFile = (file: File): string | null => {
        if (maxSize && file.size > maxSize * 1024 * 1024) {
          return `File size must be less than ${maxSize}MB`;
        }

        if (accept === "image/*" && !file.type.startsWith("image/")) {
          return "Please select an image file";
        }

        return null;
      };

      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setFile(selectedFile);
      onFileSelect(selectedFile);

      // Create preview for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
    },
    [onFileSelect, maxSize, accept]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [handleFile, disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFile(selectedFile);
      }
    },
    [handleFile]
  );

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {/* Avatar Preview */}
        <div className="relative flex items-center gap-3">
          <div
            className={cn(
              "relative transition-all duration-200",
              isDragOver && "scale-105",
              error
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Avatar
              src={preview || currentImageUrl}
              name={name}
              fallback={fallback}
              size={size}
              className={cn(
                "border-2 transition-all duration-200",
                preview || currentImageUrl
                  ? "border-transparent"
                  : "border-black/5",
                isDragOver &&
                  !(preview || currentImageUrl) &&
                  "border-blue-500 bg-blue-50",
                error && "border-red-400"
              )}
            />
          </div>

          {file ? (
            <div className="text-sm tracking-tighter text-black/50">
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
            </div>
          ) : (
            <p className="text-sm tracking-tighter text-black/50">{subtitle}</p>
          )}
        </div>

        {/* Upload Info and Button */}
        <Button
          type="button"
          variant="outline"
          className="relative overflow-hidden font-medium"
          disabled={disabled}
        >
          Importer
          <Icon name="download" size="sm" />
          <input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            disabled={disabled}
          />
        </Button>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
