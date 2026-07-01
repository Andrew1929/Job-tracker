import { Plus } from "lucide-react";

import { KanbanCard } from "@/components/kanban/KanbanCard";
import { Button } from "@/components/ui/button";

import type { KanbanCard as KanbanCardData, KanbanColumnId } from "@/types/kanban.types";

type KanbanColumnProps = {
  columnId: KanbanColumnId;
  cards: KanbanCardData[];
};

export function KanbanColumn({ columnId, cards }: KanbanColumnProps) {
  return (
    <section
      className="flex min-w-[240px] flex-1 flex-col rounded-xl border border-dashed border-border bg-muted/40 p-3"
      aria-label={`${columnId} column`}
    >
      <header className="mb-3 px-1">
        <h2 className="text-sm font-semibold text-foreground">
          {columnId}{" "}
          <span className="font-normal text-muted-foreground">
            ({cards.length})
          </span>
        </h2>
      </header>

      <ul className="flex flex-1 flex-col gap-3">
        {cards.map((card) => (
          <li key={card.id}>
            <KanbanCard card={card} />
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full border-dashed"
      >
        <Plus />
        Add Job
      </Button>
    </section>
  );
}
