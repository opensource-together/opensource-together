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
  const pathname = usePathname();
  const headerDashboard = pathname.startsWith("/dashboard");

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-[65px] z-40 h-8 bg-gradient-to-b from-white to-transparent md:top-[81px] ${
        headerDashboard ? "hidden" : ""
      }`}
    />
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  startWith?: boolean;
}

function NavLink({
  href,
  children,
  className = "",
  startWith = false,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = startWith ? pathname.startsWith(href) : pathname === href;

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
  const headerDashboard = pathname.startsWith("/dashboard");
  const { isAuthenticated, currentUser, logout, requireAuth } = useAuth();

  if (pathname.startsWith("/auth")) {
    return null;
  }

  const handleProfile = () =>
    requireAuth(() => router.push("/profile"), "/profile");

  const handleDashboard = () =>
    requireAuth(() => router.push("/dashboard"), "/dashboard");

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-6 py-4 text-sm font-normal md:py-6 lg:px-20 ${
          headerDashboard ? "border-b border-black/5" : ""
        }`}
      >
        <section className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
          <Link href="/">
            <Image
              src="/ostogether-logo.svg"
              alt="ost-logo"
              width={209}
              height={12}
              className="max-h-[16px] lg:max-h-[25px]"
            />
          </Link>

          {/* Navigation pour desktop et tablette */}
          <nav className="hidden items-center space-x-3 tracking-tighter md:flex lg:space-x-6">
            <NavLink href="/">Découvrir</NavLink>

            {/* Dashboard */}
            {isAuthenticated ? (
              <NavLink startWith href="/dashboard">
                Gestion de projet
              </NavLink>
            ) : (
              <Button
                variant="ghost"
                onClick={handleDashboard}
                className="flex h-auto items-center justify-center px-3.5 py-1.5 text-[black]/70 transition-all duration-200 hover:rounded-full hover:bg-[black]/5"
              >
                Gestion de projet
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
            <NavLink href="/dashboard" className="w-full py-1.5">
              Dashboard
            </NavLink>
          ) : (
            <Button
              variant="ghost"
              onClick={handleDashboard}
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
            <div className="flex items-center gap-2">
              <Link
                href="https://github.com/opensource-together"
                target="_blank"
              >
                <Button variant="outline">
                  Star Us <Icon name="github" size="md" />
                </Button>
              </Link>
            </div>
          )}

          {!isAuthenticated && (
            <Button
              asChild
              variant="default"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            >
              <a href="/auth/login">Se connecter</a>
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
                    name={currentUser?.username}
                    alt={currentUser?.username}
                    size="xs"
                  />
                  <span className="font-medium tracking-tighter">
                    {currentUser?.username}
                  </span>
                  <Icon name="chevron-down" size="md" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuItem onClick={handleProfile}>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">Mon Profil</span>
                      <p className="text-xs text-gray-500">
                        Modifiez votre profil
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="user" size="sm" variant="gray" />
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDashboard}>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">Dashboard</span>
                      <p className="text-xs text-gray-500">Gestion de projet</p>
                    </div>
                    <Icon name="bagpack" size="sm" />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">Déconnexion</span>
                      <p className="text-xs text-gray-500">
                        Déconnexion de votre compte
                      </p>
                    </div>
                    <Icon name="logout" size="sm" variant="gray" />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </section>

        {/* Actions mobile affichées dans le menu */}
        {mobileMenuOpen && (
          <div className="mt-3 flex w-full justify-center md:hidden">
            {!isAuthenticated && (
              <Button
                asChild
                variant="default"
                className="flex w-full max-w-[220px] items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
              >
                <a href="/auth/github">Se connecter</a>
              </Button>
            )}
          </div>
        )}
      </header>

      <HeaderBackdrop />
    </>
  );
}
