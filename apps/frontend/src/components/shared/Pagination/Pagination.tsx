import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

type PageItem = number | "ellipsis";

function buildPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];

  if (currentPage <= 3) {
    items.push(2, 3, "ellipsis", totalPages);
    return items;
  }

  if (currentPage >= totalPages - 2) {
    items.push("ellipsis");
    for (let page = totalPages - 3; page <= totalPages; page += 1) {
      if (page > 1) {
        items.push(page);
      }
    }
    return items;
  }

  items.push("ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);

  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pageItems = buildPageItems(currentPage, totalPages);

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Pagination"
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pageItems.map((item, index) => {
        if (item === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex size-9 items-center justify-center text-sm text-muted-foreground"
              aria-hidden="true"
            >
              …
            </span>
          );
        }

        const isActive = item === currentPage;

        return (
          <Button
            key={item}
            type="button"
            variant={isActive ? "default" : "outline"}
            size="icon"
            className={cn("size-9", !isActive && "border-border/80 bg-card")}
            onClick={() => onPageChange(item)}
            aria-label={`Go to page ${item}`}
            aria-current={isActive ? "page" : undefined}
          >
            {item}
          </Button>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-9"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
