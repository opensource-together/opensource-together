import { cn } from "@/shared/lib/utils";

interface StepperWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function StepperWrapper({ children, className }: StepperWrapperProps) {
  return (
    <div className={cn("mx-auto mt-8 max-w-md", className)}>
      <div className="my-24 flex flex-col items-start justify-start">
        {children}
      </div>
    </div>
  );
}
