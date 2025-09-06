import { HiInbox } from "react-icons/hi2";

import DashboardCtaComponent from "../../components/layout/dashboard-cta.component";
import DashboardHeading from "../../components/layout/dashboard-heading.component";
import { MyApplicationsList } from "../../components/my-applications/my-applications-list.component";

export default function MyApplicationsView() {
  return (
    <div>
      <DashboardHeading
        title="Candidatures"
        icon={<HiInbox size={16} />}
        description="Retrouvez ici l’ensemble de vos candidatures aux projets Open Source."
      />
      <DashboardCtaComponent
        title="Postulez à votre prochain projet"
        description="Travaillez sur des projets réels et développez vos compétences en équipe."
        buttonText="Postuler à un projet"
        buttonLink="/"
      />
      <div className="mt-8 flex flex-col gap-4">
        <MyApplicationsList />
      </div>
    </div>
  );
}
