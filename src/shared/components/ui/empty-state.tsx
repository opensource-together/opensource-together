"use client";

import Link from "next/link";
import { IconType } from "react-icons/lib";

import { Button } from "./button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: IconType | React.ComponentType;
  href?: string;
  buttonText?: string;
  buttonIcon?: IconType | React.ComponentType;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  href,
  buttonText,
  buttonIcon: ButtonIcon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`mx-auto flex max-w-46 flex-col items-center justify-center py-12 text-center ${className}`}
    >
      {Icon ? (
        <div className="flex items-center gap-2">
          <Icon size={20} aria-hidden />
          <p className="font-medium">{title}</p>
        </div>
      ) : (
        <p className="font-medium">{title}</p>
      )}

      {description && (
        <p className="text-muted-foreground my-4 mt-2 text-sm">{description}</p>
      )}

      {href && buttonText && (
        <Link href={href}>
          <Button>
            {buttonText}
            {ButtonIcon && <ButtonIcon size={20} aria-hidden />}
          </Button>
        </Link>
      )}
    </div>
  );
}
