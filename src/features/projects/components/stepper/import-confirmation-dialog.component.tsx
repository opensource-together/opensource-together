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
            Importer votre projet sur OpenSource Together
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Votre projet <strong>"{projectTitle}"</strong> va être publié
                sur OpenSource Together et sera visible par tous les
                utilisateurs de la plateforme.
              </p>
              <div className="rounded-lg bg-blue-50 p-3">
                <div className="flex items-start gap-2">
                  <p className="text-sm text-blue-800">
                    <strong>À savoir :</strong> Votre repository Github reste
                    inchangé. Seules les informations du projet seront
                    synchronisées avec la plateforme pour permettre aux
                    contributeurs de vous découvrir.
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <div className="flex items-start gap-2">
                  <p className="text-sm text-green-800">
                    Vous pourrez modifier ou supprimer votre projet depuis la
                    plateforme à tout moment.
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
