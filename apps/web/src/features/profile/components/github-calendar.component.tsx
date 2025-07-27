// Type pour les niveaux de contribution
type ContributionLevel = 0 | 1 | 2 | 3 | 4;

interface GithubCalendarProps {
  contributionsCount?: number;
}

export default function GithubCalendar({
  contributionsCount: _contributionsCount = 0,
}: GithubCalendarProps) {
  // Générer les données du calendrier par semaine
  const generateCalendarData = (): ContributionLevel[][] => {
    const weeks: ContributionLevel[][] = [];

    // Créer 52 semaines (environ 1 an)
    for (let week = 0; week < 58; week++) {
      const days: ContributionLevel[] = [];

      // Chaque semaine a 7 jours
      for (let day = 0; day < 7; day++) {
        // Distribuer les niveaux pour reproduire un motif similaire à l'image
        const rand = Math.random();

        let level: ContributionLevel;

        if (rand < 0.45) {
          level = 0; // Plus de cases vides (gris clair)
        } else if (rand < 0.75) {
          level = 1; // Beaucoup de bleu très clair
        } else if (rand < 0.9) {
          level = 2; // Moyennement de bleu moyen
        } else if (rand < 0.97) {
          level = 3; // Peu de bleu foncé
        } else {
          level = 4; // Très peu de bleu très foncé
        }

        days.push(level);
      }

      weeks.push(days);
    }

    return weeks;
  };

  const calendarWeeks = generateCalendarData();

  const getSquareColor = (level: ContributionLevel): string => {
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

  const months = [
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
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
            <div className="h-[60px] w-full max-w-[598.07px] rounded-lg border border-black/5 p-1 md:h-[87px] md:p-2">
              <div className="flex h-full gap-[1px] md:gap-0.5">
                {calendarWeeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="flex flex-col gap-[1px] md:gap-0.5"
                  >
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`size-[6px] rounded-full md:size-[8px] ${getSquareColor(day)}`}
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
