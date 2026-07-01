import type { JobStatus } from "@/types/job-status.types";

export type KanbanColumnId = JobStatus;

export type KanbanCard = {
  id: string;
  company: string;
  position: string;
  date: string;
  columnId: KanbanColumnId;
};
