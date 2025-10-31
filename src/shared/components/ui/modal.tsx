"use client";

import * as React from "react";
import { RiLoader2Fill } from "react-icons/ri";

import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Separator } from "./separator";

interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  // Action props
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  confirmVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
};

function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  trigger,
  className,
  size = "lg",
  showCloseButton = true,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
  onCancel,
  isLoading = false,
  confirmVariant = "default",
}: ModalProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={`${sizeClasses[size]} ${className || ""}`}
        showCloseButton={showCloseButton}
      >
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        {children}

        {(onConfirm || onCancel) && (
          <>
            <Separator
              className="mt-3 mb-1"
              style={{
                marginLeft: "-16px",
                marginRight: "-16px",
                width: "calc(100% + 32px)",
              }}
            />
            <DialogFooter>
              {onCancel && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                >
                  {cancelText}
                </Button>
              )}
              {onConfirm && (
                <Button
                  variant={confirmVariant}
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex items-center gap-2 ${
                    confirmVariant === "destructive"
                      ? "bg-red-500 hover:bg-red-600"
                      : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RiLoader2Fill className="animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>{confirmText}</>
                  )}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { Modal };
