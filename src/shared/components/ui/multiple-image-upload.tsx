"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { HiXMark } from "react-icons/hi2";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

import Icon from "./icon";

interface MultipleImageUploadProps {
  onFilesChange: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
  currentImages?: string[];
  onRemoveCurrentImage?: (imageUrl: string, index: number) => void;
}

export function MultipleImageUpload({
  onFilesChange,
  accept = "image/*",
  maxFiles = 4,
  maxSize = 5,
  className,
  disabled = false,
  currentImages = [],
  onRemoveCurrentImage,
}: MultipleImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const previews = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file));
  }, [files]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const allImages = useMemo(
    () => [...currentImages, ...previews],
    [currentImages, previews]
  );
  const totalCount = useMemo(
    () => currentImages.length + files.length,
    [currentImages.length, files.length]
  );

  const dropzoneAccept = useMemo(() => {
    if (accept === "image/*") {
      return { "image/*": [] };
    }
    const mimeTypes = accept.split(",").map((type) => type.trim());
    const acceptObj: Record<string, string[]> = {};
    mimeTypes.forEach((type) => {
      acceptObj[type] = [];
    });
    return acceptObj;
  }, [accept]);

  const handleAcceptedFiles = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const updatedFiles = [...files, ...acceptedFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    },
    [files, onFilesChange]
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
            setError("Unsupported file type");
            break;
          case "too-many-files":
            setError(`You can only upload ${maxFiles} images maximum`);
            break;
          default:
            setError("Error uploading file");
        }
      }
    },
    [maxSize, maxFiles]
  );

  const isDropzoneDisabled = disabled || totalCount >= maxFiles;

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: handleAcceptedFiles,
      onDropRejected: handleRejectedFiles,
      accept: dropzoneAccept,
      maxFiles: Math.max(0, maxFiles - currentImages.length - files.length),
      maxSize: maxSize * 1024 * 1024,
      disabled: isDropzoneDisabled,
      multiple: true,
    });

  const removeImage = useCallback(
    (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
      setError(null);
    },
    [files, onFilesChange]
  );

  return (
    <div className={cn("w-full", className)}>
      <div className="space-y-4">
        <div
          {...getRootProps()}
          className={cn(
            "relative rounded-lg border-2 border-dashed p-6 text-center transition-all duration-200",
            !isDropzoneDisabled && "cursor-pointer",
            isDragActive && !isDragReject
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300",
            isDragReject && "border-red-500 bg-red-50",
            error && "border-red-400",
            isDropzoneDisabled &&
              "pointer-events-none cursor-not-allowed opacity-50"
          )}
          tabIndex={isDropzoneDisabled ? -1 : 0}
          aria-disabled={isDropzoneDisabled}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <Icon name="download" size="2xl" className="text-gray-400" />
            <div>
              <p className="font-medium text-gray-700 text-sm">
                {isDragActive
                  ? "Drop your images here..."
                  : "Drag and drop your images here or click to browse"}
              </p>
              {!isDragActive && (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  disabled={isDropzoneDisabled}
                >
                  Browse
                </Button>
              )}
            </div>
            <p className="text-gray-500 text-xs">
              JPG, PNG, GIF up to {maxSize}MB • Maximum {maxFiles} images
            </p>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {allImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {allImages.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-video rounded-lg border border-gray-200"
              >
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <Image
                    src={image}
                    alt={`Cover image ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                    <p className="font-medium text-white text-xs">
                      Image {index + 1}
                    </p>
                  </div>
                </div>

                {index < currentImages.length ? (
                  <button
                    type="button"
                    onClick={() => onRemoveCurrentImage?.(image, index)}
                    className="absolute -top-1 -right-1 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white p-1 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                    disabled={disabled}
                  >
                    <HiXMark />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeImage(index - currentImages.length)}
                    className="absolute -top-1 -right-1 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white p-1 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                    disabled={disabled}
                  >
                    <HiXMark />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-center text-gray-600 text-sm">
          {totalCount} / {maxFiles} images
        </div>
      </div>
    </div>
  );
}
