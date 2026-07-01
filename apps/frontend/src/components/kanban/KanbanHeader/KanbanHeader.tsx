import { Plus } from "lucide-react";

import { KanbanJobFilter } from "@/components/kanban/KanbanJobFilter";
import { Button } from "@/components/ui/button";

export function KanbanHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Kanban Board
      </h1>

      <div className="flex items-center gap-3">
        <Button type="button" size="sm">
          <Plus />
          Add Job
        </Button>
        <KanbanJobFilter />
      </div>
    </div>
  );
}
