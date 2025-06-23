"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

import { StepperWrapper } from "../../../components/stepper/stepper-wrapper.component";
import { useProjectCreateStore } from "../../../store/project-create.store";
import {
  type NewRoleFormData,
  type StepThreeFormData,
  newRoleSchema,
  stepThreeSchema,
} from "../../../validations/step-three.schema";

function DifficultyBars({ level }: { level: "Easy" | "Medium" | "Hard" }) {
  if (level === "Easy") {
    return (
      <span className="ml-2 flex items-center gap-[2px]">
        <Image
          src="/icons/difficulty-bar-gray.svg"
          alt="Difficulty level"
          width={2}
          height={8}
        />
        <Image
          src="/icons/difficulty-bar-light.svg"
          alt="Difficulty level"
          width={2}
          height={8}
        />
        <Image
          src="/icons/difficulty-bar-light.svg"
          alt="Difficulty level"
          width={2}
          height={8}
        />
      </span>
    );
  } else if (level === "Medium") {
    return (
      <span className="ml-2 flex items-center gap-[2px]">
        <Image
          src="/icons/difficulty-bar-gray.svg"
          alt="Difficulty level"
          width={2}
          height={8}
        />
        <Image
          src="/icons/difficulty-bar-gray.svg"
          alt="Difficulty level"
          width={2}
          height={8}
        />
        <Image
          src="/icons/difficulty-bar-light.svg"
          alt="Difficulty level"
          width={2}
          height={8}
        />
      </span>
    );
  } else {
    return (
      <span className="ml-2 flex items-center gap-[2px]">
        <Image
          src="/icons/difficulty-bar-gray.svg"
          alt="Difficulty level"
          width={2}
          height={8}
        />
        <Image
          src="/icons/difficulty-bar-gray.svg"
          alt="Difficulty level"
          width={2}
          height={8}
        />
        <Image
          src="/icons/difficulty-bar-gray.svg"
          alt="Difficulty level"
          width={2}
          height={8}
        />
      </span>
    );
  }
}

export default function StepThreeView() {
  const router = useRouter();
  const { updateRoles, resetForm } = useProjectCreateStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Main form
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StepThreeFormData>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      collaborators: [],
      techStack: [],
      difficulty: "MEDIUM",
      roles: [],
    },
  });

  // New role form
  const {
    register: registerRole,
    handleSubmit: handleSubmitRole,
    reset: resetRoleForm,
    formState: { errors: roleErrors },
  } = useForm<NewRoleFormData>({
    resolver: zodResolver(newRoleSchema),
    defaultValues: {
      title: "",
      description: "",
      skills: [],
      skillLevel: "INTERMEDIATE",
    },
  });

  // Field array for roles
  const {
    fields: roles,
    append: appendRole,
    remove: removeRole,
  } = useFieldArray({
    control,
    name: "roles",
  });

  const selectedDifficulty = watch("difficulty");

  const onSubmit = async (data: StepThreeFormData) => {
    try {
      updateRoles(
        data.roles.map((role) => ({
          id: role.id,
          name: role.title,
          description: role.description,
          skillLevel: role.skillLevel,
          isOpen: role.isOpen,
        }))
      );

      setShowConfirmation(true);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const onAddRole = (roleData: NewRoleFormData) => {
    appendRole({
      id: `role-${Date.now()}`,
      title: roleData.title,
      description: roleData.description,
      skillLevel: roleData.skillLevel,
      skills: roleData.skills,
      isOpen: true,
    });
    resetRoleForm();
    setShowRoleModal(false);
  };

  const handleFinish = () => {
    resetForm();
    router.push("/projects");
  };

  if (showConfirmation) {
    return (
      <StepperWrapper currentStep={3} method="scratch">
        <div className="font-geist flex flex-col items-center justify-center rounded-[20px] bg-white p-10">
          <h2 className="font-geist mb-2 text-center text-[30px] font-medium tracking-tight">
            Félicitations ! Votre projet a été créé
          </h2>
          <p className="mb-8 text-center text-[15px] text-black/70">
            Vous pouvez maintenant trouver vos projets dans votre tableau de
            bord "Mes projets" et les membres pourront postuler à n'importe quel
            rôle ouvert
          </p>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={handleFinish}
          >
            Voir mes projets
          </Button>
        </div>
      </StepperWrapper>
    );
  }

  return (
    <StepperWrapper currentStep={3} method="scratch">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="font-geist flex w-[500px] flex-col gap-8 rounded-[20px] bg-white p-10">
          <div>
            <h2 className="font-geist mb-2 text-center text-[30px] font-medium tracking-tight">
              Ajouter les détails du projet
            </h2>
            <p className="mb-8 text-center text-[15px] text-black/70">
              Complétez les informations détaillées de votre projet open source
            </p>
          </div>

          {/* Choose difficulty */}
          <div>
            <label className="font-geist mb-2 block text-[18px] font-medium text-black">
              Difficulté
            </label>
            <div className="flex gap-3">
              {(["EASY", "MEDIUM", "HARD"] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  type="button"
                  onClick={() => setValue("difficulty", difficulty)}
                  className={`font-geist flex h-[25px] w-[120px] items-center justify-center gap-2 rounded-[5px] text-[11px] ${
                    selectedDifficulty === difficulty
                      ? "bg-black text-white"
                      : "bg-black/2 text-black/30"
                  }`}
                >
                  Difficulté{" "}
                  {difficulty === "EASY"
                    ? "facile"
                    : difficulty === "MEDIUM"
                      ? "moyenne"
                      : "difficile"}
                  <DifficultyBars
                    level={
                      difficulty === "EASY"
                        ? "Easy"
                        : difficulty === "MEDIUM"
                          ? "Medium"
                          : "Hard"
                    }
                  />
                </button>
              ))}
            </div>
            {errors.difficulty && (
              <p className="mt-1 text-sm text-red-500">
                {errors.difficulty.message}
              </p>
            )}
          </div>

          {/* Open Roles */}
          <div>
            <label className="font-geist mb-2 block text-[18px] font-medium text-black">
              Rôles disponibles
            </label>
            <button
              type="button"
              className="mb-4 flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] border border-black/10 bg-white text-[15px] font-medium text-black"
              onClick={() => setShowRoleModal(true)}
            >
              Créer un nouveau rôle{" "}
              <span className="text-[22px]">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 6.5H11"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M6.5 2V11"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>

            {/* Roles list */}
            {roles.map((role, index) => (
              <div
                key={role.id}
                className="mb-2 w-full rounded-[10px] border border-black/10 bg-white px-4 pt-2 pb-3"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-geist text-[17px] font-medium text-black">
                    {role.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRole(index)}
                    className="text-[10px] font-bold text-black/50"
                  >
                    <Image
                      src="/icons/croix-suppression.svg"
                      alt="supprimer"
                      width={13}
                      height={13}
                    />
                  </button>
                </div>
                <p className="mb-2 text-sm text-black/70">{role.description}</p>
                <div className="flex flex-wrap gap-2">
                  {role.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="success">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}

            {errors.roles && (
              <p className="mt-1 text-sm text-red-500">
                {errors.roles.message}
              </p>
            )}

            <Button
              size="lg"
              className="mt-12 mb-4 w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Création..." : "Créer un nouveau projet"}
            </Button>
          </div>
        </div>
      </form>

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
          <div className="font-geist relative flex max-h-[90vh] min-h-[400px] w-[603px] flex-col items-center overflow-y-auto rounded-[20px] border border-black/5 bg-white px-6 py-6 shadow-xl">
            <div className="relative mb-8 flex w-full items-center justify-center">
              <span className="font-geist text-[12px] font-medium text-black/20">
                Create New Role
              </span>
              <button
                type="button"
                className="absolute right-0 flex items-center justify-center"
                onClick={() => setShowRoleModal(false)}
              >
                <Image
                  src="/icons/croix-suppression.svg"
                  alt="close"
                  width={12}
                  height={12}
                />
              </button>
            </div>

            <form onSubmit={handleSubmitRole(onAddRole)} className="w-full">
              <div className="mb-4">
                <label className="font-geist mb-2 block text-[18px] font-medium text-black">
                  Titre du rôle
                </label>
                <input
                  {...registerRole("title")}
                  className="w-full rounded-[5px] border border-black/5 px-3 py-2 text-[15px]"
                  placeholder="Ex: Développeur Frontend"
                />
                {roleErrors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {roleErrors.title.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="font-geist mb-2 block text-[18px] font-medium text-black">
                  Description
                </label>
                <textarea
                  {...registerRole("description")}
                  className="h-[100px] w-full resize-none rounded-[5px] border border-black/5 px-3 py-2 text-[15px]"
                  placeholder="Décrivez ce rôle..."
                  maxLength={250}
                />
                {roleErrors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {roleErrors.description.message}
                  </p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full">
                Ajouter le rôle
              </Button>
            </form>
          </div>
        </div>
      )}
    </StepperWrapper>
  );
}
