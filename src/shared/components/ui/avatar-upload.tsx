"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

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
            setError(
              `La taille du fichier doit être inférieure à ${maxSize}MB`
            );
            break;
          case "file-invalid-type":
            setError("Type de fichier non supporté");
            break;
          default:
            setError("Erreur lors du téléchargement du fichier");
        }
      }
    },
    [maxSize]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: handleAcceptedFiles,
      onDropRejected: handleRejectedFiles,
      accept: dropzoneAccept,
      maxFiles: 1,
      maxSize: maxSize * 1024 * 1024,
      disabled,
      multiple: false,
    });

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        <div className="relative flex items-center gap-3">
          <div
            {...getRootProps()}
            className={cn(
              "relative cursor-pointer transition-all duration-200",
              isDragActive && "scale-105",
              error && "border-red-400"
            )}
          >
            <input {...getInputProps()} />
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
                isDragActive &&
                  !isDragReject &&
                  !(preview || currentImageUrl) &&
                  "border-blue-500 bg-blue-50",
                isDragReject && "border-red-500 bg-red-50",
                error && "border-red-400"
              )}
            />
          </div>

          {file ? (
            <div className="text-sm tracking-tighter text-black/50">
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
            </div>
          ) : (
            <p className="text-xs tracking-tighter text-black/50">{subtitle}</p>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <Button
          type="button"
          variant="outline"
          className="font-medium"
          disabled={disabled}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = accept;
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                handleAcceptedFiles([file]);
              }
            };
            input.click();
          }}
        >
          Importer
          <Icon name="download" size="sm" />
        </Button>
      </div>
    </div>
  );
}
