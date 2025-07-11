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
import Icon from "@/shared/components/ui/icon";

interface ProjectCreationConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  isCreating: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ProjectCreationConfirmDialog({
  open,
  onOpenChange,
  projectTitle,
  isCreating,
  onConfirm,
  onCancel,
}: ProjectCreationConfirmDialogProps) {
  const repositoryName = projectTitle.split(" ").join("-");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3">
            <Icon name="github" size="md" />
            Création du repository GitHub
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Un repository GitHub <strong>public</strong> sera
                automatiquement créé sur votre compte avec le nom "
                <strong>{repositoryName}</strong>".
              </p>
              <div className="rounded-lg bg-yellow-50 p-3">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  <p className="text-sm text-yellow-800">
                    <strong>Important :</strong> Ce repository sera visible par
                    tous sur GitHub. Vous pourrez le modifier ou le supprimer
                    depuis votre compte GitHub à tout moment.
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isCreating}>
            {isCreating ? "Création en cours..." : "Confirmer et créer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
