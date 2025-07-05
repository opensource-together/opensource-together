import Image from "next/image";

export default function AuthIllustration() {
  return (
    <div className="relative hidden w-full lg:block">
      <Image
        src="/auth-bible-bg.png"
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/30 to-transparent backdrop-blur-sm" />
    </div>
  );
}
