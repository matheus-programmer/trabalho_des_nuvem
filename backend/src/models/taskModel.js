const Parse = require('parse/node');

// Definição da classe Task
const Task = Parse.Object.extend("Task");

// Funções auxiliares para trabalhar com o modelo Task
const taskModel = {
  // Converter objeto Parse para objeto JavaScript
  parseToObject: (parseObject) => {
    return {
      id: parseObject.id,
      title: parseObject.get('title'),
      description: parseObject.get('description'),
      status: parseObject.get('status'),
      createdAt: parseObject.get('createdAt'),
      updatedAt: parseObject.get('updatedAt')
    };
  },
  
  // Criar nova instância de Task
  createTaskInstance: (data) => {
    const task = new Task();
    if (data.title) task.set('title', data.title);
    if (data.description) task.set('description', data.description);
    if (data.status) task.set('status', data.status);
    return task;
  }
};

module.exports = { Task, taskModel };