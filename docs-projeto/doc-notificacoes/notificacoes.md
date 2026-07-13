# Análise do Sistema de Notificações — ERP Conexão

> **Documento gerado em:** 04/07/2026

---

## 1. Visão Geral

O sistema de notificações do ERP Conexão permite criar **templates de notificação** vinculados a eventos, que disparam notificações **in-app** para usuários específicos.

---

## 2. Tabelas

### 2.1 notificacoes_templates

| Coluna | Tipo | Descrição |
|---|---|---|
| `evento` | TEXT | Evento que dispara (ex: "cadastro.aprovado") |
| `titulo` | TEXT | Título (suporta `{{variavel}}`) |
| `corpo_template` | TEXT | Mensagem (suporta `{{variavel}}`) |
| `ativo` | BOOLEAN | Se está ativo |
| `ordem` | INTEGER | Ordem no workflow |
| `destinatario_tipo` | TEXT | Quem recebe |
| `modulo_key` | TEXT | Módulo vinculado |
| `empresa_id` | UUID | FK empresas (null = global) |

### 2.2 notificacoes

| Coluna | Tipo | Descrição |
|---|---|---|
| `usuario_id` | UUID | Destinatário |
| `titulo` | TEXT | Título interpolado |
| `mensagem` | TEXT | Mensagem interpolada |
| `lida` | BOOLEAN | Se foi lida |
| `dados` | JSONB | Dados extras (ex: `{cadastro_id}`) |

---

## 3. Tipos de Destinatário

| Tipo | Descrição | Alvo |
|---|---|---|
| `consultor` | Criador do cadastro | `cadastros.created_by` |
| `cadastro` | Setor de cadastro | Todos com `ambiente = 'cadastro'` |
| `superadmin` | Super Admins | `is_super_admin = true` |
| `ti` | Equipe de TI | `ambiente = 'tecnologia'` |

---

## 4. Polling de Notificações

`AppLayout` faz polling a cada **5s**:

```typescript
// src/components/layout/AppLayout.tsx
useEffect(() => {
  const interval = setInterval(async () => {
    const data = await listarNotificacoes(profile.id);
    setNotificacoes(data);
  }, 5000);
  return () => clearInterval(interval);
}, [profile]);
```

---

## 5. Interpolação de Variáveis

Placeholders `{{variavel}}` são resolvidos dinamicamente:

```typescript
for (const [chave, valor] of Object.entries(context)) {
  const placeholder = new RegExp(`{{${chave}}}`, "g");
  tituloFinal = tituloFinal.replace(placeholder, String(valor));
  mensagemFinal = mensagemFinal.replace(placeholder, String(valor));
}
```

---

## 6. Canais de Notificação

| Canal | Implementação | Status |
|---|---|---|
| In-App (notificacoes table) | `supabase.from("notificacoes").insert(...)` | ✅ |
| WhatsApp (Evolution API) | Webhook configurado na Central de Ações | ✅ |
| E-mail (Gmail SMTP) | Webhook configurado na Central de Ações | ✅ |
| Push Notification | ❌ Não implementado | ❌ |

---

## 7. Notificações do Funis

Além do sistema global, o módulo Funis possui seu próprio sistema de notificações na tabela `funis_notifications`.

---

## 8. Configuração

- **UI**: `/empresa/acoes` (Central de Ações)
- **Quem**: Admin de Empresa ou Super Admin
