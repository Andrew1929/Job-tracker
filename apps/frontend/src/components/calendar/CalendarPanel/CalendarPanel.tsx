"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CALENDAR_DEFAULT_MONTH,
  CALENDAR_VIEW_OPTIONS,
  MOCK_CALENDAR_EVENTS,
} from "@/constants/calendar.constants";
import { formatMonthYear } from "@/lib/calendar/month-grid";
import { cn } from "@/lib/utils";

import {
  isCalendarViewMode,
  type CalendarViewMode,
} from "@/types/calendar.types";

type CalendarPanelProps = {
  className?: string;
};

export function CalendarPanel({ className }: CalendarPanelProps) {
  const [currentMonth, setCurrentMonth] = useState(CALENDAR_DEFAULT_MONTH);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");

  const goToToday = () => {
    setCurrentMonth(CALENDAR_DEFAULT_MONTH);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (month) => new Date(month.getFullYear(), month.getMonth() + 1, 1),
    );
  };

  return (
    <Card className={cn("rounded-xl shadow-sm", className)}>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goToToday}
            >
              Today
            </Button>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9"
                onClick={goToPreviousMonth}
                aria-label="Go to previous month"
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9"
                onClick={goToNextMonth}
                aria-label="Go to next month"
              >
                <ChevronRight />
              </Button>
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              {formatMonthYear(currentMonth)}
            </h2>
          </div>

          <FilterSelect
            id="calendar-view-mode"
            ariaLabel="Calendar view"
            value={viewMode}
            options={CALENDAR_VIEW_OPTIONS}
            onChange={(value) => {
              if (isCalendarViewMode(value)) {
                setViewMode(value);
              }
            }}
          />
        </div>

        {viewMode === "month" ? (
          <CalendarGrid
            year={currentMonth.getFullYear()}
            month={currentMonth.getMonth()}
            events={MOCK_CALENDAR_EVENTS}
          />
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {viewMode === "week" ? "Week" : "Day"} view coming soon.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
