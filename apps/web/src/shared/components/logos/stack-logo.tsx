import Image from "next/image";

interface StackLogoProps {
  icon: string;
  alt: string;
  name?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function StackLogo({
  icon,
  alt,
  name,
  width = 14.5,
  height = 10.22,
}: StackLogoProps) {
  let iconSrcToUse = icon;
  if (
    typeof icon === "string" &&
    !icon.startsWith("/") &&
    !icon.includes("://") &&
    !icon.startsWith("data:")
  ) {
    iconSrcToUse = `/icons/${icon}`;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex items-center gap-1">
        <div className="flex size-5 items-center justify-center rounded-full bg-[#FAFAF9] p-1">
          <Image src={iconSrcToUse} alt={alt} width={width} height={height} />
        </div>
        {name && (
          <span className="text-sm font-medium text-black/70">{name}</span>
        )}
      </div>
    </div>
  );
}
