import Image from "next/image";
import { HiChevronRight } from "react-icons/hi2";

import { Button } from "@/shared/components/ui/button";

export default function DashboardCtaComponent() {
  return (
    <div className="border-muted-black-stroke relative mt-6.5 overflow-hidden rounded-3xl border px-5 py-7">
      <h2 className="text-lg">Construisez OpenSource Together</h2>
      <p className="text-muted-foreground mt-2 max-w-72 text-sm">
        Lancez un nouveau projet, importez un repository Github ou commencez de
        zéro.
      </p>
      <Button className="mt-6">
        Créer un projet <HiChevronRight size={10} />
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
