import { TechStack } from "../types/projectTypes";
import { AuthorTag } from "@/components/shared/AuthorTag";
import { StackIcon } from "@/components/shared/StackIcon";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ProjectHeroProps {
  title?: string;
  description?: string;
  longDescription?: string;
  techStacks?: TechStack[];
  keyBenefits?: string[];
  difficulty?: "Facile" | "Moyenne" | "Difficile";
  image?: string;
  authorName?: string;
  authorImage?: string;
}

export default function ProjectHero({
  title = "EcoTrack",
  description,
  longDescription,
  techStacks = [],
  keyBenefits = [
    "Suivi sans effort: Suivez votre empreinte carbone de vos activités quotidiennes et de votre consommation en quelques clics.",
    "Insights personnalisés: Recevez des conseils personnalisés et des suggestions basées sur vos choix pour vous aider à faire des choix plus durables.",
    "Visualisation en temps réel: Voir comment vos actions affectent l'environnement avec des retours visuels dynamiques et faciles à comprendre.",
    "Objectifs de réduction: Définissez des objectifs de réduction et suivez votre progression dans le temps pour rester motivé et responsable.",
    "Recommandations intelligentes: Découvrez des alternatives éco-amicales et des habitudes basées sur votre style de vie et vos préférences.",
    "Confidentialité des données: Vos informations personnelles restent sécurisées—les données ne sont jamais partagées sans votre consentement.",
    "Support multi-appareils: Utilisez l'application sans difficulté sur smartphones, tablettes et navigateurs web.",
  ],
  difficulty = "Moyenne",
  image,
  authorName,
  authorImage,
}: ProjectHeroProps) {
  // Map of tech stacks to icons - to be replaced with dynamic icon loading
  const techIconMap: Record<string, any> = {
    TypeScript: "typescript.svg",
    Typescript: "typescript.svg",
    React: "react.svg",
    MongoDB: "mongodb.svg",
    TailwindCSS: "tailwindcss.svg",
    Tailwind: "tailwindcss.svg",
  };

  // Fonction pour rendre les barres de difficulté
  const renderDifficultyBars = () => {
    if (difficulty === "Facile") {
      return (
        <div className="flex items-center gap-[2px]">
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
        </div>
      );
    } else if (difficulty === "Moyenne") {
      return (
        <div className="flex items-center gap-[2px]">
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
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-[2px]">
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
        </div>
      );
    }
  };

  return (
    <section className="flex w-[710px] flex-col rounded-3xl border border-[black]/10 bg-white p-10 shadow-[0_0_0.5px_0_rgba(0,0,0,0.20)]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-[80px] w-[82px] items-center justify-center rounded-[16px] bg-[#F4F4F4]">
            <Image
              src={image || "/icons/empty-project.svg"}
              alt={title || "Project icon"}
              width={80}
              height={80}
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl leading-tight font-medium">{title}</h1>
            <AuthorTag name={authorName} image={authorImage} />
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="flex h-[20px] w-32 items-center rounded-full bg-black/[0.02] px-3">
            <span className="mr-1 text-[11px] font-normal tracking-[-0.5px] text-black/40">
              Difficulté {difficulty}
            </span>
            {renderDifficultyBars()}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              Voir le Repository
              <Image
                src="/icons/github.svg"
                alt="arrowright"
                width={15}
                height={15}
              />
            </Button>
            <Button>
              Rejoindre le projet
              <Image
                src="/icons/joined.svg"
                alt="joined"
                width={10}
                height={10}
                style={{ filter: "invert(1)" }}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-2">
        <h2 className="mb-2 font-medium">Description du projet</h2>
        <p className="mb-4 text-sm font-normal text-black/70">{description}</p>
        <div className="w-[629px]">
          {keyBenefits && keyBenefits.length > 0 && (
            <>
              <p className="text-sm leading-[16px] font-normal text-black/70">
                Les avantages clés de notre outil de suivi de l'empreinte
                carbone incluent:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-[16px] font-normal text-black/70">
                {keyBenefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </>
          )}
          {(!keyBenefits || keyBenefits.length === 0) && longDescription && (
            <p className="text-sm font-normal text-black/70">
              {longDescription}
            </p>
          )}
        </div>
      </div>

      {/* Ligne de séparation */}
      <div className="mt-12 mb-3 w-full border-t border-dashed border-black/10"></div>

      {/* Technical Stack */}
      <div className="pt-4">
        <h3 className="mb-3 text-sm font-medium">Stack Technique</h3>
        <div className="flex gap-3">
          {techStacks.length > 0 ? (
            techStacks.map((tech, index) => (
              <StackIcon
                key={index}
                name={tech.name}
                icon={tech.iconUrl || "/icons/empty-project.svg"}
                alt={tech.name}
              />
            ))
          ) : (
            // Default tech stacks if none provided
            <>
              <StackIcon
                name="Typescript"
                icon="typescript.svg"
                alt="Typescript"
              />
              <StackIcon name="React" icon="react.svg" alt="React" />
              <StackIcon name="MongoDB" icon="mongodb.svg" alt="MongoDB" />
              <StackIcon
                name="TailwindCSS"
                icon="tailwindcss.svg"
                alt="TailwindCSS"
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export function SkeletonProjectHero() {
  return (
    <section className="flex min-h-[634px] w-[710px] animate-pulse flex-col rounded-3xl border border-[black]/10 bg-white p-10 shadow-[0_0_0.5px_0_rgba(0,0,0,0.20)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="h-[80px] w-[82px] rounded-[16px] bg-gray-200" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-6 w-40 rounded bg-gray-200" />
            <div className="h-5 w-24 rounded bg-gray-100" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="h-[20px] w-[118px] rounded-full bg-gray-100" />
          <div className="flex items-center gap-3">
            <div className="h-[43px] w-[130px] rounded bg-gray-200" />
            <div className="ml-2 h-[43px] w-[120px] rounded bg-gray-200" />
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="mt-2">
        <div className="mb-2 h-5 w-40 rounded bg-gray-200" />
        <div className="mb-2 h-4 w-3/4 rounded bg-gray-100" />
        <div className="mt-2 flex w-[629px] flex-col gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-4 w-full rounded bg-gray-100" />
          ))}
        </div>
      </div>
      <div className="mt-8 mb-3 w-full border-t border-dashed border-black/10"></div>
      {/* Technical Stack */}
      <div className="mt-2">
        <div className="mb-3 h-5 w-32 rounded bg-gray-200" />
        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[28px] w-[60px] rounded bg-gray-100" />
          ))}
        </div>
      </div>
    </section>
  );
}
