"use client";

import { RiLoader2Fill } from "react-icons/ri";

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
  confirmText = "Confirm",
  confirmVariant = "default",
}: ConfirmDialogProps) {
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
          className="mt-1 mb-1"
          style={{
            marginLeft: "-24px",
            marginRight: "-24px",
            width: "calc(100% + 48px)",
          }}
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <RiLoader2Fill className="animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              confirmText
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
