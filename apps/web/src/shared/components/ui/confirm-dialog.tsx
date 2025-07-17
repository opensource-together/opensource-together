"use client";

import Image from "next/image";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import Icon from "@/shared/components/ui/icon";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  confirmIcon?: string;
  confirmVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  isLoading,
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  confirmIcon,
  confirmVariant = "default",
}: ConfirmDialogProps) {
  const renderIcon = () => {
    if (!confirmIcon) return null;

    // Si c'est un chemin direct (commence par /)
    if (confirmIcon.startsWith("/")) {
      return (
        <Image
          src={confirmIcon}
          alt="Icon"
          width={13}
          height={13}
          className="h-3 w-3 sm:h-[13px] sm:w-[13px]"
        />
      );
    }

    // Sinon c'est un nom d'icône du composant Icon
    return <Icon name={confirmIcon as any} size="xs" variant="black" />;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>{description}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Annuler</AlertDialogCancel>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center gap-2 ${
              confirmVariant === "destructive"
                ? "bg-red-500 hover:bg-red-600"
                : ""
            }`}
          >
            {isLoading ? (
              "En cours..."
            ) : (
              <>
                {confirmText}
                {renderIcon()}
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
