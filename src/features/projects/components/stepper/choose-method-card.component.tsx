"use client";

import { IconType } from "react-icons/lib";

import { cn } from "@/shared/lib/utils";

interface ChooseMethodCardProps {
  icon?: IconType | React.ComponentType;
  title: string;
  description: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function ChooseMethodCard({
  icon,
  title,
  description,
  isSelected = false,
  onClick,
  className,
}: ChooseMethodCardProps) {
  const IconComp = icon as IconType;
  return (
    <div
      className={cn(
        "flex w-64 flex-1 cursor-pointer flex-col rounded-[20px] p-6 transition-all",
        isSelected
          ? "outline-ost-blue-two outline-2"
          : "outline-muted-black-stroke outline",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        <IconComp size={20} />
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-gray-500">{description}</p>
    </div>
  );
}
