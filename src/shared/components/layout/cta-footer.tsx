import Image from "next/image";
import Link from "next/link";
import { HiStar } from "react-icons/hi";

import { EXTERNAL_LINKS } from "@/shared/lib/constants";
import { Button } from "../ui/button";

interface CTAFooterProps {
  imageIllustration?: string;
  imageIllustrationMobile?: string;
}

export default function CTAFooter({
  imageIllustration,
  imageIllustrationMobile,
}: CTAFooterProps) {
  return (
    <div className="relative mx-auto flex h-[402px] w-full max-w-7xl flex-col items-center justify-center overflow-hidden px-4 pt-8 pb-16 md:px-7 md:pb-20">
      {imageIllustrationMobile ? (
        <div className="pointer-events-none absolute -top-0 right-0 bottom-0 left-0 -z-10 md:hidden">
          <Image
            src={imageIllustrationMobile}
            alt=""
            fill
            quality={100}
            sizes="100vw"
            className="object-cover object-right-top"
            priority
          />
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
        <Image
          src={imageIllustration || ""}
          alt=""
          fill
          quality={85}
          sizes="(min-width: 1024px) 1120px, 100vw"
          className="object-cover object-right-top md:object-right"
          priority
          fetchPriority="high"
        />
      </div>

      <div className="relative z-10 min-w-0 flex-shrink-0 text-center md:text-center">
        <h1
          className="mt-3 text-center text-4xl leading-none md:text-5xl"
          style={{ fontFamily: "Aspekta", fontWeight: 500 }}
        >
          Build your projects,
          <br />
          find your contributors
        </h1>
        <p className="mt-5 max-w-[450px] px-2 text-center text-sm text-neutral-950">
          Highlighting ambitious open source projects to offer them an{" "}
          <br className="hidden md:block" /> initial wave of visibility,
          committed contributors and support.
        </p>
        <div className="mt-6 flex flex-row justify-center gap-3 md:justify-center">
          <Link
            href={EXTERNAL_LINKS.GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              Star Us on Github
              <HiStar size={16} />
            </Button>
          </Link>
          <Link
            href={EXTERNAL_LINKS.TWITTER}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary">Follow Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
