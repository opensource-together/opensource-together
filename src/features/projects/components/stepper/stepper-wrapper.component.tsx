import { cn } from "@/shared/lib/utils";

interface StepperWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function StepperWrapper({ children, className }: StepperWrapperProps) {
  return (
    <div className={cn("mx-7 max-w-md sm:mx-auto", className)}>
      <div className="my-16 flex flex-col items-start justify-start">
        {children}
      </div>
    </div>
  );
}
