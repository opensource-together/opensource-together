"use client";

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
import Icon, { IconName, IconVariant } from "@/shared/components/ui/icon";
import { Separator } from "@/shared/components/ui/separator";

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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>{description}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Separator
          className="mt-3 mb-1"
          style={{
            marginLeft: "-24px",
            marginRight: "-24px",
            width: "calc(100% + 48px)",
          }}
        />
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
