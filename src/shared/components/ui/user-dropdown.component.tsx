"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RiBookmarkLine,
  RiLogoutBoxLine,
  RiPencilLine,
  RiSettingsLine,
  RiUser3Line,
} from "react-icons/ri";

import { Avatar } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import useAuth from "@/features/auth/hooks/use-auth.hook";

export default function UserDropdown() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="cursor-pointer">
          <Avatar
            src={currentUser?.image}
            name={currentUser?.name}
            alt={currentUser?.name}
            size="md"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] p-2">
        <div className="flex flex-col truncate p-2 text-sm">
          <p className="text-primary font-medium">{currentUser?.name}</p>
          <p className="text-muted-foreground">{currentUser?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <Link href="/profile/me">
          <DropdownMenuItem>
            <RiUser3Line className="text-primary size-4" />
            View profile
          </DropdownMenuItem>
        </Link>
        <Link href="/profile/me/edit">
          <DropdownMenuItem>
            <RiPencilLine className="text-primary size-4" />
            Edit profile
          </DropdownMenuItem>
        </Link>
        <Link href="/profile/me?tab=saved-projects">
          <DropdownMenuItem>
            <RiBookmarkLine className="text-primary size-4" />
            View Bookmarks
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href="/dashboard/settings">
          <DropdownMenuItem>
            <RiSettingsLine className="text-primary size-4" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <RiLogoutBoxLine className="text-primary size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
