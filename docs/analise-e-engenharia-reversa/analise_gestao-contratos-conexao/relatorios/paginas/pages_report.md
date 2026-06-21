# Páginas

**Projeto:** gestao-contratos-conexao
**Total de Páginas:** 19

---

## Resumo Geral

| Tipo | Quantidade | Páginas |
|------|------------|---------|
| **Autenticação** | 2 | index, reset_pw |
| **Administrativas** | 5 | consultor, cadastro, pre_cadastro, credenciais, super_admin |
| **Landing Pages** | 9 | lp_evento, lp_evento_vip, lp_evento_es, lp_evento_pt, lp_cadastro, lp_obrigado, lp_evento_lista, lp_evento_lista_giselma |
| **Utilitárias** | 3 | encurtar_link_evento, linktree, 404 |
| **Teste** | 1 | teste |

---

## Página: index
**ID:** bTHFf | **Type:** Page
**Title:** Login | Conexão Implantes

### Elementos (34)
- Image A (logo), Text login-title ("Entrar na Plataforma"), Text login-subtitle
- Input login-email, Input login-password, Button login-submit ("Entrar")
- Text "Usuário inativo" (condicional, visível se CurrentUser.c__ativo__boolean = false)
- Text "Deseja redefinir sua senha? Clique Aqui" (com link)
- **Popups:** POPUP - INATIVO, POPUP - CONTA NÃO ENCONTRADA, POPUP - ERROS, POPUP - RESETE SENHA, CARREGANDO

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked (login-submit) | LogOutOtherSessions → LogIn → Search (email + ativo) → ChangePage (consultor) |
| ButtonClicked (login-submit, super_admin) | ChangePage (super_admin) |
| ButtonClicked (login-submit, tipo_de_credencial=Vendas) | ChangePage (consultor) |
| ButtonClicked (login-submit, tipo_de_credencial=Cadastro) | ChangePage (cadastro) |
| ButtonClicked (login-submit, tipo_de_credencial=Tecnologia) | ChangePage (credenciais) |
| Various show/hide | Popup management for inactive, not found, errors, reset password |

### Fluxo de Login
1. Usuário insere email + senha
2. Sistema busca usuário com `email_equals` + `ativo=true`
3. LogOutOtherSessions → LogIn
4. Roteamento condicional por `tipo_de_credencial`:
   - Vendas → consultor
   - Cadastro → cadastro
   - Tecnologia → credenciais
   - Super Admin → super_admin

---

## Página: consultor
**ID:** bTHHP | **Type:** Page
**Title:** Consultor

### Elementos (148)
- Dashboard cards com estatísticas (totais, pendentes, etc.)
- [GR] Lista Principal, [GR] Dados do Cliente
- POPUP - Gerar link, Popup cadastro-details-popup
- POPUP - Link compartilhado, POPUP - Link copiado
- CARREGANDO, REMOVER BARRA DE ROLAGEM
- TUTORIAIS

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked (status filters) | SetCustomState (custom.status_) |
| ButtonClicked (BTN SHARE LINK) | NewThing cliente → ChangeThing → OpenURL WhatsApp → Show popup |
| ButtonClicked (logout) | LogOut → ChangePage (index) |
| PageLoaded | DeleteListOfThings → PauseWFClient → HideElement loading |
| ButtonClicked (EXCLUIR) | DeleteListOfThings (7 tipos) + API connector |
| ButtonClicked (FILTRO) | ResetGroup → ShowElement |
| ButtonClicked (super admin) | ChangePage (super_admin) |

---

## Página: cadastro
**ID:** bTIxd | **Type:** Page

### Elementos (118)
- MAIN, Group main-header
- CONSULTAS tab, RELATÓRIOS tab
- [GR] Cadastros PF/PJ
- 10 Popups: Dados do Cliente, Revisar Dados, Visualizar Documentos, DEVICES, Aprovação Cadastro, Sucesso, Descrição Correção/Reprovação, Confirmação de Download, DELETAR CADASTRO, CARREGANDO

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked (BTN REVISAR) | ChangeThing → DisplayGroupData → Show popup |
| ButtonClicked (BTN APROVAR) | ChangeThing → API connector → SendEmail |
| ButtonClicked (CORREÇÃO/REPROVAÇÃO) | ResetGroup → DisplayGroupData → SetCustomState → Show popup |
| ButtonClicked (AÇÃO: Buscar CRO) | API connector → NewThing (buscas_cro) |
| ButtonClicked (AÇÃO: Deletar Cadastro) | DeleteThing (5 tipos) |
| ButtonClicked (status filters) | SetCustomState (custom.status_) |
| PageLoaded | PauseWFClient → HideElement loading |
| LoggedOut | ChangePage (index) |

---

## Página: pre_cadastro
**ID:** bTJzd | **Type:** Page

### Elementos (89)
- main, Group main-header
- 11 Popups: success, Visualizar Documentos, Cadastro Existente, DEVICES, VALIDADOR DE CPF/CNPJ, TOKEN DE VERIFICAÇÃO, TOKEN INVALIDO, TOKEN EXPIRADO, TOKEN REENVIADO, LINK INCORRETO OU EXPIRADO, CARREGANDO

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked (PESSOA FÍSICA) | NewThing (_pf__clientes, endere_os, documentos) → API → Show success |
| ButtonClicked (PESSOA JURÍDICA) | NewThing (clientes, endere_os, documentos) → API → Show success |
| ButtonClicked (AÇÃO: Buscar endereço) | API (CEP) |
| ButtonClicked (AÇÃO: Envia token) | ChangeThing → API → SendEmail → Show token popup |
| ButtonClicked (AÇÃO: Token Válido) | SetCustomState → ChangeThing |
| ButtonClicked (AÇÃO: Token Inválido) | Show TOKEN INVALIDO |
| ButtonClicked (AÇÃO: Token Expirado) | Show TOKEN EXPIRADO |
| ButtonClicked (AÇÃO: Reenviar Token) | ChangeThing → API → SendEmail → Show TOKEN REENVIADO |

---

## Página: super_admin
**ID:** bTLpx | **Type:** Page

### Elementos (44)
- [GR] Usuários (repeating group)
- Filters: Departamento, Status, Nome (dropdowns)
- HTML A element
- Popups reutilizados: CARREGANDO, POPUP - INATIVO, POPUP - CONTA NÃO ENCONTRADA

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked (navegação) | ChangePage (consultor/cadastro/credenciais) |
| ButtonClicked (sair) | ChangePage (index) |
| ButtonClicked (reset filters) | ResetGroup |

---

## Página: credenciais
**ID:** bTHTz | **Type:** Page

### Elementos (34)
- MAIN, [G] HEADER
- POPUP - Cadastrar Colaborador
- REMOVER BARRA DE ROLAGEM

---

## Página: reset_pw
**ID:** AAL | **Type:** Page

### Elementos (9)
- Card Reset Password, Text Header ("Redefinir Senha")
- Input Password, Input Confirm Password
- Button "Redefinir"

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked (Redefinir) | ResetPassword → ChangePage |

---

## Página: lp_evento
**ID:** bTMrN | **Type:** Page

### Elementos (94)
- HERO, DATA LOCAL INVESTIMENTO, PRESENTES, FRASE
- LOGOS 01/02, LOGICA 01/02, MESTRES, BENEFICIOS, FAC
- FloatingGroup A (CTA flutuante)
- Múltiplas imagens (logos, fotos de mestres/palestrantes)
- CARREGANDO..., Popup A/B

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked (CTA) | ChangePage (lp_cadastro) |
| ButtonClicked (floating CTA) | Show loading → Pause 1500 → ChangePage (lp_cadastro) |
| ButtonClicked (FAQ) | ToggleElement (expand/retrai resposta) |

---

## Página: lp_cadastro
**ID:** bTNGx | **Type:** Page

### Elementos (52)
- HEAD, BODY, FOOTER sections
- Input cad_email, Input cad_socio (RadioButtons)
- Campos CPF, CELULAR (custom)
- Button submit, Image A
- CARREGANDO..., Popup A/B

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked (submit) | NewThing (evento_vip) → API connector → OpenURL |

---

## Página: lp_evento_vip
**ID:** bTNpw | **Type:** Page

### Elementos (135)
- HERO, DATA LOCAL, PRESENTES, FRASE, LOGOS, MESTRES, BENEFICIOS, FAC
- Formulário de confirmação (vip_email, vip_cpf, NOME, WHATS, CIDADE, EMAIL)
- Floating CTA, Submit button
- CARREGANDO..., POPUP - Confirmação de Download

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked (Cadastrar cliente VIP) | NewThing (evento_vip) → API → Pause → Show confirmation |
| ButtonClicked (FAQ) | ToggleElement |
| ButtonClicked (hero CTA) | ScrollToElement (form) |

---

## Página: lp_evento_es
**ID:** bTOhV | **Type:** Page
**Idioma:** Espanhol

### Elementos (60)
- HERO, DATA LOCAL, LOGOS
- INSCRIÇÃO (popup), formulário em espanhol
- CARREGANDO..., POPUP - Confirmação de Download

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked (Cadastrar VIP) | NewThing (evento) → API → Pause → Show confirmation |
| ButtonClicked (open inscricao) | ShowElement popup |

---

## Página: lp_evento_pt
**ID:** bTPCu | **Type:** Page
**Idioma:** Português

### Elementos (60)
- Estrutura idêntica a lp_evento_es, labels em português

### Workflows
(Mesmos workflows de lp_evento_es)

---

## Página: lp_evento_lista
**ID:** bTOTM | **Type:** Page

### Elementos (37)
- [GR] lista_inscritos, filtros (tag, nome)
- Group evento, Icones
- Popup A

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked (filter CONEXÃO/APCD/LEAD) | SetCustomState |
| ButtonClicked (Baixar lista) | download action |
| ButtonClicked (confirmar) | ChangeThing |

---

## Página: lp_evento_lista_giselma
**ID:** bTNxh | **Type:** Page

### Elementos (50)
- SORTEIO, NOME e CPF display
- [GR] lista_inscritos, filtros
- FloatingGroup A
- CARREGANDO

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked (Confirmar presença) | ChangeThing → API |
| ButtonClicked (Baixar lista) | download action |

---

## Página: encurtar_link_evento
**ID:** bTOJD | **Type:** Page

### Elementos (9)
- URL dropdown, Button encurtar, URL encurtada display

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked | API connector (shorten URL) → DisplayGroupData |

---

## Página: linktree
**ID:** bTOLl | **Type:** Page

### Elementos (15)
- Cabeçalho, Corpo, Rodapé
- Image A, SAC, INSTAGRAM, LINKEDIN, YOUTUBE, SITE, IMERSÃO, TELEVENDAS

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked (8x) | OpenURL (links externos: WhatsApp, Instagram, LinkedIn, YouTube, Site, Televendas, Imersão, SAC) |

---

## Página: lp_obrigado
**ID:** bTOPJ | **Type:** Page

### Elementos (6)
- Group A, popup-header, icon-container
- Icon check-circle, Title ("Obrigado!"), Subtitle

---

## Página: teste
**ID:** bTMHT | **Type:** Page

### Elementos (13)
- Button, Input email, [GR] Cadastros, CreateFile, HTML, Popups

### Workflows
| Trigger | Ações |
|---------|-------|
| ButtonClicked | API connector → CreateFile |
| ButtonClicked | download action |

---

## Página: 404
**ID:** AAU | **Type:** Page

### Elementos (3)
- Text "Oops! 404 error", Text description
