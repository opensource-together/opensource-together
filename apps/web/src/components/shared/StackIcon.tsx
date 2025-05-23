import Image from "next/image";

interface StackIconProps {
  icon: string;
  alt: string;
  name?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function StackIcon({
  icon,
  alt,
  name,
  width = 14.5,
  height = 10.22,
  className = "",
}: StackIconProps) {
  // TODO: remove this once we have the icons from the backend
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
    <div className="flex items-center gap-2">
      <div className="size-5 border border-black/10 rounded-xs flex items-center justify-center">
        <Image src={iconSrcToUse} alt={alt} width={width} height={height} />
      </div>
      {name && <span className="text-sm">{name}</span>}
    </div>
  );
}

export default StackIcon;
