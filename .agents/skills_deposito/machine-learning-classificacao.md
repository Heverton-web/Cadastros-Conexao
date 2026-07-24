---
name: Classificacao ML
description: Pipeline completo de classificação com scikit-learn: carga, tratamento, treino, teste, validação e comparação de modelos
---
# Classificação com Machine Learning — Passos Operacionais

## 1. Importar e Preparar Dados

### 1.1 Carregar CSV com Pandas
1. `import pandas as pd` — use pd abreviado (python data analysis)
2. `df = pd.read_csv('arquivo.csv')` — lê CSV completo como DataFrame
3. Acessar colunas: `df[['col1', 'col2']]` (array de nomes) seleciona X; `df['target']` seleciona Y
4. Verificar dtype: `df.dtypes` — colunas categóricas (string) precisam de transformação

### 1.2 Converter Variáveis Categóricas (Dummies)
1. `Xdummies = pd.get_dummies(X_df)` — transforma colunas string em colunas binárias (one-hot)
2. Y com 2 valores (0/1): não precisa de `get_dummies` — usar Y_df direto
3. Converter DataFrame em array numpy: `X = Xdummies.values` e `Y = Y_df.values`
4. `pd.get_dummies(X_df).astype(int)` para forçar inteiros

### 1.3 Separar Treino/Teste/Validação
1. Definir proporções:
   ```python
   porcentagem_treino = 0.8
   tamanho_treino = int(porcentagem_treino * len(Y))
   ```
2. Fatias de treino: `treino_dados = X[:tamanho_treino]` e `treino_marcacoes = Y[:tamanho_treino]`
3. Fatias de teste: `teste_dados = X[-tamanho_teste:]` e `teste_marcacoes = Y[-tamanho_teste:]`
4. Para 3-partes (treino/teste/validação):
   ```python
   tamanho_teste = int(porcentagem_teste * len(Y))
   fim_treino = tamanho_treino + tamanho_teste
   teste_dados = X[tamanho_treino:fim_treino]
   validacao_dados = X[fim_treino:]
   ```

## 2. Treinar e Testar Modelo (fit_and_predict)

### 2.1 Função Genérica de Treino+Teste
```python
def fit_and_predict(nome, modelo, treino_dados, treino_marcacoes, teste_dados, teste_marcacoes):
    modelo.fit(treino_dados, treino_marcacoes)
    resultado = modelo.predict(teste_dados)
    acertos = resultado == teste_marcacoes
    total_acertos = sum(acertos)
    total_elementos = len(teste_dados)
    taxa_acerto = 100.0 * total_acertos / total_elementos
    print("Taxa de acerto do algoritmo {0}: {1}".format(nome, taxa_acerto))
    return taxa_acerto
```

### 2.2 Uso com Múltiplos Modelos
1. Dicionário `resultados = {}` para armazenar resultados
2. Para cada modelo, chamar `fit_and_predict` e guardar:
   ```python
   resultado = fit_and_predict("Nome", modelo, treino_dados, treino_marcacoes, teste_dados, teste_marcacoes)
   resultados[resultado] = modelo
   ```
3. Vencedor: `maximo = max(resultados)`; `vencedor = resultados[maximo]`

## 3. Modelos de Classificação (scikit-learn)

### 3.1 Multinomial Naive Bayes (MultinomialNB)
```python
from sklearn.naive_bayes import MultinomialNB
modelo = MultinomialNB()
modelo.fit(X, Y)
resultado = modelo.predict(X_teste)
```
- Bom para classificação de texto e variáveis categóricas
- Funciona com 2+ categorias

### 3.2 AdaBoost
```python
from sklearn.ensemble import AdaBoostClassifier
modelo = AdaBoostClassifier(random_state=0)
```
- Ensemble que refina iterativamente
- Pode superar MultinomialNB em dados com padrões complexos

### 3.3 OneVsRest (multiclasse)
```python
from sklearn.multiclass import OneVsRestClassifier
from sklearn.svm import LinearSVC
modelo = OneVsRestClassifier(LinearSVC(random_state=0))
```
- Divide problema N-classes em N problemas binários (classe vs resto)

### 3.4 OneVsOne (multiclasse)
```python
from sklearn.multiclass import OneVsOneClassifier
modelo = OneVsOneClassifier(LinearSVC(random_state=0))
```
- Divide problema N-classes em N*(N-1)/2 classificadores binários (um-vs-um)

## 4. Validação e Métricas

### 4.1 Calcular Taxa de Acerto
```python
diferencas = resultado - teste_marcacoes
acertos = [d for d in diferencas if d == 0]
total_acertos = len(acertos)
total_elementos = len(teste_dados)
taxa = 100.0 * total_acertos / total_elementos
```

### 4.2 Algoritmo Base (Baseline)
1. Chutar sempre o valor mais frequente:
   ```python
   from collections import Counter
   acerto_base = max(Counter(teste_marcacoes).values())
   taxa_base = 100.0 * acerto_base / len(teste_marcacoes)
   ```
2. Se algoritmo complexo for pior que base → modelo não serve para esses dados

### 4.3 Teste no Mundo Real (Validação Final)
```python
def teste_real(modelo, validacao_dados, validacao_marcacoes):
    resultado = modelo.predict(validacao_dados)
    acertos = resultado == validacao_marcacoes
    total_acertos = sum(acertos)
    taxa = 100.0 * total_acertos / len(validacao_marcacoes)
    return taxa
```
- Dados de validação NUNCA vistos durante treino/teste

### 4.4 K-Fold Cross Validation
1. Separar apenas treino (80%) e validação (20%) — sem teste separado
2. Usar `cross_val_score` do scikit-learn ou implementar manualmente:
   ```python
   from sklearn.model_selection import cross_val_score
   scores = cross_val_score(modelo, treino_dados, treino_marcacoes, cv=k)
   ```
3. k-fold divide treino em k-partes, treina em k-1 e testa na k-ésima, repetindo

## 5. Boas Práticas

### 5.1 Nunca Testar com Dados de Treino
- `modelo.predict(X)` com mesmo X do treino → taxa artificialmente alta
- Sempre separar dados antes de treinar

### 5.2 Documentar Testes e Variações
- Anotar cada combinação de features testada:
  ```python
  # teste inicial: home, busca, logado => comprou
  # home, busca
  # home, logado
  # busca: 85,71% (7 testes)
  ```
- Resultado pode ser sorte sem documentação do processo

### 5.3 Seleção de Features
- Testar cada feature individualmente e em combinações
- Remover features que não melhoram (ou pioram) o resultado
- Variável com maior impacto pode ser suficiente sozinha

### 5.4 Nomenclatura Clara
- `X_df` / `Y_df`: DataFrames do pandas
- `Xdummies_df`: DataFrame com dummies
- `X` / `Y`: arrays numpy para o modelo
- Separar claramente treino/teste/validação nos nomes

## 6. Pipeline Resumido
1. `pd.read_csv()` → DataFrame
2. `pd.get_dummies()` → one-hot encoding
3. `.values` → numpy arrays
4. Separar treino + teste (+ validação)
5. `fit_and_predict()` para cada modelo
6. Escolher vencedor
7. `teste_real()` com dados de validação
8. Comparar com baseline (Counter)
9. Se aplicável: k-fold cross validation
