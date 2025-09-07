import React, { ReactNode } from "react";

interface TwoColumnLayoutProps {
  sidebar: ReactNode;
  hero: React.ReactElement<{ hideHeader?: boolean }>;
  children?: ReactNode;
  mobileHeader?: ReactNode;
}

export default function TwoColumnLayout({
  sidebar,
  hero,
  children,
  mobileHeader,
}: TwoColumnLayoutProps) {
  return (
    <div className="mx-7 mt-2 mb-20 flex max-w-[1007px] flex-col gap-8 md:mt-13.5 lg:mx-auto">
      {mobileHeader && <div className="md:hidden">{mobileHeader}</div>}

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-25">
        <div className="w-full md:w-[260px] md:shrink-0">{sidebar}</div>
        <div className="flex w-full flex-col gap-8 md:max-w-[677px] md:min-w-0 md:flex-1">
          <div className="hidden md:block">{hero}</div>

          <div className="md:hidden">
            {typeof hero === "object" &&
              React.isValidElement(hero) &&
              React.cloneElement(hero, { hideHeader: true })}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
