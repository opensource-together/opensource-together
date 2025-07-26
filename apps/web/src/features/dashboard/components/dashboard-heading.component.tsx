export default function DashboardHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-black/70">{description}</p>
    </div>
  );
}
