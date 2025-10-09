import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";
import { Icon } from "../ui/icon";

interface CTAFooterProps {
  imageIllustration?: string;
}

export default function CTAFooter({ imageIllustration }: CTAFooterProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-4 pt-8 pb-0 md:flex-row md:px-7">
      <div className="min-w-0 flex-shrink-0 text-start">
        <h1
          className="text-2xl leading-tight font-medium tracking-tighter md:text-2xl lg:text-5xl"
          style={{ fontFamily: "Aspekta", fontWeight: 500 }}
        >
          Together, build our <br />
          future in open source
        </h1>
        <p className="mx-auto mt-2 max-w-[350px] text-sm text-black md:mx-0 md:max-w-[450px]">
          Discover projects, apply to roles, collaborate and build.
          <br className="hidden md:block" />
          Share and grow together through open source.
        </p>
        <div className="mt-6 flex flex-row gap-3">
          <Link
            href="https://github.com/opensource-together/opensource-together"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              Star Us on Github
              <Icon name="star" variant="filled" size="sm" />
            </Button>
          </Link>
          <Link
            href="https://x.com/OpenSTogether"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary">Contact Us</Button>
          </Link>
        </div>
      </div>
      <div className="mt-6 flex justify-center md:mt-0 md:ml-4 md:flex-shrink-0">
        <Image
          src={imageIllustration || "/background-footer.png"}
          alt="ost-footer-bg"
          width={643}
          height={376}
          className="w-[300px] object-contain md:w-[643px]"
          priority
        />
      </div>
    </div>
  );
}
