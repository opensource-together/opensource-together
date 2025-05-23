import Image from "next/image";

export default function ProjectSearchBar() {
  return (
    <div className="relative w-full max-w-[613px] h-[35px]">
      <input
        type="text"
        placeholder="Trouvez votre prochain projet open source"
        className="w-full h-full bg-[#F5F5F5] border border-[black]/5 rounded-sm px-3 text-sm text-[black]/80 focus:outline-none focus:ring-1 focus:ring-[black]/10"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <Image src="/icons/search.svg" alt="Search" width={14} height={14} />
      </div>
    </div>
  );
}
