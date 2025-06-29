"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import useAuth from "@/features/auth/hooks/use-auth.hook";

import { Avatar } from "../ui/avatar";
import Icon from "../ui/icon";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function NavLink({ href, children, className = "" }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center justify-center px-3.5 py-1.5 transition-all duration-200 ${
        isActive
          ? "rounded-full bg-[black]/5"
          : "text-[black]/70 hover:rounded-full hover:bg-[black]/5"
      } ${className}`}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, currentUser, logout } = useAuth();

  if (pathname.startsWith("/auth")) {
    return null;
  }

  const handleCreate = () => {
    router.push("/projects/create");
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="font-geist flex h-auto min-h-[60px] flex-wrap items-center justify-between px-4 py-3 text-[13px] font-normal sm:px-6 md:min-h-[70px] md:px-10 md:py-0 lg:h-[81px] lg:px-[73px]">
      <section className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
        <Link href="/">
          <article className="flex items-center gap-2">
            <Image
              src="/ost-logo.svg"
              alt="ost-logo"
              width={130}
              height={26}
              className="h-auto max-h-[26px] w-auto md:max-h-[30px] lg:max-h-[35px]"
            />
          </article>
        </Link>

        {/* Navigation pour desktop et tablette */}
        <nav className="hidden items-center space-x-3 text-sm tracking-tighter md:flex lg:space-x-6">
          <NavLink href="/">Accueil</NavLink>
          <NavLink href="/profile">Profil</NavLink>
          <NavLink href="/my-projects">Gestion projet</NavLink>
        </nav>
      </section>

      {/* Bouton menu mobile */}
      <button
        className="flex h-8 w-8 flex-col items-center justify-center md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span
          className={`mb-1 block h-0.5 w-5 bg-black transition-transform ${mobileMenuOpen ? "translate-y-1.5 rotate-45" : ""}`}
        ></span>
        <span
          className={`mb-1 block h-0.5 w-5 bg-black transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`}
        ></span>
        <span
          className={`block h-0.5 w-5 bg-black transition-transform ${mobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
        ></span>
      </button>

      {/* Menu mobile */}
      <nav
        className={`${mobileMenuOpen ? "flex" : "hidden"} w-full flex-col space-y-3 py-3 md:hidden`}
      >
        <NavLink href="/" className="w-full py-1.5">
          Home
        </NavLink>
        <NavLink href="/profile" className="w-full py-1.5">
          Profile
        </NavLink>
        <NavLink href="/my-projects" className="w-full py-1.5">
          My Projects
        </NavLink>

        <Link
          href="https://github.com/opensource-together/opensource-together"
          target="_blank"
        >
          <Button
            variant="outline"
            className="flex items-center font-medium shadow-none"
          >
            Star Us <Icon name="github" size="md" />
          </Button>
        </Link>
      </nav>

      {/* Desktop */}
      <section className="hidden items-center space-x-2 sm:space-x-3 md:flex md:space-x-4">
        <Link href="https://github.com/opensource-together" target="_blank">
          <Button
            variant="outline"
            className="flex items-center font-medium shadow-none"
          >
            Star Us <Icon name="github" size="md" />
          </Button>
        </Link>
        {isAuthenticated ? (
          <>
            <Button onClick={handleCreate}>
              <span className="hidden sm:inline">Créer un Projet</span>
              <span className="inline sm:hidden">Nouveau projet</span>
              <Icon name="cross" size="xs" className="ml-1.5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 px-2"
                >
                  <Avatar
                    src={currentUser?.avatarUrl}
                    name={currentUser?.name}
                    alt={currentUser?.name}
                    size="xs"
                  />
                  <span className="text-sm font-medium tracking-tighter">
                    {currentUser?.name}
                  </span>
                  <Icon name="chevron-down" size="md" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={handleProfile}
                  className="cursor-pointer"
                >
                  <Icon name="user" size="sm" />
                  Mon Profil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  <Icon name="logout" size="sm" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button onClick={handleLogin}>
            <span className="hidden sm:inline">Créer un Projet</span>
            <Icon name="cross" size="xs" className="ml-1.5" />
          </Button>
        )}
      </section>

      {/* Actions mobile affichées dans le menu */}
      {mobileMenuOpen && (
        <div className="mt-3 flex w-full justify-center md:hidden">
          <Button onClick={handleCreate} className="w-full max-w-[220px]">
            New Project{" "}
            <Icon name="cross" size="xs" className="ml-0 align-middle" />
          </Button>
        </div>
      )}
    </header>
  );
}
