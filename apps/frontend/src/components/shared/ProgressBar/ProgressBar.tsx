import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
};

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div
      className={cn("h-3 w-full overflow-hidden rounded-full bg-violet-100", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`Progress: ${percentage}%`}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-600 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
