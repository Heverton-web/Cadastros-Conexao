import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { MetaPostsList } from "~/features/marketing/meta-bm/components/MetaPostsList";

export const marketingMetaBmPostsRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/marketing/meta-bm/posts",
  component: MetaPostsList,
});
