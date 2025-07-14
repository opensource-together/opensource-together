import React, { forwardRef, useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";

export interface BulletTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const BulletTextarea = forwardRef<HTMLTextAreaElement, BulletTextareaProps>(
  ({ className, value = "", onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const internalRef = ref || textareaRef;

    // Transform plain text to bullet points
    const transformToBulletPoints = (text: string) => {
      if (!text) return "";

      return text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => (line.startsWith("• ") ? line : `• ${line}`))
        .join("\n");
    };

    // Extract plain text from bullet points
    const extractPlainText = (text: string) => {
      return text
        .split("\n")
        .map((line) => line.replace(/^• /, "").trim())
        .filter((line) => line.length > 0)
        .join("\n");
    };

    // Update display value when value prop changes
    useEffect(() => {
      if (value) {
        setDisplayValue(transformToBulletPoints(value));
      } else {
        setDisplayValue("");
      }
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      const plainText = extractPlainText(newValue);

      // Update the display immediately for better UX
      setDisplayValue(transformToBulletPoints(plainText));

      // Call the original onChange with plain text
      if (onChange) {
        const syntheticEvent = {
          ...event,
          target: {
            ...event.target,
            value: plainText,
          },
        };
        onChange(syntheticEvent as React.ChangeEvent<HTMLTextAreaElement>);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const textarea = event.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentValue = textarea.value;

        // Insert new line with bullet point
        const newValue =
          currentValue.substring(0, start) +
          "\n• " +
          currentValue.substring(end);

        // Update the textarea value
        textarea.value = newValue;

        // Set cursor position after the bullet point
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 3;
        }, 0);

        // Trigger change event
        const plainText = extractPlainText(newValue);
        setDisplayValue(newValue);

        if (onChange) {
          const syntheticEvent = {
            target: {
              ...textarea,
              value: plainText,
            },
          } as React.ChangeEvent<HTMLTextAreaElement>;
          onChange(syntheticEvent);
        }
      }

      // Call original onKeyDown if provided
      if (props.onKeyDown) {
        props.onKeyDown(event);
      }
    };

    return (
      <textarea
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border border-black/5 bg-[#F9FAFB] px-3 py-2 text-sm leading-loose shadow-xs transition-[color,box-shadow] outline-none placeholder:text-black/70 focus-visible:ring-[1px] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={internalRef}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);

BulletTextarea.displayName = "BulletTextarea";

export { BulletTextarea };
