const Parse = require('parse/node');
const { Task, taskModel } = require('../models/taskModel');

// Obter todas as tarefas
exports.getAllTasks = async (req, res) => {
  try {
    const query = new Parse.Query(Task);
    
    // Permitir ordenação por parâmetros
    if (req.query.sort) {
      const sortField = req.query.sort;
      const sortDir = req.query.dir === 'desc' ? -1 : 1;
      
      if (sortDir === 1) {
        query.ascending(sortField);
      } else {
        query.descending(sortField);
      }
    } else {
      // Ordenação padrão
      query.descending('updatedAt');
    }
    
    // Filtrar por status, se fornecido
    if (req.query.status) {
      query.equalTo('status', req.query.status);
    }
    
    // Implementação básica de paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    query.skip(skip);
    query.limit(limit);
    
    const results = await query.find();
    const count = await query.count();
    
    // Transformar objetos Parse em objetos JavaScript regulares
    const tasks = results.map(task => taskModel.parseToObject(task));
    
    res.status(200).json({ 
      success: true, 
      data: tasks,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar tarefas', error: error.message });
  }
};

// Obter uma tarefa por ID
exports.getTaskById = async (req, res) => {
  try {
    const query = new Parse.Query(Task);
    const task = await query.get(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
    }
    
    res.status(200).json({
      success: true,
      data: taskModel.parseToObject(task)
    });
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
      return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
    }
    res.status(500).json({ success: false, message: 'Erro ao buscar tarefa', error: error.message });
  }
};

// Criar uma nova tarefa
exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    // Validar dados
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Título e descrição são obrigatórios' });
    }
    
    // Criar nova tarefa
    const task = taskModel.createTaskInstance({
      title,
      description,
      status: status || 'pendente'
    });
    
    await task.save();
    
    res.status(201).json({
      success: true,
      message: 'Tarefa criada com sucesso',
      data: taskModel.parseToObject(task)
    });
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ success: false, message: 'Erro ao criar tarefa', error: error.message });
  }
};

// Atualizar uma tarefa existente
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const taskId = req.params.id;
    
    // Validar que pelo menos um campo está sendo atualizado
    if (!title && !description && !status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Pelo menos um campo (título, descrição ou status) deve ser fornecido para atualização' 
      });
    }
    
    // Buscar a tarefa
    const query = new Parse.Query(Task);
    const task = await query.get(taskId);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
    }
    
    // Atualizar campos
    if (title) task.set('title', title);
    if (description) task.set('description', description);
    if (status) task.set('status', status);
    
    await task.save();
    
    res.status(200).json({
      success: true,
      message: 'Tarefa atualizada com sucesso',
      data: taskModel.parseToObject(task)
    });
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
      return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
    }
    res.status(500).json({ success: false, message: 'Erro ao atualizar tarefa', error: error.message });
  }
};

// Excluir uma tarefa
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Buscar a tarefa
    const query = new Parse.Query(Task);
    const task = await query.get(taskId);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
    }
    
    // Excluir a tarefa
    await task.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Tarefa excluída com sucesso',
      data: { id: taskId }
    });
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
      return res.status(404).json({ success: false, message: 'Tarefa não encontrada' });
    }
    res.status(500).json({ success: false, message: 'Erro ao excluir tarefa', error: error.message });
  }
};

// Buscar tarefas por texto
exports.searchTasks = async (req, res) => {
  try {
    const { term } = req.query;
    
    if (!term) {
      return res.status(400).json({ success: false, message: 'Termo de busca é obrigatório' });
    }
    
    // Criar queries para buscar por título e descrição
    const titleQuery = new Parse.Query(Task);
    titleQuery.contains('title', term);
    
    const descriptionQuery = new Parse.Query(Task);
    descriptionQuery.contains('description', term);
    
    // Combinar as queries com OR
    const mainQuery = Parse.Query.or(titleQuery, descriptionQuery);
    
    // Ordenar por data de atualização
    mainQuery.descending('updatedAt');
    
    const results = await mainQuery.find();
    
    // Transformar objetos Parse em objetos JavaScript regulares
    const tasks = results.map(task => taskModel.parseToObject(task));
    
    res.status(200).json({ 
      success: true, 
      data: tasks,
      count: tasks.length,
      searchTerm: term
    });
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar tarefas', error: error.message });
  }
};