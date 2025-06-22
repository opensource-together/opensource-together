import Image from "next/image";

interface StackLogoProps {
  icon: string;
  alt: string;
  name?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Renders a stack logo icon with an optional label.
 *
 * Displays an icon image, optionally accompanied by a name label. The icon source is automatically prefixed with `/icons/` if it is a relative string path.
 *
 * @param icon - The source path or identifier for the icon image
 * @param alt - The alternative text for the icon image
 * @param name - Optional label text displayed next to the icon
 * @param width - Optional width of the icon image; defaults to 14.5
 * @param height - Optional height of the icon image; defaults to 10.22
 */
export default function StackLogo({
  icon,
  alt,
  name,
  width = 14.5,
  height = 10.22,
}: StackLogoProps) {
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
      <div className="flex size-5 items-center justify-center rounded-xs border border-black/10">
        <Image src={iconSrcToUse} alt={alt} width={width} height={height} />
      </div>
      {name && <span className="text-sm">{name}</span>}
    </div>
  );
}
