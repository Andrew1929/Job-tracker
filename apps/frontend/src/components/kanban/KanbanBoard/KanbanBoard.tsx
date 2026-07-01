import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import {
  KANBAN_COLUMNS,
  MOCK_KANBAN_CARDS,
} from "@/constants/kanban.constants";

import type { KanbanCard, KanbanColumnId } from "@/types/kanban.types";

function groupCardsByColumn(
  cards: KanbanCard[],
): Record<KanbanColumnId, KanbanCard[]> {
  const grouped = Object.fromEntries(
    KANBAN_COLUMNS.map((columnId) => [columnId, [] as KanbanCard[]]),
  ) as Record<KanbanColumnId, KanbanCard[]>;

  for (const card of cards) {
    grouped[card.columnId].push(card);
  }

  return grouped;
}

export function KanbanBoard() {
  const cardsByColumn = groupCardsByColumn(MOCK_KANBAN_CARDS);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-4">
        {KANBAN_COLUMNS.map((columnId) => (
          <KanbanColumn
            key={columnId}
            columnId={columnId}
            cards={cardsByColumn[columnId]}
          />
        ))}
      </div>
    </div>
  );
}
