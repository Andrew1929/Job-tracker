import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import type { SelectOption } from "@/types/select-option.types";

type FilterSelectProps = {
  id: string;
  prefix: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (value: string) => void;
  className?: string;
};

function getDisplayLabel(prefix: string, option: SelectOption): string {
  return `${prefix}: ${option.label}`;
}

export function FilterSelect({
  id,
  prefix,
  value,
  options,
  onChange,
  className,
}: FilterSelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-10 min-w-[140px] appearance-none rounded-lg border border-input bg-card py-2 pl-3 pr-9 text-sm text-foreground shadow-none transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        aria-label={prefix}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {getDisplayLabel(prefix, option)}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}
