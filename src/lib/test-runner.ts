export type TestResult = {
  success: boolean;
  numPassedTests: number;
  numFailedTests: number;
  numTotalTests: number;
  testResults: Array<{
    name: string;
    status: "passed" | "failed";
    duration: number;
    failureMessage?: string[];
  }>;
  output: string;
};

export type TestCategory = {
  id: string;
  label: string;
  icon: string;
  description: string;
  testFiles: string[];
  moduleKeys: string[];
};

export const TEST_CATEGORIES: TestCategory[] = [
  {
    id: "super-admin",
    label: "Super Admin",
    icon: "Shield",
    description: "Permissões, módulos e navegação do Super Admin",
    testFiles: [
      "src/__tests__/super-admin/permissions.test.ts",
      "src/__tests__/super-admin/modules.test.ts",
      "src/__tests__/super-admin/navigation.test.ts",
    ],
    moduleKeys: ["permissions", "modules", "navigation"],
  },
  {
    id: "modulos",
    label: "Módulos",
    icon: "Puzzle",
    description: "Testes CRUD e permissões dos módulos do ERP",
    testFiles: [
      "src/__tests__/modules/despesas/services.test.ts",
      "src/__tests__/modules/despesas/permissions.test.ts",
    ],
    moduleKeys: ["despesas"],
  },
  {
    id: "integracoes",
    label: "Integrações",
    icon: "Cable",
    description: "APIs externas (CEP, Evolution) e conectores",
    testFiles: [
      "src/__tests__/integrations/cep.test.ts",
      "src/__tests__/integrations/evolution.test.ts",
    ],
    moduleKeys: ["integracoes"],
  },
];

export const ALL_CATEGORIES_TEST_FILES = TEST_CATEGORIES.flatMap(c => c.testFiles);
