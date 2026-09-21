import { CalendarClock, CalendarDays, CircleCheck, Hourglass } from "lucide-react";

import { InterviewSummaryCard } from "@/components/interviews/InterviewSummaryCard";

import type { LucideIcon } from "lucide-react";

/**
 * The four counts the summary row renders. Every one of them is derivable from
 * the interviews list endpoint alone — no analytics endpoint is involved:
 *
 *   upcoming       SCHEDULED interviews whose `scheduledAt` is still ahead
 *   thisWeek       the subset of those inside the next seven days
 *   completed      total COMPLETED interviews (`meta.total` of a status query)
 *   awaitingResult COMPLETED interviews still carrying result PENDING
 */
export type InterviewsSummaryCounts = {
  upcoming: number;
  thisWeek: number;
  completed: number;
  awaitingResult: number;
};

type SummaryCardPresentation = {
  id: keyof InterviewsSummaryCounts;
  label: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconClass: string;
};

// Icon and colour are pinned per metric, mirroring DASHBOARD_STAT_PRESENTATION.
const SUMMARY_CARDS: readonly SummaryCardPresentation[] = [
  {
    id: "upcoming",
    label: "Upcoming",
    icon: CalendarClock,
    iconBgClass: "bg-violet-100",
    iconClass: "text-violet-600",
  },
  {
    id: "thisWeek",
    label: "This week",
    icon: CalendarDays,
    iconBgClass: "bg-sky-100",
    iconClass: "text-sky-600",
  },
  {
    id: "completed",
    label: "Completed",
    icon: CircleCheck,
    iconBgClass: "bg-emerald-100",
    iconClass: "text-emerald-600",
  },
  {
    id: "awaitingResult",
    label: "Awaiting result",
    icon: Hourglass,
    iconBgClass: "bg-amber-100",
    iconClass: "text-amber-600",
  },
];

type InterviewsSummaryProps = {
  counts: InterviewsSummaryCounts;
};

export function InterviewsSummary({ counts }: InterviewsSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {SUMMARY_CARDS.map((card) => (
        <InterviewSummaryCard
          key={card.id}
          label={card.label}
          value={counts[card.id]}
          icon={card.icon}
          iconBgClass={card.iconBgClass}
          iconClass={card.iconClass}
        />
      ))}
    </div>
  );
}
