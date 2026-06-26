import { ProgressBar } from "@/components/shared/ProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WEEKLY_GOAL } from "@/constants/dashboard.constants";

export function WeeklyGoal() {
  const percentage = Math.round(
    (WEEKLY_GOAL.current / WEEKLY_GOAL.target) * 100,
  );

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Weekly Goal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <p className="text-sm text-muted-foreground">
          You&apos;ve applied to{" "}
          <span className="font-semibold text-foreground">
            {WEEKLY_GOAL.current} jobs
          </span>
        </p>
        <ProgressBar value={WEEKLY_GOAL.current} max={WEEKLY_GOAL.target} />
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            {WEEKLY_GOAL.current} / {WEEKLY_GOAL.target}
          </span>
          <span className="font-semibold text-primary">{percentage}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
