import { HiInbox } from "react-icons/hi2";

import DashboardHeading from "../components/layout/dashboard-heading.component";
import { MyApplicationsList } from "../components/my-applications/my-applications-list.component";

export default function MyApplicationsView() {
  return (
    <div>
      <DashboardHeading
        title="Candidatures"
        icon={<HiInbox size={16} />}
        description="Vous pouvez visualiser vos candidatures de projets Open Source ici."
      />
      <div className="mt-8 flex flex-col gap-4">
        <MyApplicationsList />
      </div>
    </div>
  );
}
