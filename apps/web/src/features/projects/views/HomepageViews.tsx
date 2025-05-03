import React from 'react';
import Billboard from '@/shared/ui/Billboard';
import ProjectFilters from '../components/ProjectFilters';
import ProjectSearchBar from '../components/ProjectSearchBar';
import ProjectCard from '../components/ProjectCard';
import Pagination from '@/shared/ui/Pagination';
import Footer from '@/shared/layout/Footer';
import Header from '@/shared/layout/Header';

export default function HomepageViews() {
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
        
        <div className="mt-25">
          <Pagination />
        </div>
      </div>
      
      <div className="mt-20 px-4 sm:px-6 md:px-8">
        <Footer />
      </div>
      </div>
    </>
  );
} 