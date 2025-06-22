import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import ProfileView from "@/features/profile/views/ProfileView";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileView />
    </ProtectedRoute>
  );
}
