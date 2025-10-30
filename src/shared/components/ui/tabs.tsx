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
        "border-border relative inline-flex items-center overflow-x-auto border-b",
        className
      )}
      {...props}
    >
      {props.children}
      {underlineStyle.visible ? (
        <div
          className="bg-primary absolute bottom-0 z-10 h-0.5 transition-all duration-200"
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
        "text-muted-foreground data-[state=active]:text-primary data-[state=active]:border-primary focus-visible:ring-ring group mr-2 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {count !== undefined && count !== null && (
        <span className="text-muted-foreground group-data-[state=active]:text-primary bg-accent min-w-[18px] rounded-full px-1.5 py-0.5 text-center text-[10px] leading-4 font-medium">
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
