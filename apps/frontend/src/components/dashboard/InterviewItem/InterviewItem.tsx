import { CompanyAvatar } from "@/components/shared/CompanyAvatar";

import type { UpcomingInterview } from "@/types/dashboard.types";

type InterviewItemProps = {
  interview: UpcomingInterview;
};

export function InterviewItem({ interview }: InterviewItemProps) {
  return (
    <li className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <CompanyAvatar
        initial={interview.companyInitial}
        colorClass={interview.companyColor}
        size="sm"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {interview.role}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {interview.dateTime}
        </p>
      </div>
    </li>
  );
}
