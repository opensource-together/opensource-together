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

const HeaderBackdrop = () => {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[60px] z-40 h-8 bg-gradient-to-b from-white to-transparent md:top-[70px] lg:top-[81px]" />
  );
};

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
  const { isAuthenticated, currentUser, logout, requireAuth } = useAuth();

  if (pathname.startsWith("/auth")) {
    return null;
  }

  const handleCreate = () =>
    requireAuth(() => router.push("/projects/create"), "/projects/create");

  const handleProfile = () =>
    requireAuth(() => router.push("/profile"), "/profile");

  const handleMyProjects = () =>
    requireAuth(() => router.push("/my-projects"), "/my-projects");

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <header className="font-geist sticky top-0 z-50 flex h-auto min-h-[60px] flex-wrap items-center justify-between bg-white px-4 py-3 text-[13px] font-normal sm:px-6 md:min-h-[70px] md:px-10 md:py-0 lg:h-[81px] lg:px-[73px]">
        <section className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
          <Link href="/">
            <Image
              src="/ost-beta-logo.svg"
              alt="ost-logo"
              width={207}
              height={25}
              className="h-auto max-h-[25px] w-auto md:max-h-[30px] lg:max-h-[35px]"
            />
          </Link>

          {/* Navigation pour desktop et tablette */}
          <nav className="hidden items-center space-x-3 text-sm tracking-tighter md:flex lg:space-x-6">
            <NavLink href="/">Découvrir</NavLink>

            {/* Dashboard */}
            {isAuthenticated ? (
              <NavLink href="/my-projects">Dashboard</NavLink>
            ) : (
              <Button
                variant="ghost"
                onClick={handleMyProjects}
                className="flex h-auto items-center justify-center px-3.5 py-1.5 text-[black]/70 transition-all duration-200 hover:rounded-full hover:bg-[black]/5"
              >
                Dashboard
              </Button>
            )}
          </nav>
        </section>

        {/* Bouton menu mobile */}
        <Button
          variant="outline"
          size="icon"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-black/5 bg-white p-0 shadow-xs transition-all hover:bg-black/5 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="flex flex-col items-center justify-center space-y-1">
            <span
              className={`block h-0.5 w-4 bg-black transition-all duration-200 ${
                mobileMenuOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-4 bg-black transition-all duration-200 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-4 bg-black transition-all duration-200 ${
                mobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </div>
        </Button>

        {/* Menu mobile */}
        <nav
          className={`${mobileMenuOpen ? "flex" : "hidden"} w-full flex-col space-y-3 py-3 md:hidden`}
        >
          <NavLink href="/" className="w-full py-1.5">
            Home
          </NavLink>

          {/* Dashboard mobile */}
          {isAuthenticated ? (
            <NavLink href="/my-projects" className="w-full py-1.5">
              Dashboard
            </NavLink>
          ) : (
            <Button
              variant="ghost"
              onClick={handleMyProjects}
              className="flex h-auto w-full items-center justify-center px-3.5 py-1.5 text-[black]/70 transition-all duration-200 hover:rounded-full hover:bg-[black]/5"
            >
              Dashboard
            </Button>
          )}

          {/* Profile mobile */}
          {isAuthenticated && (
            <NavLink href="/profile" className="w-full py-1.5">
              Mon Profil
            </NavLink>
          )}

          {/* Star Us mobile - visible seulement si pas connecté */}
          {!isAuthenticated && (
            <Link
              href="https://github.com/opensource-together"
              target="_blank"
              className="w-full"
            >
              <Button
                variant="outline"
                className="flex w-full items-center justify-center font-medium shadow-none"
              >
                Star Us <Icon name="github" size="md" />
              </Button>
            </Link>
          )}

          {/* Déconnexion mobile */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex h-auto w-full items-center justify-center px-3.5 py-1.5 text-[black]/70 transition-all duration-200 hover:rounded-full hover:bg-[black]/5"
            >
              Déconnexion
            </Button>
          )}
        </nav>

        {/* Desktop */}
        <section className="hidden items-center space-x-2 sm:space-x-3 md:flex md:space-x-4">
          {/* Star Us - visible seulement si pas connecté */}
          {!isAuthenticated && (
            <Link href="https://github.com/opensource-together" target="_blank">
              <Button
                variant="outline"
                className="flex items-center font-medium shadow-none"
              >
                Star Us <Icon name="github" size="md" />
              </Button>
            </Link>
          )}

          {/* Créer un Projet */}
          {isAuthenticated ? (
            <Link href="/projects/create">
              <Button>
                <span className="hidden sm:inline">Créer un Projet</span>
                <span className="inline sm:hidden">Nouveau projet</span>
                <Icon
                  name="plus"
                  size="xs"
                  variant="white"
                  className="ml-1.5"
                />
              </Button>
            </Link>
          ) : (
            <Button onClick={handleCreate}>
              <span className="hidden sm:inline">Créer un Projet</span>
              <span className="inline sm:hidden">Nouveau projet</span>
              <Icon name="plus" size="xs" variant="white" className="ml-1.5" />
            </Button>
          )}

          {isAuthenticated && (
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
          )}
        </section>

        {/* Actions mobile affichées dans le menu */}
        {mobileMenuOpen && (
          <div className="mt-3 flex w-full justify-center md:hidden">
            {isAuthenticated ? (
              <Link href="/projects/create" className="w-full max-w-[220px]">
                <Button className="w-full">
                  New Project{" "}
                  <Icon
                    name="plus"
                    size="xs"
                    variant="white"
                    className="ml-0 align-middle"
                  />
                </Button>
              </Link>
            ) : (
              <Button onClick={handleCreate} className="w-full max-w-[220px]">
                New Project{" "}
                <Icon
                  name="plus"
                  size="xs"
                  variant="white"
                  className="ml-0 align-middle"
                />
              </Button>
            )}
          </div>
        )}
      </header>

      <HeaderBackdrop />
    </>
  );
}
