import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Home `ProjectCard`–style hover for detail tabs: `px-5`/`py-5` base padding. */
export const detailCardHoverClass =
  "box-border transition-[margin,padding,box-shadow] duration-300 ease-out hover:-m-[2.5px] hover:cursor-pointer hover:px-[calc(1.25rem+2.5px)] hover:py-[calc(1.25rem+2.5px)] hover:shadow-[0_4px_32px_-8px_rgb(0_0_0/0.03)]";

/** Same hover for contributor grid cards (`px-4` / `py-3.5`). */
export const contributorCardHoverClass =
  "box-border transition-[margin,padding,box-shadow] duration-300 ease-out hover:-m-[2.5px] hover:cursor-pointer hover:px-[calc(1rem+2.5px)] hover:py-[calc(0.875rem+2.5px)] hover:shadow-[0_4px_32px_-8px_rgb(0_0_0/0.03)]";
