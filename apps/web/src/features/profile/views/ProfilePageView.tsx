import ProjectCard from "@/features/profile/components/ProjectCard";
import pinnedIcon from "@/shared/icons/pinned-icon.svg";
import Image from "next/image";
import ProfileCard from "../components/ProfileCard";
import ProfileSidebar from "../components/ProfileSidebar";
export default function ProfilePageView() {
  return (
    <>
      <div className="flex flex-col mx-auto px-4 sm:px-6 md:px-8 lg:px-24 xl:px-40 max-w-[1300px] mt-4 md:mt-8 gap-8">
        {/* Section du haut avec le profil et la sidebar */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-16">
          <div className="lg:max-w-[721.96px] w-full">
            <ProfileCard />
          </div>
          <ProfileSidebar />
        </div>

        {/* Section des projets pinnés en dessous */}
        <div className="w-full lg:pl-0 mt-2 mb-30">
          <h2 className="text-[20px] font-medium mb-10 font-geist flex items-center gap-1">
            Pinned Projects{" "}
            <Image src={pinnedIcon} alt="pinnedicon" width={18} height={17} />
          </h2>
          <div className="flex flex-col gap-6 lg:max-w-[731px]">
            <ProjectCard />
            <ProjectCard />
            <ProjectCard />
          </div>
        </div>
      </div>
    </>
  );
}
