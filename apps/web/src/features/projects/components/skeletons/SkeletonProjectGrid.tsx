import SkeletonProjectCard from "./SkeletonProjectCard";

export default function SkeletonProjectGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
      {[...Array(6)].map((_, index) => (
        <SkeletonProjectCard key={index} />
      ))}
    </div>
  );
}
