import Image from "next/image";

interface AuthorTagProps {
  name?: string;
  image?: string;
  className?: string;
}

export function AuthorTag({
  name,
  image = "/icons/exemplebyronIcon.svg",
  className = "",
}: AuthorTagProps) {
  return (
    <div
      className={`flex items-center gap-1.5 font-normal text-black/80 border border-black/10 rounded-[3px] bg-white px-2 py-1 w-fit ${className}`}
    >
      <span className="flex-shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-[#F4F4F4]">
        <Image src={image} alt={name || "Auteur"} width={14} height={14} />
      </span>
      <span className="font-medium text-xs">{name}</span>
    </div>
  );
}

export default AuthorTag;
