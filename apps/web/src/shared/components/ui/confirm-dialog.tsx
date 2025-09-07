"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import Icon, { IconName, IconVariant } from "@/shared/components/ui/icon";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  confirmIcon?: IconName;
  confirmIconVariant?: IconVariant;
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
  confirmIcon = "check",
  confirmVariant = "default",
}: ConfirmDialogProps) {
  const renderIcon = () => {
    if (!confirmIcon) return null;
    return <Icon name="check" size="xs" variant="white" />;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-[22px]">
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto">
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
          </div>
          <div className="sticky bottom-0 z-50 bg-white">
            <div className="-mx-6 mt-5">
              <div className="border-t border-black/10" />
              <div className="flex items-center justify-end gap-4 px-6 pt-4">
                <AlertDialogCancel asChild>
                  <Button variant="secondary" onClick={onCancel}>
                    Retour
                  </Button>
                </AlertDialogCancel>
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
              </div>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
