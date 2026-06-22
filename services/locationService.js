// ============================================================
// services/locationService.js
//
// Camada de serviço (business logic) para localizações.
// Intermediária entre Controller e Model.
// ============================================================

const LocationModel = require('../models/LocationModel');

const locationService = {

  // ── Salvar localização + ciclovia ────────────────────────
  async salvar(dados) {
    const { latitude, longitude, cicloviaId, tipo, bairro, extensaoKm } = dados;

    // Validação de coordenadas (Recife está entre -8.0 e -8.2 de lat,
    // e -34.8 a -35.0 de lon — mas aceitamos qualquer coordenada válida)
    if (latitude < -90 || latitude > 90) {
      throw new Error('Latitude inválida. Deve estar entre -90 e 90.');
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error('Longitude inválida. Deve estar entre -180 e 180.');
    }

    // Cria o registro no banco
    const registro = LocationModel.criar({
      latitude,
      longitude,
      cicloviaId: String(cicloviaId),
      tipo:       tipo  ? tipo.toUpperCase() : null,
      bairro:     bairro || null,
      extensaoKm: extensaoKm ? Number(extensaoKm) : null,
    });

    return registro;
  },

  // ── Listar registros ─────────────────────────────────────
  async listar(limite = 100, offset = 0) {
    const registros = LocationModel.buscarTodos(limite, offset);
    const total     = LocationModel.contarTotal();

    return { registros, total };
  },

  // ── Buscar por ID ─────────────────────────────────────────
  async buscarUm(id) {
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      throw new Error('ID deve ser um número inteiro.');
    }

    const registro = LocationModel.buscarPorId(idNum);
    if (!registro) {
      throw new Error(`Registro com ID ${id} não encontrado.`);
    }

    return registro;
  },

  // ── Deletar registro ─────────────────────────────────────
  async deletar(id) {
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      throw new Error('ID deve ser um número inteiro.');
    }

    // Verifica se existe antes de deletar (para retornar 404)
    const existe = LocationModel.buscarPorId(idNum);
    if (!existe) {
      throw new Error(`Registro com ID ${id} não encontrado.`);
    }

    return LocationModel.deletar(idNum);
  },
};

module.exports = locationService;
