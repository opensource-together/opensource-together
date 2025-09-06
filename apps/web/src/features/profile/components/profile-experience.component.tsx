import { Separator } from "@/shared/components/ui/separator";

export default function ProfileExperience() {
  const experiences = [
    {
      id: "1",
      startDate: "2023-01",
      endDate: "2023-12",
      position: "Chomeur",
      company: "",
    },
    {
      id: "2",
      startDate: "2024-05",
      endDate: "2024-10",
      position: "Designer at",
      company: "elevenstudio",
    },
    {
      id: "3",
      startDate: "2025-08",
      endDate: "2025-09",
      position: "Founding Designer at",
      company: "OST",
    },
  ].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const getMonthName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long" });
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="mb-0 flex flex-col">
        <h2 className="text-primary mb-1 text-lg text-sm font-normal">
          Experiences
        </h2>
      </div>

      <div className="mb-0 flex flex-col">
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className="flex flex-col items-center items-start justify-between gap-2 py-2 md:flex-row md:items-center md:gap-0"
          >
            <div className="flex min-w-0 flex-shrink-0 items-center gap-2">
              <span className="text-sm font-normal whitespace-nowrap text-black/50">
                {getMonthName(experience.startDate)}{" "}
                {experience.startDate.slice(0, 4)} -{" "}
                {getMonthName(experience.endDate)}{" "}
                {experience.endDate.slice(0, 4)}
              </span>
            </div>
            <div className="mx-4 flex-1 items-center md:block">
              <Separator />
            </div>
            <span className="text-primary text-sm font-medium break-words">
              {experience.position} {experience.company}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
