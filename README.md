# 🚲 Ciclovias Recife — Backend

API REST desenvolvida com **Node.js + Express + SQLite** para persistência de dados do aplicativo mobile Ciclovias Recife.

---

## 📋 Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Node.js | 18+ | Runtime JavaScript |
| Express | 4.18+ | Framework HTTP |
| better-sqlite3 | 9.x | Banco de dados SQLite |
| express-validator | 7.x | Validação de dados |
| helmet | 7.x | Segurança HTTP |
| cors | 2.x | Cross-Origin Resource Sharing |
| morgan | 1.x | Logger de requisições |
| dotenv | 16.x | Variáveis de ambiente |

---

## 📁 Estrutura de Pastas

```
backend/
├── server.js              # Ponto de entrada — inicializa o Express
├── .env.example           # Template de variáveis de ambiente
├── .gitignore
├── package.json
│
├── routes/
│   └── locationRoutes.js  # Define os endpoints e as validações
│
├── controllers/
│   └── locationController.js  # Recebe req, chama Service, envia res
│
├── models/
│   └── LocationModel.js   # Operações SQL (CRUD) direto no banco
│
├── services/
│   └── locationService.js # Regras de negócio entre Controller e Model
│
└── database/
    ├── database.js        # Inicialização e conexão com SQLite
    └── ciclovias.db       # Arquivo gerado automaticamente (gitignored)
```

### Explicação de cada pasta

**`routes/`** — Define os endpoints (POST, GET, DELETE) e aplica as validações com `express-validator` antes de passar para o Controller.

**`controllers/`** — Recebe a requisição HTTP, verifica se a validação passou, chama o Service e formata a resposta JSON.

**`models/`** — Contém os Prepared Statements SQL. Acessa o banco diretamente. Sem lógica de negócio.

**`services/`** — Camada intermediária com regras de negócio (ex: "latitude deve ser válida para o Recife"). Chama o Model e retorna dados para o Controller.

**`database/`** — Inicialização do SQLite, criação das tabelas e índices.

---

## ⚙️ Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/recife-ciclovias-backend.git
cd recife-ciclovias-backend

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp .env.example .env
# Edite o .env se necessário

# 4. Inicie o servidor
npm run dev   # com nodemon (hot reload)
# ou
npm start     # sem hot reload
```

---

## 🔧 Configuração (.env)

```env
PORT=192.168.0.3
NODE_ENV=development
```

---

## 🚀 Execução

```bash
# Desenvolvimento (hot reload)
npm run dev

# Produção
npm start
```

O servidor iniciará em `http://192.168.0.3`.

Verifique com:
```bash
curl http://192.168.0.3
```

---

## 📡 Endpoints da API

### `POST /locations`

Salva a localização do usuário associada a uma ciclovia.

**Request Body:**
```json
{
  "latitude":   -8.063100,
  "longitude":  -34.871100,
  "cicloviaId": "123",
  "tipo":       "CICLOFAIXA",
  "bairro":     "Boa Viagem",
  "extensaoKm": 1.5
}
```

**Response 201:**
```json
{
  "sucesso": true,
  "mensagem": "Localização salva com sucesso!",
  "dados": {
    "id": 1,
    "latitude": -8.0631,
    "longitude": -34.8711,
    "cicloviaId": "123",
    "tipo": "CICLOFAIXA",
    "bairro": "Boa Viagem",
    "extensaoKm": 1.5,
    "criadoEm": "2024-03-15 14:30:00"
  }
}
```

**Response 400 (validação):**
```json
{
  "sucesso": false,
  "mensagem": "Dados inválidos",
  "erros": [
    { "campo": "latitude", "mensagem": "latitude deve ser um número entre -90 e 90" }
  ]
}
```

---

### `GET /locations`

Lista todos os registros, do mais recente ao mais antigo.

**Query Params opcionais:**
- `?limite=100` — máximo de registros (padrão: 100, máximo: 500)
- `?offset=0` — paginação

**Response 200:**
```json
{
  "sucesso": true,
  "dados": [
    {
      "id": 2,
      "latitude": -8.0631,
      "longitude": -34.8711,
      "cicloviaId": "456",
      "tipo": "CICLOVIA",
      "bairro": "Madalena",
      "extensaoKm": 2.3,
      "criadoEm": "2024-03-15 15:00:00"
    }
  ],
  "paginacao": {
    "total": 2,
    "retornados": 2,
    "limite": 100,
    "offset": 0
  }
}
```

---

### `GET /locations/:id`

Busca um registro específico pelo ID.

**Response 200:**
```json
{
  "sucesso": true,
  "dados": { ... }
}
```

**Response 404:**
```json
{
  "sucesso": false,
  "mensagem": "Registro com ID 99 não encontrado."
}
```

---

### `DELETE /locations/:id`

Remove um registro pelo ID.

**Response 200:**
```json
{
  "sucesso": true,
  "mensagem": "Registro 1 removido com sucesso."
}
```

---

### `GET /health`

Verificação de saúde do servidor.

**Response 200:**
```json
{
  "sucesso": true,
  "mensagem": "Backend Ciclovias Recife rodando ✅",
  "versao": "1.0.0",
  "timestamp": "2024-03-15T14:30:00.000Z"
}
```

---

## 🗄️ Banco de Dados

**SQLite** via `better-sqlite3`. O arquivo `database/ciclovias.db` é criado automaticamente na primeira execução.

### Tabela `locations`

| Coluna | Tipo | Descrição |
|---|---|---|
| id | INTEGER PK | Auto-incremento |
| latitude | REAL | Latitude do usuário |
| longitude | REAL | Longitude do usuário |
| cicloviaId | TEXT | ID do registro na API |
| tipo | TEXT | CICLOVIA / CICLOFAIXA / CICLORROTA |
| bairro | TEXT | Bairro da ciclovia |
| extensaoKm | REAL | Extensão em km (nullable) |
| criadoEm | TEXT | Timestamp ISO 8601 |

---

