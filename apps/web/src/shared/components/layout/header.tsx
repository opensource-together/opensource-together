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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/shared/components/ui/sheet";

import useAuth from "@/features/auth/hooks/use-auth.hook";
import { NotificationDropdown } from "@/features/notifications/components/notification-dropdown.component";

import { Avatar } from "../ui/avatar";
import Icon, { IconName } from "../ui/icon";

const HeaderBackdrop = () => {
  const pathname = usePathname();
  const headerDashboard = pathname.startsWith("/dashboard");

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-[65px] z-40 h-8 bg-gradient-to-b from-white to-transparent lg:top-[81px] ${
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
  onClick?: () => void;
}

function NavLink({
  href,
  children,
  className = "",
  startWith = false,
  onClick,
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
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

// Composant pour les éléments de navigation du dashboard
function DashboardNavItems({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { isAuthenticated, requireAuth } = useAuth();
  const router = useRouter();

  const dashboardItems = [
    {
      label: "Mes projets",
      href: "/dashboard/my-projects",
      icon: "mix",
    },
    {
      label: "Mes candidatures",
      href: "/dashboard/my-applications",
      icon: "file-text",
    },
  ];

  const handleDashboardNav = (href: string) => {
    if (!isAuthenticated) {
      requireAuth(() => router.push(href), href);
    } else {
      router.push(href);
    }
    onClose?.();
  };

  return (
    <div className="space-y-2">
      <div className="mb-4">
        <h3 className="mb-3 text-sm font-medium text-black/70">
          Navigation Dashboard
        </h3>
        {dashboardItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <button
              key={item.label}
              onClick={() => handleDashboardNav(item.href)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-all duration-200 ${
                isActive
                  ? "bg-stone-100 font-medium text-black"
                  : "text-black/50 hover:bg-stone-100"
              }`}
            >
              <Icon
                name={item.icon as IconName}
                size="sm"
                variant={isActive ? "default" : "gray"}
                className="size-4"
              />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bouton créer un projet */}
      <div className="border-t border-black/10 pt-4">
        <Button asChild className="w-full">
          <Link href="/projects/create" onClick={onClose}>
            Créer un Project
            <Icon name="plus" size="xs" variant="white" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const headerDashboard = pathname.startsWith("/dashboard");
  const { isAuthenticated, currentUser, logout, requireAuth, isLoading } =
    useAuth();

  if (pathname.startsWith("/auth")) {
    return null;
  }

  const handleProfile = () =>
    requireAuth(() => router.push("/profile/me"), "/profile/me");

  const handleDashboard = () =>
    requireAuth(() => router.push("/dashboard"), "/dashboard");

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const showLoadingState = isLoading && !currentUser;

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-6 py-4 text-sm font-normal lg:px-20 lg:py-6 ${
          headerDashboard ? "border-b border-black/5" : ""
        }`}
      >
        <section className="flex items-center space-x-2 sm:space-x-4 lg:space-x-8">
          <Link href="/">
            <Image
              src="/ostogether-logo.svg"
              alt="ost-logo"
              width={209}
              height={12}
              className="max-h-[20px] lg:max-h-[25px]"
            />
          </Link>

          {/* Navigation pour desktop et tablette */}
          <nav className="hidden items-center space-x-3 tracking-tighter lg:flex lg:space-x-6">
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

        {/* Bouton menu mobile avec Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button size="ghostIcon">
              <div className="flex flex-col items-center justify-center space-y-1">
                <span
                  className={`block h-0.5 w-4 bg-black transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-4 bg-black transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-4 bg-black transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="flex h-full flex-col">
              {/* Header avec logo */}
              <div className="border-b border-black/5 p-6">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Image
                    src="/ostogether-logo.svg"
                    alt="ost-logo"
                    width={180}
                    height={12}
                    className="max-h-[20px]"
                  />
                </Link>
              </div>

              {/* Contenu du menu */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {/* Navigation principale */}
                <div className="mb-8 space-y-2">
                  <h3 className="mb-4 text-sm font-medium text-black/70">
                    Navigation
                  </h3>

                  <button
                    onClick={() => {
                      router.push("/");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-all duration-200 ${
                      pathname === "/"
                        ? "bg-stone-100 font-medium text-black"
                        : "text-black/50 hover:bg-stone-100"
                    }`}
                  >
                    <Icon
                      name="search"
                      size="sm"
                      variant={pathname === "/" ? "default" : "gray"}
                      className="size-4"
                    />
                    <span className="text-sm">Découvrir</span>
                  </button>

                  {/* Dashboard */}
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        router.push("/dashboard");
                        setMobileMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-all duration-200 ${
                        pathname.startsWith("/dashboard")
                          ? "bg-stone-100 font-medium text-black"
                          : "text-black/50 hover:bg-stone-100"
                      }`}
                    >
                      <Icon
                        name="bagpack"
                        size="sm"
                        variant={
                          pathname.startsWith("/dashboard") ? "default" : "gray"
                        }
                        className="size-4"
                      />
                      <span className="text-sm">Gestion de projet</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleDashboard();
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-black/50 transition-all duration-200 hover:bg-stone-100"
                    >
                      <Icon
                        name="bagpack"
                        size="sm"
                        variant="gray"
                        className="size-4"
                      />
                      <span className="text-sm">Gestion de projet</span>
                    </button>
                  )}

                  {/* Notifications */}
                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        // TODO: Open notifications panel
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-black/50 transition-all duration-200 hover:bg-stone-100"
                    >
                      <Icon
                        name="bell"
                        size="sm"
                        variant="gray"
                        className="size-4"
                      />
                      <span className="text-sm">Notifications</span>
                    </button>
                  )}

                  {/* Profile */}
                  {isAuthenticated && (
                    <button
                      onClick={() => {
                        router.push("/profile/me");
                        setMobileMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-all duration-200 ${
                        pathname.startsWith("/profile")
                          ? "bg-stone-100 font-medium text-black"
                          : "text-black/50 hover:bg-stone-100"
                      }`}
                    >
                      <Icon
                        name="user"
                        size="sm"
                        variant={
                          pathname.startsWith("/profile") ? "default" : "gray"
                        }
                        className="size-4"
                      />
                      <span className="text-sm">Mon Profil</span>
                    </button>
                  )}
                </div>

                {/* Navigation Dashboard si on est sur le dashboard */}
                {headerDashboard && (
                  <div className="mb-8">
                    <DashboardNavItems
                      onClose={() => setMobileMenuOpen(false)}
                    />
                  </div>
                )}
              </div>

              {/* Actions en bas */}
              <div className="border-t border-black/10 bg-stone-50/50 px-6 py-4">
                <div className="flex flex-col gap-4">
                  {/* Star Us - visible seulement si pas connecté */}
                  {!isAuthenticated && !showLoadingState && (
                    <Link
                      href="https://github.com/opensource-together"
                      target="_blank"
                      className="w-full"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="flex w-full items-center justify-center gap-2 font-medium shadow-none"
                      >
                        <Icon name="github" size="sm" />
                        Star Us
                      </Button>
                    </Link>
                  )}

                  {/* Connexion/Déconnexion */}
                  {!isAuthenticated && !showLoadingState ? (
                    <Button
                      asChild
                      variant="default"
                      className="flex w-full items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <a href="/auth/login">Se connecter</a>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex h-auto w-full items-center justify-start gap-2 px-3 py-2 text-[black]/70 transition-all duration-200 hover:rounded-full hover:bg-[black]/5"
                    >
                      <Icon name="logout" size="sm" variant="gray" />
                      Déconnexion
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop */}
        <section className="hidden items-center space-x-2 sm:space-x-3 lg:flex lg:space-x-4">
          {/* État de chargement */}
          {showLoadingState && (
            <div className="flex items-center gap-2">
              <div className="h-9 w-24 animate-pulse rounded-full bg-gray-200" />
            </div>
          )}

          {/* Star Us - visible seulement si pas connecté */}
          {!isAuthenticated && !showLoadingState && (
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

          {!isAuthenticated && !showLoadingState && (
            <Button
              asChild
              variant="default"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
            >
              <a href="/auth/login">Se connecter</a>
            </Button>
          )}

          {isAuthenticated && !showLoadingState && (
            <>
              <NotificationDropdown />
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
                        <p className="text-xs text-gray-500">
                          Gestion de projet
                        </p>
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
            </>
          )}
        </section>
      </header>

      <HeaderBackdrop />
    </>
  );
}
