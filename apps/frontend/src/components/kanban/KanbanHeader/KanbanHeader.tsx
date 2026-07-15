import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type KanbanHeaderProps = {
  onAddJob: () => void;
};

export function KanbanHeader({ onAddJob }: KanbanHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Kanban Board
      </h1>

      <Button type="button" size="sm" onClick={onAddJob}>
        <Plus />
        Add Job
      </Button>
    </div>
  );
}
