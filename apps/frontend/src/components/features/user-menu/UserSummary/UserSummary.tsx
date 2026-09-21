import { Avatar } from "@/components/shared/Avatar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";


type UserSummaryProps = {
  className?: string;
  avatarSize?: "sm" | "md";
  showRole?: boolean;
};

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserSummary({
  className,
  avatarSize = "sm",
  showRole = true,
}: UserSummaryProps) {
  const { user } = useAuth();

  if(!user) {
    return null;
  }

  const displayName = user.name ?? user.email;
  
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar
        alt={ displayName}
        fallback={getInitials(displayName)}
        size={avatarSize}
      />
      <div className="min-w-0 text-left">
        <p className="truncate text-sm font-medium text-foreground">
          {displayName}
        </p>
        {showRole ? (
          <p className="truncate text-xs text-muted-foreground">
            {user.role}
          </p>
        ) : null}
      </div>
    </div>
  );
}
