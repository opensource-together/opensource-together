import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { HiLogout } from "react-icons/hi";
import {
  HiBookOpen,
  HiCog6Tooth,
  HiMiniBars3,
  HiMiniPencilSquare,
  HiMiniSquare2Stack,
  HiOutlineInformationCircle,
  HiUserCircle,
} from "react-icons/hi2";
import { RxDotsVertical } from "react-icons/rx";

import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/shared/components/ui/sheet";

import useAuth from "@/features/auth/hooks/use-auth.hook";
import SearchCommand from "@/features/projects/components/search-command.component";

interface MobileHeaderProps {
  links?: Array<{ label: string; icon: React.ElementType; href: string }>;
}

const DEFAULT_LINKS: MobileHeaderProps["links"] = [
  {
    label: "Dashboard",
    icon: HiMiniSquare2Stack,
    href: "/dashboard/my-projects",
  },
  { label: "About", icon: HiOutlineInformationCircle, href: "/about" },
  { label: "Guide", icon: HiBookOpen, href: "/guide" },
];

export function MobileHeader({ links = DEFAULT_LINKS }: MobileHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-black/5 bg-white/70 px-4 py-4 backdrop-blur-lg md:hidden">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/ostogether-logo.svg"
          alt="OpenSource Together"
          width={200}
          height={32}
        />
      </Link>

      <div className="flex items-center gap-4">
        <SearchCommand />

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation">
              <span className="sr-only">Open navigation</span>
              <HiMiniBars3 className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-3/4 flex-col p-0 pt-6">
            <SheetHeader className="flex flex-col gap-2 px-4">
              <Image
                src="/ostogether-logo.svg"
                alt="OpenSource Together"
                width={200}
                height={32}
              />
            </SheetHeader>

            <div className="flex flex-1 flex-col">
              <nav className="mt-6 flex flex-col gap-3 px-4">
                {links &&
                  links.map((link) => {
                    const active =
                      pathname === link.href ||
                      pathname.startsWith(`${link.href}/`);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={handleLinkClick}
                        className={`hover:bg-accent flex items-center gap-2 rounded-lg py-2 pl-2 text-sm font-medium transition ${
                          active
                            ? "bg-accent text-black"
                            : "text-muted-foreground"
                        }`}
                      >
                        <link.icon className="size-4" />
                        {link.label}
                      </Link>
                    );
                  })}
              </nav>

              {/* User Section - Fixed at bottom */}
              <div className="border-border mt-auto border-t">
                {isLoading ? null : isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="hover:bg-accent relative flex w-full cursor-pointer items-center gap-3 py-4 transition">
                        <div className="pl-4">
                          <Avatar
                            src={currentUser?.image}
                            name={currentUser?.name}
                            alt={currentUser?.name}
                            size="md"
                          />
                        </div>
                        <div className="flex flex-col truncate">
                          <p className="text-sm font-medium text-black">
                            {currentUser?.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {currentUser?.email}
                          </p>
                        </div>
                        <div className="absolute top-6 right-4">
                          <RxDotsVertical className="size-4" />
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="text-muted-foreground mr-2 w-48"
                    >
                      <Link href="/profile/me" onClick={handleLinkClick}>
                        <DropdownMenuItem>
                          <HiUserCircle className="size-4" />
                          View profile
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/profile/me/edit" onClick={handleLinkClick}>
                        <DropdownMenuItem>
                          <HiMiniPencilSquare className="size-4" />
                          Edit profile
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <Link
                        href="/dashboard/settings"
                        onClick={handleLinkClick}
                      >
                        <DropdownMenuItem>
                          <HiCog6Tooth className="size-4" />
                          Settings
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        variant="destructive"
                      >
                        <HiLogout className="size-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={handleLinkClick}
                    className="block w-full"
                  >
                    <div className="hover:bg-accent flex w-full items-center justify-center py-4 transition">
                      <span className="text-sm font-medium">Sign In</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
