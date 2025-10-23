export default function DashboardHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1">
        <h1 className="text-xl">{title}</h1>
      </div>
      <p className="text-sm text-black/70">{description}</p>
    </div>
  );
}
