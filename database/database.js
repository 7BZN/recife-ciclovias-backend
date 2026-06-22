// ============================================================
// database/database.js
//
// Banco de dados em arquivo JSON usando o módulo nativo `fs`.
// ============================================================

const fs   = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

// ── Lê o banco do disco ──────────────────────────────────────
function lerBanco() {
  if (!fs.existsSync(DB_PATH)) {
    return { locations: [], nextId: 1 };
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

// ── Persiste o banco no disco ────────────────────────────────
function salvarBanco(dados) {
  fs.writeFileSync(DB_PATH, JSON.stringify(dados, null, 2));
}

// ── API pública (mesma interface que better-sqlite3 usaria) ──
const db = {
  inserir(registro) {
    const banco = lerBanco();
    const novoRegistro = {
      id: banco.nextId++,
      ...registro,
      criadoEm: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    banco.locations.push(novoRegistro);
    salvarBanco(banco);
    return novoRegistro;
  },

  buscarTodos(limite = 100, offset = 0) {
    const banco = lerBanco();
    return [...banco.locations]
      .sort((a, b) => b.id - a.id)
      .slice(offset, offset + limite);
  },

  contarTotal() {
    return lerBanco().locations.length;
  },

  buscarPorId(id) {
    return lerBanco().locations.find((r) => r.id === id) || null;
  },

  deletar(id) {
    const banco = lerBanco();
    const antes = banco.locations.length;
    banco.locations = banco.locations.filter((r) => r.id !== id);
    salvarBanco(banco);
    return banco.locations.length < antes;
  },

  buscarPorTipo(tipo, limite = 50) {
    const banco = lerBanco();
    return banco.locations
      .filter((r) => r.tipo === tipo.toUpperCase())
      .sort((a, b) => b.id - a.id)
      .slice(0, limite);
  },
};

function inicializarBancoDados() {
  if (!fs.existsSync(DB_PATH)) {
    salvarBanco({ locations: [], nextId: 1 });
    console.log('✅ Banco de dados criado: database/db.json');
  } else {
    console.log('✅ Banco de dados carregado: database/db.json');
  }
}

module.exports = { db, inicializarBancoDados };
