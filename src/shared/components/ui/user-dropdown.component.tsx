"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiLogout } from "react-icons/hi";
import { HiCog6Tooth, HiMiniPencilSquare, HiUserCircle } from "react-icons/hi2";

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
        <Avatar
          src={currentUser?.image}
          name={currentUser?.name}
          alt={currentUser?.name}
          size="md"
          className="cursor-pointer"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="text-muted-foreground w-48 px-2"
      >
        <div className="flex flex-col truncate p-2 text-sm">
          <p className="text-primary font-medium">{currentUser?.name}</p>
          <p className="text-muted-foreground">{currentUser?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <Link href="/profile/me">
          <DropdownMenuItem>
            <HiUserCircle className="size-4" />
            View profile
          </DropdownMenuItem>
        </Link>
        <Link href="/profile/me/edit">
          <DropdownMenuItem>
            <HiMiniPencilSquare className="size-4" />
            Edit profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href="/settings">
          <DropdownMenuItem>
            <HiCog6Tooth className="size-4" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <HiLogout className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
