---
name: hands-on-apis-ai-data-science
description: >- Passos praticos de APIs para IA e Data Science — FastAPI, Docker, Airflow, LangChain e deploy
---
# Hands-On APIs for AI and Data Science — Passos Operacionais

## 1. CRIANDO DATABASE (SQLite + SQLAlchemy)
### 1.1 Criar tabelas
```sql
CREATE TABLE player (player_id INTEGER PRIMARY KEY, gsis_id VARCHAR,
    first_name VARCHAR NOT NULL, last_name VARCHAR NOT NULL,
    position VARCHAR NOT NULL, last_changed_date DATE NOT NULL);
CREATE TABLE performance (performance_id INTEGER PRIMARY KEY,
    week_number VARCHAR NOT NULL, fantasy_points FLOAT NOT NULL,
    player_id INTEGER NOT NULL REFERENCES player(player_id),
    last_changed_date DATE NOT NULL);
CREATE TABLE league (league_id INTEGER PRIMARY KEY,
    league_name VARCHAR NOT NULL, scoring_type VARCHAR NOT NULL,
    last_changed_date DATE NOT NULL);
CREATE TABLE team (team_id INTEGER PRIMARY KEY, team_name VARCHAR NOT NULL,
    league_id INTEGER NOT NULL REFERENCES league(league_id),
    last_changed_date DATE NOT NULL);
CREATE TABLE team_player (team_id INTEGER NOT NULL REFERENCES team(team_id),
    player_id INTEGER NOT NULL REFERENCES player(player_id),
    last_changed_date DATE NOT NULL, PRIMARY KEY (team_id, player_id));
```

### 1.2 Importar dados CSV
```sql
PRAGMA foreign_keys = ON;
.mode csv
.import --skip 1 data/player_data.csv player
.import --skip 1 data/performance_data.csv performance
-- (repete p/ league, team, team_player)
```

### 1.3 Configurar SQLAlchemy
```python
# database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
SQLALCHEMY_DATABASE_URL = "sqlite:///./fantasy_data.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# models.py — ORM classes p/ Player, Performance, League, Team, TeamPlayer
# crud.py — funcoes query: get_player, get_players, get_performances, get_leagues, get_teams, get_counts
```

### 1.4 Testes com pytest
```python
@pytest.fixture(scope="function")
def db_session(): session = SessionLocal(); yield session; session.close()

def test_get_player(db_session):
    player = crud.get_player(db_session, player_id=1001)
    assert player.player_id == 1001
```
Rodar: `pytest test_crud.py` — esperar 5 passed.

## 2. DESENVOLVENDO FASTAPI
### 2.1 Setup
```bash
pip install pydantic>=2.4.0 fastapi[standard]>=0.115.0 uvicorn>=0.23.0 httpx>=0.27.0
```

### 2.2 Schemas Pydantic
```python
class Performance(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    performance_id: int; player_id: int; week_number: str
    fantasy_points: float; last_changed_date: date

class Player(PlayerBase):
    performances: List[Performance] = []
# + TeamBase, Team, League, Counts
```

### 2.3 Controller REST
```python
app = FastAPI()
def get_db(): db = SessionLocal(); yield db; db.close()

@app.get("/v0/players/", response_model=list[schemas.Player])
def read_players(skip: int = 0, limit: int = 100,
    minimum_last_changed_date: date = None, first_name: str = None,
    last_name: str = None, db: Session = Depends(get_db)):
    players = crud.get_players(db, skip=skip, limit=limit, ...)
    return players

# + /v0/players/{player_id}, /v0/performances/, /v0/leagues/, /v0/leagues/{league_id}, /v0/teams/, /v0/counts/
```

### 2.4 Testes com TestClient
```python
from fastapi.testclient import TestClient
from main import app
client = TestClient(app)
def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "API health check successful"}
# + test_read_players, test_read_performances, test_counts, etc.
```
Rodar: `pytest test_main.py` — 11 passed.

### 2.5 Launch
```bash
fastapi run main.py
```
Health check em `http://0.0.0.0:8000`.

## 3. DOCUMENTANDO A API
### 3.1 Meta-info no FastAPI
```python
app = FastAPI(
    description=api_description,
    title="Sports World Central (SWC) Fantasy Football API",
    version="0.1")
```

### 3.2 Tags + descricoes nos endpoints
```python
@app.get("/v0/players/{player_id}",
    summary="Get one player using the Player ID",
    description="If you have an SWC Player ID...",
    operation_id="v0_get_players_by_player_id",
    tags=["player"])
```

### 3.3 Query parameters com descricao
```python
def read_players(
    skip: int = Query(0, description="Items to skip."),
    limit: int = Query(100, description="Records to return."), ...)
```

### 3.4 Visitar documentacao
- Swagger UI: `{base_url}/docs`
- Redoc: `{base_url}/redoc`
- OAS: `{base_url}/openapi.json`

## 4. DEPLOY DA API
### 4.1 Render (cloud simplificada)
1. Criar conta em render.com.
2. New Web Service → conectar repo GitHub.
3. Configurar: Python 3, build = `pip install -r requirements.txt`, start = `uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Deploy → URL publica.

### 4.2 Docker
```dockerfile
FROM python:3.10-slim
WORKDIR /code
COPY requirements.txt /code/
RUN pip3 install --no-cache-dir --upgrade -r requirements.txt
COPY *.py *.db /code/
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
```
```bash
docker build -t apicontainerimage .
docker run --publish 80:80 --name apicontainer1 apicontainerimage
```

### 4.3 AWS Lightsail
1. Criar Lightsail Container Service (Nano/Micro).
2. `aws lightsail push-container-image --region <Region> --service-name aws-api-container --label aws-api --image apicontainerimage:latest`
3. Deploy via UI com porta 80 e public endpoint.

## 5. CRIANDO PYTHON SDK
### 5.1 Estrutura
```
sdk/
├── pyproject.toml
├── src/
│   └── swcpy/
│       ├── __init__.py
│       ├── swc_client.py
│       ├── swc_config.py
│       └── schemas/
└── tests/
    └── test_swcpy.py
```

### 5.2 pyproject.toml
```toml
[project]
name = "swcpy"
version = "0.0.1"
dependencies = ['pytest>=8.1', 'httpx>=0.27.0', 'pydantic>=2.4.0', 'backoff>=2.2.1']
```

### 5.3 Minimum Viable SDK
```python
class SWCClient:
    def __init__(self, swc_base_url: str):
        self.swc_base_url = swc_base_url
    def get_health_check(self):
        with httpx.Client(base_url=self.swc_base_url) as client:
            return client.get("/")
```

### 5.4 Feature-rich: Config + Backoff + Schemas
```python
class SWCConfig:
    def __init__(self, swc_base_url: str = None, backoff: bool = True,
                 backoff_max_time: int = 30, bulk_file_format: str = "csv"):
        self.swc_base_url = swc_base_url or os.getenv("SWC_API_BASE_URL")

class SWCClient:
    def __init__(self, input_config: config.SWCConfig):
        self.call_api = backoff.on_exception(
            wait_gen=backoff.expo,
            exception=(httpx.RequestError, httpx.HTTPStatusError),
            max_time=self.backoff_max_time,
            jitter=backoff.random_jitter)(self.call_api)
    def call_api(self, api_endpoint, api_params=None):
        with httpx.Client(base_url=self.swc_base_url) as client:
            return client.get(api_endpoint, params=api_params)
    def list_leagues(self, ...) -> List[League]:
        return [League(**l) for l in self.call_api("/v0/leagues/", params).json()]
    def get_bulk_player_file(self) -> bytes: ...
```

### 5.5 Instalar e testar
```bash
pip3 install -e .
pytest tests/test_swcpy.py
```

## 6. DATA PIPELINE COM APACHE AIRFLOW
### 6.1 Setup Airflow com Docker
```bash
curl -LfO 'https://airflow.apache.org/docs/apache-airflow/2.10.0/docker-compose.yaml'
mkdir -p ./dags ./logs ./plugins ./config
echo -e "AIRFLOW_UID=$(id -u)" > .env
docker compose up airflow-init
docker compose up -d
```
Login: `airflow` / `airflow` em `http://localhost:8080`.

### 6.2 Configurar Connections (UI)
- **analytics_database:** Type Sqlite, Schema `/opt/airflow/dags/analytics_database.db`
- **sportsworldcentral_url:** Type HTTP, Host = URL da API

### 6.3 DAG com HttpOperator + PythonOperator
```python
@dag(schedule_interval=None)
def recurring_player_api_insert_update_dag():
    api_health_check_task = HttpOperator(
        task_id="check_api_health_check_endpoint",
        http_conn_id="sportsworldcentral_url", endpoint="/", method="GET",
        response_check=lambda r: r.status_code==200 and r.json()=={"message": "API health check successful"})
    api_player_query_task = HttpOperator(
        task_id="api_player_query",
        http_conn_id="sportsworldcentral_url",
        endpoint="/v0/players/?skip=0&limit=100000&minimum_last_changed_date=2024-04-01",
        method="GET")
    player_sqlite_upsert_task = PythonOperator(
        task_id="player_sqlite_upsert",
        python_callable=insert_update_player_data,
        provide_context=True)
    api_health_check_task >> api_player_query_task >> player_sqlite_upsert_task
```
Funcao `upsert_player_data` usa `sqlite3` com `INSERT ... ON CONFLICT DO UPDATE`.

## 7. DEPLOY DE ML API (ONNX + FastAPI)
### 7.1 Treinar modelo (scikit-learn → ONNX)
```python
model = GradientBoostingRegressor(loss="quantile", alpha=0.5)
model.fit(X_train, y_train)
onx = to_onnx(model, X_array[:1])
with open("acquisition_model_50.onnx", "wb") as f:
    f.write(onx.SerializeToString())
# Treinar 3 modelos: 10th, 50th, 90th percentil
```

### 7.2 Schemas Pydantic
```python
class FantasyAcquisitionFeatures(BaseModel):
    waiver_value_tier: int
    fantasy_regular_season_weeks_remaining: int
    league_budget_pct_remaining: int

class PredictionOutput(BaseModel):
    winning_bid_10th_percentile: float
    winning_bid_50th_percentile: float
    winning_bid_90th_percentile: float
```

### 7.3 API com ONNX Runtime
```python
sess = rt.InferenceSession("acquisition_model_50.onnx", providers=["CPUExecutionProvider"])
input_name = sess.get_inputs()[0].name
label_name = sess.get_outputs()[0].name

@app.post("/predict/", response_model=PredictionOutput)
def predict(features: FantasyAcquisitionFeatures):
    input_data = np.array([[features.waiver_value_tier,
        features.fantasy_regular_season_weeks_remaining,
        features.league_budget_pct_remaining]], dtype=np.int64)
    pred = sess.run([label_name], {input_name: input_data})[0]
    return PredictionOutput(winning_bid_50th_percentile=round(float(pred[0]), 2))
```

## 8. LANGCHAIN / LANGGRAPH AGENT
### 8.1 Setup
```bash
pip install langchain_core langchain_anthropic langgraph
```
Criar API key em console.anthropic.com → configurar env `ANTHROPIC_API_KEY`.

### 8.2 Agent basico (sem tools)
```python
model = ChatAnthropic(model="claude-3-5-sonnet-20240620", temperature=0)

def call_model(state: MessagesState):
    response = model.invoke(state['messages'])
    return {"messages": [response]}

workflow = StateGraph(MessagesState)
workflow.add_node("agent", call_model)
workflow.add_edge(START, "agent")
app = workflow.compile(checkpointer=MemorySaver())
```

### 8.3 LangChain Toolkit p/ API
```python
class ListLeaguesTool(BaseTool):
    name: str = "ListLeagues"
    description: str = "get a list of leagues from SportsWorldCentral"
    args_schema: Type[LeaguesInput] = LeaguesInput
    def _run(self, league_name=None, run_manager=None) -> List[League]:
        return local_swc_client.list_leagues(league_name=league_name)

class SportsWorldCentralToolkit(BaseToolkit):
    def get_tools(self) -> List[BaseTool]:
        return [HealthCheckTool(), ListLeaguesTool(), ListTeamsTool()]
```

### 8.4 Agent com Tools
```python
tool_node = ToolNode(tools)
model = ChatAnthropic(model="claude-3-5-sonnet-20240620", temperature=0).bind_tools(tools)

def should_continue(state) -> Literal["tools", END]:
    return "tools" if state['messages'][-1].tool_calls else END

workflow = StateGraph(MessagesState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", tool_node)
workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("tools", 'agent')
app = workflow.compile(checkpointer=MemorySaver())

final_state = app.invoke(
    {"messages": [HumanMessage(content="What leagues are in SWC?")]},
    config={"configurable": {"thread_id": 99}})
```

## 9. CHATGPT CUSTOM GPT COM ACTIONS
### 9.1 Setup
1. Assinar ChatGPT Plus/Team/Enterprise.
2. Fazer deploy da API (Render ou Codespaces).
3. Garantir que API esteja publica.

### 9.2 Adicionar servers section no OpenAPI
```python
app = FastAPI(servers=[{"url": "https://seu-dominio.app.github.dev", "description": "Main server"}])
```

### 9.3 Criar Custom GPT
1. Profile photo → My GPTs → Create a GPT.
2. Preencher Name, Description, Instructions.
3. Em Configure → Create new action.
4. Authentication: None.
5. Import URL: colar `{base_url}/openapi.json` → Import.
6. Verificar endpoints em Available actions.
7. Test action → Save.

### 9.4 Usar GPT
- Selecionar GPT no sidebar.
- Perguntar sobre dados da API.
- GPT chama API automaticamente via OpenAPI spec.
- Respostas baseadas nos dados reais.

## 10. API ANALYTICS COM STREAMLIT
### 10.1 Setup
```bash
pip install streamlit nfl_data_py
```

### 10.2 App Streamlit
```python
import streamlit as st
import swcpy
from swcpy import SWCClient, SWCConfig

st.set_page_config(page_title="SWC Fantasy Analytics", layout="wide")
st.title("SWC Fantasy Football Analytics")

config = SWCConfig(swc_base_url="http://localhost:8000", backoff=False)
client = SWCClient(config)
```

### 10.3 Paginas
- Team Roster: selecionar time → listar players + posicoes.
- Team Stats: metricas agregadas por time.
- Usar `st.dataframe`, `st.bar_chart`, `st.metric` p/ visualizacao.

### 10.4 Deploy
```bash
streamlit run app.py
```
Ou fazer deploy no Streamlit Community Cloud.
