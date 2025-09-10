import MyApplicationsDetailsView from "@/features/dashboard/views/applications/my-applications-details.view";

interface MyApplicationPageProps {
  params: Promise<{
    applicationId: string;
  }>;
}

export default async function MyApplicationPage({
  params,
}: MyApplicationPageProps) {
  const { applicationId } = await params;
  return <MyApplicationsDetailsView applicationId={applicationId} />;
}
