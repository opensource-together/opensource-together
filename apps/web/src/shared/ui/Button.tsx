import React from "react";

/**
 * Composant Button stylé (TailwindCSS)
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export default function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`cursor-pointer font-geist font-medium text-[13px] py-2 px-4 min-w-[160px] text-white flex items-center justify-center gap-2 bg-[#0d0d0d] shadow-inner-dark border-[1px] border-[#000000] rounded-[7px] hover:shadow-none hover:bg-[#0d0d0d] transition-all duration-200 ${className}`}
      style={{ fontWeight: 500 }}
      {...props}
    >
      {children}
    </button>
  );
}

