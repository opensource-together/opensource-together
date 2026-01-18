"use client";

import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { HiMiniSquare2Stack } from "react-icons/hi2";
import type { Project } from "@/features/projects/types/project.type";
import { Avatar } from "@/shared/components/ui/avatar";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Input } from "@/shared/components/ui/input";
import { Modal } from "@/shared/components/ui/modal";

interface PinProjectsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  selectedProjectIds: string[];
  onSelectionChange: (projectIds: string[]) => void;
  isLoading?: boolean;
}

export default function PinProjectsModal({
  open,
  onOpenChange,
  projects,
  selectedProjectIds,
  onSelectionChange,
  isLoading = false,
}: PinProjectsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectToggle = (projectId: string) => {
    if (selectedProjectIds.includes(projectId)) {
      onSelectionChange(selectedProjectIds.filter((id) => id !== projectId));
    } else {
      onSelectionChange([...selectedProjectIds, projectId]);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(d);
  };

  const handleConfirm = () => {
    // TODO: Implement confirm logic
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Pin Projects"
      size="lg"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    >
      <div className="flex flex-col gap-4">
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              Loading pinned projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <EmptyState
              title="No projects found"
              description="No published projects available to pin."
              icon={HiMiniSquare2Stack}
            />
          ) : (
            <div className="flex flex-col">
              {filteredProjects.map((project, index) => {
                const isSelected = selectedProjectIds.includes(
                  project.id || project.publicId || ""
                );
                const projectId = project.id || project.publicId || "";

                return (
                  <div
                    key={projectId}
                    onClick={() => handleProjectToggle(projectId)}
                    className={`grid cursor-pointer grid-cols-[auto_1fr_1fr_auto] items-center gap-2.5 px-2 py-3 transition-colors hover:bg-muted ${
                      index < filteredProjects.length - 1
                        ? "border-muted-black-stroke border-b"
                        : ""
                    }`}
                  >
                    <Avatar
                      src={project.logoUrl || undefined}
                      name={project.title}
                      alt={project.title}
                      size="sm"
                      shape="sharp"
                    />
                    <span className="line-clamp-1 font-medium text-sm">
                      {project.title}
                    </span>
                    <span className="text-center text-muted-foreground text-xs">
                      {formatDate(project.createdAt)}
                    </span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleProjectToggle(projectId)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
