import { Avatar } from "@/components/shared/Avatar";
import { DEMO_USER } from "@/constants/navigation.constants";
import { cn } from "@/lib/utils";

type UserSummaryProps = {
  className?: string;
  avatarSize?: "sm" | "md";
  showRole?: boolean;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export function UserSummary({
  className,
  avatarSize = "sm",
  showRole = true,
}: UserSummaryProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar
        alt={DEMO_USER.name}
        fallback={getInitials(DEMO_USER.name)}
        size={avatarSize}
      />
      <div className="min-w-0 text-left">
        <p className="truncate text-sm font-medium text-foreground">
          {DEMO_USER.name}
        </p>
        {showRole ? (
          <p className="truncate text-xs text-muted-foreground">
            {DEMO_USER.role}
          </p>
        ) : null}
      </div>
    </div>
  );
}
