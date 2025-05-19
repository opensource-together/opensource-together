import Button from "@/shared/ui/Button";
import Image from "next/image";
import writingIcon from "@/shared/icons/writing-icon.svg";
import linkIcon from "@/shared/icons/link-icon.svg";

export default function StepThree({ onNext }: { onNext: () => void; }) {
  return (
    <div className="flex flex-col items-center bg-white p-10 rounded-[20px]">
       <h2 className="text-black font-geist font-medium text-[30px] mb-2">Confirm your Github information</h2>
      <p className="text-[15px] text-black/70 mb-8 text-center">
      Choose if you want import to Github or Create from Scratch
      </p>
      <div className="w-[425px] h-full rounded-[10px] border border-black/10 bg-black/3 p-5 mb-9">
        {/* Name */}
        <div className="mb-4">
          <div className="flex items-center gap-1 mb-1">
            <span className="font-geist font-medium text-[16px] text-black/70">Name</span>
            <Image src={writingIcon} alt="writing-icon" width={13} height={13} />
          </div>
          <div className="font-geist font-normal text-[12px] text-black/50 mb-3">OpenSource Together</div>
        </div>
        {/* Dotted border */}
        <div className="border-t-2 border-dashed border-black/5 my-4" />
        {/* Description */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <span className="font-geist font-medium text-[16px] text-black/70">Description</span>
              <Image src={writingIcon} alt="writing-icon" width={13} height={13} />
            </div>
            <span className="text-[10px] text-black/10 font-normal">250/250</span>
          </div>
          <div className="font-geist font-normal text-[12px] text-black/50 mb-3">
            We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality ...
          </div>
        </div>
        {/* Dotted border */}
        <div className="border-t-2 border-dashed border-black/5 my-4" />
        {/* Link to repository */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <span className="font-geist font-medium text-[16px] text-black/70">Link to repository</span>
            <Image src={writingIcon} alt="writing-icon" width={13} height={13} />
          </div>
          <div className="flex items-center gap-2">
            <Image src={linkIcon} alt="link-icon" width={15} height={15} />
            <span className="font-geist font-normal text-[12px] text-black/50 break-all">https://github.com/opensource-together/opensource-together</span>
          </div>
        </div>
      </div>
      <Button
        width="425px"
        height="43px"
        radius="10px"
        className="flex items-center justify-center text-[15px]"
        onClick={onNext}
      >
        Confirm Information
      </Button>
    </div>
  );
} 