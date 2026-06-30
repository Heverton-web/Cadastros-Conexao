import { createClient } from "@supabase/supabase-js";
const sb = createClient(
  "https://cluuqzhizeqvkgvfdisx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM",
);
const { data } = await sb
  .from("profiles")
  .select("id, email, nome, is_super_admin");
if (!data) {
  console.log("no data");
  process.exit(1);
}
data.forEach((p) =>
  console.log(
    p.is_super_admin ? ">> SUPER" : "   normal",
    p.email.padEnd(40),
    p.nome,
  ),
);
