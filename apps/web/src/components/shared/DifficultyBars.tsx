import Image from "next/image";

export type Difficulty = "Facile" | "Moyenne" | "Difficile" | "";

interface DifficultyBarsProps {
  difficulty: Difficulty;
  showLabel?: boolean;
  className?: string;
}

export default function DifficultyBars({
  difficulty,
  showLabel = true,
  className = "",
}: DifficultyBarsProps) {
  const renderBars = () => {
    switch (difficulty) {
      case "Facile":
        return (
          <>
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
          </>
        );
      case "Moyenne":
        return (
          <>
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
          </>
        );
      case "Difficile":
        return (
          <>
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
          </>
        );
      default:
        return (
          <>
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
            <Image
              src="/icons/difficulty-bar-light.svg"
              alt="Difficulty level"
              width={2}
              height={8}
            />
          </>
        );
    }
  };

  return (
    <div
      className={`flex h-[20px] w-32 items-center rounded-full bg-black/[0.02] px-3 ${className}`}
    >
      {showLabel && (
        <span className="mr-1 text-[11px] font-normal tracking-[-0.5px] text-black/40">
          Difficulté {difficulty || "Non définie"}
        </span>
      )}
      <div className="flex items-center gap-[2px]">{renderBars()}</div>
    </div>
  );
}
