import React from 'react';
import Billboard from '@/shared/ui/Billboard';
import ProjectFilters from '../components/ProjectFilters';
import ProjectSearchBar from '../components/ProjectSearchBar';
import ProjectCard from '../components/ProjectCard';
import Pagination from '@/shared/ui/Pagination';
import Footer from '@/shared/layout/Footer';
import Header from '@/shared/layout/Header';
import { useProjects } from '../hooks/useProjects';

export default function HomepageViews() {
  // Utilisation du hook TanStack Query pour récupérer les projets
  const { data: projects, isLoading, isError, error } = useProjects();

  // Fonction pour rendre la grille de projets selon l'état de chargement
  const renderProjectGrid = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="text-red-500 mb-4">
            Une erreur est survenue: {error instanceof Error ? error.message : 'Erreur inconnue'}
          </div>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      );
    }
    
    // Si aucun projet n'est disponible, afficher des cartes statiques au lieu d'un message
    if (!projects || projects.length === 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </div>
      );
    }
    
    // Affichage des projets avec les données réelles
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            title={project.title} 
            description={project.description} 
            // Conversion des techStacks du format backend au format attendu par le composant
            techStack={project.techStacks?.map(tech => ({
              icon: tech.iconUrl,
              alt: tech.name
            }))}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4 md:space-y-5 pb-10">
        <Header />
        <div className="flex flex-col items-center mx-auto px-4 sm:px-6 md:px-8 lg:px-0 mt-4 md:mt-8">
          <Billboard />
        </div>
        
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-[1200px] py-4 md:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
            <ProjectFilters />
            <ProjectSearchBar />
          </div>
          
          {/* Grille de projets rendue dynamiquement */}
          {renderProjectGrid()}
          
          {/* Pagination toujours affichée sauf en cas de chargement ou d'erreur */}
          {!isLoading && !isError && (
            <div className="mt-25">
              <Pagination />
            </div>
          )}
        </div>
        
        <div className="mt-20 px-4 sm:px-6 md:px-8">
          <Footer />
        </div>
      </div>
    </>
  );
}