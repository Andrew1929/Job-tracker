import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  DASHBOARD_STATS,
  STAT_CARD_ICONS,
} from "@/constants/dashboard.constants";

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {DASHBOARD_STATS.map((stat) => {
        const Icon = STAT_CARD_ICONS[stat.id as keyof typeof STAT_CARD_ICONS];
        return <StatsCard key={stat.id} data={stat} icon={Icon} />;
      })}
    </div>
  );
}
