# Manual Técnico — md-to-pdf

> Conversor de Markdown para PDF com interface gráfica (Electron) e CLI.  
> **Versão:** 1.0.0 | **Plataforma:** Windows/Linux x64 | **Node:** ≥ 18

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Tecnologias](#2-tecnologias)
3. [Arquitetura](#3-arquitetura)
4. [Estrutura de Arquivos](#4-estrutura-de-arquivos)
5. [Pipeline de Conversão](#5-pipeline-de-conversão)
6. [Processo Main (Electron)](#6-processo-main-electron)
7. [Preload e IPC Bridge](#7-preload-e-ipc-bridge)
8. [Interface Gráfica (Renderer)](#8-interface-gráfica-renderer)
9. [CLI](#9-cli)
10. [Design System](#10-design-system)
11. [Build e Empacotamento](#11-build-e-empacotamento)
12. [Scripts NPM](#12-scripts-npm)
13. [Configuração do PDF](#13-configuração-do-pdf)
14. [Saída dos Arquivos](#14-saída-dos-arquivos)
15. [Dependências](#15-dependências)
16. [Fluxo de Dados](#16-fluxo-de-dados)

---

## 1. Visão Geral

O **md-to-pdf** é uma aplicação desktop (Electron) e CLI que converte arquivos `.md` (Markdown) em PDF com alta fidelidade tipográfica. Suporta:

- **Syntax highlighting** em blocos de código (via `highlight.js`)
- **Tabelas** estilizadas com zebra-striping
- **Imagens locais** embutidas como Base64 no PDF
- **Links** com URL impressa automaticamente
- **Múltiplos arquivos** em batch com progresso em tempo real
- **Configurações**: tamanho do papel, orientação, margens, título

### Modos de uso

| Modo | Trigger | Saída |
|------|---------|-------|
| GUI (Electron) | Abre o app | PDF em `~/Documents/md-to-pdf-conversoes/<nome>/` |
| CLI | `node dist/cli.js <arquivo.md>` | PDF em `conversoes/proj-<nome>/` |

---

## 2. Tecnologias

| Camada | Tecnologia | Versão | Papel |
|--------|-----------|--------|-------|
| Runtime desktop | **Electron** | ^43.0 | Shell nativo + IPC |
| Renderer UI | **React** | ^19.2 | Interface gráfica |
| Build renderer | **Vite** | ^8.1 + `@vitejs/plugin-react` | Bundle do frontend |
| Conversão MD→HTML | **marked** | ^12.0 | Parser Markdown |
| Syntax highlight | **marked-highlight** + **highlight.js** | ^2.1 / ^11.9 | Colorização de código |
| Renderização PDF | **Playwright (Chromium)** | ^1.44 | Headless browser → PDF |
| CLI | **commander** | ^12.0 | Parser de argumentos |
| Build core/CLI | **tsup** | ^8.1 | Bundle ESM do core |
| Linguagem | **TypeScript** | ^5.4 | Todo o projeto |
| Empacotamento | **electron-builder** | ^26.15 | Instalador/executável |

---

## 3. Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    ELECTRON APP                         │
│                                                         │
│  ┌──────────────┐    IPC     ┌──────────────────────┐  │
│  │   RENDERER   │◄──────────►│   MAIN PROCESS       │  │
│  │  (React/Vite)│            │  (electron/main.cjs) │  │
│  │              │            │                      │  │
│  │  - Dropzone  │  invoke()  │  - BrowserWindow     │  │
│  │  - FileList  │  send()    │  - ipcMain.handle()  │  │
│  │  - Config    │            │  - pathToFileURL()   │  │
│  │  - Output    │            │  - fs.mkdirSync()    │  │
│  └──────┬───────┘            └──────────┬───────────┘  │
│         │                               │               │
│  ┌──────▼───────┐            ┌──────────▼───────────┐  │
│  │   PRELOAD    │            │    CORE LIBRARY       │  │
│  │ (preload.cjs)│            │   (dist/convert.js)  │  │
│  │contextBridge │            │                      │  │
│  │window.mdToPdf│            │  markdownToHtml()    │  │
│  └──────────────┘            │  buildPdfHtml()      │  │
│                               │  Playwright.launch() │  │
│                               └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘

┌───────────────────────────────┐
│          CLI MODE             │
│  node dist/cli.js input.md   │
│  → commander parse args       │
│  → convertMarkdownToPdf()     │
│  → PDF salvo em conversoes/   │
└───────────────────────────────┘
```

### Separação de processos (Electron)

O Electron usa dois processos isolados por segurança:

- **Main Process** (`electron/main.cjs`): acesso ao Node.js, filesystem, Playwright. Roda em CJS para compatibilidade com `require()` nativo.
- **Renderer Process** (`renderer/`): UI React isolada, sem acesso direto ao Node. Comunicação apenas via `contextBridge`.
- **Preload** (`electron/preload.cjs`): ponte segura que expõe API limitada (`window.mdToPdf`) ao renderer via `contextBridge.exposeInMainWorld`.

---

## 4. Estrutura de Arquivos

```
md-to-pdf/
├── electron/
│   ├── main.cjs          # Main process (CJS) — janela + IPC handlers
│   ├── main.ts           # Versão TypeScript (referência, não usada em prod)
│   ├── preload.cjs       # Bridge contextBridge → window.mdToPdf
│   └── preload.ts        # Versão TypeScript (referência)
│
├── src/                  # Core library (compilado para dist/)
│   ├── cli.ts            # Entry point CLI (commander)
│   ├── convert.ts        # Orquestrador: MD → HTML → PDF via Playwright
│   ├── markdown-to-html.ts # Markdown parser + embed imagens Base64
│   ├── pdf-template.ts   # Template HTML/CSS completo do PDF
│   └── types.ts          # Interface ConvertOptions
│
├── renderer/             # Frontend React (compilado para dist-renderer/)
│   ├── index.html        # Entry HTML (carrega Google Font Inter)
│   ├── index.css         # Design system: CSS vars dark mode
│   ├── main.tsx          # ReactDOM.createRoot entry
│   ├── App.tsx           # Componente raiz: estado global + orquestração
│   ├── types.ts          # QueuedFile, ConvertOptions, MdToPdfApi (window)
│   └── components/
│       ├── FileDropzone.tsx   # Drag & drop + input file
│       ├── FileList.tsx       # Lista de arquivos com status/badges
│       ├── ConfigPanel.tsx    # Formulário de opções PDF
│       ├── ConvertButton.tsx  # Botão converter + progress bar
│       ├── OutputPanel.tsx    # Links "Abrir pasta" pós-conversão
│       └── PreviewPanel.tsx   # Preview do PDF gerado (webview)
│
├── dist/                 # Core compilado (tsup ESM)
│   ├── convert.js        # Re-export de chunk-*.js
│   ├── cli.js            # CLI compilado
│   └── chunk-*.js        # Chunks gerados pelo tsup
│
├── dist-renderer/        # Frontend compilado (Vite)
│   └── index.html + assets/
│
├── build-output/         # Saída do electron-builder (app empacotado)
├── conversoes/           # PDFs gerados pelo CLI
├── electron-builder.yml  # Config empacotamento
├── package.json          # Dependências + scripts
├── tsconfig.json         # TypeScript config
└── vite.config.ts        # Vite config (root: renderer/)
```

---

## 5. Pipeline de Conversão

```
arquivo.md
    │
    ▼
readFileSync(inputPath)           ← lê conteúdo bruto
    │
    ▼
markdownToHtml(mdContent, baseDir)
    ├── marked.parse()            ← MD → HTML (com marked-highlight)
    │   └── hljs.highlight()     ← syntax highlight por linguagem
    └── resolveImages(html)      ← img src local → data:image/xxx;base64,...
    │
    ▼
buildPdfHtml(htmlContent, options)
    ├── título + header estilizado
    ├── CSS embutido (tipografia, tabelas, código, links, @page)
    └── footer com data de geração
    │
    ▼
playwright.chromium.launch()
    ├── page.setContent(fullHtml, { waitUntil: 'networkidle' })
    └── page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true,
            margin: { top, right, bottom, left }
        })
    │
    ▼
browser.close()
    │
    ▼
retorna outputPath (string)
```

---

## 6. Processo Main (Electron)

**Arquivo:** `electron/main.cjs`

### BrowserWindow

```js
new BrowserWindow({
  width: 1100, height: 760,
  webPreferences: {
    preload: 'electron/preload.cjs',
    contextIsolation: true,   // segurança: renderer isolado
    nodeIntegration: false,   // sem acesso Node no renderer
  }
})
```

Em **dev**: carrega `http://localhost:5173` (Vite dev server).  
Em **prod**: carrega `dist-renderer/index.html` (arquivo local).

### IPC Handlers

| Canal | Direção | Payload | Retorno |
|-------|---------|---------|---------|
| `convert:file` | renderer → main | `(inputPath, options)` | `outputPath` string |
| `convert:batch` | renderer → main | `(files[], options)` | `string[]` (paths ou `ERRO:...`) |
| `convert:progress` | main → renderer | `(file, percent)` | — evento push |
| `shell:openFolder` | renderer → main | `(filePath)` | — |

### Resolução de caminho — fix Windows

```js
// PROBLEMA: backslash persiste no Windows com replace simples
path.join(__dirname, '..', 'dist', 'convert.js').replace(/\\/g, '/')
// → "C:\dist\convert.js"  ← ERRADO

// SOLUÇÃO: pathToFileURL garante URL válida em qualquer SO
const { pathToFileURL } = require('url')
const convertUrl = pathToFileURL(convertPath).href
// → "file:///C:/dist/convert.js"  ← CORRETO
const mod = await import(convertUrl)
```

### Saída dos PDFs

```
~/Documents/md-to-pdf-conversoes/
└── <nome-arquivo-sanitizado>/
    └── <nome-arquivo-sanitizado>.pdf
```

---

## 7. Preload e IPC Bridge

**Arquivo:** `electron/preload.cjs`

Expõe `window.mdToPdf` ao renderer com 4 métodos seguros:

```typescript
interface MdToPdfApi {
  // Converte 1 arquivo
  convertFile(inputPath: string, options: ConvertOptions): Promise<string>

  // Converte N arquivos em batch
  batchConvert(files: string[], options: ConvertOptions): Promise<string[]>

  // Escuta eventos de progresso — retorna cleanup fn
  onProgress(callback: (file: string, percent: number) => void): () => void

  // Abre pasta no Explorer/Finder
  openInFolder(filePath: string): Promise<void>
}
```

---

## 8. Interface Gráfica (Renderer)

### Estado global — `App.tsx`

```typescript
const [files, setFiles]         // QueuedFile[] — fila de arquivos
const [options, setOptions]     // ConvertOptions — configurações PDF
const [isConverting, ...]       // boolean — lock de conversão
const [progress, ...]           // number 0-100
const [previewPath, ...]        // string | null — PDF para preview
```

### Fluxo da UI

```
FileDropzone → onFilesSelected()
    └── setFiles([...prev, ...novos])   (dedup por path)

ConvertButton → handleConvert()
    ├── window.mdToPdf.batchConvert(paths, options)
    ├── setFiles(status: 'converting')
    ├── onProgress → setProgress(pct)
    └── results → setFiles(status: 'done' | 'error')

OutputPanel → onOpenFolder(outputPath)
    └── window.mdToPdf.openInFolder()
        └── shell.showItemInFolder()
```

### Componentes

| Componente | Responsabilidade |
|-----------|-----------------|
| `FileDropzone` | Drag & drop + input `type=file`, filtra `.md`, emite `{ path, name, size }[]` |
| `FileList` | Renderiza fila com badges de status (pending/converting/done/error) + botão remover |
| `ConfigPanel` | Inputs: título, tamanho papel, orientação, margens (grid 4 colunas) |
| `ConvertButton` | Botão principal com gradiente + barra de progresso animada |
| `OutputPanel` | Lista PDFs gerados com botão "Abrir pasta" |
| `PreviewPanel` | Webview/iframe para preview do PDF (opcional) |

---

## 9. CLI

**Arquivo:** `src/cli.ts` → compilado em `dist/cli.js`

```bash
# Uso básico
node dist/cli.js input.md

# Com todas as opções
node dist/cli.js documento.md \
  --title "Meu Documento" \
  --page-size A4 \
  --landscape \
  --margin-top 3cm \
  --margin-right 2cm \
  --margin-bottom 2cm \
  --margin-left 2cm \
  --proj meu-projeto
```

### Opções CLI

| Flag | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `<input>` | positional | — | Caminho do `.md` (obrigatório) |
| `-p, --proj` | string | nome do arquivo | Nome da pasta de saída |
| `-t, --title` | string | auto (Pascal Case) | Título do documento |
| `--page-size` | A4/Letter/Legal | `A4` | Formato do papel |
| `--landscape` | boolean flag | `false` | Orientação paisagem |
| `--margin-top` | string | `2cm` | Margem superior |
| `--margin-right` | string | `2cm` | Margem direita |
| `--margin-bottom` | string | `2cm` | Margem inferior |
| `--margin-left` | string | `2cm` | Margem esquerda |

**Saída:** `conversoes/proj-<nome>/<nome>.pdf`

---

## 10. Design System

**Arquivo:** `renderer/index.css`

### Tokens CSS (dark mode)

```css
:root {
  --bg: #0f1117;             /* fundo principal */
  --surface: #1a1d27;        /* cards e painéis */
  --surface2: #22263a;       /* inputs e itens de lista */
  --border: #2e3248;         /* bordas padrão */
  --border-hover: #4a5080;   /* bordas em hover */
  --accent: #6c63ff;         /* roxo primário */
  --accent-glow: rgba(108,99,255,0.25);
  --accent2: #a78bfa;        /* roxo claro (gradientes) */
  --success: #22c55e;
  --error: #ef4444;
  --warn: #f59e0b;
  --text: #e2e8f0;           /* texto principal */
  --text-muted: #8892b0;     /* texto secundário */
  --text-dim: #4a5568;       /* texto desabilitado */
}
```

### Classes utilitárias

| Classe | Uso |
|--------|-----|
| `.app` | Container principal (max-width 820px, flex column, gap 20px) |
| `.card` | Surface com border e border-radius |
| `.dropzone` / `.dropzone.dragging` | Zona de drop (accent ao arrastar) |
| `.filelist-item` | Item da fila de arquivos |
| `.badge-pending/converting/done/error` | Badges de status coloridos |
| `.form-input` / `.form-select` | Inputs (focus ring com --accent-glow) |
| `.row-2` / `.row-4` | Grids de 2 ou 4 colunas |
| `.btn-convert` | Botão principal com gradiente + glow + hover lift |
| `.btn-remove` | Botão × (vira vermelho no hover) |
| `.btn-link` | Link-button transparente |
| `.progress-bar` / `.progress-fill` | Barra de progresso gradiente |
| `.spinner` | Spinner CSS puro (border + animation: spin) |

### Tipografia

- **Fonte:** Inter (Google Fonts) — carregada via `<link>` no `index.html`
- **Fallback:** `-apple-system, BlinkMacSystemFont, sans-serif`
- **Base:** 14px / line-height 1.5 / `-webkit-font-smoothing: antialiased`

---

## 11. Build e Empacotamento

### Fluxo de build completo

```
npm run build
├── tsup (build:cli)
│   └── src/*.ts → dist/*.js (formato ESM, .d.ts gerado)
└── vite build (build:renderer)
    └── renderer/ → dist-renderer/

npm run dist
├── npm run build
└── electron-builder
    ├── empacota: electron/ + dist-renderer/ + dist/ + node_modules/
    ├── asar: true (arquivo comprimido único)
    └── saída: build-output/
```

### `electron-builder.yml` anotado

```yaml
appId: com.md-to-pdf.app
productName: md-to-pdf
directories:
  output: build-output       # pasta de saída do build
files:
  - electron/**/*            # main.cjs + preload.cjs
  - dist-renderer/**/*       # React compilado
  - node_modules/**/*        # dependências (inclui Playwright)
  - src/**/*                 # fontes originais (acesso runtime)
  - package.json
asar: true                   # comprime em arquivo .asar
win:
  target:
    - target: dir            # gera pasta portátil (não instalador NSIS)
      arch: [x64]
extraMetadata:
  main: electron/main.cjs   # entry point do Electron
```

> **Para gerar instalador `.exe` (NSIS):** altere `target: dir` para `target: nsis`.

### `vite.config.ts`

```typescript
defineConfig({
  plugins: [react()],
  root: 'renderer',       // raiz do frontend
  base: './',             // paths relativos (obrigatório para Electron file://)
  build: {
    outDir: '../dist-renderer',
    emptyOutDir: true,
  }
})
```

---

## 12. Scripts NPM

| Script | Comando completo | Descrição |
|--------|-----------------|-----------|
| `dev` | `concurrently "dev:renderer" "dev:electron"` | Dev completo com HMR |
| `dev:renderer` | `vite --port 5173 --strictPort` | Vite dev server |
| `dev:electron` | `wait-on http://localhost:5173 && cross-env NODE_ENV=development electron .` | Electron após Vite |
| `build` | `build:cli && build:renderer` | Build de produção |
| `build:cli` | `tsup src/cli.ts src/convert.ts ... --format esm --clean --dts` | Compila core + CLI |
| `build:renderer` | `vite build` | Compila frontend React |
| `dist` | `build && electron-builder` | Gera app empacotado |
| `pdf` | `tsx src/cli.ts` | CLI em dev (sem compilar) |
| `start` | `node dist/cli.js` | Executa CLI compilado |

---

## 13. Configuração do PDF

### Interface `ConvertOptions`

```typescript
// src/types.ts
interface ConvertOptions {
  inputPath: string          // caminho absoluto do .md
  outputPath: string         // caminho absoluto de saída .pdf
  cssPath?: string           // CSS adicional (futuro)
  title?: string             // título (header + <title> HTML)
  margin?: {
    top?: string             // ex: "2cm", "1in", "20px"
    right?: string
    bottom?: string
    left?: string
  }
  pageSize?: 'A4' | 'Letter' | 'Legal'
  landscape?: boolean
}
```

### CSS embutido no PDF (`pdf-template.ts`)

- `@page { margin; size }` — margens e formato do papel
- `@page :first { margin-top: 3cm }` — mais espaço na primeira página
- `page-break-before: avoid` em todos os headings (h1–h6)
- `page-break-inside: avoid` em tabelas e blocos `<pre>`
- `hr` → `page-break-after: always` (nova página forçada)
- `a::after { content: " (" attr(href) ")" }` — imprime a URL dos links
- Fontes de sistema: Segoe UI / DejaVu Sans / Noto Sans
- Código: Cascadia Code / Fira Code / JetBrains Mono
- Tema de código dark: fundo `#1e1e2e` (inspirado Catppuccin Mocha)

### Embedding de imagens locais

```typescript
// markdown-to-html.ts
function resolveImages(html: string, baseDir: string): string {
  return html.replace(/<img([^>]+)src="([^"]+)"([^>]*)>/g,
    (_match, before, src, after) => {
      if (src.startsWith('http') || src.startsWith('data:')) return _match
      const absolutePath = isAbsolute(src) ? src : resolve(baseDir, src)
      const imgBuffer = readFileSync(absolutePath)
      const base64 = imgBuffer.toString('base64')
      return `<img${before}src="data:image/png;base64,${base64}"${after}>`
    }
  )
}
```

Converte imagens locais para `data:image/...;base64,...` garantindo que apareçam no PDF sem servidor web.

---

## 14. Saída dos Arquivos

### Modo GUI (Electron)

```
C:\Users\<user>\Documents\
└── md-to-pdf-conversoes\
    └── <nome-sanitizado>\        ← basename sem .md, só [a-zA-Z0-9_-]
        └── <nome-sanitizado>.pdf
```

### Modo CLI

```
md-to-pdf/
└── conversoes/
    └── proj-<nome>\
        └── <nome>.pdf
```

---

## 15. Dependências

### Produção (`dependencies`)

| Pacote | Versão | Função |
|--------|--------|--------|
| `playwright` | ^1.44 | Headless Chromium — geração de PDF via `page.pdf()` |
| `marked` | ^12.0 | Parser Markdown → HTML |
| `marked-highlight` | ^2.1 | Plugin syntax highlight para marked |
| `highlight.js` | ^11.9 | Colorização (180+ linguagens) |
| `commander` | ^12.0 | Framework CLI |

### Dev / Build (`devDependencies`)

| Pacote | Versão | Função |
|--------|--------|--------|
| `electron` | ^43.0 | Shell desktop multiplataforma |
| `electron-builder` | ^26.15 | Empacotamento + instalador |
| `vite` | ^8.1 | Dev server + build |
| `@vitejs/plugin-react` | ^6.0 | HMR React no Vite |
| `react` / `react-dom` | ^19.2 | UI framework |
| `tsup` | ^8.1 | Bundle TypeScript → ESM |
| `tsx` | ^4.11 | Executa `.ts` diretamente (dev) |
| `concurrently` | ^10.0 | Múltiplos scripts em paralelo |
| `cross-env` | ^10.1 | `NODE_ENV` cross-platform |
| `wait-on` | ^9.0 | Aguarda serviço antes de iniciar |
| `typescript` | ^5.4 | Compilador TS |

---

## 16. Fluxo de Dados

### Conversão em batch (GUI)

```
1. USER arrasta .md para Dropzone
   FileDropzone.handleDrop()
   → onFilesSelected([{ path, name, size }])
   → App.setFiles([...prev, ...novos])  // dedup por path

2. USER clica "Converter"
   App.handleConvert()
   → setFiles(status: 'converting')
   → window.mdToPdf.batchConvert(paths, options)
     → IPC: 'convert:batch' → main.cjs
       → getConverter() via import(pathToFileURL(dist/convert.js))
       → for each file:
           mkdirSync(outputDir)
           convertMarkdownToPdf({ inputPath, outputPath, ...options })
             readFileSync(inputPath)
             markdownToHtml(content, baseDir)
               marked.parse() + hljs.highlight() + resolveImages()
             buildPdfHtml(html, options)
             playwright: launch → setContent → page.pdf({ path }) → close
           event.sender.send('convert:progress', file, pct%)
             → renderer: setProgress(pct)
       → retorna string[] (outputPath | "ERRO:...")
   → setFiles(status: 'done' | 'error')

3. OutputPanel exibe arquivos concluídos
   → onOpenFolder(outputPath)
   → IPC: 'shell:openFolder'
   → shell.showItemInFolder(path)
```

---

## Referências

- [Electron Docs](https://www.electronjs.org/docs)
- [Playwright PDF API](https://playwright.dev/docs/api/class-page#page-pdf)
- [marked Docs](https://marked.js.org/)
- [highlight.js](https://highlightjs.org/)
- [electron-builder](https://www.electron.build/)
- [Vite](https://vite.dev/)

---

*Gerado em: 2026-07-03 | Projeto: md-to-pdf v1.0.0*
