import type { KanbanCard } from "@/types/kanban.types";

type KanbanCardProps = {
  card: KanbanCard;
};

export function KanbanCard({ card }: KanbanCardProps) {
  return (
    <article className="rounded-lg border border-border/60 bg-card p-3 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">{card.company}</h3>
      <p className="mt-1 text-sm text-foreground">{card.position}</p>
      <p className="mt-3 text-xs text-muted-foreground">{card.date}</p>
    </article>
  );
}
