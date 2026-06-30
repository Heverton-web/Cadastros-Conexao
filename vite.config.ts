import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { execSync } from "child_process";

function testRunnerPlugin(): Plugin {
  return {
    name: "test-runner",
    configureServer(server) {
      server.middlewares.use("/api/testes", async (req, res) => {
        if (req.method !== "POST" && req.method !== "OPTIONS") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");

        if (req.method === "OPTIONS") {
          res.statusCode = 200;
          res.end();
          return;
        }

        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const { testFiles } = JSON.parse(body || "{}");
            if (!testFiles || !Array.isArray(testFiles) || testFiles.length === 0) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "testFiles array required" }));
              return;
            }

            const paths = testFiles.join(" ");
            const cwd = process.cwd();
            const stdout = execSync(
              `npx vitest run ${paths} --reporter=json --no-file-parallelism`,
              { cwd, encoding: "utf-8", timeout: 120000 }
            );
            res.end(JSON.stringify({ success: true, output: stdout }));
          } catch (err: any) {
            const output = err.stdout || err.stderr || err.message;
            res.end(JSON.stringify({ success: false, output }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), testRunnerPlugin()],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'tanstack': ['@tanstack/react-router', '@tanstack/react-query'],
          'radix': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-alert-dialog'],
          'charts': ['recharts'],
        },
      },
    },
  },
});
