import Image from "next/image";
import { useState } from "react";
import { IoChevronBack, IoChevronForward, IoEllipse } from "react-icons/io5";

import { Button } from "./button";

interface ImageSliderProps {
  images: string[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;

    if (Math.abs(diff) > 50) {
      setIsDragging(false);
      setTranslateX(0);
      if (diff > 0) {
        handlePrevImage();
      } else {
        handleNextImage();
      }
      return;
    }

    setTranslateX(diff);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setTranslateX(0);
  };

  if (images.length === 0) return null;

  return (
    <div className="mt-2 mb-8 flex flex-row gap-1">
      <div className="flex-1">
        <div
          className="relative h-[207px] w-full overflow-hidden rounded-2xl select-none sm:h-[370px]"
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <div
            className={`border-muted-black-stroke flex h-full rounded-2xl border transition-transform duration-300 ${isDragging ? "transition-none" : ""}`}
            style={{
              transform: `translateX(calc(${translateX}px - ${currentImageIndex * 100}%))`,
            }}
          >
            {images.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`Image ${idx + 1}`}
                width={688}
                height={393}
                className="h-[207px] w-full shrink-0 rounded-2xl object-cover sm:h-[365px]"
                unoptimized
                priority={idx === currentImageIndex}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-3">
            <Button
              size="icon"
              variant="outline"
              className="size-7.5"
              onClick={handlePrevImage}
            >
              <IoChevronBack className="size-3" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="size-7.5"
              onClick={handleNextImage}
            >
              <IoChevronForward className="size-3" />
            </Button>
          </div>
          <div className="mt-[-10px] flex gap-1">
            {images.map((_, idx) => (
              <IoEllipse
                key={idx}
                className={`hover:text-muted-foreground size-1.5 hover:cursor-pointer ${
                  idx === currentImageIndex
                    ? "text-muted-foreground"
                    : "text-muted-foreground/50"
                }`}
                onClick={() => setCurrentImageIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
