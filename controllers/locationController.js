// ============================================================
// controllers/locationController.js
// ============================================================

const { validationResult } = require('express-validator');
const locationService      = require('../services/locationService');

const locationController = {

  // ============================================================
  // POST /locations
  //
  // Salva a localização do usuário associada a uma ciclovia.
  //
  // Request Body (JSON):
  //   {
  //     "latitude":   -8.0631,
  //     "longitude":  -34.8711,
  //     "cicloviaId": "123",
  //     "tipo":       "CICLOFAIXA",
  //     "bairro":     "Boa Viagem",
  //     "extensaoKm": 1.5          // opcional
  //   }
  //
  // Respostas:
  //   201 Created — registro criado com sucesso
  //   400 Bad Request — dados inválidos
  //   500 Internal Server Error — erro inesperado
  // ============================================================
  async criar(req, res) {
    // Verifica erros da validação (definida no Route)
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados inválidos',
        erros: erros.array().map((e) => ({
          campo: e.path,
          mensagem: e.msg,
        })),
      });
    }

    try {
      const registro = await locationService.salvar(req.body);

      return res.status(201).json({
        sucesso: true,
        mensagem: 'Localização salva com sucesso!',
        dados: registro,
      });
    } catch (error) {
      console.error('[locationController.criar]', error.message);
      return res.status(400).json({
        sucesso: false,
        mensagem: error.message,
      });
    }
  },

  // ============================================================
  // GET /locations
  //
  // Lista todos os registros salvos, do mais recente ao mais antigo.
  //
  // Query Params opcionais:
  //   ?limite=50   — número máximo de registros
  //   ?offset=0    — paginação
  //
  // Resposta:
  //   200 OK — lista de registros + total
  // ============================================================
  async listar(req, res) {
    try {
      // Parseia parâmetros de paginação da query string
      const limite = parseInt(req.query.limite) || 100;
      const offset = parseInt(req.query.offset) || 0;

      // Garante limites razoáveis
      const limiteSanitizado = Math.min(Math.max(1, limite), 500);

      const { registros, total } = await locationService.listar(
        limiteSanitizado,
        offset
      );

      return res.status(200).json({
        sucesso: true,
        dados: registros,
        paginacao: {
          total,
          retornados: registros.length,
          limite: limiteSanitizado,
          offset,
        },
      });
    } catch (error) {
      console.error('[locationController.listar]', error.message);
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao listar registros.',
      });
    }
  },

  // ============================================================
  // GET /locations/:id
  //
  // Busca um registro específico pelo ID.
  //
  // Resposta:
  //   200 OK — registro encontrado
  //   404 Not Found — ID não existe
  // ============================================================
  async buscarUm(req, res) {
    try {
      const registro = await locationService.buscarUm(req.params.id);

      return res.status(200).json({
        sucesso: true,
        dados: registro,
      });
    } catch (error) {
      const status = error.message.includes('não encontrado') ? 404 : 400;
      return res.status(status).json({
        sucesso: false,
        mensagem: error.message,
      });
    }
  },

  // ============================================================
  // DELETE /locations/:id
  //
  // Remove um registro pelo ID.
  //
  // Resposta:
  //   200 OK — deletado com sucesso
  //   404 Not Found — ID não existe
  // ============================================================
  async deletar(req, res) {
    try {
      await locationService.deletar(req.params.id);

      return res.status(200).json({
        sucesso: true,
        mensagem: `Registro ${req.params.id} removido com sucesso.`,
      });
    } catch (error) {
      const status = error.message.includes('não encontrado') ? 404 : 400;
      return res.status(status).json({
        sucesso: false,
        mensagem: error.message,
      });
    }
  },
};

module.exports = locationController;
