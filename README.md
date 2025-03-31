# Gerenciador de Tarefas

Um aplicativo web simples para gerenciar tarefas, usando Node.js, Express e Back4App para o backend e HTML, CSS e JavaScript para o frontend.

## Funcionalidades

- Listar todas as tarefas
- Adicionar novas tarefas
- Editar tarefas existentes
- Excluir tarefas
- Filtrar tarefas por status
- Pesquisar tarefas

## Tecnologias Utilizadas

- **Backend**:
  - Node.js
  - Express
  - Parse Server (Back4App)
  
- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (Vanilla)

## Estrutura do Projeto

```
gerenciador-tarefas/
├── public/                  # Arquivos do frontend
│   ├── index.html           # Página principal
│   ├── style.css            # Estilos CSS
│   └── script.js            # JavaScript do cliente
├── src/                     # Código do backend
│   ├── controllers/         # Controladores da aplicação
│   ├── routes/              # Rotas da API
│   ├── models/              # Modelos de dados
│   └── config/              # Configurações
├── server.js                # Ponto de entrada do backend
├── package.json             # Dependências e scripts
```

## Requisitos

- Node.js 14.x ou superior
- Conta no Back4App (para o banco de dados)

## Instruções de Instalação

1. Clone o repositório
2. Execute `npm install` para instalar as dependências
3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```
   PORT=3000
   BACK4APP_APP_ID=sua_app_id
   BACK4APP_JS_KEY=sua_javascript_key
   ATENÇÃO: Alterar os valores das chaves também em parseConfig.js
   ```
4. Execute `npm start` para iniciar o servidor
5. Acesse `http://localhost:3000` no navegador

## Uso

- **Adicionar tarefa**: Clique no botão "Adicionar Tarefa", preencha o formulário e envie
- **Editar tarefa**: Clique no botão "Editar" ao lado da tarefa que deseja modificar
- **Excluir tarefa**: Clique no botão "Excluir" ao lado da tarefa que deseja remover