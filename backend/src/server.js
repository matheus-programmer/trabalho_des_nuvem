// Importações
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importar configurações do Parse
const { initializeParse } = require('./src/config/parseConfig');

// Inicialização do Express
const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Parse
initializeParse();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// Servir arquivos estáticos do front-end
app.use(express.static(path.join(__dirname, 'public')));

// Rotas para API
const taskRoutes = require('./src/routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// Rota de verificação de saúde da API
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'API em funcionamento',
        timestamp: new Date(),
        version: process.env.npm_package_version || '1.0.0'
    });
});

// Rota para todas as outras requisições não tratadas
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Ocorreu um erro no servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse http://localhost:${PORT}`);
});

// Tratamento para encerramento elegante
process.on('SIGTERM', () => {
    console.log('SIGTERM recebido. Encerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT recebido. Encerrando servidor...');
    process.exit(0);
});