import React from "react";

/**
 * Composant Button stylé (TailwindCSS)
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  width?: string; // ex: "110px" ou "w-[110px]"
  height?: string; // ex: "35px" ou "h-[35px]"
  minWidth?: string | false; // ex: "160px" ou false pour désactiver
  radius?: string; // ex: "7px" ou "rounded-full"
}

export default function Button({
  children,
  className = "",
  width,
  height,
  minWidth = "160px",
  radius,
  ...props
}: ButtonProps) {
  // Détection si c'est une classe Tailwind ou une valeur brute
  const isTailwind = (val?: string) => val && val.includes("[");

  const widthClass = isTailwind(width) ? width : "";
  const heightClass = isTailwind(height) ? height : "";
  const radiusClass = isTailwind(radius) ? radius : "";
  const minWidthClass =
    typeof minWidth === "string" ? (isTailwind(minWidth) ? minWidth : "") : "";
  const style: React.CSSProperties = {
    fontWeight: 500,
    ...(width && !isTailwind(width) ? { width } : {}),
    ...(height && !isTailwind(height) ? { height } : {}),
    ...(typeof minWidth === "string" && !isTailwind(minWidth)
      ? { minWidth }
      : {}),
    ...(radius && !isTailwind(radius) ? { borderRadius: radius } : {}),
  };

  return (
    <button
      className={`cursor-pointer font-geist font-medium text-[13px] py-2 px-4 text-white flex items-center justify-center gap-2 bg-[#0d0d0d] shadow-inner-dark border-[1px] border-[#000000] hover:shadow-none hover:bg-[#0d0d0d]/80 transition-all duration-200 rounded-[7px] ${widthClass} ${heightClass} ${radiusClass} ${minWidthClass} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
