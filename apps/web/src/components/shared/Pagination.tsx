import Image from "next/image";

export default function Pagination() {
  return (
    <div className="flex items-center justify-center gap-3">
      <button className="flex items-center gap-1 px-2 py-1 font-geist font-medium text-[14px] text-[black]">
        <Image
          src="/icons/chevron-left-small.svg"
          alt="Précédent"
          width={5}
          height={10}
        />
        <span>Précédent</span>
      </button>

      <div className="flex items-center gap-2">
        <button className="h-[30px] min-w-[30px] px-2 font-geist font-medium text-[14px] flex items-center justify-center">
          1
        </button>

        <button className="h-[30px] min-w-[30px] px-2 font-geist font-medium text-[14px] flex items-center justify-center border border-[black]/10 rounded-[4px]">
          2
        </button>

        <button className="h-[30px] min-w-[30px] px-2 font-geist font-medium text-[14px] flex items-center justify-center">
          3
        </button>

        <span className="mx-1 font-geist">...</span>
      </div>

      <button className="flex items-center gap-1 px-2 py-1 font-geist font-medium text-[14px] text-[black]">
        <span>Suivant</span>
        <Image
          src="/icons/chevron-right-small.svg"
          alt="Suivant"
          width={5}
          height={10}
        />
      </button>
    </div>
  );
}
