"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { HiExclamationCircle } from "react-icons/hi";
import { IconType } from "react-icons/lib";

import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message: string;
  icon?: IconType | React.ComponentType;
  href?: string;
  buttonText?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
  width?: string;
  queryKey?: string[];
  refetchFn?: () => Promise<unknown>;
}

export function ErrorState({
  title = "An error has occurred",
  message,
  icon,
  href,
  buttonText,
  onRetry,
  retryText = "Try again",
  className = "",
  width = "w-[400px]",
  queryKey,
  refetchFn,
}: ErrorStateProps) {
  const queryClient = useQueryClient();
  const defaultIcon = icon || HiExclamationCircle;

  const handleRetry = async () => {
    if (onRetry) {
      onRetry();
    } else if (queryKey && queryKey.length > 0) {
      await queryClient.refetchQueries({ queryKey });
    } else if (refetchFn) {
      await refetchFn();
    } else {
      await queryClient.refetchQueries();
    }
  };

  return (
    <div
      className={`mx-auto flex flex-col items-center justify-center py-12 text-center ${width} ${className}`}
    >
      {defaultIcon && (
        <div className="text-neutral-200">
          {(() => {
            const IconComp = defaultIcon as IconType;
            return <IconComp size={48} aria-hidden />;
          })()}
        </div>
      )}

      <h3 className="text-muted-foreground mt-4 mb-2 text-lg font-medium">
        {title}
      </h3>

      <p className="text-muted-foreground mb-6 max-w-80">{message}</p>

      <div className="flex gap-3 sm:flex-row">
        {href && (
          <Link href={href}>
            <Button variant="secondary">{buttonText}</Button>
          </Link>
        )}
        {(onRetry || queryKey || refetchFn) && (
          <Button onClick={handleRetry}>{retryText}</Button>
        )}
      </div>
    </div>
  );
}
