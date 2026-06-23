import { createRoute, Outlet } from "@tanstack/react-router";
import { authLayout } from "./_auth";

export const funisRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/funis",
  component: Outlet,
});
