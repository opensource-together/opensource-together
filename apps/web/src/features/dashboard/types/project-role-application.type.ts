import { ProjectRole } from "@/features/projects/types/project-role.type";
import { Author } from "@/features/projects/types/project.type";

/**
 * Type représentant une candidature à un rôle de projet
 *
 * Cette interface correspond à la structure retournée par l'API backend
 * pour l'endpoint GET /v1/user/me/applications
 *
 * @see {@link ProjectRole} - Type du rôle de projet
 * @see {@link Author} - Type de l'auteur du projet
 *
 * @example
 * ```typescript
 * const application: ProjectRoleApplicationType = {
 *   appplicationId: "uuid",
 *   projectRoleId: "uuid",
 *   projectRoleTitle: "Développeur Frontend",
 *   project: {
 *     id: "uuid",
 *     title: "Mon Projet",
 *     shortDescription: "Description courte",
 *     image: "https://example.com/image.jpg",
 *     author: {
 *       ownerId: "uuid",
 *       name: "John Doe",
 *       avatarUrl: "https://example.com/avatar.jpg"
 *     }
 *   },
 *   projectRole: {
 *     id: "uuid",
 *     projectId: "uuid",
 *     title: "Développeur Frontend",
 *     description: "Description du rôle",
 *     techStacks: [
 *       { id: "uuid", name: "React", iconUrl: "https://example.com/react.svg" }
 *     ],
 *     roleCount: 1,
 *     projectGoal: [
 *       { id: "uuid", projectId: "uuid", goal: "Améliorer l'UX" }
 *     ]
 *   },
 *   status: "PENDING",
 *   selectedKeyFeatures: [{ feature: "Interface utilisateur" }],
 *   selectedProjectGoals: [{ goal: "Améliorer l'UX" }],
 *   appliedAt: new Date(),
 *   decidedAt: new Date(),
 *   decidedBy: "uuid",
 *   rejectionReason: "Raison du rejet",
 *   motivationLetter: "Lettre de motivation",
 *   userProfile: {
 *     id: "uuid",
 *     name: "John Doe",
 *     avatarUrl: "https://example.com/avatar.jpg"
 *   }
 * };
 * ```
 */
export interface ProjectRoleApplicationType {
  /** ID unique de la candidature */
  appplicationId: string;

  /** ID du rôle de projet pour lequel la candidature a été soumise */
  projectRoleId: string;

  /** Titre du rôle de projet (conservé pour l'historique) */
  projectRoleTitle: string;

  /** Informations complètes du projet */
  project: {
    /** ID unique du projet */
    id: string;

    /** Titre du projet */
    title: string;

    /** Description courte du projet */
    shortDescription: string;

    /** URL de l'image du projet (optionnel) */
    image?: string;

    /** Informations de l'auteur du projet */
    author: Author;
  };

  /** Informations complètes du rôle de projet */
  projectRole: {
    /** ID unique du rôle de projet */
    id: string;

    /** ID du projet associé */
    projectId: string;

    /** Titre du rôle */
    title: string;

    /** Description du rôle */
    description: string;

    /** Technologies requises pour ce rôle */
    techStacks: {
      id: string;
      name: string;
      iconUrl: string;
    }[];

    /** Nombre de rôles disponibles */
    roleCount: number;

    /** Objectifs du projet associés à ce rôle */
    projectGoal: {
      id: string;
      projectId: string;
      goal: string;
    }[];
  };

  /** Statut de la candidature */
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

  /** Fonctionnalités clés sélectionnées par le candidat */
  selectedKeyFeatures: {
    feature: string;
  }[];

  /** Objectifs du projet sélectionnés par le candidat */
  selectedProjectGoals: {
    goal: string;
  }[];

  /** Date de soumission de la candidature */
  appliedAt: Date;

  /** Date de décision (acceptation/rejet) - optionnel */
  decidedAt?: Date;

  /** ID de l'utilisateur qui a pris la décision (optionnel) */
  decidedBy?: string;

  /** Raison du rejet (optionnel) */
  rejectionReason?: string;

  /** Lettre de motivation du candidat */
  motivationLetter: string;

  /** Profil de l'utilisateur candidat */
  userProfile: {
    /** ID unique de l'utilisateur */
    id: string;

    /** Nom d'affichage de l'utilisateur */
    name: string;

    /** URL de l'avatar de l'utilisateur (optionnel) */
    avatarUrl?: string;
  };
}
