"use client";

import { HiMiniSquare2Stack } from "react-icons/hi2";

import { Separator } from "@/shared/components/ui/separator";

import DashboardCtaComponent from "../../components/layout/dashboard-cta.component";
import DashboardHeading from "../../components/layout/dashboard-heading.component";
import MyProjectsList from "../../components/my-projects/my-projects-list.component";

export default function MyProjectsView() {
  return (
    <div>
      <DashboardHeading
        title="Projets"
        icon={<HiMiniSquare2Stack size={16} />}
        description="Organisez, modifiez, gérez les membres et administrez vos projets — tout en un seul endroit."
      />
      <DashboardCtaComponent
        title="Construisez OpenSource Together"
        description="Lancez un nouveau projet, importez un repository Github ou commencez de zéro."
        buttonText="Créer un projet"
        buttonLink="/projects/create"
      />

      <Separator className="my-10" />

      <div className="w-full">
        <MyProjectsList />
      </div>
    </div>
  );
}
