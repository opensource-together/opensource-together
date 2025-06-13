"use client";

import Image from "next/image";

import { StackIcon } from "@/components/shared/StackIcon";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { ProjectRole } from "../types/projectTypes";

interface RoleCardProps {
  role: ProjectRole;
  className?: string;
}

export default function RoleCard({ role, className }: RoleCardProps) {
  const { title = "", description = "", badges = [] } = role;

  return (
    <div
      className={`min-h-[310px] w-[668px] rounded-lg border border-[black]/5 bg-white p-6 shadow-xs ${className}`}
    >
      {/* Role Title */}
      <h3 className="mb-4 text-lg font-medium text-black">{title}</h3>

      {/* Role Description */}
      <p className="mb-6 text-sm leading-relaxed text-black/70">
        {description}
      </p>

      {/* Good First Issue Section */}
      <div
        className="mb-7 rounded-lg border border-[black]/5 p-4"
        style={{ backgroundColor: "rgba(250, 250, 250, 0.5)" }}
      >
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium text-black">Good first issue</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-black/50">20 days ago</span>
            <Image
              src="/icons/exemplebyronIcon.svg"
              alt="Byron Love"
              width={15}
              height={15}
              className="rounded-full"
            />
            <span className="text-xs text-black/70">Byron Love</span>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="mb-3 w-full border-t border-dashed border-black/8"></div>

        {/* Issue */}
        <div className="flex items-start gap-3">
          <Badge
            className="mt-1 mt-[0.5px] text-xs font-normal"
            style={{ backgroundColor: "#F0FDF4", color: "#00C950" }}
          >
            #24572
          </Badge>
          <span className="text-sm text-black">
            Remove m_is_test_chain, use ChainType directly
          </span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto flex items-center justify-between">
        {/* Tech Badges */}
        <div className="flex gap-2">
          {badges.length > 0 ? (
            badges.map((badge) => (
              <StackIcon
                key={`${badge.label}`}
                name={badge.label}
                icon={`/icons/mongodb.svg`}
                alt={badge.label}
              />
            ))
          ) : (
            // Default MongoDB badges for demo
            <>
              <StackIcon
                name="MongoDB"
                icon="/icons/mongodb.svg"
                alt="MongoDB"
              />
              <StackIcon
                name="MongoDB"
                icon="/icons/mongodb.svg"
                alt="MongoDB"
              />
              <StackIcon
                name="MongoDB"
                icon="/icons/mongodb.svg"
                alt="MongoDB"
              />
            </>
          )}
        </div>

        {/* Apply Button */}
        <div className="flex items-center gap-1 text-sm">
          Apply for Role
          <Image
            src="/icons/arrow-up-right.svg"
            alt="arrow"
            width={9}
            height={9}
            className="mt-0.5"
          />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRoleCard() {
  return (
    <div className="mb-6 flex min-h-[310px] w-[668px] flex-col rounded-lg border border-[black]/10 bg-white p-6 shadow-[0_0_0.5px_0_rgba(0,0,0,0.20)]">
      {/* Title skeleton */}
      <Skeleton className="mb-4 h-6 w-48" />

      {/* Description skeleton */}
      <div className="mb-6">
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Good first issue section skeleton */}
      <div className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <div className="mb-6 flex items-start gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Bottom section skeleton */}
      <div className="mt-auto flex items-center justify-between">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16" />
          ))}
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
