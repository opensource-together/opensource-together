"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiLogout } from "react-icons/hi";
import { HiCog6Tooth, HiMiniPencilSquare, HiUser } from "react-icons/hi2";

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
          className="ml-3 cursor-pointer"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-2">
        <div className="flex flex-col p-2">
          <p className="text-sm font-medium">{currentUser?.name}</p>
          <p className="text-muted-foreground text-sm">{currentUser?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <Link href="/profile/me">
          <DropdownMenuItem>
            <div className="text-muted-foreground flex w-full items-center justify-between">
              <p className="text-sm font-medium">Mon profil</p>
              <HiUser className="size-4" />
            </div>
          </DropdownMenuItem>
        </Link>
        <Link href="/profile/me/edit">
          <DropdownMenuItem>
            <div className="text-muted-foreground flex w-full items-center justify-between">
              <p className="text-sm font-medium">Modifier le profil</p>
              <HiMiniPencilSquare className="size-4" />
            </div>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href="/settings">
          <DropdownMenuItem>
            <div className="text-muted-foreground flex w-full items-center justify-between">
              <p className="text-sm font-medium">Paramètres</p>
              <HiCog6Tooth className="size-4" />
            </div>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleLogout}>
          <div className="text-destructive flex w-full items-center justify-between">
            <p className="text-sm font-medium">Déconnexion</p>
            <HiLogout className="text-destructive size-4" />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
