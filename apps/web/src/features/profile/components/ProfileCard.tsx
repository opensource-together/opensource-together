import React from 'react';
import Image from 'next/image';
import exemplebyronIcon from '../../../shared/icons/exemplebyronIcon.svg';

// Type pour les niveaux de contribution
type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export default function ProfileCard() {
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
      case 0: return "bg-[#ebedf0]";
      case 1: return "bg-[#9be9a8]";
      case 2: return "bg-[#40c463]";
      case 3: return "bg-[#30a14e]";
      case 4: return "bg-[#216e39]";
      default: return "bg-[#ebedf0]";
    }
  };

  const skills = ["UX Designer", "Front-end Developer", "MongoDB"];

  return (
    <div className="bg-white w-full sm:w-[540px] lg:w-[721.96px] h-auto rounded-[25px] border border-[#000000]/10 p-8 font-geist">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="relative mr-4">
            <Image 
              src={exemplebyronIcon} 
              alt="Profile" 
              width={85} 
              height={85} 
              className="rounded-full"
            />
          </div>
          <div>
            <h2 className="text-[24px] font-medium">Byron Love</h2>
            <p className="text-[11px] text-gray-500">Joined Jan 25, 2022</p>
          </div>
        </div>
        <button className="h-[35px] w-[100px] text-[13px] border border-[#000000]/10 rounded-[5px] self-center">Edit Profile</button>
      </div>
      
      <p className="text-sm text-gray-700 mb-6">
        Fullstack developer crafting clean, efficient code for modern web experiences
      </p>

      {/* Line */}
      <div className="border-t border-dashed border-[black]/10 my-7" />
      
      <div className="mb-6">
        <h3 className="text-[14px] font-medium mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => {
            // Alternance des couleurs selon l'index
            let bgColor = "";
            let textColor = "";
            
            if (index % 3 === 0) {
              // Jaune/Or
              bgColor = "bg-[#FEF3C6]";
              textColor = "text-[#FFB900]";
            } else if (index % 3 === 1) {
              // Bleu
              bgColor = "bg-[#DBEAFE]";
              textColor = "text-[#51A2FF]";
            } else {
              // Vert
              bgColor = "bg-[#DCFCE7]";
              textColor = "text-[#05DF72]";
            }
            
            return (
              <span 
                key={index} 
                className={`px-2 py-0.5 text-[12px] rounded-[3px] h-[20.34px] flex items-center ${bgColor} ${textColor}`}
              >
                {skill}
              </span>
            );
          })}
        </div>
      </div>

      {/* Line */}
      <div className="border-t border-dashed border-[black]/10 my-7" />
      
      <div>
        <div className="flex items-center justify-between mb-7">
          <h3 className="text-[14px] font-medium">Contribution Activity</h3>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#000000]/70">2024-2023</span>
            <select className="text-[12px] border border-[#000000]/10 rounded-[5px] h-[30px] w-[86px] px-4">
              <option>Current</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
          </div>
        </div>
        
        <div className="w-full overflow-hidden mb-4">
          <div className="flex gap-0.5">
            {calendarWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {week.map((day, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className={`w-3 h-3 rounded-[5px] ${getSquareColor(day)}`} 
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-[12px] text-[#000000]/70">1,268 submissions in the last year</p>
      </div>
    </div>
  );
}
