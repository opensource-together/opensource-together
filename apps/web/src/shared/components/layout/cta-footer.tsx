import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";
import { Icon } from "../ui/icon";

interface CTAFooterProps {
  imageIllustration?: string;
}

export default function CTAFooter({ imageIllustration }: CTAFooterProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-4 py-8 md:flex-row md:px-7">
      <div className="min-w-0 flex-shrink-0 text-start">
        <h1
          className="text-2xl leading-tight font-medium tracking-tighter md:text-2xl lg:text-5xl"
          style={{ fontFamily: "Aspekta", fontWeight: 500 }}
        >
          Construisons ensemble <br /> l'avenir du développement
        </h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-[350px] text-sm md:mx-0 md:max-w-[450px]">
          Trouvez des projets, postulez à des rôles, collaborez, construisons,{" "}
          <br className="hidden md:block" />
          partageons et grandissons ensemble grâce à l&apos;open source
        </p>
        <div className="mt-6 flex flex-row gap-3">
          <Link
            href="https://github.com/opensource-together/opensource-together"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              <Icon name="star" variant="white" size="sm" />
              Star Us on Github
            </Button>
          </Link>
          <Link
            href="https://x.com/OpenSTogether"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary">Besoin d&apos;aide ?</Button>
          </Link>
        </div>
      </div>
      <div className="mt-6 flex justify-center md:mt-0 md:ml-4 md:flex-shrink-0">
        <Image
          src={imageIllustration || "/background-footer.png"}
          alt="ost-footer-bg"
          width={575}
          height={551}
          className="w-[300px] object-contain md:w-[575px]"
          priority
        />
      </div>
    </div>
  );
}
