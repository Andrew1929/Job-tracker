import { Eye, Pencil, Trash2 } from "lucide-react";

import { InterviewStatusBadge } from "@/components/interviews/InterviewStatusBadge";
import { ActionMenu } from "@/components/shared/ActionMenu";
import { INTERVIEW_TYPE_LABELS } from "@/constants/interviews.constants";
import { REMOTE_TYPE_LABELS } from "@/constants/jobs.constants";
import {
  formatInterviewDate,
  formatInterviewTime,
} from "@/lib/interviews/format-interview";

import type { Interview } from "@/types/interviews.types";

type InterviewTableRowProps = {
  interview: Interview;
  onOpenDetails: (interview: Interview) => void;
  onEdit: (interview: Interview) => void;
  onDelete: (interview: Interview) => void;
};

const EMPTY_VALUE = "—";

export function InterviewTableRow({
  interview,
  onOpenDetails,
  onEdit,
  onDelete,
}: InterviewTableRowProps) {
  const companyName = interview.job.company?.name ?? EMPTY_VALUE;
  const modeLabel = interview.remoteType
    ? REMOTE_TYPE_LABELS[interview.remoteType]
    : EMPTY_VALUE;

  return (
    <tr
      className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-muted/50"
      onClick={() => onOpenDetails(interview)}
    >
      <td className="py-4 pr-4">
        <span className="block text-sm font-semibold text-foreground">
          {formatInterviewDate(interview.scheduledAt)}
        </span>
        <span className="block text-xs text-muted-foreground">
          {formatInterviewTime(interview.scheduledAt)}
        </span>
      </td>

      <td className="py-4 pr-4">
        {/* Keyboard path into the drawer; the row click is a mouse convenience. */}
        <button
          type="button"
          className="block max-w-xs rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          onClick={(event) => {
            event.stopPropagation();
            onOpenDetails(interview);
          }}
        >
          <span className="block truncate text-sm font-semibold text-foreground">
            {interview.job.title}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {companyName}
          </span>
        </button>
      </td>

      <td className="hidden py-4 pr-4 text-sm text-foreground sm:table-cell">
        {INTERVIEW_TYPE_LABELS[interview.type]}
      </td>

      <td className="hidden py-4 pr-4 text-sm text-muted-foreground md:table-cell">
        {modeLabel}
      </td>

      <td className="py-4 pr-4">
        <InterviewStatusBadge status={interview.status} />
      </td>

      <td
        className="py-4 text-right"
        onClick={(event) => event.stopPropagation()}
      >
        <ActionMenu
          triggerAriaLabel={`Actions for ${interview.job.title} interview`}
          items={[
            {
              id: "view",
              label: "View Details",
              icon: Eye,
              onSelect: () => onOpenDetails(interview),
            },
            {
              id: "edit",
              label: "Edit Details",
              icon: Pencil,
              onSelect: () => onEdit(interview),
            },
            {
              id: "delete",
              label: "Delete",
              icon: Trash2,
              onSelect: () => onDelete(interview),
            },
          ]}
        />
      </td>
    </tr>
  );
}
