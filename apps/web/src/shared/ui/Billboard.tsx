import Image from "next/image";
import billboard from "../../../public/billboardost.svg";
import chevronRight from "@/shared/icons/chevron-right.svg";
import chevronLeft from "@/shared/icons/chevron-left.svg";

const Billboard = () => {
  return (
    <div className="border border-[#000000]/10 rounded-[30px] w-[1116px] h-[373px] flex items-center justify-center relative overflow-hidden">
      <div className="relative w-[1076px] h-[330px]">
        <Image src={billboard} alt="billboard" width={1076} height={330} />
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,1) 85%)' 
          }} 
        />
      </div>
      <div className="absolute bottom-8 left-10 text-left">
        <div className="font-geist text-[40px] font-medium">OsT Changelog #001</div>
        {/* changelog content hidden */}
        <div className="hidden font-geist text-[14px] text-[#000000]/70 font-light max-w-[500px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</div>
      </div>
      <div className="absolute bottom-12 right-10 flex items-center gap-2">
        <div className="flex items-center pr-[1px] justify-center bg-white border border-[#000000]/10 rounded-[30px] w-[40px] h-[40px]">
        <Image src={chevronLeft} alt="chevron-left" width={8} height={24} />
        </div>
        <div className="flex items-center pl-[2px] justify-center bg-white border border-[#000000]/10 rounded-[30px] w-[40px] h-[40px]">
        <Image src={chevronRight} alt="chevron-right" width={8} height={24} />
        </div>
      </div>
      <div className="absolute bottom-7 right-10 flex items-center justify-center w-[90px] gap-1">
        <div className="bg-[#C3C3C3] w-[8px] h-[8px] rounded-[30px]"></div>
        <div className="cursor-pointer bg-[#D3D3D3] w-[8px] h-[8px] rounded-[30px] hover:bg-[#C3C3C3]"></div>
        <div className="cursor-pointer bg-[#D3D3D3] w-[8px] h-[8px] rounded-[30px] hover:bg-[#C3C3C3]"></div>
        <div className="cursor-pointer bg-[#D3D3D3] w-[8px] h-[8px] rounded-[30px] hover:bg-[#C3C3C3]"></div>
      </div>
    </div>
  )
}

export default Billboard
