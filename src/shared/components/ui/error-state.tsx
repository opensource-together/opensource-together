"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { HiExclamationCircle } from "react-icons/hi";
import type { IconType } from "react-icons/lib";
import { RiLoader2Fill } from "react-icons/ri";

import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message: string;
  icon?: IconType | React.ComponentType;
  href?: string;
  buttonText?: string;
  onRetry?: () => void | Promise<void>;
  retryText?: string;
  isLoading?: boolean;
  className?: string;
  width?: string;
  queryKey?: unknown[];
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
  isLoading = false,
  className = "",
  width = "w-[400px]",
  queryKey,
  refetchFn,
}: ErrorStateProps) {
  const queryClient = useQueryClient();
  const [isRetrying, setIsRetrying] = useState(false);
  const defaultIcon = icon || HiExclamationCircle;
  const isPending = isLoading || isRetrying;

  const handleRetry = async () => {
    if (isPending) return;

    setIsRetrying(true);
    try {
      if (onRetry) {
        await onRetry();
      } else if (queryKey && queryKey.length > 0) {
        await queryClient.refetchQueries({ queryKey });
      } else if (refetchFn) {
        await refetchFn();
      } else {
        await queryClient.refetchQueries();
      }
    } finally {
      setIsRetrying(false);
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

      <h3 className="mt-4 mb-2 font-medium text-lg text-muted-foreground">
        {title}
      </h3>

      <p className="mb-6 max-w-80 text-muted-foreground">{message}</p>

      <div className="flex gap-3 sm:flex-row">
        {href && (
          <Link href={href}>
            <Button variant="secondary">{buttonText}</Button>
          </Link>
        )}
        {(onRetry || queryKey || refetchFn) && (
          <Button
            onClick={() => void handleRetry()}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending && <RiLoader2Fill className="animate-spin" />}
            {retryText}
          </Button>
        )}
      </div>
    </div>
  );
}
