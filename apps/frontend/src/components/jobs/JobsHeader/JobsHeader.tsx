import { Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

export function JobsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Jobs</h1>

      <div className="flex items-center gap-3">
        <Button type="button" size="sm">
          <Plus />
          Add Job
        </Button>
        <Button type="button" variant="outline" size="sm">
          <Upload />
          Export
        </Button>
      </div>
    </div>
  );
}
