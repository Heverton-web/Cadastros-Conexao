import { type LucideIcon } from "lucide-react";

export type NavItemRegistration = {
  id: string;
  label: string;
  icon: LucideIcon;
  to: string;
  permissionCheck: (perms: Record<string, boolean> | null) => boolean;
  order: number;
};

const items = new Map<string, NavItemRegistration>();

export function registerNavItem(item: NavItemRegistration): void {
  if (items.has(item.id)) {
    console.warn(`NavItem "${item.id}" j? registrado — ignorando duplicata`);
    return;
  }
  items.set(item.id, item);
}

export function getNavItems(
  perms: Record<string, boolean> | null
): NavItemRegistration[] {
  return Array.from(items.values())
    .filter((item) => item.permissionCheck(perms))
    .sort((a, b) => a.order - b.order);
}
