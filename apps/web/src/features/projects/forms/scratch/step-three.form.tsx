"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

import {
  NewRoleFormData,
  StepThreeFormData,
  newRoleSchema,
  stepThreeSchema,
} from "@/features/projects/validations/project-stepper.schema";

import { useProjectCreateStore } from "../../stores/project-create.store";

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

interface StepThreeFormProps {
  onSuccess: () => void;
}

export function StepThreeForm({ onSuccess }: StepThreeFormProps) {
  const router = useRouter();
  const { formData, updateRoles, resetForm } = useProjectCreateStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [modalBlurState, setModalBlurState] = useState<
    "enter" | "enter-active" | "exit" | "exit-active" | null
  >(null);

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

  // Animate modal blur on open/close
  const openRoleModal = () => {
    setShowRoleModal(true);
    setTimeout(() => setModalBlurState("enter-active"), 10);
  };
  const closeRoleModal = () => {
    setModalBlurState("exit");
    setTimeout(() => setModalBlurState("exit-active"), 10);
    setTimeout(() => {
      setShowRoleModal(false);
      setModalBlurState(null);
    }, 300);
  };

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

      onSuccess();
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
    closeRoleModal();
  };

  const handleFinish = () => {
    resetForm();
    router.push("/projects");
  };

  // Modale Create New Role
  const RoleModal = () => (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center modal-blur-${modalBlurState || "enter"}`}
      style={{ background: "rgba(0,0,0,0.10)" }}
    >
      <div className="font-geist relative flex max-h-[90vh] min-h-[400px] w-[603px] flex-col items-center overflow-y-auto rounded-[20px] border border-black/5 bg-white px-6 py-6 shadow-xl">
        {/* Header: Title centered, close cross right */}
        <div
          className="relative mb-8 flex w-full items-center justify-center"
          style={{ height: "32px" }}
        >
          <span className="absolute left-0" style={{ width: "32px" }}></span>
          <span className="font-geist text-[12px] font-medium text-black/20">
            Create New Role
          </span>
          <button
            className="absolute right-0 flex items-center justify-center text-black transition hover:text-black"
            style={{ width: "32px", height: "32px" }}
            onClick={closeRoleModal}
          >
            <Image
              src="/icons/croix-suppression.svg"
              alt="close"
              width={12}
              height={12}
            />
          </button>
        </div>
        <div className="flex w-full flex-col gap-8">
          <div>
            <label className="font-geist mb-5 block text-[18px] font-medium text-black">
              Choose Role Title
            </label>
            <div className="grid grid-cols-3 gap-3">
              {Array(6)
                .fill("Back-end Developer")
                .map((role, i) => (
                  <button
                    key={i}
                    className="flex h-[30px] w-[144px] items-center justify-center rounded-[5px] border border-black/5 bg-white text-[12px] font-medium text-black"
                  >
                    {role}
                  </button>
                ))}
            </div>
          </div>
          <div className="my-2 border-t border-dashed border-black/10"></div>
          <div>
            <label className="font-geist mb-5 block text-[18px] font-medium text-black">
              Add skill set
            </label>
            <div className="flex flex-wrap gap-2">
              {Array(4)
                .fill("Front-end Developer")
                .map((skill, i) => (
                  <Badge key={i} variant="info">
                    {skill}
                  </Badge>
                ))}
              {Array(4)
                .fill("UX Designer")
                .map((skill, i) => (
                  <Badge key={i} variant="danger">
                    {skill}
                  </Badge>
                ))}
              {Array(4)
                .fill("MongoDB")
                .map((skill, i) => (
                  <Badge key={i} variant="success">
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>
          <div className="my-2 border-t border-dashed border-black/10"></div>
          <div>
            <label className="font-geist mb-5 block text-[18px] font-medium text-black">
              Add Description
            </label>
            <div className="relative mb-3">
              <textarea
                className="font-geist h-[153px] w-full resize-none rounded-[10px] border border-black/10 bg-white px-4 py-3 text-[15px] text-black/70 focus:outline-none"
                maxLength={250}
                placeholder="Describe new role"
              />
              <span className="absolute right-4 bottom-3 text-[13px] text-black/20">
                250/250
              </span>
            </div>
          </div>
          <Button
            size="lg"
            className="mt-0 mb-4 flex items-center justify-center"
            onClick={closeRoleModal}
          >
            Créer un nouveau rôle
          </Button>
        </div>
      </div>
    </div>
  );

  if (showConfirmation) {
    return (
      <div className="font-geist flex flex-col items-center justify-center rounded-[20px] bg-white p-10">
        <h2 className="font-geist mb-2 text-center text-[30px] font-medium tracking-tight">
          Félicitations ! Votre projet a été créé
        </h2>
        <p className="mb-8 text-center text-[15px] text-black/70">
          Vous pouvez maintenant trouver vos projets dans votre tableau de bord
          "Mes projets" et les membres pourront postuler à n'importe quel rôle
          ouvert
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
    );
  }

  return (
    <div className="font-geist flex w-[500px] flex-col gap-8 rounded-[20px] bg-white p-10">
      {/* Add collaborators */}
      <div>
        <h2 className="font-geist mb-2 text-center text-[30px] font-medium tracking-tight">
          Ajouter les détails du projet
        </h2>
        <p className="mb-8 text-center text-[15px] text-black/70">
          Complétez les informations détaillées de votre projet open source
        </p>
        <label className="font-geist mb-2 block text-[18px] font-medium text-black">
          Ajouter des collaborateurs
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher des collaborateurs"
            className="font-geist h-[42px] w-full rounded-[5px] border border-black/5 bg-black/2 px-4 pr-10 text-[15px] text-black/50 focus:outline-none"
            disabled
          />
          <span className="absolute top-1/2 right-4 -translate-y-1/2 text-black/20">
            {/* Icone de loupe */}
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M20 20l-3-3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <label className="font-geist mb-2 block text-[18px] font-medium text-black">
          Technologies
        </label>
        <button className="font-geist flex items-center gap-2 text-[15px] text-black/70">
          <span className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-black/5 bg-white">
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
          Ajouter une technologie
        </button>
      </div>

      {/* Choose difficulty */}
      <div>
        <label className="font-geist mb-2 block text-[18px] font-medium text-black">
          Difficulté
        </label>
        <div className="flex gap-3">
          <button className="font-geist flex h-[25px] w-[120px] items-center justify-center gap-2 rounded-[5px] bg-black/2 text-[11px] text-black/30">
            Difficulté facile <DifficultyBars level="Easy" />
          </button>
          <button className="font-geist flex h-[25px] w-[120px] items-center justify-center gap-2 rounded-[5px] bg-black/2 text-[11px] text-black/30">
            Difficulté moyenne <DifficultyBars level="Medium" />
          </button>
          <button className="font-geist flex h-[25px] w-[120px] items-center justify-center gap-2 rounded-[5px] bg-black/2 text-[11px] text-black/30">
            Difficulté difficile <DifficultyBars level="Hard" />
          </button>
        </div>
      </div>

      {/* Open Roles */}
      <div>
        <label className="font-geist mb-2 block text-[18px] font-medium text-black">
          Rôles disponibles
        </label>
        <button
          className="mb-4 flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] border border-black/10 bg-white text-[15px] font-medium text-black"
          onClick={openRoleModal}
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
        {/* Example role card */}
        <div className="w-full rounded-[10px] border border-black/10 bg-white px-4 pt-2 pb-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-geist text-[17px] font-medium text-black">
              Développeur Back-end
            </span>
            <button className="mt-6 text-[10px] font-bold text-black/50">
              <Image
                src="/icons/croix-suppression.svg"
                alt="croix suppression"
                width={13}
                height={13}
              />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Node.js", "MongoDB", "Docker"].map((tech, index) => (
              <Badge key={index} variant="success">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        {showRoleModal && <RoleModal />}
        <Button
          size="lg"
          className="mt-12 mb-4 w-full"
          onClick={handleSubmit(onSubmit)}
        >
          Créer un nouveau projet
        </Button>
      </div>
    </div>
  );
}
