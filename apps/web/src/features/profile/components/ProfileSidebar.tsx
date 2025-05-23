import { RightSidebar } from "@/components/shared/rightSidebar/RightSidebar";

export default function ProfileSidebar() {
  const sections = [
    {
      title: "Socials",
      links: [
        {
          icon: "/icons/github.svg",
          label: "@byronlove111",
          url: "https://github.com/byronlove111",
        },
        {
          icon: "/icons/linkedin.svg",
          label: "@byronlove111",
          url: "https://linkedin.com/in/byronlove111",
        },
        {
          icon: "/icons/x-logo.svg",
          label: "@byronlove111",
          url: "https://x.com/byronlove111",
        },
      ],
    },
    {
      title: "Stats OST",
      links: [
        {
          icon: "/icons/joined.svg",
          label: "Projets rejoins",
          value: 5,
        },
        {
          icon: "/icons/black-star.svg",
          label: "Stars",
          value: 127,
        },
        {
          icon: "/icons/created-projects-icon.svg",
          label: "Projets créés",
          value: 3,
        },
      ],
    },
  ];

  return <RightSidebar sections={sections} />;
}
