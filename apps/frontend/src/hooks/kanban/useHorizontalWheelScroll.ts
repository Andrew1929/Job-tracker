"use client";

import { useEffect, useRef } from "react";

const COLUMN_BODY_SELECTOR = "[data-kanban-column-body]";

// Multiplier applied to the wheel delta. Deliberately large so a single strong
// wheel flick carries the user across a wide board; `scroll-smooth` on the
// container eases each jump so the motion stays smooth rather than jittery.
const WHEEL_SPEED_MULTIPLIER = 4;

// Fallback pixel sizes for mice that report wheel deltas in lines/pages
// (deltaMode 1/2) rather than pixels (deltaMode 0).
const LINE_HEIGHT_PX = 16;

/**
 * Lets a horizontally-scrolling container respond to a vertical mouse wheel,
 * while still allowing an inner column to scroll vertically first when it has
 * more content in that direction. Trackpads (which emit horizontal deltas) are
 * left to the browser's native handling.
 */
export function useHorizontalWheelScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      const isVerticalWheel =
        event.deltaY !== 0 && Math.abs(event.deltaY) > Math.abs(event.deltaX);
      const canScrollHorizontally =
        container.scrollWidth > container.clientWidth;

      if (!isVerticalWheel || !canScrollHorizontally) {
        return;
      }

      const column = (event.target as HTMLElement).closest(
        COLUMN_BODY_SELECTOR,
      ) as HTMLElement | null;

      if (column && columnCanScroll(column, event.deltaY)) {
        return;
      }

      event.preventDefault();
      container.scrollLeft += resolveScrollDistance(event, container);
    };

    // A non-passive listener is required so we can call `preventDefault`.
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return ref;
}

// Converts the wheel delta into a pixel distance, normalizing line/page-based
// deltas and amplifying it so the board traverses quickly and responsively.
function resolveScrollDistance(event: WheelEvent, container: HTMLElement): number {
  let pixels = event.deltaY;

  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    pixels *= LINE_HEIGHT_PX;
  } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    pixels *= container.clientWidth;
  }

  return pixels * WHEEL_SPEED_MULTIPLIER;
}

function columnCanScroll(column: HTMLElement, deltaY: number): boolean {
  const hasOverflow = column.scrollHeight > column.clientHeight;
  if (!hasOverflow) {
    return false;
  }

  if (deltaY < 0) {
    return column.scrollTop > 0;
  }

  const maxScrollTop = column.scrollHeight - column.clientHeight;
  return Math.ceil(column.scrollTop) < maxScrollTop;
}
