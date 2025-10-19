import Image from "next/image";

export default function AuthIllustration() {
  return (
    <div className="relative h-full w-full">
      {/* Mobile: centered illustration (no crop), scaled within viewport */}
      <div className="flex h-full w-full items-center justify-center md:hidden">
        <Image
          src="/illustrations/knight-background-2-mobile.png"
          alt="Background"
          priority
          width={900}
          height={900}
          sizes="(max-width: 768px) 90vw"
          className="h-auto max-h-[100%] w-[92vw] max-w-[560px] object-contain"
        />
      </div>
      {/* Desktop+: cover full background */}
      <Image
        src="/illustrations/knight-background-2.png"
        alt="Background"
        fill
        priority
        sizes="(min-width: 768px) 100vw, 0px"
        className="hidden object-cover md:block"
      />
    </div>
  );
}
