import Image from "next/image";
import Link from "next/link";

export interface RightSidebarLink {
  icon: string;
  label: string;
  url?: string;
  value?: string | number;
}

export interface RightSidebarSectionProps {
  title: string;
  links: RightSidebarLink[];
}

export function RightSidebarSection({
  title,
  links,
}: RightSidebarSectionProps) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-medium">{title}</h2>
      <div className="flex flex-col gap-5">
        {links.map((link, index) => (
          <div key={index} className="flex items-center gap-3">
            <Image src={link.icon} alt={link.label} width={15} height={15} />
            {link.url ? (
              <Link
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-black/70 hover:underline"
              >
                {link.label}
              </Link>
            ) : (
              <div className="flex gap-1 text-sm">
                <span className="text-black/70">{link.label}</span>
                {link.value !== undefined && (
                  <span className="text-black">{link.value}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
