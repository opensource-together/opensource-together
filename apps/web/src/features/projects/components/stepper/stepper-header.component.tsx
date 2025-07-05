interface StepperHeaderComponentProps {
  title: string;
  description: string;
}

export default function StepperHeaderComponent({
  title,
  description,
}: StepperHeaderComponentProps) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-2 text-center text-3xl font-medium tracking-tighter">
        {title}
      </h2>
      <p className="mb-12 text-center text-sm text-black/70">{description}</p>
    </div>
  );
}
