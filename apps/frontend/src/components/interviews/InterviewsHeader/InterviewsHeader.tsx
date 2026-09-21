import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type InterviewsHeaderProps = {
  onAddInterview: () => void;
};

export function InterviewsHeader({ onAddInterview }: InterviewsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Interviews
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage upcoming interviews, outcomes, and interview details.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" size="sm" onClick={onAddInterview}>
          <Plus />
          Add interview
        </Button>
      </div>
    </div>
  );
}
