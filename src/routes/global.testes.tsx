import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useAuth } from "~/lib/auth";
import { useState, useCallback } from "react";
import {
  Shield, Play, RotateCcw, CheckCircle2, XCircle, Loader2,
  ChevronDown, ChevronRight, FileText, AlertCircle,
  Puzzle, Cable,
} from "lucide-react";
import { TEST_CATEGORIES, type TestCategory, type TestResult } from "~/lib/test-runner";

export const adminSuperTestesRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/global/testes",
  component: AdminSuperTestes,
});

type CategoryStatus = {
  status: "idle" | "running" | "done";
  result: TestResult | null;
};

function AdminSuperTestes() {
  const { profile } = useAuth();

  if (!profile?.is_super_admin) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-8">
        <div className="text-center">
          <Shield size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">Acesso restrito</h2>
          <p className="text-muted-foreground mt-2">
            Apenas Super Administradores podem acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return <TestRunnerPage />;
}

function TestRunnerPage() {
  const [categoryStates, setCategoryStates] = useState<
    Record<string, CategoryStatus>
  >({});
  const [expandedResults, setExpandedResults] = useState<
    Record<string, boolean>
  >({});
  const [globalRunning, setGlobalRunning] = useState(false);

  const setCatState = useCallback(
    (id: string, state: Partial<CategoryStatus>) => {
      setCategoryStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], status: prev[id]?.status || "idle", result: prev[id]?.result || null, ...state },
      }));
    },
    [],
  );

  async function runCategory(category: TestCategory) {
    setCatState(category.id, { status: "running" });
    try {
      const res = await fetch("/api/testes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testFiles: category.testFiles }),
      });
      const raw = await res.json();
      const parsed = parseVitestOutput(raw.output);
      setCatState(category.id, { status: "done", result: parsed });
    } catch (err: any) {
      setCatState(category.id, {
        status: "done",
        result: {
          success: false,
          numPassedTests: 0,
          numFailedTests: 0,
          numTotalTests: 0,
          testResults: [],
          output: `Erro: ${err.message}`,
        },
      });
    }
  }

  async function runAll() {
    setGlobalRunning(true);
    for (const cat of TEST_CATEGORIES) {
      await runCategory(cat);
    }
    setGlobalRunning(false);
  }

  function clearResults() {
    setCategoryStates({});
    setExpandedResults({});
  }

  return (
    <div className="min-h-dvh bg-background p-6">
      <PageHeader onRunAll={runAll} onClear={clearResults} globalRunning={globalRunning} />

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TEST_CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            state={categoryStates[cat.id] || { status: "idle", result: null }}
            onRun={() => runCategory(cat)}
            expanded={!!expandedResults[cat.id]}
            onToggleExpand={() =>
              setExpandedResults((prev) => ({
                ...prev,
                [cat.id]: !prev[cat.id],
              }))
            }
          />
        ))}
      </div>
    </div>
  );
}

function PageHeader({
  onRunAll,
  onClear,
  globalRunning,
}: {
  onRunAll: () => void;
  onClear: () => void;
  globalRunning: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Central de Testes</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Testes unitários e de integração do ERP Conexão
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClear}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent"
        >
          <RotateCcw size={16} />
          Limpar
        </button>
        <button
          onClick={onRunAll}
          disabled={globalRunning}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {globalRunning ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Play size={16} />
          )}
          Executar Todos
        </button>
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  state,
  onRun,
  expanded,
  onToggleExpand,
}: {
  category: TestCategory;
  state: CategoryStatus;
  onRun: () => void;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const Icon = getIcon(category.icon);
  const result = state.result;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-accent/10 p-2">
            <Icon size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{category.label}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {category.description}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {category.testFiles.length} arquivo(s) de teste
            </p>
          </div>
        </div>
        <StatusBadge state={state.status} result={result} />
      </div>

      <div className="flex items-center gap-2 border-t border-border px-4 py-3">
        <button
          onClick={onRun}
          disabled={state.status === "running"}
          className="flex cursor-pointer items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state.status === "running" ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Play size={13} />
          )}
          {state.status === "running" ? "Executando..." : "Executar"}
        </button>

        {result && (
          <>
            <span className="ml-auto text-xs text-muted-foreground">
              <span className="font-medium text-green-600">{result.numPassedTests}</span>/
              {result.numTotalTests} passaram
            </span>
            <button
              onClick={onToggleExpand}
              className="ml-1 flex cursor-pointer items-center text-xs text-muted-foreground hover:text-foreground"
            >
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              Detalhes
            </button>
          </>
        )}
      </div>

      {expanded && result && (
        <div className="border-t border-border p-4">
          {result.testResults.length > 0 ? (
            <ul className="space-y-2">
              {result.testResults.map((tr) => (
                <FileResult key={tr.name} result={tr} />
              ))}
            </ul>
          ) : (
            <pre className="max-h-48 overflow-auto rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              {result.output}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

function FileResult({
  result,
}: {
  result: TestResult["testResults"][0];
}) {
  const fileName = result.name.split("/").pop() || result.name;
  return (
    <li className="rounded-lg bg-muted/50 p-3">
      <div className="flex items-center gap-2">
        {result.status === "passed" ? (
          <CheckCircle2 size={14} className="text-green-600" />
        ) : (
          <XCircle size={14} className="text-red-600" />
        )}
        <span className="flex-1 text-sm font-medium text-foreground">
          {fileName}
        </span>
        <span className="text-xs text-muted-foreground">
          {result.duration}ms
        </span>
      </div>
      {result.status === "failed" && (
        <div className="mt-2 space-y-1">
          {result.failureMessage?.map((msg, i) => (
            <p key={i} className="text-xs text-red-600">
              {msg}
            </p>
          ))}
        </div>
      )}
    </li>
  );
}

function StatusBadge({
  state,
  result,
}: {
  state: string;
  result: TestResult | null;
}) {
  if (state === "running") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
        <Loader2 size={12} className="animate-spin" />
        Rodando
      </span>
    );
  }
  if (state === "done" && result) {
    if (result.success) {
      return (
        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
          <CheckCircle2 size={12} />
          OK
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
        <XCircle size={12} />
        {result.numFailedTests} falha(s)
      </span>
    );
  }
  return null;
}

function getIcon(name: string) {
  const icons: Record<string, React.ComponentType<any>> = {
    Shield, Puzzle, Cable,
  };
  return icons[name] || Shield;
}

function parseVitestOutput(raw: string): TestResult {
  try {
    const json = JSON.parse(raw);
    return {
      success: json.numFailedTests === 0,
      numPassedTests: json.numPassedTests || 0,
      numFailedTests: json.numFailedTests || 0,
      numTotalTests: json.numTotalTests || 0,
      testResults: (json.testResults || []).map((suite: any) => ({
        name: suite.name,
        status: suite.status === "passed" ? "passed" : "failed",
        duration: suite.duration || 0,
        failureMessage: suite.assertionResults
          ?.filter((a: any) => a.status === "failed")
          .map((a: any) => a.failureMessages?.[0] || a.fullName || a.title)
          .filter(Boolean) || [],
      })),
      output: raw,
    };
  } catch {
    return {
      success: false,
      numPassedTests: 0,
      numFailedTests: 0,
      numTotalTests: 0,
      testResults: [],
      output: raw,
    };
  }
}
