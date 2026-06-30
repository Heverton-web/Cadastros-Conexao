import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchHubMaterials, createHubMaterial, deleteHubMaterial } from '~/features/hub/services/materials';

vi.mock('~/core/supabase/client', () => {
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

describe('Hub Services - Materials', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchHubMaterials', () => {
    it('retorna lista quando Supabase responde com dados', async () => {
      const { supabase } = await import('~/core/supabase/client');
      supabase.from.mockReturnValue(
        mockQueryBuilder({
          then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: [{ id: '1', titulo: 'Material Teste' }], error: null })),
        })
      );
      const result = await fetchHubMaterials(empresaId);
      expect(result).toHaveLength(1);
    });

    it('lança erro quando Supabase falha', async () => {
      const { supabase } = await import('~/core/supabase/client');
      supabase.from.mockReturnValue(
        mockQueryBuilder({
          then: vi.fn((resolve: (v: unknown) => void) => resolve({ data: null, error: new Error('DB Error') })),
        })
      );
      await expect(fetchHubMaterials(empresaId)).rejects.toThrow('DB Error');
    });
  });

  describe('createHubMaterial', () => {
    it('cria material e retorna com id', async () => {
      const { supabase } = await import('~/core/supabase/client');
      supabase.from.mockReturnValue(
        mockQueryBuilder({
          single: vi.fn().mockResolvedValue({ data: { id: 'new-1', titulo: 'Novo Material' }, error: null }),
        })
      );
      const result = await createHubMaterial({ titulo: 'Novo Material' });
      expect(result.id).toBe('new-1');
    });
  });

  describe('deleteHubMaterial', () => {
    it('exclui sem retorno', async () => {
      const { supabase } = await import('~/core/supabase/client');
      supabase.from.mockReturnValue(
        mockQueryBuilder({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        })
      );
      await expect(deleteHubMaterial('1')).resolves.toBeUndefined();
    });
  });
});
