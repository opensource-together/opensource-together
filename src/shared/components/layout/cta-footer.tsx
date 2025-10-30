import Image from "next/image";
import Link from "next/link";
import { HiStar } from "react-icons/hi";

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
    <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center overflow-hidden px-4 pt-8 pb-16 md:px-7 md:pb-20">
      {imageIllustrationMobile ? (
        <div className="pointer-events-none absolute -top-30 right-0 bottom-0 left-0 -z-10 md:hidden">
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
          quality={100}
          sizes="(min-width: 1024px) 1120px, 100vw"
          className="object-cover object-right-top md:object-right"
          priority
        />
      </div>

      <div className="relative z-10 min-w-0 flex-shrink-0 text-center md:text-center">
        <h1
          className="text-2xl leading-tight font-medium tracking-tighter md:text-2xl lg:text-5xl"
          style={{ fontFamily: "Aspekta", fontWeight: 500 }}
        >
          Build your projects,
          <br />
          find your contributors
        </h1>
        <p className="mx-auto mt-2 max-w-[600px] text-sm text-black md:max-w-[650px]">
          Highlighting ambitious open source projects to offer them an <br />{" "}
          initial wave of visibility, committed contributors and support.
        </p>
        <div className="mt-6 flex flex-row justify-center gap-3 md:justify-center">
          <Link
            href="https://github.com/opensource-together/opensource-together"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              Star Us on Github
              <HiStar size={16} />
            </Button>
          </Link>
          <Link
            href="https://x.com/OpenSTogether"
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
