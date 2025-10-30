"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create project"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
