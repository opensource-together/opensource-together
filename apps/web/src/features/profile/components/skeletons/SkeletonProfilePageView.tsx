import SkeletonPinnedProjects from "./SkeletonPinnedProjects";
import SkeletonProfileHero from "./SkeletonProfileHero";

export default function SkeletonProfilePageView() {
  return (
    <div className="mx-auto mt-4 flex justify-center items-center max-w-[1300px] flex-col gap-8 px-4 sm:px-6 md:mt-8 md:px-8 lg:px-24 xl:px-40">
      {/* Section du haut avec le profil et la sidebar */}
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:gap-16">
        <div className="w-full lg:max-w-[721.96px]">
          <SkeletonProfileHero />
        </div>
      </div>

      {/* Section des projets pinnés en dessous */}
      <div className="mt-2 mb-30 w-full  lg:pl-0">
        <div className="flex justify-center items-center flex-col gap-6  w-full">
          <SkeletonPinnedProjects />
        </div>
      </div>
    </div>
  );
}
