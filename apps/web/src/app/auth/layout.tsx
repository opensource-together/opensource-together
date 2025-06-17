import { PublicRoute } from "@/features/auth/components/ProtectedRoute";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicRoute>
      {children}
    </PublicRoute>
  );
}
