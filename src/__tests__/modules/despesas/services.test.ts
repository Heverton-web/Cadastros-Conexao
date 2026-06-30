import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listarMinhasDespesas, criarDespesa, atualizarDespesa, excluirDespesa } from '~/features/despesas/services/despesas.service';

vi.mock('~/core/supabase', () => {
  const mockFrom = vi.fn();
  return {
    supabase: {
      from: mockFrom,
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null }),
        onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      },
    },
  };
});

const empresaId = 'emp-123';
const usuarioId = 'user-456';

function mockQueryBuilder(overrides: Record<string, unknown> = {}) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [], error: null })),
    ...overrides,
  };
}

describe('Despesas Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listarMinhasDespesas', () => {
    it('retorna lista quando Supabase responde com dados', async () => {
      const { supabase } = await import('~/core/supabase');
      supabase.from.mockReturnValue(
        mockQueryBuilder({
          then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ id: '1', nome: 'Despesa Teste' }], error: null })),
        })
      );
      const result = await listarMinhasDespesas(empresaId, usuarioId);
      expect(result).toHaveLength(1);
    });

    it('lança erro quando Supabase falha', async () => {
      const { supabase } = await import('~/core/supabase');
      supabase.from.mockReturnValue(
        mockQueryBuilder({
          then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: null, error: new Error('DB Error') })),
        })
      );
      await expect(listarMinhasDespesas(empresaId, usuarioId)).rejects.toThrow('DB Error');
    });
  });

  describe('criarDespesa', () => {
    it('cria despesa com status rascunho', async () => {
      const { supabase } = await import('~/core/supabase');
      supabase.from.mockReturnValue(
        mockQueryBuilder({
          single: vi.fn().mockResolvedValue({ data: { id: 'new-1', status: 'rascunho' }, error: null }),
        })
      );
      const result = await criarDespesa(empresaId, usuarioId, { nome: 'Teste' });
      expect(result.status).toBe('rascunho');
    });
  });

  describe('atualizarDespesa', () => {
    it('atualiza e retorna despesa modificada', async () => {
      const { supabase } = await import('~/core/supabase');
      supabase.from.mockReturnValue(
        mockQueryBuilder({
          single: vi.fn().mockResolvedValue({ data: { id: '1', nome: 'Atualizado' }, error: null }),
        })
      );
      const result = await atualizarDespesa('1', { nome: 'Atualizado' });
      expect(result.nome).toBe('Atualizado');
    });
  });

  describe('excluirDespesa', () => {
    it('exclui sem retorno', async () => {
      const { supabase } = await import('~/core/supabase');
      supabase.from.mockReturnValue(
        mockQueryBuilder({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        })
      );
      await expect(excluirDespesa('1')).resolves.toBeUndefined();
    });
  });
});
