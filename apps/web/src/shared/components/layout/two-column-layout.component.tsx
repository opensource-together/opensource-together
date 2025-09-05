import { ReactNode } from "react";

interface TwoColumnLayoutProps {
  sidebar: ReactNode;
  hero: ReactNode;
  children?: ReactNode;
}

export default function TwoColumnLayout({
  sidebar,
  hero,
  children,
}: TwoColumnLayoutProps) {
  return (
    <div className="mx-7 mt-2 mb-20 flex max-w-[1007px] flex-col gap-8 md:mt-13.5 lg:mx-auto">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-25">
        <div className="w-full md:w-[260px] md:shrink-0">{sidebar}</div>
        <div className="flex w-full flex-col gap-8 md:max-w-[677px] md:min-w-0 md:flex-1">
          {hero}
          {children}
        </div>
      </div>
    </div>
  );
}
