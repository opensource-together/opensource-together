"use client";

import * as React from "react";
import { createContext, useContext } from "react";

import { cn } from "@/lib/utils";

// Types
type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: "horizontal" | "vertical";
};

type StepItemContextValue = {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
};

type StepState = "active" | "completed" | "inactive" | "loading";

// Contexts
const StepperContext = createContext<StepperContextValue | undefined>(
  undefined
);
const StepItemContext = createContext<StepItemContextValue | undefined>(
  undefined
);

const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a Stepper");
  }
  return context;
};

const useStepItem = () => {
  const context = useContext(StepItemContext);
  if (!context) {
    throw new Error("useStepItem must be used within a StepperItem");
  }
  return context;
};

// Components
interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      defaultValue = 0,
      value,
      onValueChange,
      orientation = "horizontal",
      className,
      ...props
    },
    ref
  ) => {
    const [activeStep, setInternalStep] = React.useState(defaultValue);

    const setActiveStep = React.useCallback(
      (step: number) => {
        if (value === undefined) {
          setInternalStep(step);
        }
        onValueChange?.(step);
      },
      [value, onValueChange]
    );

    const currentStep = value ?? activeStep;

    return (
      <StepperContext.Provider
        value={{
          activeStep: currentStep,
          setActiveStep,
          orientation,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "group/stepper inline-flex items-center justify-center data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
            className
          )}
          data-orientation={orientation}
          {...props}
        />
      </StepperContext.Provider>
    );
  }
);
Stepper.displayName = "Stepper";

// StepperItem
interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const StepperItem = React.forwardRef<HTMLDivElement, StepperItemProps>(
  (
    {
      step,
      completed = false,
      disabled = false,
      loading = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { activeStep } = useStepper();

    const state: StepState =
      completed || step < activeStep
        ? "completed"
        : activeStep === step
          ? "active"
          : "inactive";

    const isLoading = loading && step === activeStep;

    return (
      <StepItemContext.Provider
        value={{ step, state, isDisabled: disabled, isLoading }}
      >
        <div
          ref={ref}
          className={cn(
            "group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col",
            className
          )}
          data-state={state}
          {...(isLoading ? { "data-loading": true } : {})}
          {...props}
        >
          {children}
        </div>
      </StepItemContext.Provider>
    );
  }
);
StepperItem.displayName = "StepperItem";

// StepperTrigger
interface StepperTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const StepperTrigger = React.forwardRef<HTMLButtonElement, StepperTriggerProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const { setActiveStep } = useStepper();
    const { step, isDisabled } = useStepItem();

    const content = asChild ? (
      <div className={className}>{children}</div>
    ) : (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-3 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        onClick={() => setActiveStep(step)}
        disabled={isDisabled}
        {...props}
      >
        {children}
      </button>
    );

    return content;
  }
);
StepperTrigger.displayName = "StepperTrigger";

// StepperIndicator
interface StepperIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const StepperIndicator = React.forwardRef<
  HTMLDivElement,
  StepperIndicatorProps
>(({ className, ...props }, ref) => {
  const { state, step } = useStepItem();
  // Style selon l'état
  const isActive = state === "active";
  const isCompleted = state === "completed";
  return (
    <div
      ref={ref}
      className={cn(
        "font-geist flex items-center justify-center rounded-full font-medium",
        isActive || isCompleted
          ? "bg-black text-white"
          : "bg-black/5 text-black",
        "transition-colors duration-200",
        "h-[28px] w-[28px] text-[15px]",
        className
      )}
      data-state={state}
      {...props}
    >
      {step + 1}
    </div>
  );
});
StepperIndicator.displayName = "StepperIndicator";

// StepperTitle
const StepperTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-sm font-medium", className)} {...props} />
));
StepperTitle.displayName = "StepperTitle";

// StepperDescription
const StepperDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
StepperDescription.displayName = "StepperDescription";

// StepperSeparator
const StepperSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useStepper();
  return (
    <div
      ref={ref}
      className={cn(
        "transition-colors duration-200",
        orientation === "horizontal"
          ? "mx-2 h-[2px] w-[90px]"
          : "my-2 h-[90px] w-[2px]",
        className
      )}
      data-step-separator
      {...props}
    />
  );
});
StepperSeparator.displayName = "StepperSeparator";

export {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
};
