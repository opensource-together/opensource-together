import { useCallback, useState } from "react";

interface UseDragAndDropOptions {
  onReorder?: (fromIndex: number, toIndex: number) => void;
  enabled?: boolean;
}

export function useDragAndDrop({
  onReorder,
  enabled = true,
}: UseDragAndDropOptions = {}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      if (!enabled) return;
      e.stopPropagation();
      setDraggedIndex(index);
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
      }
    },
    [enabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      if (!enabled) return;
      e.preventDefault();
      e.stopPropagation();
      if (draggedIndex !== null && draggedIndex !== index) {
        setDragOverIndex((prev) => (prev !== index ? index : prev));
      } else {
        setDragOverIndex((prev) => (prev !== null ? null : prev));
      }
    },
    [draggedIndex, enabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      if (!enabled) return;
      e.preventDefault();
      e.stopPropagation();

      if (draggedIndex !== null && onReorder && draggedIndex !== dropIndex) {
        onReorder(draggedIndex, dropIndex);
      }

      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [draggedIndex, onReorder, enabled]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  return {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    isDragging: draggedIndex !== null,
  };
}
