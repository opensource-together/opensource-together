"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [underlineStyle, setUnderlineStyle] = React.useState<{
    left: number;
    width: number;
    visible: boolean;
  }>({ left: 0, width: 0, visible: false });

  const updateUnderline = React.useCallback(() => {
    const container = listRef.current;
    if (!container) return;
    const active = container.querySelector(
      '[data-state="active"]'
    ) as HTMLElement | null;
    if (active) {
      setUnderlineStyle({
        left: active.offsetLeft,
        width: active.offsetWidth,
        visible: true,
      });
    }
  }, []);

  React.useLayoutEffect(() => {
    updateUnderline();

    const container = listRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => updateUnderline());
    resizeObserver.observe(container);

    const mutationObserver = new MutationObserver(() => updateUnderline());
    mutationObserver.observe(container, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-state", "class", "style"],
      childList: true,
    });

    const handleClick = () => {
      // Delay to allow Radix to update data-state before measuring
      setTimeout(updateUnderline, 0);
    };
    container.addEventListener("click", handleClick, true);

    const handleWindowResize = () => updateUnderline();
    window.addEventListener("resize", handleWindowResize);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      container.removeEventListener("click", handleClick, true);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [updateUnderline]);

  return (
    <TabsPrimitive.List
      ref={listRef as unknown as React.Ref<HTMLDivElement>}
      data-slot="tabs-list"
      className={cn(
        "relative inline-flex items-center overflow-x-auto border-border border-b",
        className
      )}
      {...props}
    >
      {props.children}
      {underlineStyle.visible ? (
        <div
          className="absolute bottom-0 z-10 h-0.5 bg-primary transition-all duration-200"
          style={{ left: underlineStyle.left, width: underlineStyle.width }}
        />
      ) : null}
    </TabsPrimitive.List>
  );
}

interface TabsTriggerProps
  extends React.ComponentProps<typeof TabsPrimitive.Trigger> {
  count?: number | string;
}

function TabsTrigger({
  className,
  count,
  children,
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "group mr-2 inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap px-2 py-1.5 font-medium text-muted-foreground text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:border-b data-[state=active]:text-primary [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {count !== undefined && count !== null && (
        <span className="min-w-[18px] rounded-full bg-accent px-1.5 py-0.5 text-center font-medium text-[10px] text-muted-foreground leading-4 group-data-[state=active]:text-primary">
          {count}
        </span>
      )}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
