// ============================================================
// server.js — Ponto de entrada do backend
//
// Inicializa o servidor Express com todos os middlewares,
// rotas e conexão com o banco de dados SQLite.
// ============================================================

// Carrega variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const helmet  = require('helmet');

// Importações internas
const { inicializarBancoDados } = require('./database/database');
const locationRoutes            = require('./routes/locationRoutes');

// ── Inicialização da aplicação Express ───────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globais ──────────────────────────────────────

// helmet: adiciona headers de segurança HTTP automaticamente
app.use(helmet());

// cors: permite requisições de outras origens (ex: app mobile)
// Em produção, restringir para o IP/domínio do app
app.use(cors({
  origin: '*', // liberado para desenvolvimento
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// express.json: parseia o body das requisições como JSON
app.use(express.json());

// morgan: log de requisições no terminal (útil para debug)
// Formato 'dev': exibe método, rota, status e tempo de resposta
app.use(morgan('dev'));

// ── Inicialização do banco de dados ──────────────────────────
// Cria as tabelas se não existirem
inicializarBancoDados();

// ── Rotas da API ─────────────────────────────────────────────
// Prefixo /locations para todos os endpoints de localização
app.use('/locations', locationRoutes);

// ── Rota de saúde (health check) ────────────────────────────
// Útil para verificar se o servidor está rodando
app.get('/health', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'Backend Ciclovias Recife rodando ✅',
    versao: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── Tratamento de rotas não encontradas ─────────────────────
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: `Rota ${req.method} ${req.path} não encontrada`,
  });
});

// ── Middleware global de erros ───────────────────────────────
// Captura qualquer erro não tratado nas rotas
// Os 4 parâmetros (err, req, res, next) são obrigatórios para
// o Express reconhecer como middleware de erro
app.use((err, req, res, next) => {
  console.error('[ERRO GLOBAL]', err.stack);
  res.status(500).json({
    sucesso: false,
    mensagem: 'Erro interno no servidor.',
    detalhe: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ── Iniciar o servidor ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   🚲 Backend Ciclovias Recife            ║
║   Rodando em: http://192.168.0.3     ║
║   Ambiente: ${process.env.NODE_ENV || 'development'}              ║
╚══════════════════════════════════════════╝
  `);
});

module.exports = app;
