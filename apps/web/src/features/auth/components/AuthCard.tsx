import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="flex items-center">
      <div className="w-full max-w-md">
        <div className="p-4">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-2xl font-medium tracking-tight text-gray-900">
              {title}
            </h1>
            {subtitle && <p className="text-xs text-black/50">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
