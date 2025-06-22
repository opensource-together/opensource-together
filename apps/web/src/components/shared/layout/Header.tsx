"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import useAuth from "@/features/auth/hooks/useAuth";

import { Button } from "@/components/ui/button";

import GithubLink from "../GithubLink";

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
      className={`flex items-center justify-center px-[10px] py-[2px] transition-all duration-200 ${
        isActive
          ? "rounded-[3px] bg-[black]/5"
          : "text-[black]/70 hover:rounded-[3px] hover:bg-[black]/5"
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
    router.push("/projects/new");
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

        <div className="flex items-center justify-center space-x-6 py-2">
          <GithubLink url="https://github.com/opensource-together/opensource-together" />
        </div>
      </nav>

      <section className="hidden items-center space-x-2 sm:space-x-3 md:flex md:space-x-4">
        <GithubLink
          className="flex items-center gap-2 font-medium"
          url="https://github.com/opensource-together/opensource-together"
        />

        {isAuthenticated ? (
          <>
            <Button onClick={handleCreate}>
              <span className="hidden sm:inline">Créer un Projet</span>
              <span className="inline sm:hidden">Nouveau projet</span>
              <Image
                src="/icons/cross-icon.svg"
                alt="crossIcon"
                width={11}
                height={11}
                className="ml-1.5"
              />
            </Button>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleProfile}
                className="flex items-center space-x-2 hover:opacity-80"
              >
                {currentUser?.avatarUrl && (
                  <Image
                    src={currentUser.avatarUrl}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm font-medium">{currentUser?.name}</span>
              </button>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
          </>
        ) : (
          <Button onClick={handleLogin}>
            <span className="hidden sm:inline">Créer un Projet</span>
            <Image
              src="/icons/cross-icon.svg"
              alt="crossIcon"
              width={11}
              height={11}
              className="ml-1.5"
            />
          </Button>
        )}
      </section>

      {/* Actions mobile affichées dans le menu */}
      {mobileMenuOpen && (
        <div className="mt-3 flex w-full justify-center md:hidden">
          <Button onClick={handleCreate} className="w-full max-w-[220px]">
            New Project{" "}
            <Image
              src="/icons/cross-icon.svg"
              alt="crossIcon"
              width={11}
              height={11}
              className="ml-0 align-middle"
            />
          </Button>
        </div>
      )}
    </header>
  );
}
