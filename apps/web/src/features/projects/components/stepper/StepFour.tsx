import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function DifficultyBars({ level }: { level: "Easy" | "Medium" | "Hard" }) {
  if (level === "Easy") {
    return (
      <span className="flex items-center gap-[2px] ml-2">
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
      <span className="flex items-center gap-[2px] ml-2">
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
      <span className="flex items-center gap-[2px] ml-2">
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

export default function StepFour({ onBack }: { onBack: () => void }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [modalBlurState, setModalBlurState] = useState<
    "enter" | "enter-active" | "exit" | "exit-active" | null
  >(null);

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

  if (showConfirmation) {
    return (
      <div className="flex flex-col items-center justify-center bg-white p-10 rounded-[20px] font-geist">
        <h2 className="text-[30px] text-center font-medium tracking-tight font-geist mb-2">
          Félicitations ! Votre projet a été créé
        </h2>
        <p className="text-[15px] text-center text-black/70 mb-8">
          Vous pouvez maintenant trouver vos projets dans votre tableau de bord
          "Mes projets" et les membres pourront postuler à n'importe quel rôle
          ouvert
        </p>
        <Link href="/" className="w-full">
          <Button size="lg" variant="outline" className="w-full">
            Voir le projet
          </Button>
        </Link>
      </div>
    );
  }

  // Modale Create New Role
  const RoleModal = () => (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center modal-blur-${modalBlurState || "enter"}`}
      style={{ background: "rgba(0,0,0,0.10)" }}
    >
      <div className="relative bg-white w-[603px] min-h-[400px] max-h-[90vh] rounded-[20px] border border-black/5 flex flex-col items-center px-6 py-6 shadow-xl font-geist overflow-y-auto">
        {/* Header: Title centered, close cross right */}
        <div
          className="w-full flex items-center justify-center relative mb-8"
          style={{ height: "32px" }}
        >
          <span className="absolute left-0" style={{ width: "32px" }}></span>
          <span className="text-black/20 text-[12px] font-geist font-medium ">
            Create New Role
          </span>
          <button
            className="absolute right-0 flex items-center justify-center text-black hover:text-black transition"
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
        <div className="w-full flex flex-col gap-8">
          <div>
            <label className="block text-black font-geist font-medium text-[18px] mb-5">
              Choose Role Title
            </label>
            <div className="grid grid-cols-3 gap-3 ">
              {Array(6)
                .fill("Back-end Developer")
                .map((role, i) => (
                  <button
                    key={i}
                    className="w-[144px] h-[30px] rounded-[5px] border border-black/5 bg-white text-black text-[12px] font-medium flex items-center justify-center"
                  >
                    {role}
                  </button>
                ))}
            </div>
          </div>
          <div className="border-t border-dashed border-black/10 my-2"></div>
          <div>
            <label className="block text-black font-geist font-medium text-[18px] mb-5">
              Add skill set
            </label>
            <div className="flex flex-wrap gap-2">
              {Array(4)
                .fill("Front-end Developer")
                .map((skill, i) => (
                  <span
                    key={i}
                    className="font-geist font-normal text-[12px] text-[#2B7FFF] bg-[#EFF6FF] rounded-full px-2 py-0.5"
                  >
                    {skill}
                  </span>
                ))}
              {Array(4)
                .fill("UX Designer")
                .map((skill, i) => (
                  <span
                    key={i}
                    className="font-geist font-normal text-[12px] text-[#FF8904] bg-[#FFFBEB] rounded-full px-2 py-0.5"
                  >
                    {skill}
                  </span>
                ))}
              {Array(4)
                .fill("MongoDB")
                .map((skill, i) => (
                  <span
                    key={i}
                    className="font-geist font-normal text-[12px] text-[#00C950] bg-[#F0FDF4] rounded-full px-2 py-0.5"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>
          <div className="border-t border-dashed border-black/10 my-2"></div>
          <div>
            <label className="block text-black font-geist font-medium text-[18px] mb-5">
              Add Description
            </label>
            <div className="relative mb-3">
              <textarea
                className="w-full h-[153px] rounded-[10px] border border-black/10 bg-white px-4 py-3 text-[15px] font-geist text-black/70 focus:outline-none resize-none"
                maxLength={250}
                placeholder="Describe new role"
              />
              <span className="absolute bottom-3 right-4 text-[13px] text-black/20">
                250/250
              </span>
            </div>
          </div>
          <Button
            size="lg"
            className="mb-4 flex items-center justify-center mt-0"
            onClick={() => setShowConfirmation(true)}
          >
            Créer un nouveau rôle
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 w-[500px] bg-white p-10 rounded-[20px] font-geist">
      {/* Add collaborators */}

      <div>
        <h2 className="text-[30px] text-center font-medium tracking-tight font-geist mb-2">
          Ajouter les détails du projet
        </h2>
        <p className="text-[15px] text-center text-black/70 mb-8">
          Complétez les informations détaillées de votre projet open source
        </p>
        <label className="block text-black font-geist font-medium text-[18px] mb-2">
          Ajouter des collaborateurs
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher des collaborateurs"
            className="w-full h-[42px] rounded-[5px] border border-black/5 bg-black/2 px-4 pr-10 text-[15px] font-geist text-black/50 focus:outline-none"
            disabled
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20">
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
        <label className="block text-black font-geist font-medium text-[18px] mb-2">
          Technologies
        </label>
        <button className="flex items-center gap-2 text-black/70 text-[15px] font-geist">
          <span className="w-7 h-7 flex items-center justify-center border border-black/5 rounded-[2px] bg-white">
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
        <label className="block text-black font-geist font-medium text-[18px] mb-2">
          Difficulté
        </label>
        <div className="flex gap-3">
          <button className="w-[120px] h-[25px] rounded-[5px]  bg-black/2 text-black/30 text-[11px] font-geist flex items-center justify-center gap-2">
            Difficulté facile <DifficultyBars level="Easy" />
          </button>
          <button className="w-[120px] h-[25px] rounded-[5px] bg-black/2 text-black/30 text-[11px] font-geist flex items-center justify-center gap-2">
            Difficulté moyenne <DifficultyBars level="Medium" />
          </button>
          <button className="w-[120px] h-[25px] rounded-[5px]  bg-black/2 text-black/30 text-[11px] font-geist flex items-center justify-center gap-2">
            Difficulté difficile <DifficultyBars level="Hard" />
          </button>
        </div>
      </div>

      {/* Open Roles */}
      <div>
        <label className="block text-black font-geist font-medium text-[18px] mb-2">
          Rôles disponibles
        </label>
        <button
          className="w-full h-[48px] rounded-[10px] border border-black/10 bg-white text-black text-[15px] font-medium flex items-center justify-center gap-2 mb-4"
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
          <div className="flex items-center justify-between mb-1">
            <span className="font-geist font-medium text-[17px] text-black">
              Développeur Back-end
            </span>
            <button className="text-black/50 text-[10px] font-bold mt-6">
              <Image
                src="/icons/croix-suppression.svg"
                alt="croix suppression"
                width={13}
                height={13}
              />
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="w-[60px] h-[20px] flex items-center justify-center rounded-full bg-[#F0FDF4] text-[#00C950] text-[11px] font-geist">
              Node.js
            </span>
            <span className="w-[60px] h-[20px] flex items-center justify-center rounded-full bg-[#F0FDF4] text-[#00C950] text-[11px] font-geist">
              MongoDB
            </span>
            <span className="w-[60px] h-[20px] flex items-center justify-center rounded-full bg-[#F0FDF4] text-[#00C950] text-[11px] font-geist">
              Docker
            </span>
          </div>
        </div>
        {showRoleModal && <RoleModal />}
        <Button
          size="lg"
          className="mb-4 w-full mt-12"
          onClick={() => setShowConfirmation(true)}
        >
          Créer un nouveau projet
        </Button>
      </div>
    </div>
  );
}
