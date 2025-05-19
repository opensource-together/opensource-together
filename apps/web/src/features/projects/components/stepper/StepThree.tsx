export default function StepThree({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col items-center w-[400px] bg-white p-10 rounded-[20px] shadow-[0_2px_5px_rgba(0,0,0,0.03)] border border-black/10">
      <div className="mb-4">Step 3 (fake form)</div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-gray-200 rounded" onClick={onBack}>Back</button>
        <button className="px-4 py-2 bg-black text-white rounded" onClick={onNext}>Next</button>
      </div>
    </div>
  );
} 