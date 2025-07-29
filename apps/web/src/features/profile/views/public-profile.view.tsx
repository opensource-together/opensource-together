"use client";

import CTAFooter from "@/shared/components/layout/cta-footer";

import GithubCalendar from "../components/github-calendar.component";
import PinnedProjects from "../components/pinned-projects.component";
import ProfileExperience from "../components/profile-experience.component";
import ProfileSidebar from "../components/profile-sidebar.component";
import PublicProfileEmpty from "../components/public-profile-empty.component";
import PublicProfileHero from "../components/public-profile-hero.component";
import { Profile } from "../types/profile.type";

interface PublicProfileViewProps {
  profile: Profile | null;
}

export function PublicProfileView({ profile }: PublicProfileViewProps) {
  // Si pas de profil, afficher l'empty state
  if (!profile) {
    return (
      <>
        <PublicProfileEmpty />
        <div className="mt-16">
          <CTAFooter imageIllustration="/illustrations/hooded-man.png" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mx-4 mt-4 flex w-full max-w-7xl flex-col gap-2 md:mx-auto md:mt-8 lg:flex-row lg:justify-center">
        {/* Sidebar à gauche */}
        <div className="w-full lg:mr-35 lg:w-auto">
          <ProfileSidebar profile={profile} />
        </div>

        {/* Main Content à droite */}
        <div className="flex w-full flex-col items-center justify-center gap-5 lg:w-[639px]">
          <div className="w-full">
            <PublicProfileHero profile={profile} />
          </div>

          {/* Section du calendrier GitHub */}
          <div className="mb-8 w-full">
            <GithubCalendar contributionsCount={profile.contributionsCount} />
          </div>

          {/* Section des expériences */}
          <div className="w-full">
            <ProfileExperience />
          </div>

          {/* Section des projets pinnés */}
          <div className="mt-12 mb-8 flex w-full">
            <PinnedProjects profile={profile} />
          </div>
        </div>
      </div>
    </>
  );
}
