"use client";

import React from "react";

import { cn } from "@/shared/lib/utils";

interface StepperIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function StepperIndicator({
  currentStep,
  totalSteps,
  className,
}: StepperIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <React.Fragment key={index}>
          {/* Step Indicator */}
          <div
            className={cn(
              "font-geist flex h-[28px] w-[28px] items-center justify-center rounded-full text-[15px] font-medium transition-colors duration-200",
              currentStep >= index
                ? "bg-black text-white"
                : "bg-black/5 text-black"
            )}
          >
            {index + 1}
          </div>

          {/* Separator (not for the last step) */}
          {index < totalSteps - 1 && (
            <div
              className={cn(
                "mx-2 h-[2px] w-[90px] transition-colors duration-200",
                currentStep > index ? "bg-black" : "bg-black/5"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
