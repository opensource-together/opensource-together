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
    <div>
      <div className="mb-2 flex flex-col">
        <h2 className="mb-1 text-lg font-medium tracking-tight text-black">
          Experiences
        </h2>
      </div>

      <div className="mb-2 flex flex-col">
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-normal text-black/50">
                {getMonthName(experience.startDate)}{" "}
                {experience.startDate.slice(0, 4)} -{" "}
                {getMonthName(experience.endDate)}{" "}
                {experience.endDate.slice(0, 4)}
              </span>
            </div>
            <div className="mx-4 flex flex-1 items-center">
              <div className="h-[1px] w-full bg-black/5" />
            </div>
            <span className="text-sm font-medium text-black">
              {experience.position} {experience.company}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
