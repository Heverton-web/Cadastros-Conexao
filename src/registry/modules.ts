import type { LucideIcon } from "lucide-react";

export type ModuleAba = {
  key: string;
  label: string;
  descricao?: string;
};

export type ModuleEvent = {
  key: string;
  label: string;
  descricao: string;
};

export type ModuleDefinition = {
  key: string;
  nome: string;
  descricao: string;
  icon: LucideIcon;
  routes: string[];
  ambientes: string[];
  abas: ModuleAba[];
  permissions: string[];
  events: ModuleEvent[];
  hasCredentialScopes?: boolean;
  hasLaboratorio?: boolean;
  hasFormulario?: boolean;
  hasCustomActions?: boolean;
  hasApiConnectors?: boolean;
  setup?: () => void;
};

const moduleRegistry = new Map<string, ModuleDefinition>();

export function registerModule(mod: ModuleDefinition): void {
  if (moduleRegistry.has(mod.key)) return;
  moduleRegistry.set(mod.key, mod);
}

export function getModule(key: string): ModuleDefinition | undefined {
  return moduleRegistry.get(key);
}

export function getAllModules(): ModuleDefinition[] {
  return Array.from(moduleRegistry.values());
}

export function getModuleKeys(): string[] {
  return Array.from(moduleRegistry.keys());
}
