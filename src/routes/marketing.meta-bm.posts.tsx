import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { PageHeader } from "~/components/ui/page-header";
import { EmptyState } from "~/components/ui/empty-state";
import { PenLine } from "lucide-react";

function PostsList() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Posts Meta" description="Gerencie seus posts no Facebook e Instagram" />
      <EmptyState icon={PenLine} title="Posts" description="Crie e agende posts para suas redes sociais." />
    </div>
  );
}

export const marketingMetaBmPostsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/meta-bm/posts",
  component: PostsList,
});
