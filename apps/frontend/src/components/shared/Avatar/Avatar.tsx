import { cn } from "@/lib/utils";

type AvatarProps = {
  src?: string;
  alt: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-24 text-2xl",
};

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  className,
}: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn(
          "shrink-0 rounded-full object-cover bg-muted",
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-500",
        sizeClasses[size],
        className,
      )}
      aria-label={alt}
    >
      {fallback}
    </div>
  );
}
