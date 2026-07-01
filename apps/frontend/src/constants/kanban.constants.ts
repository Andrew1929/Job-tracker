import type { KanbanCard, KanbanColumnId } from "@/types/kanban.types";
import type { SelectOption } from "@/types/select-option.types";

export const KANBAN_COLUMNS: readonly KanbanColumnId[] = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Rejected",
];

export const KANBAN_JOB_FILTER_OPTIONS: readonly SelectOption[] = [
  { value: "all", label: "All Jobs" },
];

export const MOCK_KANBAN_CARDS: KanbanCard[] = [
  {
    id: "1",
    company: "Google",
    position: "Frontend Developer",
    date: "May 14, 2026",
    columnId: "Applied",
  },
  {
    id: "2",
    company: "Amazon",
    position: "Software Engineer",
    date: "May 12, 2026",
    columnId: "Applied",
  },
  {
    id: "3",
    company: "Netflix",
    position: "Senior Frontend Dev",
    date: "May 5, 2026",
    columnId: "Applied",
  },
  {
    id: "4",
    company: "Apple",
    position: "UI Engineer",
    date: "May 3, 2026",
    columnId: "Applied",
  },
  {
    id: "5",
    company: "Meta",
    position: "React Developer",
    date: "May 8, 2026",
    columnId: "Screening",
  },
  {
    id: "6",
    company: "Microsoft",
    position: "Backend Developer",
    date: "May 6, 2026",
    columnId: "Screening",
  },
  {
    id: "7",
    company: "Stripe",
    position: "Full Stack Developer",
    date: "May 10, 2026",
    columnId: "Interview",
  },
  {
    id: "8",
    company: "Airbnb",
    position: "Senior Engineer",
    date: "May 9, 2026",
    columnId: "Interview",
  },
  {
    id: "9",
    company: "Uber",
    position: "Software Engineer",
    date: "May 7, 2026",
    columnId: "Interview",
  },
  {
    id: "10",
    company: "Shopify",
    position: "Lead Developer",
    date: "May 4, 2026",
    columnId: "Offer",
  },
  {
    id: "11",
    company: "Twitter",
    position: "Frontend Developer",
    date: "May 2, 2026",
    columnId: "Rejected",
  },
  {
    id: "12",
    company: "LinkedIn",
    position: "React Developer",
    date: "May 1, 2026",
    columnId: "Rejected",
  },
];
