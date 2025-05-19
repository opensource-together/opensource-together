import Button from "@/shared/ui/Button";

export default function StepOne({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center bg-white p-10 rounded-[20px]">
      <h2 className="text-[30px] font-medium tracking-tight font-geist text-black mb-2">Choose your Method</h2>
      <p className="text-[15px] text-black/70 mb-8 text-center">
        Import a repository from Github or create project from scratch.
      </p>
      <Button
        width="425px"
        height="43px"
        radius="10px"
        className="mb-4 flex items-center justify-center text-[15px]"
        onClick={onNext}
      >
        Import from Github <span className=""><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.34-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.338 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.577.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z"/></svg></span>
      </Button>
      <div className="text-[15px] text-black/70 mb-2">or</div>
      <button
        className="w-[425px] h-[43px] rounded-[10px] border border-black/10 bg-white text-black text-[15px] font-medium"
        style={{ boxShadow: "0 2px 5px rgba(0,0,0,0.03)" }}
        onClick={onNext}
      >
        Start from scratch
      </button>
    </div>
  );
} 