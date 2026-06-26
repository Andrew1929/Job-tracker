import { CompanyAvatar } from "@/components/shared/CompanyAvatar";
import { StatusBadge } from "@/components/shared/StatusBadge";

import type { RecentApplication } from "@/types/dashboard.types";

type ApplicationRowProps = {
  application: RecentApplication;
};

export function ApplicationRow({ application }: ApplicationRowProps) {
  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <CompanyAvatar
            initial={application.companyInitial}
            colorClass={application.companyColor}
            size="sm"
          />
          <span className="text-sm font-medium text-foreground">
            {application.company}
          </span>
        </div>
      </td>
      <td className="hidden py-4 pr-4 text-sm text-foreground sm:table-cell">
        {application.role}
      </td>
      <td className="py-4 pr-4">
        <StatusBadge status={application.status} />
      </td>
      <td className="hidden py-4 text-sm text-muted-foreground md:table-cell">
        {application.date}
      </td>
    </tr>
  );
}
