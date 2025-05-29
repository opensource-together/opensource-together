import Image from "next/image";

export default function AuthIllustration() {
  return (
    <div className="relative my-8 hidden w-full overflow-hidden rounded-3xl border-1 border-black/5 py-5 lg:block">
      <Image src="/auth-background.jpg" alt="Background" fill priority />

      <div className="absolute inset-0 left-[600px] flex items-center justify-center">
        <Image
          src="/auth-app-screen.png"
          alt="Application screen"
          width={1700}
          height={1700}
          className="ml-[600px] max-w-none"
          priority
        />
      </div>
    </div>
  );
}
