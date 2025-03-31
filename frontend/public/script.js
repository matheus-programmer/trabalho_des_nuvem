// URL base da API
const apiUrl = 'https://parseapi.back4app.com/classes/Task';

// Chaves de autenticação do Back4App (obtidas do parseConfig.js)
const BACK4APP_APP_ID = 'Ky5Bq9nLE90cYTcPtie9wKYdZKWsfsWKRnqzmIQo';
const BACK4APP_JS_KEY = 'zcHQBkod7Oi5oPBHhJlk0A4cqwIjlDHe58IJxrri';

// Função para carregar as tarefas
async function loadTasks() {
    try {
        // Exibir indicador de carregamento
        const taskList = document.querySelector('#task-list ul');
        taskList.innerHTML = '<li class="loading">Carregando tarefas...</li>';
        
        const response = await fetch(apiUrl, {
            headers: {
                'X-Parse-Application-Id': BACK4APP_APP_ID,
                'X-Parse-JavaScript-Key': BACK4APP_JS_KEY
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        taskList.innerHTML = '';
        
        if (!data.results || data.results.length === 0) {
            taskList.innerHTML = '<li class="empty-list">Nenhuma tarefa encontrada</li>';
            return;
        }
        
        data.results.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.dataset.id = task.objectId;
            taskItem.innerHTML = `
                <div>
                    <strong>${task.title}</strong>
                    <p>${task.description}</p>
                    <span class="status-badge ${task.status}">Status: ${task.status}</span>
                </div>
                <div class="task-buttons">
                    <button class="edit-btn" onclick="openEditModal('${task.objectId}')">Editar</button>
                    <button class="delete-btn" onclick="deleteTask('${task.objectId}')">Excluir</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        const taskList = document.querySelector('#task-list ul');
        taskList.innerHTML = `<li class="error">Erro ao carregar tarefas: ${error.message}</li>`;
    }
}

// Função para adicionar uma tarefa
async function addTask(title, description, status) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'X-Parse-Application-Id': BACK4APP_APP_ID,
                'X-Parse-JavaScript-Key': BACK4APP_JS_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                status
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }
        
        await response.json();
        loadTasks();
        closeModal('add-task-modal');
        resetForm('add-task-form');
        
        // Mostrar mensagem de sucesso
        showMessage('Tarefa adicionada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
        showMessage(`Erro ao adicionar tarefa: ${error.message}`, 'error');
    }
}

// Função para atualizar uma tarefa
async function updateTask(id, title, description, status) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'X-Parse-Application-Id': BACK4APP_APP_ID,
                'X-Parse-JavaScript-Key': BACK4APP_JS_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                status
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }
        
        await response.json();
        loadTasks();
        closeModal('edit-task-modal');
        
        // Mostrar mensagem de sucesso
        showMessage('Tarefa atualizada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        showMessage(`Erro ao atualizar tarefa: ${error.message}`, 'error');
    }
}

// Função para excluir uma tarefa
async function deleteTask(id) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'X-Parse-Application-Id': BACK4APP_APP_ID,
                'X-Parse-JavaScript-Key': BACK4APP_JS_KEY
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }
        
        await response.json();
        loadTasks();
        
        // Mostrar mensagem de sucesso
        showMessage('Tarefa excluída com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        showMessage(`Erro ao excluir tarefa: ${error.message}`, 'error');
    }
}

// Função para buscar uma tarefa específica
async function getTask(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            headers: {
                'X-Parse-Application-Id': BACK4APP_APP_ID,
                'X-Parse-JavaScript-Key': BACK4APP_JS_KEY
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao obter detalhes da tarefa:', error);
        showMessage(`Erro ao obter detalhes da tarefa: ${error.message}`, 'error');
        return null;
    }
}

// Função para abrir o modal de edição
async function openEditModal(id) {
    // Mostrar indicador de carregamento
    document.getElementById('edit-form-content').style.display = 'none';
    document.getElementById('edit-loading').style.display = 'block';
    openModal('edit-task-modal');
    
    const task = await getTask(id);
    
    document.getElementById('edit-loading').style.display = 'none';
    document.getElementById('edit-form-content').style.display = 'block';
    
    if (!task) {
        closeModal('edit-task-modal');
        return;
    }

    document.getElementById('edit-task-id').value = task.objectId;
    document.getElementById('edit-title').value = task.title;
    document.getElementById('edit-description').value = task.description;
    document.getElementById('edit-status').value = task.status;
}

// Função para mostrar mensagens temporárias
function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('message-container');
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    messageContainer.appendChild(messageElement);
    
    // Remover a mensagem após 3 segundos
    setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => {
            messageElement.remove();
        }, 500);
    }, 3000);
}

// Funções para manipulação de modais
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.classList.add('modal-open');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Função para resetar formulário
function resetForm(formId) {
    document.getElementById(formId).reset();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Carregar tarefas ao iniciar
    loadTasks();

    // Listener para botão de adicionar tarefa
    document.getElementById('add-task-btn').addEventListener('click', () => {
        openModal('add-task-modal');
    });

    // Listeners para fechar modais
    document.querySelectorAll('.close-modal-btn').forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.closest('.modal').id;
            closeModal(modalId);
        });
    });

    // Fechar modal ao clicar fora dele
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Listener para formulário de adicionar tarefa
    document.getElementById('add-task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const status = document.getElementById('status').value;
        
        addTask(title, description, status);
    });

    // Listener para formulário de editar tarefa
    document.getElementById('edit-task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-task-id').value;
        const title = document.getElementById('edit-title').value;
        const description = document.getElementById('edit-description').value;
        const status = document.getElementById('edit-status').value;
        
        updateTask(id, title, description, status);
    });
});