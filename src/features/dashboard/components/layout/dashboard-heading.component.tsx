export default function DashboardHeading({
  title,
  icon,
  description,
}: {
  title: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1">
        <h1 className="text-xl">{title}</h1>
        {icon}
      </div>
      <p className="text-sm text-black/70">{description}</p>
    </div>
  );
}
