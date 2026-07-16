---
name: python-simplified-genai
description: Aprenda Python do zero com Generative AI (GPT-4o) como tutor — calculadora, algoritmos de ordenação, Pandas, CNN e deploy Gradio/Hugging Face
---

# Python Simplified com Generative AI — Passos Operacionais

## 1. Configuração do Ambiente (Jupyter Notebook + Google Colab)

### 1.1 Acessar Google Colab
1. Abra navegador → acesse `https://colab.research.google.com`
2. Faça login com conta Google (gratuita)
3. Clique em **Novo Notebook** para criar ambiente Python pronto
4. Colab já inclui Pandas, Matplotlib e bibliotecas comuns

### 1.2 Instalar bibliotecas sob demanda
1. Use `!pip install <lib>` em célula de código
2. Exemplo: `!pip install gradio` ou `!pip install fastai`
3. Verifique versão: `<lib>.__version__` ou comando `!pip show <lib>`

### 1.3 Estrutura do Notebook
1. **Células de código**: escreva/execute código Python bloco a bloco
2. **Células de texto**: documente com Markdown + LaTeX (`$formula$`)
3. Execute células individuais (`Shift+Enter`) — feedback imediato por célula

### 1.4 Prompt Engineering com GPT-4o
1. Seja específico: "Write a Python function with inline documentation for bubble sort"
2. Peça explicações: "Explain this code line by line"
3. Refine: peça formato Markdown, tom infantíl, ou "explain like I'm 5"
4. Peça variações: "Write this 3 different ways"
5. Use GPT-4o para depurar: copie erro → peça correção

## 2. Fundamentos Python (Via Calculadora)

### 2.1 Variáveis e Tipos
1. Atribuição sem declaração: `nome = "Pluto"` (string inferida)
2. Tipos comuns: `int`, `float`, `bool`, `list`, `tuple`, `dict`, `None`
3. Use `type(var)` para inspecionar

### 2.2 If-Else
```python
if condicao:
    ...
elif outra:
    ...
else:
    ...
```
1. Use `==`, `!=`, `>`, `<`, `>=`, `<=`
2. Combine com `and`, `or`, `not`

### 2.3 Funções
1. Defina com `def nome(parametros):`
2. Documente com docstring inline (GPT-4o gera automaticamente)
3. Mantenha funções < 40 linhas — quebre em funções menores
4. Use `return` para retornar valor

### 2.4 Loops
1. `for i in range(n):` — itera n vezes
2. `while condicao:` — repete enquanto condição verdadeira
3. Use `break` para sair, `continue` para pular iteração
4. Loops aninhados: loop dentro de loop

### 2.5 Classes e Objetos
1. `class Nome:` define blueprint
2. `__init__(self, ...)` inicializa atributos
3. `__str__(self)` define representação legível
4. Instancie: `obj = Nome(args)`
5. Acesse atributos: `obj.atributo`

### 2.6 Calculadora — Código Completo
1. Defina funções: `add(x,y)`, `subtract(x,y)`, `multiply(x,y)`, `divide(x,y)`
2. Valide entradas (tipo numérico)
3. Trate divisão por zero com `raise ValueError`
4. Crie loop principal com `while True` e `break` na opção sair
5. Use `try/except` para capturar erros de entrada

## 3. Algoritmos de Ordenação

### 3.1 Bubble Sort
1. Loop externo percorre lista `n` vezes (`for i in range(n)`)
2. Loop interno compara pares adjacentes (`for j in range(0, n-i-1)`)
3. Troca se elemento da esquerda > direita
4. Otimização: flag `swapped` — se nenhuma troca ocorrer, lista já ordenada → early exit
5. Complexidade: O(n²) tempo, O(1) memória (in-place, estável)

### 3.2 Selection Sort
1. Percorra lista: cada posição `i` assume que é o menor
2. Escaneie resto da lista: encontre o menor elemento
3. Troque o menor com o elemento na posição `i`
4. Expanda parte ordenada incrementalmente
5. Complexidade: O(n²), mas menos trocas que bubble

### 3.3 Insertion Sort
1. Comece com primeiro elemento como parte ordenada
2. Pegue próximo elemento, compare com parte ordenada
3. Desloque elementos maiores para direita
4. Insira elemento na posição correta
5. Repita até lista toda ordenada
6. Eficiente para datasets pequenos

### 3.4 Merge Sort (Dividir e Conquistar)
1. Divida lista ao meio recursivamente até sublistas de 1 elemento
2. **Split**: `split_list(lista)` → retorna `left, right`
3. **Merge**: compare elementos de `left` e `right`, intercale ordenado
4. Caso base: se lista tem ≤1 elemento, retorne
5. Complexidade: O(n log n) sempre — estável

### 3.5 Quick Sort
1. Escolha pivô (ex: elemento do meio)
2. Particione: `left` (< pivô), `middle` (= pivô), `right` (> pivô)
3. Recursivamente aplique quick sort em `left` e `right`
4. Combine: `left + middle + right`
5. Complexidade: O(n log n) médio, O(n²) pior caso (mau pivô)

### 3.6 Análise de Performance
1. Use `time` para medir execução com datasets grandes
2. Compare O(n²) vs O(n log n) na prática
3. Visualize passos com Matplotlib (gráfico de barras por iteração)
4. Use debug logs (`print`) para rastrear estado interno

## 4. Pandas — Manipulação de Dados

### 4.1 Estruturas Básicas
1. **Series**: array 1D com índice rotulado
2. **DataFrame**: tabela 2D (linhas × colunas), cada coluna é uma Series
3. Crie: `df = pd.DataFrame(data_dict)` — dicionário chave=coluna, valor=lista

### 4.2 Operações Fundamentais
1. **Visualizar**: `df.head(n)`, `df.tail(n)`, `df.sample(n)`
2. **Selecionar colunas**: `df[['col1', 'col2']]`
3. **Filtrar linhas**: `df[df['idade'] >= 24]`
4. **Condições múltiplas**: `df[(df['idade'] >= 24) & (df['curso'] == 'Eng')]`
5. **Adicionar coluna**: `df['nova'] = valores`
6. **Remover coluna**: `df.drop('col', axis=1, inplace=True)`
7. **Renomear**: `df.rename(columns={'antigo': 'novo'}, inplace=True)`
8. **Ordenar**: `df.sort_values(by='coluna')` — simples ou múltipla
9. **Informações**: `df.info()` — tipos, nulls, linhas

### 4.3 Limpeza de Dados
1. Detecte nulos: `df.isnull().sum()`
2. Preencha: `df.fillna('valor_padrao')` ou `df.replace(valor_antigo, novo)`
3. Remova nulos: `df.dropna()`
4. Converta tipos: `df['col'] = df['col'].astype(int)`
5. Limpe strings: `df['col'].str.replace(...)` ou `df['col'].str[1:]`

### 4.4 Agrupamento e Agregação
1. `df.groupby('coluna').mean()` — média por grupo
2. `df.groupby('coluna').count()` — contagem por grupo
3. `df.groupby('coluna').max()` / `.min()` — valor máximo/mínimo

### 4.5 Merge de DataFrames
1. `pd.merge(df1, df2, on='coluna_chave', how='inner')`
2. Tipos: `inner` (só match), `outer` (todos), `left`, `right`

### 4.6 Visualização
1. `df.plot()` — gráfico de linhas (Matplotlib embutido)
2. `df.plot.bar()` — gráfico de barras
3. `df['col'].plot(kind='area')` — área
4. Adicione título, labels, legenda com Matplotlib

### 4.7 Dataset Real (Kaggle)
1. Escolha dataset em `kaggle.com`
2. Faça upload para GitHub (raw URL)
3. Importe: `df = pd.read_csv('https://raw.githubusercontent.com/...')`
4. Inspecione com `df.info()`, limpe colunas, trate anomalias
5. Analise e visualize para extrair insights

## 5. CNN — Deep Learning com Fast.ai

### 5.1 Conceitos Essenciais
1. **AI** > **ML** (10 algoritmos padrão) > **ANN/Deep Learning** > **CNN/LLM**
2. CNN: redes neurais convolucionais para classificação de imagens
3. **Transfer Learning**: use modelo pré-treinado (ex: ResNet34) em vez de treinar do zero
4. **Fine-tuning**: ajuste camadas finais do modelo ao seu dataset específico

### 5.2 Pipeline CNN em 7 Passos
1. **Setup**: Jupyter Notebook + GPU (Google Colab gratuito)
2. **Dataset**: Kaggle — baixe imagens rotuladas
3. **Transfer Learning**: escolha modelo base (ex: ResNet34 do timm)
4. **Learning Rate**: use `lr_find()` do Fast.ai para valor ótimo
5. **Treinar**: `model.fine_tune(epochs)` — ajuste fino
6. **Avaliar**: métricas (erro, loss) e matriz de confusão
7. **Predizer**: `model.predict(img)` em novas imagens

### 5.3 Fast.ai — 4 Linhas de Código
```python
from fastai.vision.all import *
dls = ImageDataLoaders.from_folder(path, valid_pct=0.2)
learn = cnn_learner(dls, resnet34, metrics=error_rate)
learn.fine_tune(6)
```

### 5.4 Dataset Próprio (Ex: Cobras)
1. Baixe dataset do Kaggle com API: `kagglehub.dataset_download()`
2. Carregue metadados em DataFrame com Pandas
3. Construa coluna `image_path` combinando diretório + class_id + UUID
4. Limpe: mantenha só colunas necessárias (`poisonous`, `image_path`, `is_valid`)
5. Crie DataLoader: `dls = ImageDataLoaders.from_df(df, path, ...)`
6. Defina tamanho do batch (ex: 32) e aumentação (flips, resize)
7. Treine: `learn = cnn_learner(dls, resnet34, metrics=error_rate)`
8. Encontre learning rate: `learn.lr_find()`
9. Fine-tune: `learn.fine_tune(epochs)`
10. Avalie: `learn.show_results()`

## 6. Deploy com Gradio + Hugging Face

### 6.1 Componentes de Deploy
1. **Client-side**: GUI que usuário vê (Gradio gera HTML/CSS/JS automaticamente)
2. **API**: ponte entre client e servidor (REST/GraphQL)
3. **Server-side**: lógica de negócio e processamento

### 6.2 Gradio — Criar GUI Web com Python
1. Instale: `!pip install gradio`
2. Importe: `import gradio as gr`
3. Defina função de processamento
4. Crie interface: `gr.Interface(fn, inputs, outputs, title=...)`
5. Lance: `interface.launch()` — gera URL pública automaticamente
6. Tipos de input/output: texto, número, imagem, áudio, etc.
7. Compartilhe URL pública (válida 72h no plano gratuito)

### 6.3 Deploy no Hugging Face
1. Crie conta em `https://huggingface.co`
2. Crie **Space**: escolha Gradio SDK, nome, licença, hardware (gratuito: 2 vCPU + 16GB)
3. Prepare **requirements.txt** com versões exatas:
   ```
   gradio==5.12.0
   fastai>=2.7.18
   ```
4. Prepare **app.py** com código completo (lógica + interface Gradio)
5. Exporte do Notebook: `%%writefile app.py` (ou `%%writefile -a app.py` para append)
6. Faça upload via: (a) botão Add File no Space ou (b) Git clone + push
7. Hugging Face constrói automaticamente — monte logs de build
8. Teste URL pública gerada

### 6.4 Padrões de Código Deploy
1. **Calculadora**: inputs numéricos + botões operadores + output
2. **Quick Sort**: input lista não ordenada → output ordenado
3. **CNN Classificação**: upload imagem → modelo carrega `learner` exportado → predição
4. Separe lógica da UI: funções em células separadas
5. Não coloque dados sensíveis no código-fonte
6. API gerada automaticamente pelo Gradio — reutilizável em outras apps
