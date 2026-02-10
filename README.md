# 🛒 E-commerce Híbrido de Alta Performance (Spring Boot + Angular)

Bem-vindo ao repositório do **E-commerce Híbrido de Alta Performance**. Este projeto é um produto real desenvolvido para validar um modelo de negócios inovador que mescla **Venda Própria (estoque local)** com **Marketing de Afiliados/Dropshipping** em uma interface unificada.

Além de ser uma plataforma de vendas robusta, este repositório serve como um portfólio avançado de arquitetura Full-Stack, utilizando as tecnologias mais modernas do ecossistema Java e Angular.

## 🎯 Objetivo do Projeto

O propósito principal é oferecer uma experiência de compra fluida onde produtos nativos (com checkout interno) convivem harmonicamente com produtos de afiliados (links externos para parceiros como Amazon/Magalu). Tudo isso controlado via banco de dados e gerenciado por um painel administrativo poderoso.

---

## 📸 Screenshots

> *Adicione aqui as capturas de tela do projeto para ilustrar a interface.*

### Home Page (Dark Mode / Gamer)
![Home Page](https://via.placeholder.com/800x450?text=Screenshot+Home+Page+Gamer)

### Dashboard Administrativo ("God Mode")
![Admin Dashboard](https://via.placeholder.com/800x450?text=Screenshot+Admin+Dashboard)

### Checkout com Integração de Endereço
![Checkout](https://via.placeholder.com/800x450?text=Screenshot+Checkout)

---

## 🚀 Funcionalidades Principais

### 🛍️ Modelo Híbrido de Produtos
*   **Flexibilidade Total:** O sistema suporta produtos nativos e de afiliados.
*   **Controle via Database:** Uma simples "flag" no banco de dados define se o produto inicia um checkout interno ou redireciona para um link externo.

### 🛡️ Painel Administrativo "God Mode"
*   **Gestão Completa:** Dashboard com métricas de vendas em tempo real.
*   **Dinâmico:** Gestão de categorias e controle de status de pedidos (Logística).

### 💳 Checkout & Pagamentos
*   **Mercado Pago SDK:** Integração real para processamento de vendas.
*   **Smart Address:** Captura inteligente de endereço via CEP.

### 🔒 Arquitetura Segura
*   **Autenticação JWT:** Tokens seguros para proteção de rotas.
*   **Role-Based Access Control (RBAC):** Diferenciação clara entre permissões de ADMIN e USER.

### 🎨 UX Premium
*   **Dark Mode Nativo:** Interface moderna desenvolvida com Angular Material.
*   **Nicho Tech/Gamer:** Design focado no público-alvo de tecnologia e jogos.

---

## 🛠️ Tecnologias Utilizadas

### Backend (Pasta `/backend`)
*   **Java 17**: Linguagem LTS robusta e performática.
*   **Spring Boot 3.5.0**: Framework líder para microsserviços e APIs REST.
*   **Spring Security + JWT**: Segurança de ponta a ponta.
*   **Spring Data JPA**: Persistência de dados simplificada.
*   **PostgreSQL**: Banco de dados relacional confiável.
*   **Mercado Pago SDK**: Integração de pagamentos.
*   **Lombok**: Produtividade no código Java.
*   **Docker**: Containerização para facilitar o deploy.

### Frontend (Pasta `/frontend`)
*   **Angular 18**: A versão mais recente e performática do framework.
*   **Angular Material**: Componentes de UI elegantes e responsivos.
*   **Standalone Components**: Arquitetura moderna sem NgModules.
*   **RxJS**: Programação reativa.

---

## 🔮 Atualizações Futuras (Roadmap)

Estamos constantemente evoluindo. As próximas funcionalidades planejadas incluem:

*   **CMS Nativo:** Configuração de banners e textos de marketing diretamente pelo Admin, sem necessidade de deploy.
*   **Gestão de Estoque Avançada:** Travamento automático de vendas baseado no estoque real.
*   **Área do Cliente:** Histórico detalhado de pedidos e rastreamento de entregas.
*   **Integração Logística:** Cálculo de frete em tempo real (Correios/Melhor Envio).

---

## 💻 Como Rodar Localmente

Certifique-se de ter instalado:
*   Node.js (v20+)
*   Java JDK 17+
*   Git
*   Docker (Opcional, mas recomendado para o Banco de Dados)

### 1. Instalar Dependências
Na pasta raiz do projeto, execute:
```bash
npm install
npm run install:all
```
Isso instalará as dependências do root, do frontend e compilará o backend.

### 2. Configurar Banco de Dados
O projeto utiliza PostgreSQL.
1.  Crie um banco de dados (localmente ou na nuvem, ex: Neon/Render).
2.  Crie um arquivo `backend/src/main/resources/application.properties` (baseado no exemplo existente).
3.  Configure suas credenciais:
    ```properties
    spring.datasource.url=jdbc:postgresql://host:port/seu_banco
    spring.datasource.username=seu_usuario
    spring.datasource.password=sua_senha
    # Configurações JWT e Mercado Pago também devem ser ajustadas aqui
    ```

### 3. Rodar a Aplicação
Para subir o Frontend e o Backend simultaneamente:
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

---

## 🤝 Contribuição

Este projeto é **Open Source** e adoramos receber contribuições da comunidade!
Se você deseja implementar uma nova integração de pagamento, melhorar a UI ou corrigir bugs:

1.  Faça um **Fork** do projeto.
2.  Crie uma **Branch** para sua feature (`git checkout -b feature/MinhaFeature`).
3.  Faça o **Commit** (`git commit -m 'Adicionando nova feature'`).
4.  Faça o **Push** (`git push origin feature/MinhaFeature`).
5.  Abra um **Pull Request**.

---

## 📝 Licença

Este projeto é disponibilizado para fins de estudo e portfólio. Sinta-se à vontade para usar o código como base para seus próprios projetos.
