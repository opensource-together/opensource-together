import Image from "next/image";

export default function AuthIllustration() {
  return (
    <div className="relative h-full w-full">
      {/* Mobile: background illustration as non-intrusive layer */}
      <Image
        src="/illustrations/knight-background-2-mobile.png"
        alt=""
        aria-hidden
        priority
        fill
        draggable={false}
        sizes="(max-width: 860px) 100vw"
        className="object-contain md:hidden"
      />
      {/* Desktop+: cover full background */}
      <Image
        src="/illustrations/knight-background-2.png"
        alt="Background"
        aria-hidden
        fill
        priority
        className="hidden object-cover md:block"
      />
    </div>
  );
}
