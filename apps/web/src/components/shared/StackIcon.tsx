import Image from "next/image";

interface StackIconProps {
  icon: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function StackIcon({
  icon,
  alt,
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
    <div
      className={`border border-[black]/10 rounded-xs size-4.5 flex items-center justify-center ${className}`}
    >
      <Image src={iconSrcToUse} alt={alt} width={width} height={height} />
    </div>
  );
}

export default StackIcon;
