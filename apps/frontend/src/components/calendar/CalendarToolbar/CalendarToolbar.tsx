import { ChevronLeft, ChevronRight } from "lucide-react";

import { FilterSelect } from "@/components/shared/FilterSelect";
import { Button } from "@/components/ui/button";
import { CALENDAR_VIEW_OPTIONS } from "@/constants/calendar.constants";

import {
  isCalendarViewMode,
  type CalendarViewMode,
} from "@/types/calendar.types";

type CalendarToolbarProps = {
  title: string;
  view: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

const VIEW_UNIT_LABELS: Record<CalendarViewMode, string> = {
  month: "month",
  week: "week",
  day: "day",
};

export function CalendarToolbar({
  title,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
}: CalendarToolbarProps) {
  const unit = VIEW_UNIT_LABELS[view];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9"
            onClick={onPrevious}
            aria-label={`Go to previous ${unit}`}
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-9"
            onClick={onNext}
            aria-label={`Go to next ${unit}`}
          >
            <ChevronRight />
          </Button>
        </div>

        <h2
          className="text-lg font-semibold text-foreground"
          aria-live="polite"
        >
          {title}
        </h2>
      </div>

      <FilterSelect
        id="calendar-view-mode"
        ariaLabel="Calendar view"
        value={view}
        options={CALENDAR_VIEW_OPTIONS}
        onChange={(value) => {
          if (isCalendarViewMode(value)) {
            onViewChange(value);
          }
        }}
      />
    </div>
  );
}
