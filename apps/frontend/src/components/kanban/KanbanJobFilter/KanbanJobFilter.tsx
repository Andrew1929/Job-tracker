"use client";

import { useState } from "react";

import { FilterSelect } from "@/components/shared/FilterSelect";
import { KANBAN_JOB_FILTER_OPTIONS } from "@/constants/kanban.constants";

export function KanbanJobFilter() {
  const [jobFilter, setJobFilter] = useState("all");

  return (
    <FilterSelect
      id="kanban-job-filter"
      ariaLabel="Filter jobs"
      value={jobFilter}
      options={KANBAN_JOB_FILTER_OPTIONS}
      onChange={setJobFilter}
    />
  );
}
