import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRoleBadgeVariant } from "@/lib/utils/badges";
import Image from "next/image";

// Type pour les niveaux de contribution
type ContributionLevel = 0 | 1 | 2 | 3 | 4;

interface Skill {
  name: string;
}

export default function ProfileHero() {
  // Générer les données du calendrier par semaine
  const generateCalendarData = (): ContributionLevel[][] => {
    const weeks: ContributionLevel[][] = [];

    // Créer 37 semaines
    for (let week = 0; week < 46; week++) {
      const days: ContributionLevel[] = [];

      // Chaque semaine a 7 jours
      for (let day = 0; day < 7; day++) {
        // Distribuer les niveaux pour reproduire un motif similaire à l'image
        const rand = Math.random();
        let level: ContributionLevel;

        if (rand < 0.45) {
          level = 0; // Plus de cases vides (gris clair)
        } else if (rand < 0.75) {
          level = 1; // Beaucoup de vert très clair
        } else if (rand < 0.9) {
          level = 2; // Moyennement de vert moyen
        } else if (rand < 0.97) {
          level = 3; // Peu de vert foncé
        } else {
          level = 4; // Très peu de vert très foncé
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
        return "bg-[#ebedf0]";
      case 1:
        return "bg-[#9be9a8]";
      case 2:
        return "bg-[#40c463]";
      case 3:
        return "bg-[#30a14e]";
      case 4:
        return "bg-[#216e39]";
      default:
        return "bg-[#ebedf0]";
    }
  };

  const skills: Skill[] = [
    { name: "Développeur Frontend" },
    { name: "Designer UX" },
    { name: "Développeur Backend" },
  ];

  return (
    <div className="h-auto w-full rounded-3xl border border-[#000000]/10 bg-white p-8 sm:w-[540px] lg:w-[731.96px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative mr-4">
            <Image
              src="https://pbs.twimg.com/profile_images/1813513692471779328/6RxAJKDu_400x400.jpg"
              alt="Profile"
              width={85}
              height={85}
              className="rounded-full"
            />
          </div>
          <div>
            <h2 className="text-2xl font-medium">Byron Love</h2>
            <p className="text-xs text-gray-500">Rejoint le 25 avril 2025</p>
          </div>
        </div>
        <Button variant="outline" className="font-medium">
          Modifier le profil
        </Button>
      </div>

      <p className="mb-6 text-sm text-gray-700">
        Développeur fullstack passionné par la création de code clair et
        performant pour des expériences web modernes
      </p>

      {/* Line */}
      <div className="my-7 border-t border-dashed border-[black]/10" />

      <div className="mb-6">
        <h3 className="mb-4 font-medium">Compétences techniques</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant={getRoleBadgeVariant(skill.name)}>
              {skill.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Line */}
      <div className="my-7 border-t border-dashed border-[black]/10" />

      <div>
        <div className="mb-7 flex items-center justify-between">
          <h3 className="font-medium">Activité de contribution</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#000000]/70">2024-2025</span>
            <select className="h-[30px] w-[86px] rounded-[5px] border border-[#000000]/10 px-3 text-xs">
              <option>Actuel</option>
              <option>Année dernière</option>
              <option>Tout le temps</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex w-full justify-center overflow-hidden">
          <div className="flex gap-0.5">
            {calendarWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`size-3 rounded-xs ${getSquareColor(day)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[#000000]/70">
          1,268 soumissions depuis l'année dernière
        </p>
      </div>
    </div>
  );
}
