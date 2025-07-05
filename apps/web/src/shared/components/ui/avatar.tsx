"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

const avatarVariants = cva("relative flex shrink-0 overflow-hidden", {
  variants: {
    size: {
      xs: "size-6",
      sm: "size-8",
      md: "size-10",
      lg: "size-12",
      xl: "size-16",
      "2xl": "size-20",
    },
    shape: {
      circle: "rounded-full",
      square: "rounded-none",
      rounded: "rounded-lg",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "circle",
  },
});

const avatarFallbackVariants = cva(
  "flex size-full items-center justify-center font-medium select-none",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
      },
      color: {
        blue: "bg-blue-500 text-white",
        green: "bg-green-500 text-white",
        purple: "bg-purple-500 text-white",
        pink: "bg-pink-500 text-white",
        indigo: "bg-indigo-500 text-white",
        yellow: "bg-yellow-500 text-black",
        red: "bg-red-500 text-white",
        gray: "bg-gray-500 text-white",
        orange: "bg-orange-500 text-white",
        teal: "bg-teal-500 text-white",
      },
    },
    defaultVariants: {
      size: "md",
      color: "blue",
    },
  }
);

// Define color type explicitly
type AvatarColor =
  | "blue"
  | "green"
  | "purple"
  | "pink"
  | "indigo"
  | "yellow"
  | "red"
  | "gray"
  | "orange"
  | "teal";

// Helper functions for auto-generation
const generateInitials = (name: string): string => {
  if (!name) return "?";

  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    // Single word: take first 2 characters
    return words[0].substring(0, 2).toUpperCase();
  }

  // Multiple words: take first letter of first 2 words
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

const generateColorFromText = (text: string): AvatarColor => {
  if (!text) return "blue";

  const colors: AvatarColor[] = [
    "blue",
    "green",
    "purple",
    "pink",
    "indigo",
    "yellow",
    "red",
    "gray",
    "orange",
    "teal",
  ];

  // Generate consistent hash from text
  const hash = text
    .split("")
    .reduce((acc, char) => char.charCodeAt(0) + acc, 0);

  return colors[hash % colors.length];
};

interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  /** Image source URL - if provided, will show image with fallback */
  src?: string | null;
  /** Alt text for image */
  alt?: string;
  /** Name for generating initials and color automatically */
  name?: string;
  /** Manual fallback text (overridden by name if provided) */
  fallback?: string;
  /** Manual color override (ignored if name is provided) */
  color?: AvatarColor;
}

/**
 * Intelligent Avatar component that automatically handles image/fallback logic
 *
 * @example
 * ```tsx
 * // Auto-generated initials and color
 * <Avatar name="John Doe" size="lg" />
 *
 * // With image + auto fallback
 * <Avatar src="/user.jpg" name="John Doe" size="lg" />
 *
 * // Manual fallback
 * <Avatar fallback="JD" color="purple" size="lg" />
 * ```
 */
function Avatar({
  className,
  size,
  shape,
  src,
  alt,
  name,
  fallback,
  color,
  children,
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(avatarVariants({ size, shape }), className)}
      {...props}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={alt || name || "Avatar"}
          className="aspect-square size-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback
        className={cn(
          avatarFallbackVariants({
            size,
            color: name ? generateColorFromText(name) : color,
          })
        )}
      >
        {name ? generateInitials(name) : fallback || children || "?"}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

// Keep individual components for advanced usage
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

interface CustomAvatarFallbackProps {
  /** Text to generate initials and color from (overrides manual color) */
  name?: string;
  /** Manual color override (ignored if name is provided) */
  color?: AvatarColor;
  /** Size variant */
  size?: VariantProps<typeof avatarFallbackVariants>["size"];
}

function AvatarFallback({
  className,
  size,
  color,
  name,
  children,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> &
  CustomAvatarFallbackProps) {
  // Auto-generate initials and color if name is provided
  const displayText = name ? generateInitials(name) : children;
  const finalColor = name ? generateColorFromText(name) : color;

  return (
    <AvatarPrimitive.Fallback
      className={cn(
        avatarFallbackVariants({ size, color: finalColor }),
        className
      )}
      {...props}
    >
      {displayText}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarFallback, AvatarImage };
