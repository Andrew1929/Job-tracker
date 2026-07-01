"use client";

import { useState } from "react";

import { JobsFilters } from "@/components/jobs/JobsFilters";
import { JobsTable } from "@/components/jobs/JobsTable";
import { Pagination } from "@/components/shared/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import { JOBS_TOTAL_PAGES, MOCK_JOBS } from "@/constants/jobs.constants";

import type { JobsViewMode } from "@/types/jobs.types";

export function JobsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [viewMode, setViewMode] = useState<JobsViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="space-y-6 p-6">
        <JobsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          companyFilter={companyFilter}
          onCompanyFilterChange={setCompanyFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {viewMode === "list" ? (
          <JobsTable jobs={MOCK_JOBS} />
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Grid view coming soon.
          </p>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={JOBS_TOTAL_PAGES}
          onPageChange={setCurrentPage}
        />
      </CardContent>
    </Card>
  );
}
