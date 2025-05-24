import Image from "next/image";

export default function Billboard() {
  return (
    <div className="relative flex h-[373px] w-[1116px] items-center justify-center overflow-hidden rounded-[30px] border border-[#000000]/10">
      <div className="relative h-[330px] w-[1076px]">
        <Image
          src="/billboard-ost.svg"
          alt="billboard"
          width={1076}
          height={330}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 30%, rgba(255,255,255,0.7) 70%, rgba(255,255,255,1) 95%)",
          }}
        />
      </div>
      <div className="absolute bottom-8 left-10 text-left">
        <div className="font-geist text-[40px] font-medium">Change Log #04</div>
        <div className="font-geist max-w-[500px] text-[14px] font-light text-[#000000]/70">
          Version 0.1.2 : nouveau footer, navigation améliorée, et support
          Docker Compose. Plus d'infos sur GitHub !
        </div>
      </div>
      <div className="absolute right-10 bottom-12 flex items-center gap-2">
        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[30px] border border-[#000000]/10 bg-white pr-[1px]">
          <Image
            src="/icons/chevron-left.svg"
            alt="chevron-left"
            width={8}
            height={24}
          />
        </div>
        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[30px] border border-[#000000]/10 bg-white pl-[2px]">
          <Image
            src="/icons/chevron-right.svg"
            alt="chevron-right"
            width={8}
            height={24}
          />
        </div>
      </div>
      <div className="absolute right-10 bottom-7 flex w-[90px] items-center justify-center gap-1">
        <div className="h-[8px] w-[8px] rounded-[30px] bg-[#C3C3C3]"></div>
        <div className="h-[8px] w-[8px] cursor-pointer rounded-[30px] bg-[#D3D3D3] hover:bg-[#C3C3C3]"></div>
        <div className="h-[8px] w-[8px] cursor-pointer rounded-[30px] bg-[#D3D3D3] hover:bg-[#C3C3C3]"></div>
        <div className="h-[8px] w-[8px] cursor-pointer rounded-[30px] bg-[#D3D3D3] hover:bg-[#C3C3C3]"></div>
      </div>
    </div>
  );
}
