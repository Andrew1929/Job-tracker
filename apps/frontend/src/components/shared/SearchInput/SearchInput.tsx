import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  className?: string;
  placeholder?: string;
};

export function SearchInput({
  className,
  placeholder = "Search anything...",
}: SearchInputProps) {
  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder={placeholder}
        className="h-10 border-border/80 bg-card pl-10 shadow-none"
        aria-label="Search"
      />
    </div>
  );
}
