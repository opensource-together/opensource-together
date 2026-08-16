"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RiBookmarkLine,
  RiLoader2Fill,
  RiLogoutBoxLine,
  RiPencilLine,
  RiSettingsLine,
  RiUser3Line,
} from "react-icons/ri";
import { toast } from "sonner";
import useAuth from "@/features/auth/hooks/use-auth.hook";
import { Avatar } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { getErrorMessage } from "@/shared/lib/get-error-message";

export default function UserDropdown() {
  const { currentUser, logout, isLoggingOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to sign out"));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="cursor-pointer rounded-full outline-none focus-visible:outline-none focus-visible:ring-0"
        >
          <Avatar
            src={currentUser?.image}
            name={currentUser?.name}
            alt={currentUser?.name}
            size="md"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-max min-w-[200px] max-w-[min(calc(100vw-2rem),22rem)] p-2"
      >
        <div className="flex flex-col gap-0.5 p-2 text-sm">
          <p className="truncate font-medium text-primary">
            {currentUser?.name}
          </p>
          <p className="break-all text-muted-foreground">
            {currentUser?.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        <Link href="/profile/me">
          <DropdownMenuItem>
            <RiUser3Line className="size-4 text-primary" />
            View profile
          </DropdownMenuItem>
        </Link>
        <Link href="/profile/me/edit">
          <DropdownMenuItem>
            <RiPencilLine className="size-4 text-primary" />
            Edit profile
          </DropdownMenuItem>
        </Link>
        <Link href="/profile/me?tab=saved-projects">
          <DropdownMenuItem>
            <RiBookmarkLine className="size-4 text-primary" />
            View Bookmarks
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href="/dashboard/settings">
          <DropdownMenuItem>
            <RiSettingsLine className="size-4 text-primary" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={() => void handleLogout()}
          disabled={isLoggingOut}
          variant="destructive"
        >
          {isLoggingOut ? (
            <RiLoader2Fill className="size-4 animate-spin" />
          ) : (
            <RiLogoutBoxLine className="size-4 text-primary" />
          )}
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
