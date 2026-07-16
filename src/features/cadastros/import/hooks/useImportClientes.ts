import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importarClientesEmLote } from "../engine/executor";
import { useAuth } from "~/lib/auth";
import type { ClienteCsvRow, ClienteImportProgress } from "../types";
import { useState } from "react";

export function useImportClientes() {
  const qc = useQueryClient();
  const { empresa } = useAuth();
  const empresaId = empresa?.id;
  const [progress, setProgress] = useState<ClienteImportProgress>({
    current: 0,
    total: 0,
    status: "idle",
  });

  const mutation = useMutation({
    mutationFn: async (rows: ClienteCsvRow[]) => {
      if (!empresaId) throw new Error("Empresa não selecionada");
      setProgress({ current: 0, total: rows.length, status: "executing" });
      const result = await importarClientesEmLote(rows, empresaId, setProgress);
      setProgress({
        current: rows.length,
        total: rows.length,
        status: result.errors.length > 0 ? "failed" : "completed",
      });
      return result;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes"] });
      qc.invalidateQueries({ queryKey: ["cadastros"] });
    },
  });

  return { ...mutation, progress };
}
