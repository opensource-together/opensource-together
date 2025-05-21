"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import beta from "../icons/beta.svg";
import crossIcon from "../icons/crossIcon.svg";
import github from "../icons/github.svg";
import openSource from "../icons/opensource.svg";
import x from "../icons/x.svg";
import Button from "../ui/Button";

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
          ? "bg-[black]/5 rounded-[3px]"
          : "text-[black]/70 hover:bg-[black]/5 hover:rounded-[3px]"
      } ${className}`}
    >
      {children}
    </Link>
  );
}

export default function Header({
  onViewChange,
}: {
  onViewChange?: Dispatch<SetStateAction<string>>;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleCreate = () => {
    router.push("/projects/new");
  };

  const handleViewChange = (view: string) => {
    if (onViewChange) {
      onViewChange(view);
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className="font-geist text-[13px] font-normal h-auto min-h-[60px] md:min-h-[70px] lg:h-[81px] px-4 sm:px-6 md:px-10 lg:px-[73px] flex flex-wrap items-center justify-between py-3 md:py-0">
      <section className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
        <Link href="/">
          <article className="flex items-center gap-2">
            <Image
              src={openSource}
              alt="openSource"
              width={130}
              height={26}
              className="w-auto h-auto max-h-[26px] md:max-h-[30px] lg:max-h-[35px]"
            />
            <Image
              src={beta}
              alt="beta"
              width={24}
              height={10}
              className="w-auto h-auto max-h-[10px] md:max-h-[11px] lg:max-h-[12px]"
            />
          </article>
        </Link>

        {/* Navigation pour desktop et tablette */}
        <nav className="hidden md:flex items-center space-x-3 lg:space-x-6">
          <NavLink href="/">Accueil</NavLink>
          <NavLink href="/profile">Profil</NavLink>
          <NavLink href="/my-projects">Mes projets</NavLink>
        </nav>
      </section>

      {/* Bouton menu mobile */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-8 h-8"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span
          className={`block w-5 h-0.5 bg-black mb-1 transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
        ></span>
        <span
          className={`block w-5 h-0.5 bg-black mb-1 transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`}
        ></span>
        <span
          className={`block w-5 h-0.5 bg-black transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
        ></span>
      </button>

      {/* Menu mobile */}
      <nav
        className={`${mobileMenuOpen ? "flex" : "hidden"} md:hidden flex-col w-full py-3 space-y-3`}
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
          <Image
            src={github}
            alt="github"
            width={18}
            height={16}
            className="w-auto h-auto max-h-[16px]"
          />
          <Image
            src={x}
            alt="x"
            width={18}
            height={16}
            className="w-auto h-auto max-h-[16px]"
          />
        </div>
      </nav>

      <section className="hidden md:flex items-center space-x-2 sm:space-x-3 md:space-x-4">
        <Image
          src={github}
          alt="github"
          width={16}
          height={14}
          className="w-auto h-auto max-h-[14px]"
        />
        <Image
          src={x}
          alt="x"
          width={16}
          height={14}
          className="w-auto h-auto max-h-[14px]"
        />

        <Button
          onClick={handleCreate}
          className="sm:min-w-[140px] md:min-w-[160px] px-3 sm:px-4"
        >
          <span className="hidden sm:inline">Créer un projet</span>
          <span className="inline sm:hidden">Nouveau projet</span>
          <Image
            src={crossIcon}
            alt="crossIcon"
            width={11}
            height={11}
            className="ml-0 align-middle"
          />
        </Button>
      </section>

      {/* Actions mobile affichées dans le menu */}
      {mobileMenuOpen && (
        <div className="flex md:hidden w-full justify-center mt-3">
          <Button onClick={handleCreate} className="w-full max-w-[220px]">
            New Project{" "}
            <Image
              src={crossIcon}
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
