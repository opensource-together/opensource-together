"use client";

import { IconType } from "react-icons/lib";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface ChooseMethodCardProps {
  icon?: IconType | React.ComponentType;
  title: string;
  description: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  onLinkClick?: () => void;
  isLinking?: boolean;
  className?: string;
}

export default function ChooseMethodCard({
  icon,
  title,
  description,
  isSelected = false,
  isDisabled = false,
  onClick,
  onLinkClick,
  isLinking = false,
  className,
}: ChooseMethodCardProps) {
  const IconComp = icon as IconType;
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col rounded-[20px] p-6 transition-all sm:w-64",
        isDisabled
          ? "bg-muted/50 outline-muted-black-stroke cursor-not-allowed outline"
          : "hover:bg-accent cursor-pointer",
        isSelected && !isDisabled
          ? "outline-ost-blue-two outline-2"
          : "outline-muted-black-stroke outline",
        className
      )}
      onClick={!isDisabled ? onClick : undefined}
    >
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex items-center space-x-2",
            isDisabled && "opacity-60"
          )}
        >
          <IconComp size={20} />
          <h3 className="font-medium">{title}</h3>
        </div>
        {isDisabled && (
          <Button
            variant="outline"
            size="sm"
            disabled={isLinking}
            className="-mt-2"
            onClick={(e) => {
              e.stopPropagation();
              onLinkClick?.();
            }}
          >
            {isLinking ? "Linking..." : "Link"}
          </Button>
        )}
      </div>
      <p
        className={cn(
          "text-muted-foreground mt-3 text-sm",
          isDisabled && "opacity-60"
        )}
      >
        {description}
      </p>
    </div>
  );
}
