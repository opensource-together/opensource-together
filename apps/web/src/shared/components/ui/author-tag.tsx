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
      className={`flex w-fit items-center gap-1.5 rounded-[3px] border border-black/10 bg-white px-2 py-1 font-normal text-black/80 ${className}`}
    >
      <span className="flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F4F4F4]">
        <Image src={image} alt={name || "Auteur"} width={14} height={14} />
      </span>
      <span className="text-xs font-medium">{name}</span>
    </div>
  );
}

export default AuthorTag;
