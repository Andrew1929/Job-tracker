import { cn } from "@/lib/utils";

type CompanyAvatarProps = {
  initial: string;
  colorClass: string;
  size?: "sm" | "md";
  className?: string;
};

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
};

export function CompanyAvatar({
  initial,
  colorClass,
  size = "md",
  className,
}: CompanyAvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        colorClass,
        sizeClasses[size],
        className,
      )}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
