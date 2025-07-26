"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

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
}

export function MultipleImageUpload({
  onFilesChange,
  accept = "image/*",
  maxFiles = 4,
  maxSize = 5,
  className,
  disabled = false,
  currentImages = [],
}: MultipleImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        return `La taille du fichier doit être inférieure à ${maxSize}MB`;
      }

      if (accept === "image/*" && !file.type.startsWith("image/")) {
        return "Veuillez sélectionner un fichier image";
      }

      return null;
    },
    [maxSize, accept]
  );

  const handleFiles = useCallback(
    (selectedFiles: FileList) => {
      const newFiles: File[] = [];
      const newPreviews: string[] = [];
      let hasError = false;

      // Check if adding these files would exceed the limit
      if (files.length + selectedFiles.length > maxFiles) {
        setError(`Vous ne pouvez télécharger que ${maxFiles} images maximum`);
        return;
      }

      Array.from(selectedFiles).forEach((file) => {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          hasError = true;
          return;
        }

        newFiles.push(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string);

          // Update state when all files are processed
          if (newPreviews.length === newFiles.length && !hasError) {
            setError(null);
            const updatedFiles = [...files, ...newFiles];
            const updatedPreviews = [...previews, ...newPreviews];
            setFiles(updatedFiles);
            setPreviews(updatedPreviews);
            onFilesChange(updatedFiles);
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [files, previews, maxFiles, validateFile, onFilesChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      handleFiles(e.dataTransfer.files);
    },
    [handleFiles, disabled]
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
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const removeImage = useCallback(
    (index: number) => {
      const updatedFiles = files.filter((_, i) => i !== index);
      const updatedPreviews = previews.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      setPreviews(updatedPreviews);
      onFilesChange(updatedFiles);
      setError(null);
    },
    [files, previews, onFilesChange]
  );

  const allImages = [...currentImages, ...previews];

  return (
    <div className={cn("w-full", className)}>
      <div className="space-y-4">
        {/* Upload Zone */}
        <div
          className={cn(
            "relative rounded-lg border-2 border-dashed p-6 text-center transition-all duration-200",
            isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300",
            error && "border-red-400",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center gap-3">
            <Icon name="download" size="2xl" className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Glissez-déposez vos images ici ou
              </p>
              <Button
                type="button"
                variant="outline"
                className="relative mt-2 overflow-hidden"
                disabled={disabled || files.length >= maxFiles}
              >
                Parcourir
                <input
                  type="file"
                  accept={accept}
                  onChange={handleFileSelect}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  disabled={disabled || files.length >= maxFiles}
                  multiple
                />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              JPG, PNG, GIF jusqu'à {maxSize}MB • Maximum {maxFiles} images
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Image Previews */}
        {allImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {allImages.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-video overflow-hidden rounded-lg border border-gray-200"
              >
                <Image
                  src={image}
                  alt={`Image de couverture ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {index >= currentImages.length && (
                  <button
                    type="button"
                    onClick={() => removeImage(index - currentImages.length)}
                    className="absolute top-2 right-2 rounded-full bg-white p-1 opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                    disabled={disabled}
                  >
                    <Icon name="cross" size="xs" className="text-gray-700" />
                  </button>
                )}
                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                  <p className="text-xs font-medium text-white">
                    Image {index + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Progress */}
        <div className="text-center text-sm text-gray-600">
          {files.length} / {maxFiles} images téléchargées
        </div>
      </div>
    </div>
  );
}
