import CollaborationSidebar from "@/features/collaboration/components/collaboration-sidebar.component";

interface LayoutProps {
  children: React.ReactNode;
}

export default function CollaborationLayout({ children }: LayoutProps) {
  return (
    <div className="flex h-[calc(100vh-65px)] overflow-hidden md:h-[calc(100vh-85px)]">
      <CollaborationSidebar />
      <main className="flex-1 overflow-y-auto px-14 pt-12">{children}</main>
    </div>
  );
}
