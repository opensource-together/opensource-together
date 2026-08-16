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

interface ProjectImportationConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  isCreating: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ProjectImportationConfirmDialog({
  open,
  onOpenChange,
  projectTitle,
  isCreating,
  onConfirm,
  onCancel,
}: ProjectImportationConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isCreating) onOpenChange(nextOpen);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3">
            Create project
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                <strong>{projectTitle}</strong> will be created and added to
                your <strong>dashboard</strong>. You’ll be able to publish it
                later to make it visible on OpenSource Together.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isCreating}>
            Cancel
          </AlertDialogCancel>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isCreating}
            aria-busy={isCreating}
          >
            {isCreating && <RiLoader2Fill className="animate-spin" />}
            {isCreating ? "Creating..." : "Create project"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
