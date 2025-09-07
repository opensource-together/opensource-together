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
  width = 20,
  height = 20,
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
    <div className="flex flex-wrap gap-6">
      <div className="flex items-center gap-1">
        <div className="flex size-4.5 items-center justify-center rounded-full bg-black/5 p-1">
          <Image src={iconSrcToUse} alt={alt} width={width} height={height} />
        </div>
        {name && (
          <span className="text-primary text-sm tracking-tighter">{name}</span>
        )}
      </div>
    </div>
  );
}
