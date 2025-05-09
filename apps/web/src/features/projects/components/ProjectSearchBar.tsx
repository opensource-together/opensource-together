import searchIcon from "@/shared/icons/search.svg";
import Image from "next/image";

export default function ProjectSearchBar() {
  return (
    <div className="relative w-full max-w-[447px] h-[35px]">
      <input
        type="text"
        placeholder="Find your next open source project"
        className="w-full h-full bg-[#F5F5F5] border border-[black]/5 rounded-[5px] px-3 font-geist text-[13px] text-[black]/80 focus:outline-none focus:ring-1 focus:ring-[black]/10"
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <Image src={searchIcon} alt="Search" width={14} height={14} />
      </div>
    </div>
  );
}
