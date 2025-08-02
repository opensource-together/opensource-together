"use client";

import useAuth from "@/features/auth/hooks/use-auth.hook";
import LogoutButton from "./logout-button.component";

export default function UserInfo() {
  const { session, isPending, isAuthenticated, user } = useAuth();

  if (isPending) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Non connecté</span>
        <LogoutButton variant="ghost" size="sm">
          Se connecter
        </LogoutButton>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        {user.image && (
          <img
            src={user.image}
            alt={user.name || user.email}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="text-sm">
          <div className="font-medium">{user.name || user.email}</div>
          {user.name && (
            <div className="text-gray-500">{user.email}</div>
          )}
        </div>
      </div>
      <LogoutButton variant="ghost" size="sm" />
    </div>
  );
} 