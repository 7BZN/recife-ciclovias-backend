// ============================================================
// routes/locationRoutes.js
//
// Definição das rotas REST para o recurso "locations".
//
// Rotas:
//   POST   /locations         — salvar localização
//   GET    /locations         — listar todos os registros
//   GET    /locations/:id     — buscar um registro por ID
//   DELETE /locations/:id     — deletar um registro
// ============================================================

const express              = require('express');
const { body }             = require('express-validator');
const locationController   = require('../controllers/locationController');

const router = express.Router();

// ── Validações do body para POST ─────────────────────────────
// Essas regras são executadas antes do controller.
const validacoesCriar = [
  // latitude: obrigatório, número, entre -90 e 90
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('latitude deve ser um número entre -90 e 90'),

  // longitude: obrigatório, número, entre -180 e 180
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('longitude deve ser um número entre -180 e 180'),

  // cicloviaId: obrigatório, string não vazia
  body('cicloviaId')
    .trim()
    .notEmpty()
    .withMessage('cicloviaId é obrigatório'),

  // tipo: opcional, mas se informado deve ser um dos tipos válidos
  body('tipo')
    .optional()
    .isIn(['CICLOVIA', 'CICLOFAIXA', 'CICLORROTA', 'ciclovia', 'ciclofaixa', 'ciclorrota'])
    .withMessage('tipo deve ser CICLOVIA, CICLOFAIXA ou CICLORROTA'),

  // bairro: opcional, string
  body('bairro')
    .optional()
    .trim()
    .isString()
    .withMessage('bairro deve ser uma string'),

  // extensaoKm: opcional, número positivo
  body('extensaoKm')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('extensaoKm deve ser um número positivo'),
];

// ── Definição das rotas ──────────────────────────────────────

/**
 * POST /locations
 * Salva localização do usuário + dados da ciclovia
 */
router.post('/', validacoesCriar, locationController.criar);

/**
 * GET /locations
 * Lista todos os registros (paginado)
 * Query params: ?limite=100&offset=0
 */
router.get('/', locationController.listar);

/**
 * GET /locations/:id
 * Busca um registro específico
 */
router.get('/:id', locationController.buscarUm);

/**
 * DELETE /locations/:id
 * Remove um registro
 */
router.delete('/:id', locationController.deletar);

module.exports = router;
