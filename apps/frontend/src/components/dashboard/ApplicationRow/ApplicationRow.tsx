import Link from "next/link";

import {JOBS_ROUTES} from "@/constants/jobs.constants";
import { JobStatusBadge } from "@/components/jobs/JobStatusBadge";
import { CompanyAvatar } from "@/components/shared/CompanyAvatar";

import type { RecentApplication } from "@/types/dashboard.types";

type ApplicationRowProps = {
  application: RecentApplication;
};

export function ApplicationRow({ application }: ApplicationRowProps) {
  return ( 
      <tr className="group border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40">
        <td className="p-0">
          <Link 
            href={JOBS_ROUTES.details(application.id)} 
            className="flex items-center gap-3 py-3 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <CompanyAvatar
              initial={application.companyInitial}
              colorClass={application.companyColor}
              size="sm"
            />
            <span className="text-sm font-medium text-foreground">
              {application.company}
            </span>
          </Link>
        </td>

        <td className="hidden p-0 sm:table-cell">
          <Link
            href={JOBS_ROUTES.details(application.id)}
            className="block py-3 pr-4 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {application.role}
          </Link>
        </td>

        <td className="p-0">
          <Link
            href={JOBS_ROUTES.details(application.id)}
            className="block py-3 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <JobStatusBadge status={application.status} />
          </Link>
        </td>

        <td className="hidden p-0 md:table-cell">
          <Link
            href={JOBS_ROUTES.details(application.id)}
            className="block py-3 text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {application.date}
          </Link>
        </td>
      </tr>
  );
}
