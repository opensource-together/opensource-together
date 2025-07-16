import Image from "next/image";

export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="animate-pulse">
        <Image
          src="/ost-logo.svg"
          alt="OpenSource Together"
          width={170}
          height={25}
          className="h-auto w-auto"
        />
      </div>
    </div>
  );
}
