import { RightSidebarLink, RightSidebarSection } from "./RightSidebarSection";

interface RightSidebarProps {
  sections: {
    title: string;
    links: RightSidebarLink[];
  }[];
  className?: string;
}

export function RightSidebar({ sections, className = "" }: RightSidebarProps) {
  return (
    <div className={`w-[270px] font-geist flex flex-col gap-10 ${className}`}>
      {sections.map((section, index) => (
        <RightSidebarSection
          key={index}
          title={section.title}
          links={section.links}
        />
      ))}
    </div>
  );
}
