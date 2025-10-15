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
            Import your project on OpenSource Together
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Your project <strong>"{projectTitle}"</strong> will be published
                on OpenSource Together and will be visible by all users of the
                platform.
              </p>
              <div className="rounded-lg bg-blue-50 p-3">
                <div className="flex items-start gap-2">
                  <p className="text-sm text-blue-800">
                    <strong>To know :</strong> Your Github repository remains
                    unchanged. Only the project information will be synchronized
                    with the platform to allow contributors to discover you.
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <div className="flex items-start gap-2">
                  <p className="text-sm text-green-800">
                    You can modify or delete your project from the platform at
                    any time. plateforme à tout moment.
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isCreating}>
            {isCreating ? "Publication en cours..." : "Publier le projet"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
