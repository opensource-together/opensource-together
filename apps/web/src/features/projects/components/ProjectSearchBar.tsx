import Image from "next/image";

export default function ProjectSearchBar() {
  return (
    <div className="relative h-[35px] w-full max-w-[613px]">
      <input
        type="text"
        placeholder="Trouvez votre prochain projet open source"
        className="h-full w-full rounded-sm border border-[black]/5 bg-[#F5F5F5] px-3 text-sm text-[black]/80 focus:ring-1 focus:ring-[black]/10 focus:outline-none"
      />
      <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
        <Image src="/icons/search.svg" alt="Search" width={14} height={14} />
      </div>
    </div>
  );
}
