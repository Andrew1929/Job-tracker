import { StatsCard } from "@/components/dashboard/StatsCard";
import { DASHBOARD_STAT_PRESENTATION } from "@/constants/dashboard.constants";

import type { DashboardStat } from "@/types/dashboard.types";

type StatsCardsProps = {
  stats: DashboardStat[];
};

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const presentation = DASHBOARD_STAT_PRESENTATION[stat.id];
        return (
          <StatsCard
            key={stat.id}
            data={stat}
            icon={presentation.icon}
            iconBgClass={presentation.iconBgClass}
            iconClass={presentation.iconClass}
          />
        );
      })}
    </div>
  );
}
