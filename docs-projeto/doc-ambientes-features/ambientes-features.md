# Análise de Ambientes e Feature Toggle — ERP Conexão

> **Documento gerado em:** 04/07/2026

---

## 1. Ambientes

O ERP Conexão possui **4 ambientes** definidos na coluna `profiles.ambiente`:

| Ambiente | Descrição | Permissões |
|---|---|---|
| `cadastro` | Setor de cadastro | Acesso total a aprovações |
| `consultor` | Consultor de vendas | Gerar links, ver relatórios |
| `tecnologia` | TI / Administrativo | Gerenciar credenciais |
| `suporte` | Suporte | Apenas credenciais |

### Validação no Banco

```sql
CHECK (ambiente IN ('cadastro', 'consultor', 'tecnologia', 'ambos', 'suporte'))
```

---

## 2. Feature Toggles

### No módulo (ModuleDefinition)

```typescript
type ModuleDefinition = {
  hasCredentialScopes?: boolean;  // Credenciais com escopo
  hasLaboratorio?: boolean;       // Aba de laboratório
  hasFormulario?: boolean;        // Formulários dinâmicos
  hasCustomActions?: boolean;     // Ações customizadas
  hasApiConnectors?: boolean;     // Conectores de API
  hasDesignConfig?: boolean;      // Configuração de design
};
```

### Feature Toggles por Módulo

| Módulo | CredencialScopes | DesignConfig | ApiConnectors |
|---|---|---|---|
| Cadastros | ❌ | ✅ | ❌ |
| CRM | ❌ | ✅ | ❌ |
| Funis | ✅ | ✅ | ❌ |
| Hub | ✅ | ✅ | ❌ |
| Despesas | ✅ | ✅ | ❌ |
| NPS | ✅ | ✅ | ❌ |
| LinkTree | ✅ | ✅ | ❌ |
| Rotas | ❌ | ✅ | ❌ |
| Empresa | ❌ | ✅ | ❌ |
| Marketing | ❌ | ❌ | ❌ |
| Gerador Links | ❌ | ❌ | ❌ |

---

## 3. Módulos Ativos por Empresa

```sql
SELECT modulo_key, ativo
FROM modulos_empresa
WHERE empresa_id = $empresaId AND ativo = true;
```

---

## 4. Permission Defaults por Ambiente

Cada módulo registra `registerPermissionDefaults()` com valores específicos por ambiente:

```typescript
registerPermissionDefaults("cadastros", {
  cadastro: { /* todas true */ },
  consultor: { /* apenas gerar_links, ver_relatorios */ },
  tecnologia: { /* gerenciar_credenciais */ },
  suporte: { /* gerenciar_credenciais apenas */ },
});
```
