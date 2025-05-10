import React, { useState } from "react";
import { ProjectInput } from "../types/ProjectInput";
import Button from "@/shared/ui/Button";

interface ProjectFormProps {
  onSubmit: (values: ProjectInput) => void;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  error?: string;
}

const defaultTechStacks = [
  { id: "1", name: "React" },
  { id: "2", name: "Node.js" },
  { id: "3", name: "MongoDB" },
  { id: "4", name: "TailwindCSS" },
];

export default function ProjectForm({ onSubmit, isLoading, isSuccess, isError, error }: ProjectFormProps) {
  const [form, setForm] = useState<ProjectInput>({
    title: "",
    description: "",
    longDescription: "",
    status: "DRAFT",
    techStacks: [],
    roles: [],
    keyBenefits: [],
    socialLinks: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTechStackChange = (index: number, value: string) => {
    const newTechStacks = [...form.techStacks];
    newTechStacks[index] = { id: String(index + 1), name: value, iconUrl: newTechStacks[index]?.iconUrl || "" };
    setForm({ ...form, techStacks: newTechStacks });
  };

  const handleAddTechStack = () => {
    setForm({ ...form, techStacks: [...form.techStacks, { id: String(form.techStacks.length + 1), name: "", iconUrl: "" }] });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, status: e.target.value as ProjectInput["status"] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-10 rounded-[20px] shadow-[0_2px_5px_rgba(0,0,0,0.03)] border border-black/10 flex flex-col gap-4 font-geist">
      <h2 className="text-[22px] font-medium mb-2 font-geist">Create a New Project</h2>
      <div>
        <label className="block text-[15px] font-medium mb-1">Project Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border border-black/10 rounded-[7px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
          required
        />
      </div>
      <div>
        <label className="block text-[15px] font-medium mb-1">Short Description</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-black/10 rounded-[7px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
          required
        />
      </div>
      <div>
        <label className="block text-[15px] font-medium mb-1">Long Description</label>
        <textarea
          name="longDescription"
          value={form.longDescription}
          onChange={handleChange}
          className="w-full border border-black/10 rounded-[7px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
          rows={4}
        />
      </div>
      <div>
        <label className="block text-[15px] font-medium mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleStatusChange}
          className="w-full border border-black/10 rounded-[7px] px-3 py-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
      <div>
        <label className="block text-[15px] font-medium mb-1">Tech Stack</label>
        {form.techStacks.map((stack, idx) => (
          <input
            key={idx}
            type="text"
            value={stack.name}
            onChange={e => handleTechStackChange(idx, e.target.value)}
            className="w-full border border-black/10 rounded-[7px] px-3 py-2 mb-2 text-[14px] font-geist focus:outline-none focus:ring-2 focus:ring-black/10"
            placeholder="e.g. React"
          />
        ))}
        <button type="button" onClick={handleAddTechStack} className="text-blue-600 text-[13px] mt-1 font-medium">+ Add Tech</button>
      </div>
      <Button
        type="submit"
        className="mt-4"
        disabled={isLoading}
        width="100%"
        height="43px"
      >
        {isLoading ? "Creating..." : "Create Project"}
      </Button>
      {isSuccess && <div className="text-green-600 font-medium">Project created successfully!</div>}
      {isError && <div className="text-red-600 font-medium">Error creating project. Please try again.</div>}
      {error && <div className="text-red-600 font-medium">{error}</div>}
    </form>
  );
} 