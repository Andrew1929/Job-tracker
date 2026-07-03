"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useDropdownMenu } from "@/hooks/useDropdownMenu";
import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react";

type ActionMenuItemBase = {
  id: string;
  label: string;
  icon?: LucideIcon;
};

export type ActionMenuItem = ActionMenuItemBase &
  ({ href: string } | { onSelect: () => void });

type ActionMenuProps = {
  items: readonly ActionMenuItem[];
  triggerAriaLabel: string;
  triggerClassName?: string;
};

type MenuPosition = {
  top: number;
  right: number;
};

const menuItemClassName =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

function getMenuItems(menu: HTMLDivElement): HTMLElement[] {
  return Array.from(menu.querySelectorAll('[role="menuitem"]'));
}

export function ActionMenu({
  items,
  triggerAriaLabel,
  triggerClassName,
}: ActionMenuProps) {
  const { isOpen, open, close, containerRef, triggerRef, menuRef, menuId } =
    useDropdownMenu();
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  const handleTriggerClick = () => {
    if (isOpen) {
      close();
      return;
    }

    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    setMenuPosition({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
    open();
  };

  // The menu is fixed-positioned so it escapes scroll containers (e.g. the
  // jobs table's overflow wrapper); close on scroll/resize to avoid drifting.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleReposition = () => close();

    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      const menu = menuRef.current;
      if (menu) {
        getMenuItems(menu)[0]?.focus();
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, menuRef]);

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const menu = menuRef.current;
    if (!menu) {
      return;
    }

    const menuItems = getMenuItems(menu);
    const currentIndex = menuItems.findIndex(
      (item) => item === document.activeElement,
    );

    if (event.key === "ArrowDown") {
      event.preventDefault();
      menuItems[currentIndex === -1 ? 0 : (currentIndex + 1) % menuItems.length]?.focus();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      menuItems[
        currentIndex === -1
          ? menuItems.length - 1
          : (currentIndex - 1 + menuItems.length) % menuItems.length
      ]?.focus();
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      menuItems[0]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      menuItems[menuItems.length - 1]?.focus();
    }
  };

  const handleSelect = (onSelect: () => void) => {
    close();
    triggerRef.current?.focus();
    onSelect();
  };

  return (
    <div ref={containerRef} className="relative inline-flex">
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="icon"
        className={cn("size-8 text-muted-foreground", triggerClassName)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={triggerAriaLabel}
        onClick={handleTriggerClick}
      >
        <MoreVertical />
      </Button>

      {isOpen && menuPosition ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-orientation="vertical"
          aria-label={triggerAriaLabel}
          onKeyDown={handleMenuKeyDown}
          style={{ top: menuPosition.top, right: menuPosition.right }}
          className="fixed z-50 w-44 rounded-xl border border-border/60 bg-card p-1.5 shadow-lg shadow-black/10"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                {Icon ? (
                  <Icon
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                ) : null}
                {item.label}
              </>
            );

            if ("href" in item) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  role="menuitem"
                  onClick={close}
                  className={menuItemClassName}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(item.onSelect)}
                className={menuItemClassName}
              >
                {content}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
