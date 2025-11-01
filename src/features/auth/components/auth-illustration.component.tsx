import Image from "next/image";

export default function AuthIllustration() {
  return (
    <div className="relative h-screen w-full md:h-full">
      {/* Mobile: background illustration as non-intrusive layer */}
      <Image
        src="/illustrations/knight-background-mobile.png"
        alt=""
        aria-hidden
        priority
        fill
        draggable={false}
        sizes="(max-width: 860px) 100vw"
        className="scale-110 object-cover md:hidden"
      />
      {/* Desktop: cover full background */}
      <Image
        src="/illustrations/knight-background.png"
        alt="Background"
        aria-hidden
        fill
        priority
        className="hidden object-cover md:block"
      />
    </div>
  );
}
