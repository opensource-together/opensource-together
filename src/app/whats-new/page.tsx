import type { Metadata } from "next";
import WhatsNewView from "@/features/whats-new/views/whats-new.view";

export const metadata: Metadata = {
  title: "What's new",
  description:
    "Discover this week's new open-source projects on OpenSource Together. Fresh repos, new technologies, and your next contribution.",
  alternates: { canonical: "/whats-new" },
};

export default function WhatsNewPage() {
  return <WhatsNewView />;
}
