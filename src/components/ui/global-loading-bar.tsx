import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";

const SHOW_DELAY_MS = 150;
const HIDE_DELAY_MS = 200;

export function GlobalLoadingBar() {
  const isNavigating = useRouterState({ select: (s) => s.status === "pending" });
  const isFetching = useIsFetching() > 0;
  const isMutating = useIsMutating() > 0;
  const active = isNavigating || isFetching || isMutating;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setVisible(false), HIDE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [active]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Carregando"
      className="fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-transparent"
    >
      <div className="h-full w-full origin-left animate-loading-bar bg-accent" />
    </div>
  );
}
