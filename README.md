# 🛍️ E-commerce Monorepo (Spring Boot + Angular)

Bem-vindo ao repositório do projeto **E-commerce Monorepo**! Este projeto combina o poder do **Java/Spring Boot** no backend com a modernidade do **Angular** no frontend, tudo em uma estrutura unificada.

## 🚀 Tecnologias Utilizadas

### Backend (Pasta `/backend`)
*   **Java 21**: Linguagem moderna e robusta.
*   **Spring Boot 3.5.0**: Framework para criação de microsserviços e APIs REST.
*   **Spring Data JPA**: Abstração para persistência de dados.
*   **PostgreSQL (Neon)**: Banco de dados relacional na nuvem.
*   **Spring Security**: Configurado para controle de acesso (CORS habilitado).
*   **Lombok**: Redução de boilerplate code.
*   **Docker**: Containerização para deploy fácil.

### Frontend (Pasta `/frontend`)
*   **Angular 17+**: Framework web poderoso da Google.
*   **Angular Material**: Biblioteca de componentes de UI (Material Design 3).
*   **Standalone Components**: Nova arquitetura do Angular (sem NgModules).
*   **HttpClient**: Consumo de API REST.

---

## 🛠️ Como Rodar Localmente

Certifique-se de ter instalado:
*   Node.js (v20+)
*   Java JDK 17+
*   Git

### 1. Instalar Dependências (Raiz)
Na pasta raiz do projeto, rode:
```bash
npm install
npm run install:all
```
Isso vai instalar as dependências do root, do frontend e compilar o backend.

### 2. Configurar Banco de Dados
O projeto espera um banco PostgreSQL.
1.  Crie um banco no Neon ou localmente.
2.  Edite o arquivo `backend/src/main/resources/application.properties` (crie-o baseando-se no `application.properties.example`).
3.  Adicione suas credenciais:
    ```properties
    spring.datasource.url=jdbc:postgresql://host:port/dbname
    spring.datasource.username=seu_usuario
    spring.datasource.password=sua_senha
    ```

### 3. Rodar Tudo (Frontend + Backend)
Com um único comando, você sobe os dois servidores simultaneamente:
```bash
npm start
```
*   **Frontend**: http://localhost:4200
*   **Backend**: http://localhost:8080

---

## ☁️ Deploy (Produção)

Este projeto está pré-configurado para deploy no **Render** via arquivo `render.yaml`.

### Estrutura de Deploy
1.  **Frontend**: Hospedado como **Static Site** no Render.
2.  **Backend**: Hospedado como **Docker Service** no Render.

### Passos para Deploy no Render
1.  Crie uma conta no [Render.com](https://render.com).
2.  Vá em **Blueprints** > **New Blueprint Instance**.
3.  Conecte este repositório.
4.  O Render vai ler o arquivo `render.yaml` e criar os dois serviços automaticamente.
5.  **Importante**: Preencha as variáveis de ambiente do banco (`SPRING_DATASOURCE_URL`, etc) quando solicitado.

### Variáveis de Ambiente
*   **Dev**: O Frontend aponta para `localhost:8080`.
*   **Prod**: O Frontend apontará para a URL do seu backend no Render.
    *   *Nota*: Após o deploy do backend, atualize o arquivo `frontend/src/environments/environment.ts` com a URL real e faça um novo commit.

---

## 📂 Estrutura de Pastas

```plaintext
/
├── backend/            # Código Java Spring Boot
│   ├── src/main/java   # Controllers, Entities, Repositories
│   └── Dockerfile      # Configuração de imagem Docker
├── frontend/           # Código Angular
│   ├── src/app         # Componentes e Services
│   └── render.yaml     # Blueprint de deploy do Render
├── package.json        # Scripts unificados de start
└── .gitignore          # Arquivos ignorados pelo Git
```

## 📝 Licença
Este projeto é de livre uso para estudos e personalização.
