import { useCreateProject } from "@/features/projects/hooks/useProjects";
import Button from "../ui/Button";
import crossIcon from "../icons/crossIcon.svg";
import openSource from "../icons/openSource.svg";
import beta from "../icons/beta.svg";
import x from "../icons/x.svg";
import github from "../icons/github.svg";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mutation = useCreateProject();
  
  const handleCreate = () => {
    mutation.mutate({ 
      title: "titi3",
      description: "Recherche de tout ce qui est possible",
      status: "PUBLISHED",
      techStacks: [
        { id: "1", name: "python", iconUrl: "http://python" },
        { id: "2", name: "typescript", iconUrl: "http://typescript" },
        { id: "3", name: "java", iconUrl: "http://java" },
        { id: "7", name: "Docker", iconUrl: "http://Docker" }
      ]
    });
  };

  return (
    <header className="font-geist text-[13px] font-normal h-auto min-h-[60px] md:min-h-[70px] lg:h-[81px] px-4 sm:px-6 md:px-10 lg:px-[73px] flex flex-wrap items-center justify-between py-3 md:py-0">
      <section className="flex items-center space-x-2 sm:space-x-4 md:space-x-8">
        <article className="flex items-center gap-2">
          <Image src={openSource} alt="openSource" width={130} height={26} className="w-auto h-auto max-h-[26px] md:max-h-[30px] lg:max-h-[35px]" />
          <Image src={beta} alt="beta" width={24} height={10} className="w-auto h-auto max-h-[10px] md:max-h-[11px] lg:max-h-[12px]" />
        </article>

        {/* Navigation pour desktop et tablette */}
        <nav className="hidden md:flex items-center space-x-3 lg:space-x-6">
          <div className="flex items-center justify-center bg-[black]/5 w-[55px] h-[20px] rounded-[3px]">Home</div>
          <div className="text-[black]/70">Profile</div>
          <div className="text-[black]/70">My Projects</div>
        </nav>
      </section>

      {/* Bouton menu mobile */}
      <button 
        className="md:hidden flex flex-col justify-center items-center w-8 h-8" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span className={`block w-5 h-0.5 bg-black mb-1 transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block w-5 h-0.5 bg-black mb-1 transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-5 h-0.5 bg-black transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      {/* Menu mobile */}
      <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:hidden flex-col w-full py-3 space-y-3`}>
        <div className="flex items-center justify-center bg-[black]/5 w-full py-1.5 rounded-[3px]">Home</div>
        <div className="flex items-center justify-center w-full py-1.5 text-[black]/70">Profile</div>
        <div className="flex items-center justify-center w-full py-1.5 text-[black]/70">My Projects</div>
        
        <div className="flex items-center justify-center space-x-6 py-2">
          <Image src={github} alt="github" width={18} height={16} className="w-auto h-auto max-h-[16px]" />
          <Image src={x} alt="x" width={18} height={16} className="w-auto h-auto max-h-[16px]" />
        </div>
      </nav>

      <section className="hidden md:flex items-center space-x-2 sm:space-x-3 md:space-x-4">
        <Image src={github} alt="github" width={16} height={14} className="w-auto h-auto max-h-[14px]" />
        <Image src={x} alt="x" width={16} height={14} className="w-auto h-auto max-h-[14px]" />

        <Button
          onClick={handleCreate}
          disabled={mutation.isPending}
          className="sm:min-w-[140px] md:min-w-[160px] px-3 sm:px-4"
        >
          {mutation.isPending ? "Creating…" : (
            <>
              <span className="hidden sm:inline">Create new Project</span>
              <span className="inline sm:hidden">New Project</span>
              <Image src={crossIcon} alt="crossIcon" width={11} height={11} />
            </>
          )}
        </Button>

        {mutation.isError && (
          <p className="text-red-500 text-xs sm:text-sm">
            Error: {mutation.error?.message}
          </p>
        )}

        {mutation.isSuccess && mutation.data && (
          <p className="text-green-600 text-xs sm:text-sm">
            Project "{mutation.data.title}" created!
          </p>
        )}
      </section>

      {/* Actions mobile affichées dans le menu */}
      {mobileMenuOpen && (
        <div className="flex md:hidden w-full justify-center mt-3">
          <Button
            onClick={handleCreate}
            disabled={mutation.isPending}
            className="w-full max-w-[220px]"
          >
            {mutation.isPending ? "Creating…" : "New Project"}
          </Button>
        </div>
      )}
    </header>
  );
}
