import { APP_NAME } from "@/constants/auth.constants";
import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
};

export function AppLogo({ className }: AppLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="flex size-8 items-center justify-center rounded-lg bg-primary/10"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-5 text-primary"
          aria-hidden="true"
        >
          <path
            d="M12 2C8.5 2 6 4.5 6 8c0 3 2 5.5 6 10 4-4.5 6-7 6-10 0-3.5-2.5-6-6-6z"
            fill="currentColor"
            opacity="0.2"
          />
          <path
            d="M12 4c-2.5 0-4 1.8-4 4.5 0 2.2 1.5 4.2 4 7.5 2.5-3.3 4-5.3 4-7.5C16 5.8 14.5 4 12 4z"
            fill="currentColor"
          />
        </svg>
      </div>
      <span className="text-lg font-bold tracking-tight text-foreground">
        {APP_NAME}
      </span>
    </div>
  );
}
