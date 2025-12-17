"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { HiXMark } from "react-icons/hi2";
import { RiDraggable } from "react-icons/ri";
import { cn } from "@/shared/lib/utils";

interface MultipleImageUploadProps {
  onFilesChange: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
  currentImages?: string[];
  onRemoveCurrentImage?: (imageUrl: string, index: number) => void;
  onReorderCurrentImages?: (reorderedImages: string[]) => void;
}

function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
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
  onReorderCurrentImages,
}: MultipleImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDraggingCurrent, setIsDraggingCurrent] = useState(false);

  const previews = useMemo(() => {
    return files.map((file) => URL.createObjectURL(file));
  }, [files]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

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
      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, ...acceptedFiles];
        onFilesChange(updatedFiles);
        return updatedFiles;
      });
    },
    [onFilesChange]
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
      setFiles((prevFiles) => {
        const updatedFiles = prevFiles.filter((_, i) => i !== index);
        onFilesChange(updatedFiles);
        return updatedFiles;
      });
      setError(null);
    },
    [onFilesChange]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number, isCurrent: boolean) => {
      e.stopPropagation();
      setDraggedIndex(index);
      setIsDraggingCurrent(isCurrent);
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
      }
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      if (draggedIndex !== null && draggedIndex !== index) {
        setDragOverIndex((prev) => (prev !== index ? index : prev));
      } else {
        setDragOverIndex((prev) => (prev !== null ? null : prev));
      }
    },
    [draggedIndex]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      e.stopPropagation();

      if (draggedIndex === null) return;

      if (isDraggingCurrent) {
        if (onReorderCurrentImages && draggedIndex !== dropIndex) {
          const reordered = [...currentImages];
          const [removed] = reordered.splice(draggedIndex, 1);
          reordered.splice(dropIndex, 0, removed);
          onReorderCurrentImages(reordered);
        }
      } else if (draggedIndex !== dropIndex) {
        const reordered = [...files];
        const [removed] = reordered.splice(draggedIndex, 1);
        reordered.splice(dropIndex, 0, removed);
        setFiles(reordered);
        onFilesChange(reordered);
      }

      setDraggedIndex(null);
      setDragOverIndex(null);
      setIsDraggingCurrent(false);
    },
    [
      draggedIndex,
      isDraggingCurrent,
      currentImages,
      files,
      onReorderCurrentImages,
      onFilesChange,
    ]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setIsDraggingCurrent(false);
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <div className="space-y-4">
        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={cn(
            "relative rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200",
            !isDropzoneDisabled && "cursor-pointer hover:border-border",
            isDragActive && !isDragReject
              ? "border-ost-blue-three bg-ost-blue-one/10"
              : "border-input bg-secondary",
            isDragReject && "border-destructive bg-destructive/10",
            error && "border-red-400",
            isDropzoneDisabled &&
              "pointer-events-none cursor-not-allowed opacity-50"
          )}
          tabIndex={isDropzoneDisabled ? -1 : 0}
          aria-disabled={isDropzoneDisabled}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <p className="font-medium text-foreground text-sm">
              Drop your files here, or{" "}
              <span className="text-ost-blue-three">click to browse</span>
            </p>
            <p className="text-muted-foreground text-xs">
              Up to {maxFiles} files, {maxSize * maxFiles}MB total limit
            </p>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Uploaded Images List */}
        {(currentImages.length > 0 || files.length > 0) && (
          <div className="space-y-2">
            {/* Current Images */}
            {currentImages.map((imageUrl, index) => {
              const fileName =
                imageUrl.split("/").pop() || `cover-${index + 1}`;
              const isDragging = draggedIndex === index && isDraggingCurrent;
              const isDragOver = dragOverIndex === index && isDraggingCurrent;
              return (
                <div
                  key={`current-${imageUrl}`}
                  draggable={!disabled && currentImages.length > 1}
                  onDragStart={(e) => handleDragStart(e, index, true)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border border-border bg-secondary p-2 transition-all",
                    isDragging && "opacity-50",
                    isDragOver && "border-ost-blue-three bg-ost-blue-one/10"
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
                    {/* biome-ignore lint/performance/noImgElement: needed */}
                    <img
                      src={imageUrl}
                      alt={fileName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="truncate font-medium text-sm">{fileName}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-xs">Uploaded</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {currentImages.length > 1 && !disabled && (
                      <button
                        type="button"
                        className="flex h-8 w-8 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 active:cursor-grabbing"
                        aria-label="Drag to reorder"
                      >
                        <RiDraggable className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemoveCurrentImage?.(imageUrl, index)}
                      className="mr-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10"
                      disabled={disabled}
                      aria-label="Remove image"
                    >
                      <HiXMark className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* New Files */}
            {files.map((file, index) => {
              const isDragging = draggedIndex === index && !isDraggingCurrent;
              const isDragOver = dragOverIndex === index && !isDraggingCurrent;
              return (
                <div
                  key={`file-${file.name}-${file.size}-${file.lastModified}`}
                  draggable={!disabled && files.length > 1}
                  onDragStart={(e) => handleDragStart(e, index, false)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border border-border bg-secondary p-2 transition-all",
                    isDragging && "opacity-50",
                    isDragOver && "border-ost-blue-three bg-ost-blue-one/10"
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
                    {/* biome-ignore lint/performance/noImgElement: needed */}
                    <img
                      src={previews[index]}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="truncate font-medium text-sm">{file.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        {formatFileSize(file.size)}
                      </span>
                      <span className="text-green-600 text-xs">Uploaded</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {files.length > 1 && !disabled && (
                      <button
                        type="button"
                        className="flex h-8 w-8 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 active:cursor-grabbing"
                        aria-label="Drag to reorder"
                      >
                        <RiDraggable className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="mr-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10"
                      disabled={disabled}
                      aria-label="Remove image"
                    >
                      <HiXMark className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
