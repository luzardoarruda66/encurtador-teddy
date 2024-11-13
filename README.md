# Encurtador de URLs

Este projeto é uma API REST para encurtamento de URLs com autenticação de usuários, contagem de cliques e gerenciamento de URLs encurtadas.

## Tecnologias Utilizadas
- Node.js
- TypeScript
- Express
- Sequelize (com PostgreSQL)
- Docker e Docker Compose
- Swagger para documentação da API

## Instalação e Configuração

### Requisitos
- Node.js
- Docker e Docker Compose

### Passo a Passo para Rodar o Projeto

1. **Clone o repositório**:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd nome-do-projeto
2. **Instale as dependências(caso vá rodar localmente, necessário configurar um docker com postgres)**:
    ```bash
    npm i
3. **Configure as variáveis de ambiente conforme o .env.example**
4. **Rodar o projeto no Docker**
    ```bash
    docker-compose up --build
5. **Caso queira rodar o projeto localmente sem docker(recomendo rodar no docker)**:
    ```bash
    npm run dev

### Documentação
1. **A documentação da API se encontra em**:
    ```bash
    /api-docs
### Principais funcionailidades
* Encurtamento de URLs: Gera URLs curtas a partir de URLs longas.

* Autenticação e Registro de Usuário: Autenticação com JWT e gerenciamento de URLs por usuário.

* Listagem e Gerenciamento de URLs: Usuários autenticados podem listar, editar e excluir URLs.

* Contador de Cliques: Registra o número de acessos a cada URL encurtada.

### Endpoints Principais
#### Autenticação
* POST /auth/signup - Cria uma nova conta de usuário.
* POST /auth/login - Autentica um usuário e retorna um token JWT.
#### URLs
* POST /url/shorten - Encurta uma URL.

* GET /url/ - Redireciona para a URL original e conta o clique.
* GET /url/list - Lista todas as URLs do usuário autenticado.

### Testes unitários
1. **Para rodar os testes unitários basta executar**:
    ```bash
    npm test
## Licença

[MIT](https://choosealicense.com/licenses/mit/)