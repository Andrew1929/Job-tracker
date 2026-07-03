import { Check } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { JobTimelineStep } from "@/types/jobs.types";

type JobTimelineCardProps = {
  timeline: readonly JobTimelineStep[];
};

type TimelineIndicatorProps = {
  state: JobTimelineStep["state"];
};

function TimelineIndicator({ state }: TimelineIndicatorProps) {
  if (state === "completed") {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Check className="size-3.5" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full border-2 bg-card",
        state === "current" ? "border-primary" : "border-border",
      )}
    >
      {state === "current" ? (
        <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
      ) : null}
    </span>
  );
}

export function JobTimelineCard({ timeline }: JobTimelineCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Application Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ol>
          {timeline.map((step, index) => (
            <li key={step.id} className="relative flex gap-3 pb-6 last:pb-0">
              {index < timeline.length - 1 ? (
                <span
                  className="absolute left-3 top-7 h-[calc(100%-1.25rem)] w-px -translate-x-1/2 bg-border"
                  aria-hidden="true"
                />
              ) : null}

              <TimelineIndicator state={step.state} />

              <div className="pt-0.5">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.state === "upcoming"
                      ? "text-muted-foreground"
                      : "text-foreground",
                  )}
                >
                  {step.label}
                </p>
                {step.date ? (
                  <p className="text-xs text-muted-foreground">{step.date}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
