import Image from "next/image";

export default function ProfileSidebar() {
  return (
    <div className="w-[270px] font-geist flex flex-col gap-10 ">
      {/* Socials Section */}
      <div>
        <h2 className="text-[18px] font-medium mb-3">Socials</h2>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/github.svg"
              alt="GitHub"
              width={15}
              height={19}
            />
            <span className="text-[14px] text-[#000000]/70">@byronlove111</span>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src="/icons/linkedin.svg"
              alt="LinkedIn"
              width={15}
              height={15}
            />
            <span className="text-[14px] text-[#000000]/70">@byronlove111</span>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src="/icons/x-logo.svg"
              alt="X/Twitter"
              width={15}
              height={15}
            />
            <span className="text-[14px] text-[#000000]/70">@byronlove111</span>
          </div>
        </div>
      </div>

      {/* Community Stats Section */}
      <div>
        <h2 className="text-[18px] font-medium mb-3">Stats OST</h2>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/joined.svg"
              alt="Joined Projects"
              width={15}
              height={15}
            />
            <span className="text-[14px] text-[#000000]/70">
              Projets rejoins{" "}
              <span className="text-[14px] text-black font-medium">5</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src="/icons/black-star.svg"
              alt="Stars"
              width={15}
              height={15}
            />
            <span className="text-[14px] text-[#000000]/70">
              Stars{" "}
              <span className="text-[14px] text-black font-medium">127</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src="/icons/created-projects-icon.svg"
              alt="Created Projects"
              width={15}
              height={15}
            />
            <span className="text-[14px] text-[#000000]/70">
              Projets créés{" "}
              <span className="text-[14px] text-black font-medium">3</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
