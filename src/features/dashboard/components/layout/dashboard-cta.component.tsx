import Image from "next/image";
import Link from "next/link";
import { HiChevronRight } from "react-icons/hi2";

import { Button } from "@/shared/components/ui/button";

interface DashboardCtaComponentProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
}

export default function DashboardCtaComponent({
  title,
  description,
  buttonText,
  buttonLink,
}: DashboardCtaComponentProps) {
  return (
    <div className="border-muted-black-stroke relative mt-6.5 overflow-hidden rounded-3xl border px-5 py-7">
      <h2 className="text-lg">{title}</h2>
      <p className="text-muted-foreground mt-2 max-w-72 text-sm">
        {description}
      </p>
      <Button className="mt-6" asChild>
        <Link href={buttonLink || ""}>
          {buttonText} <HiChevronRight size={10} />
        </Link>
      </Button>
      <Image
        src="/illustrations/forest.png"
        alt="Forest"
        width={500}
        height={500}
        className="absolute -right-20 bottom-0 -z-10 h-full w-auto object-contain"
        priority
      />
    </div>
  );
}
