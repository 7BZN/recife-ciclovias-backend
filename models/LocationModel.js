// ============================================================
// models/LocationModel.js
//
// Modelo de dados para o recurso "locations".
// Encapsula todas as operações de persistência.
//
// Usa o db (database/database.js) como camada de acesso.
// Em produção, trocar db por better-sqlite3 ou PostgreSQL
// sem alterar este arquivo.
// ============================================================

const { db } = require('../database/database');

const LocationModel = {

  criar({ latitude, longitude, cicloviaId, tipo, bairro, extensaoKm }) {
    return db.inserir({
      latitude,
      longitude,
      cicloviaId: String(cicloviaId),
      tipo:       tipo       ? tipo.toUpperCase() : null,
      bairro:     bairro     || null,
      extensaoKm: extensaoKm ? Number(extensaoKm) : null,
    });
  },

  buscarTodos(limite = 100, offset = 0) {
    return db.buscarTodos(limite, offset);
  },

  contarTotal() {
    return db.contarTotal();
  },

  buscarPorId(id) {
    return db.buscarPorId(id);
  },

  deletar(id) {
    return db.deletar(id);
  },

  buscarPorTipo(tipo, limite = 50) {
    return db.buscarPorTipo(tipo, limite);
  },
};

module.exports = LocationModel;
