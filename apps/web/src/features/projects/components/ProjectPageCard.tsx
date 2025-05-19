import difficultyBarGray from "@/shared/icons/Difficulty-bar-gray.svg";
import difficultyBarLight from "@/shared/icons/Difficulty-bar-light.svg";
import emptyprojecticon from "@/shared/icons/emptyprojectIcon.svg";
import githubIcon from "@/shared/icons/github.svg";
import mongodbIcon from "@/shared/icons/mongodb.svg";
import reactIcon from "@/shared/icons/react.svg";
import tailwindIcon from "@/shared/icons/tailwindcss.svg";
import typescriptIcon from "@/shared/icons/typescript (2).svg";
import Button from "@/shared/ui/Button";
import Image from "next/image";
import exemplebyronIcon from "../../../shared/icons/exemplebyronIcon.svg";
import joinedIcon from "../../../shared/icons/joinedicon.svg";
import { TechStack } from "../types/ProjectTypes";

interface ProjectPageCardProps {
  title?: string;
  description?: string;
  longDescription?: string;
  techStacks?: TechStack[];
  keyBenefits?: string[];
  difficulty?: "Facile" | "Moyenne" | "Difficile";
}

export default function ProjectPageCard({
  title = "EcoTrack",
  description = "Suivez votre empreinte carbone de vos activités quotidiennes et de votre consommation. Recevez des conseils personnalisés et des suggestions pour vivre de manière plus durable et réduire votre impact sur l'environnement.",
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
}: ProjectPageCardProps) {
  // Map of tech stacks to icons - to be replaced with dynamic icon loading
  const techIconMap: Record<string, any> = {
    TypeScript: typescriptIcon,
    Typescript: typescriptIcon,
    React: reactIcon,
    MongoDB: mongodbIcon,
    TailwindCSS: tailwindIcon,
    Tailwind: tailwindIcon,
  };

  // Fonction pour rendre les barres de difficulté
  const renderDifficultyBars = () => {
    if (difficulty === "Facile") {
      return (
        <div className="flex items-center gap-[2px]">
          <Image
            src={difficultyBarGray}
            alt="Difficulty level"
            width={2}
            height={8}
          />
          <Image
            src={difficultyBarLight}
            alt="Difficulty level"
            width={2}
            height={8}
          />
          <Image
            src={difficultyBarLight}
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
            src={difficultyBarGray}
            alt="Difficulty level"
            width={2}
            height={8}
          />
          <Image
            src={difficultyBarGray}
            alt="Difficulty level"
            width={2}
            height={8}
          />
          <Image
            src={difficultyBarLight}
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
            src={difficultyBarGray}
            alt="Difficulty level"
            width={2}
            height={8}
          />
          <Image
            src={difficultyBarGray}
            alt="Difficulty level"
            width={2}
            height={8}
          />
          <Image
            src={difficultyBarGray}
            alt="Difficulty level"
            width={2}
            height={8}
          />
        </div>
      );
    }
  };

  return (
    <section className="w-[710px] bg-white rounded-[24px] shadow-[0_0_0.5px_0_rgba(0,0,0,0.20)] border border-[black]/10 p-10 flex flex-col font-geist">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-5">
          <div className="w-[82px] h-[80px] rounded-[16px] bg-[#F4F4F4] flex items-center justify-center">
            <Image
              src={emptyprojecticon}
              alt="EcoTrack"
              width={80}
              height={80}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-[24px] font-medium leading-tight font-geist">
              {title}
            </h1>
            <div className="flex items-center gap-1 font-normal text-black/80 border border-black/10 rounded-[3px] h-[25px] w-[90px] bg-white py-2 px-1">
              <span className="rounded-full overflow-hidden flex items-center justify-center bg-[#F4F4F4]">
                <Image
                  src={exemplebyronIcon}
                  alt="Byron Love"
                  width={13}
                  height={13}
                />
              </span>
              <span className="font-geist font-medium text-[12px]">
                Byron Love
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center h-[20px] w-32 bg-black/[0.02] rounded-full px-3">
            <span className="font-geist font-normal text-[11px] tracking-[-0.5px] text-black/40 mr-1">
              Difficulté {difficulty}
            </span>
            {renderDifficultyBars()}
          </div>
          <div className="flex gap-3 items-center">
            <a
              href="#"
              className="text-[13px] tracking-[-0.5px] font-medium font-geist flex items-center justify-center gap-2 text-black/80 h-[43px] w-[130px] border border-black/5 rounded-[7px] bg-white py-2 shadow-[0_2px_5px_rgba(0,0,0,0.03)] hover:bg-slate-50 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Voir le dépôt
              <Image src={githubIcon} alt="arrowright" width={15} height={15} />
            </a>
            <Button
              width="155px"
              height="43px"
              minWidth={false}
              className="ml-2 text-[13px] font-medium tracking-[-0.5px]"
            >
              Rejoindre le projet
              <Image
                src={joinedIcon}
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
        <h2 className="text-[15px] font-medium font-geist mb-2">
          Description du projet
        </h2>
        <p className="text-[13px] font-geist font-normal text-black/70 mb-4">
          Suivez votre empreinte carbone de vos activités quotidiennes et de
          votre consommation. Recevez des conseils personnalisés et des
          suggestions pour vivre de manière plus durable et réduire votre impact
          sur l'environnement.
        </p>
        <div className="w-[629px]">
          {keyBenefits && keyBenefits.length > 0 && (
            <>
              <p className="text-[13px] leading-[16px] font-geist font-normal text-black/70">
                Les avantages clés de notre outil de suivi de l'empreinte
                carbone incluent:
              </p>
              <ul className="text-[13px] leading-[16px] font-geist font-normal text-black/70 list-disc pl-5 space-y-1">
                {keyBenefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </>
          )}
          {(!keyBenefits || keyBenefits.length === 0) && longDescription && (
            <p className="text-[13px] leading-[16px] font-geist font-normal text-black/70">
              {longDescription}
            </p>
          )}
        </div>
      </div>

      {/* Ligne de séparation */}
      <div className="border-t border-dashed border-black/10 w-full mt-12 mb-3"></div>

      {/* Technical Stack */}
      <div className=" pt-4 ">
        <h3 className="text-[15px] font-medium font-geist mb-3">
          Stack Technique
        </h3>
        <div className="flex gap-3">
          {techStacks.length > 0 ? (
            techStacks.map((tech, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] border border-black/10 rounded-[2px] flex items-center justify-center">
                  <Image
                    src={techIconMap[tech.name] || emptyprojecticon}
                    alt={tech.name}
                    width={14}
                    height={14}
                  />
                </div>
                <span className="text-[14px] font-normal font-geist">
                  {tech.name}
                </span>
              </div>
            ))
          ) : (
            // Default tech stacks if none provided
            <>
              <div className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] border border-black/10 rounded-[2px] flex items-center justify-center">
                  <Image
                    src={typescriptIcon}
                    alt="Typescript"
                    width={14}
                    height={14}
                  />
                </div>
                <span className="text-[14px] font-normal font-geist">
                  Typescript
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] border border-black/10 rounded-[2px] flex items-center justify-center">
                  <Image src={reactIcon} alt="React" width={14} height={14} />
                </div>
                <span className="text-[14px] font-normal font-geist">
                  React
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] border border-black/10 rounded-[2px] flex items-center justify-center">
                  <Image
                    src={mongodbIcon}
                    alt="MongoDB"
                    width={14}
                    height={14}
                  />
                </div>
                <span className="text-[14px] font-normal font-geist">
                  MongoDB
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-[20px] h-[20px] border border-black/10 rounded-[2px] flex items-center justify-center">
                  <Image
                    src={tailwindIcon}
                    alt="TailwindCSS"
                    width={14}
                    height={14}
                  />
                </div>
                <span className="text-[14px] font-normal font-geist">
                  TailwindCSS
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export function SkeletonProjectPageCard() {
  return (
    <section className="w-[710px] min-h-[634px] bg-white rounded-[24px] shadow-[0_0_0.5px_0_rgba(0,0,0,0.20)] border border-[black]/10 p-10 flex flex-col font-geist animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-5">
          <div className="w-[82px] h-[80px] rounded-[16px] bg-gray-200" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="h-5 w-24 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="h-[20px] w-[118px] bg-gray-100 rounded-full" />
          <div className="flex gap-3 items-center">
            <div className="h-[43px] w-[130px] bg-gray-200 rounded" />
            <div className="h-[43px] w-[120px] bg-gray-200 rounded ml-2" />
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="mt-2">
        <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
        <div className="w-[629px] flex flex-col gap-2 mt-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-100 rounded" />
          ))}
        </div>
      </div>
      <div className="border-t border-dashed border-black/10 w-full mt-8 mb-3"></div>
      {/* Technical Stack */}
      <div className="mt-2">
        <div className="h-5 w-32 bg-gray-200 rounded mb-3" />
        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[60px] h-[28px] bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    </section>
  );
}
