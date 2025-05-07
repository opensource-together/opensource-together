import Image from "next/image";
import typescriptIcon from "@/shared/icons/typescript (2).svg";
import reactIcon from "@/shared/icons/react.svg";
import mongodbIcon from "@/shared/icons/mongodb.svg";
import tailwindIcon from "@/shared/icons/tailwindcss.svg";
import emptyprojecticon from "@/shared/icons/emptyprojectIcon.svg";
import Button from "@/shared/ui/Button";
import arrowUpRightIcon from "@/shared/icons/arrow-up-right.svg";
import joinedIcon from '../../../shared/icons/joinedicon.svg';
import exemplebyronIcon from '../../../shared/icons/exemplebyronIcon.svg';

export default function ProjectPageCard() {
  return (
    <section className="w-[710px] h-[634px] bg-white rounded-[24px] shadow-[0_0_0.5px_0_rgba(0,0,0,0.20)] border border-[black]/10 p-10 flex flex-col font-geist">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-5">
          <div className="w-[82px] h-[80px] rounded-[16px] bg-[#F4F4F4] flex items-center justify-center">
            <Image src={emptyprojecticon} alt="EcoTrack" width={80} height={80} />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-[24px] font-medium leading-tight font-geist">EcoTrack</h1>
            <div className="flex items-center gap-1 font-normal text-black/80 border border-black/10 rounded-[3px] h-[25px] w-[90px] bg-white py-2 px-1">
              <span className="rounded-full overflow-hidden flex items-center justify-center bg-[#F4F4F4]">
                <Image src={exemplebyronIcon} alt="Byron Love" width={13} height={13} />
              </span>
              <span className="font-geist font-medium text-[12px]">Byron Love</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center mt-2">
          <a
            href="#"
            className="text-[13px] font-medium font-geist flex items-center gap-1 text-black/80 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Repository
            <Image src={arrowUpRightIcon} alt="arrowright" width={9} height={9} />
          </a>
          <Button
            width="126px"
            height="43px"
            minWidth={false}
            className="ml-2 text-[13px] font-medium"
          >
            Join Project <Image src={joinedIcon} alt="joined" width={10} height={10} style={{ filter: 'invert(1)' }} />
          </Button>
        </div>
      </div>    

      {/* Description */}
      <div className="mt-2">
        <h2 className="text-[15px] font-medium font-geist mb-2">Project Description</h2>
        <p className="text-[13px] font-geist font-normal text-black/70 mb-4">
          Easily track your carbon footprint from daily activities and consumption. Get smart, actionable insights to live more sustainably and reduce your environmental impact.
        </p>
        <div className="w-[629px] h-[220px]">
        <p className="text-[13px] leading-[16px] font-geist font-normal text-black/70">Key benefits of our carbon tracking tool include:</p>
          <ul className="text-[13px] leading-[16px] font-geist font-normal text-black/70 list-disc pl-5 space-y-1">
            <li>Effortless tracking: Monitor your carbon footprint from everyday activities like transport, food, and energy use in just a few taps.</li>
            <li>Personalized insights: Receive tailored tips and data-driven suggestions to help you make more sustainable choices.</li>
            <li>Real-time impact visualization: See how your actions affect the environment with dynamic, easy-to-understand visual feedback.</li>
            <li>Goal setting: Set reduction targets and track your progress over time to stay motivated and accountable.</li>
            <li>Smart recommendations: Discover eco-friendly alternatives and habits based on your lifestyle and preferences.</li>
            <li>Data privacy: Your personal information stays secure—data is never shared without your consent.</li>
            <li>Multi-device support: Use the app seamlessly across smartphones, tablets, and web browsers.</li>
          </ul>
        </div>
      </div>

      {/* Ligne de séparation */}
      <div className="border-t border-dashed border-black/10 w-full mt-12 mb-3"></div>

      {/* Technical Stack */}
      <div className=" pt-4 ">
        <h3 className="text-[15px] font-medium font-geist mb-3">Technical Stack</h3>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <div className="w-[20px] h-[20px] border border-black/10 rounded-[2px] flex items-center justify-center">
              <Image src={typescriptIcon} alt="Typescript" width={14} height={14} />
            </div>
            <span className="text-[14px] font-normal font-geist">Typescript</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[20px] h-[20px] border border-black/10 rounded-[2px] flex items-center justify-center">
              <Image src={reactIcon} alt="React" width={14} height={14} />
            </div>
            <span className="text-[14px] font-normal font-geist">React</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[20px] h-[20px] border border-black/10 rounded-[2px] flex items-center justify-center">
              <Image src={mongodbIcon} alt="MongoDB" width={14} height={14} />
            </div>
            <span className="text-[14px] font-normal font-geist">MongoDB</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-[20px] h-[20px] border border-black/10 rounded-[2px] flex items-center justify-center">
              <Image src={tailwindIcon} alt="TailwindCSS" width={14} height={14} />
            </div>
            <span className="text-[14px] font-normal font-geist">TailwindCSS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
