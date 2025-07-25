"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";

export default function Footer() {
  return (
    <footer className="flex w-full flex-col justify-center bg-white">
      {/* Section texte + image décorative */}
      <div className="mx-auto flex w-full max-w-[1147px] flex-col items-center justify-between px-4 py-8 md:flex-row md:px-0 md:py-0">
        {/* Texte à gauche */}
        <div className="max-w-[530px] min-w-0 flex-shrink-0 text-center md:text-left">
          <h1
            className="mb-2 text-2xl leading-tight font-medium tracking-tighter md:text-2xl lg:text-5xl"
            style={{ fontFamily: "Aspekta", fontWeight: 500 }}
          >
            Construisons ensemble <br /> l'avenir du développement
          </h1>
          <p className="text-muted-foreground mx-auto max-w-[500px] text-xs md:mx-0 md:text-sm">
            Trouvez des projets, postulez à des rôles, collaborez, construisons,{" "}
            <br />
            partageons et grandissons ensemble grâce à l&apos;open source
          </p>
          {/* Boutons */}
          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <Button
              asChild
              variant="default"
              className="rounded-full px-4 py-2 text-sm font-medium"
            >
              <a
                href="https://github.com/opensource-together"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/icons/white-star.svg"
                  alt="star"
                  width={16}
                  height={16}
                />{" "}
                Star Us on Github
              </a>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="rounded-full px-5 py-2 text-sm font-medium"
            >
              <a href="/help">Besoin d&apos;aide ?</a>
            </Button>
          </div>
        </div>
        {/* Image décorative - visible sur mobile en dessous, à droite sur desktop */}
        <div className="mt-6 flex justify-center md:mt-0 md:ml-4 md:flex-shrink-0">
          <Image
            src="/background-footer-2.png"
            alt="ost-footer-bg"
            width={575}
            height={551}
            className="w-[300px] object-contain md:w-[575px]"
            priority
          />
        </div>
      </div>
      {/* Footer classique en bas */}
      <div className="mx-auto flex w-full max-w-[1147px] flex-col items-center justify-between border-t border-neutral-200 px-4 py-4 md:flex-row md:py-7">
        {/* Logo à gauche */}
        <Link href="/" className="mb-4 flex items-center md:mb-0">
          <Image
            src="/icons/new-ost-log-icon.svg"
            alt="ost-logo"
            width={31}
            height={25}
            className="h-auto max-h-[25px] w-auto md:max-h-[30px] lg:max-h-[35px]"
          />
        </Link>
        {/* Navigation à droite */}
        <nav className="flex flex-wrap items-center justify-center gap-4 text-xs md:gap-6 md:text-sm">
          <Link
            href="/services"
            className="text-black/70 transition hover:text-black"
          >
            Services
          </Link>
          <Link
            href="/benefits"
            className="text-black/70 transition hover:text-black"
          >
            Benefits
          </Link>
          <Link
            href="/how-it-works"
            className="text-black/70 transition hover:text-black"
          >
            How it works
          </Link>
          <Link
            href="/faq"
            className="text-black/70 transition hover:text-black"
          >
            FAQ
          </Link>
          <Link
            href="/privacy"
            className="text-black/50 transition hover:text-black"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-black/50 transition hover:text-black"
          >
            Terms of service
          </Link>
        </nav>
      </div>
    </footer>
  );
}
