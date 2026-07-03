import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cluuqzhizeqvkgvfdisx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdXVxemhpemVxdmtndmZkaXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODg3NjksImV4cCI6MjA5NzM2NDc2OX0.GM3quHA1z_9kCiMEYsfAh9Pi0KVdnCIFQEYe-wwE9MM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function promote() {
  const { error: loginErr } = await supabase.auth.signInWithPassword({
    email: "hevertoneduardoperes@gmail.com",
    password: "@#Khen741963",
  });
  if (loginErr) { console.error("Login failed:", loginErr.message); return; }
  console.log("Logged in as super admin");

  const { data: users, error: usersErr } = await supabase
    .from("profiles")
    .select("id, email, role, ambiente")
    .eq("email", "cadastro@conexao.com.br");
  if (usersErr) { console.error("Query failed:", usersErr.message); return; }
  if (!users?.length) { console.log("User not found in profiles"); return; }
  console.log("Found profile:", JSON.stringify(users[0]));

  const { error: updateErr } = await supabase
    .from("profiles")
    .update({ role: "admin", ambiente: "cadastro" })
    .eq("email", "cadastro@conexao.com.br");
  if (updateErr) { console.error("Profile update failed:", updateErr.message); return; }
  console.log("Profile updated to role=admin, ambiente=cadastro");

  const { data: mocks, error: mockQueryErr } = await supabase
    .from("mock_credentials")
    .select("id, email, role, ambiente")
    .eq("email", "cadastro@conexao.com.br");
  if (mockQueryErr) { console.error("Mock query failed:", mockQueryErr.message); return; }
  console.log("Found mock:", mocks ? JSON.stringify(mocks[0]) : "none");

  const { error: mockErr } = await supabase
    .from("mock_credentials")
    .update({ role: "admin" })
    .eq("email", "cadastro@conexao.com.br");
  if (mockErr) { console.error("Mock update failed:", mockErr.message); return; }
  console.log("Mock credential updated to role=admin");
}

promote().catch(console.error);
