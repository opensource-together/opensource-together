import Image from "next/image";

export default function AuthIllustration() {
  return (
    <div className="relative my-8 hidden w-full overflow-hidden rounded-3xl border-1 border-black/5 py-5 md:block">
      <Image
        src="/icons/background-login-page.svg"
        alt="Background"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 left-[600px] flex items-center justify-center">
        <Image
          src="/icons/screen-login-page.svg"
          alt="Application screen"
          width={1000}
          height={1000}
          className="mb-8 ml-96 w-auto max-w-none"
          priority
        />
      </div>
    </div>
  );
}
