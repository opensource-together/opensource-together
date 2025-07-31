import { ContributionGraph } from "../types/profile.type";

interface GithubCalendarProps {
  contributionGraph?: ContributionGraph;
  contributionsCount?: number;
}

export default function GithubCalendar({
  contributionGraph,
  contributionsCount = 0,
}: GithubCalendarProps) {
  const getSquareColor = (level: number): string => {
    switch (level) {
      case 0:
        return "bg-[#E8EAEE]"; // Gris clair
      case 1:
        return "bg-[#8EC5FF]"; // Bleu très clair
      case 2:
        return "bg-[#51A2FF]"; // Bleu clair
      case 3:
        return "bg-[#2B7FFF]"; // Bleu moyen
      case 4:
        return "bg-[#193CB8]"; // Bleu foncé
      default:
        return "bg-[#E8EAEE]";
    }
  };

  // Si pas de données de contribution, afficher un message
  if (
    !contributionGraph ||
    !contributionGraph.weeks ||
    contributionGraph.weeks.length === 0
  ) {
    return (
      <div className="w-full max-w-full overflow-hidden">
        <div>
          <h3 className="mb-4 text-lg font-medium tracking-tight text-black">
            Activité de contribution
          </h3>
          <div className="flex h-[87px] w-full max-w-[598.07px] items-center justify-center rounded-lg border border-black/5 p-2">
            <p className="text-sm text-gray-500">
              Aucune donnée de contribution disponible
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Afficher tous les mois de l'année
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = ["Mon", "Wed", "Fri"];

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div>
        <h3 className="mb-4 text-lg font-medium tracking-tight text-black">
          Activité de contribution
        </h3>

        <div className="relative">
          {/* Mois en haut */}
          <div className="mb-2 flex px-2">
            {months.map((month, index) => (
              <div key={index} className="flex-1 text-center">
                <span className="text-[6px] text-black/20 md:text-[8px]">
                  {month}
                </span>
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Jours à gauche */}
            <div className="mr-1 flex flex-col justify-between py-1 md:mr-2">
              {days.map((day, index) => (
                <span
                  key={index}
                  className="text-[6px] text-black/20 md:text-[8px]"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Calendrier principal */}
            <div className="h-[60px] w-full max-w-[598.07px] rounded-lg border border-black/5 p-1 md:h-[97px] md:p-2">
              <div className="flex h-full gap-[1px] md:gap-0.5">
                {contributionGraph.weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="flex flex-col gap-[1px] md:gap-0.5"
                  >
                    {week.days.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`size-[6px] rounded-full md:size-[9px] ${getSquareColor(day.level)}`}
                        title={`${day.date}: ${day.count} contributions`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
