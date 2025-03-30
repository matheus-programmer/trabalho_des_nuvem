const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Middleware para logging de requisições
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
};

// Aplicar middleware de logging a todas as rotas
router.use(requestLogger);

// Rota para buscar tarefas por termo
router.get('/search', taskController.searchTasks);

// Rota para obter todas as tarefas
router.get('/', taskController.getAllTasks);

// Rota para obter uma tarefa específica
router.get('/:id', taskController.getTaskById);

// Rota para criar uma nova tarefa
router.post('/', taskController.createTask);

// Rota para atualizar uma tarefa
router.put('/:id', taskController.updateTask);

// Rota para excluir uma tarefa
router.delete('/:id', taskController.deleteTask);

module.exports = router;