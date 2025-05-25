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
    <div className={`font-geist flex w-[270px] flex-col gap-10 ${className}`}>
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
