import { JOB_STATUSES, type JobStatus } from "@/types/jobs.types";

/**
 * The board renders one column per backend job status, in pipeline order, so
 * every job is always visible in exactly one column.
 */
export const KANBAN_COLUMNS: readonly JobStatus[] = JOB_STATUSES;

/**
 * The board loads jobs in a single request and groups them client-side. 100 is
 * the backend's maximum page size (`QueryJobsDto`), which is a sensible upper
 * bound for an interactive board.
 */
export const KANBAN_BOARD_JOBS_LIMIT = 100;
