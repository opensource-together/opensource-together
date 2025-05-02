"use client";

import { useState } from "react";
import Header from "@/shared/layout/Header";
import BillboardView from "@/features/projects/views/BillboardView";
import FiltersView from "@/features/projects/views/FiltersView";
import ProjectGridView from "@/features/projects/views/ProjectGridView";
import PaginationView from "@/features/projects/views/PaginationView";
import FooterView from "@/features/projects/views/FooterView";

export const Homepage = () => {
  const [currentView, setCurrentView] = useState("projects");

  // Function to render the correct view based on state
  const renderView = () => {
    switch (currentView) {
      case "projects":
      default:
        return (
          <>
            <BillboardView />
            
            <div className="px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-[1200px] py-4 md:py-8">
              <FiltersView />
              <ProjectGridView />
              <PaginationView />
            </div>
            
            <FooterView />
          </>
        );
    }
  };

  return (
    <div className="space-y-4 md:space-y-5 pb-10">
      <Header/>
      {renderView()}
    </div>
  );
};

export default Homepage; 