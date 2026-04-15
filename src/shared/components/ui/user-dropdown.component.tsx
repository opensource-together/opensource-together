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
import useAuth from "@/features/auth/hooks/use-auth.hook";
import { Avatar } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

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
        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <RiLogoutBoxLine className="size-4 text-primary" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
