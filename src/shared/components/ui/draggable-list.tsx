"use client";

import { RiDraggable } from "react-icons/ri";

import { useDragAndDrop } from "@/shared/hooks/use-drag-and-drop.hook";
import { cn } from "@/shared/lib/utils";

interface DraggableListProps<T> {
  items: T[];
  onReorder?: (fromIndex: number, toIndex: number) => void;
  renderItem: (
    item: T,
    index: number,
    dragProps: DragItemProps
  ) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  enabled?: boolean;
  className?: string;
  itemClassName?:
    | string
    | ((index: number, isDragging: boolean, isDragOver: boolean) => string);
  renderDragHandle?: (dragProps: DragItemProps) => React.ReactNode;
}

export interface DragItemProps {
  draggable: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isDragOver: boolean;
}

export function DraggableList<T>({
  items,
  onReorder,
  renderItem,
  keyExtractor,
  enabled = true,
  className,
  itemClassName,
  renderDragHandle,
}: DraggableListProps<T>) {
  const canReorder = items.length > 1 && !!onReorder && enabled;
  const dragAndDrop = useDragAndDrop({ onReorder, enabled: canReorder });

  const defaultDragHandle = (_dragProps: DragItemProps) => (
    <div className="flex items-center">
      <button
        type="button"
        className="flex h-6 w-6 cursor-grab items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <RiDraggable className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className={className}>
      {items.map((item, index) => {
        const isDragging = dragAndDrop.draggedIndex === index;
        const isDragOver = dragAndDrop.dragOverIndex === index;

        const dragProps: DragItemProps = {
          draggable: canReorder,
          onDragStart: (e) => dragAndDrop.handleDragStart(e, index),
          onDragOver: (e) => dragAndDrop.handleDragOver(e, index),
          onDrop: (e) => dragAndDrop.handleDrop(e, index),
          onDragEnd: dragAndDrop.handleDragEnd,
          isDragging,
          isDragOver,
        };

        const baseItemClass =
          typeof itemClassName === "function"
            ? itemClassName(index, isDragging, isDragOver)
            : itemClassName;

        const defaultDragStyles = cn(
          "transition-all",
          isDragging && "opacity-50",
          isDragOver &&
            "rounded-md bg-ost-blue-one/10 outline outline-1 outline-ost-blue-three"
        );
        const finalClassName = cn(defaultDragStyles, baseItemClass);

        return (
          <div
            key={keyExtractor(item, index)}
            draggable={canReorder}
            onDragStart={dragProps.onDragStart}
            onDragOver={dragProps.onDragOver}
            onDrop={dragProps.onDrop}
            onDragEnd={dragProps.onDragEnd}
            className={finalClassName}
          >
            {canReorder && (renderDragHandle || defaultDragHandle)(dragProps)}
            {renderItem(item, index, dragProps)}
          </div>
        );
      })}
    </div>
  );
}
