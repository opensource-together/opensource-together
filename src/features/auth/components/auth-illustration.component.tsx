import Image from "next/image";

export default function AuthIllustration() {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/illustrations/knight-background-2.png"
        alt="Background"
        fill
        priority
        className="object-cover"
      />
    </div>
  );
}
