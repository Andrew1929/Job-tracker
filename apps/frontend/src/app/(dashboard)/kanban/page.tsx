import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { KanbanHeader } from "@/components/kanban/KanbanHeader";

export default function KanbanPage() {
  return (
    <div className="space-y-6">
      <KanbanHeader />
      <KanbanBoard />
    </div>
  );
}
