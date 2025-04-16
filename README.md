# 🛒 NexaShop – Plataforma Moderna de E-commerce

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**NexaShop** é uma plataforma completa de e-commerce com tema escuro, integração de pagamentos via Stripe, painel administrativo, carrinho de compras, autenticação de usuários e muito mais. Um projeto robusto e moderno, inspirado nas melhores experiências de compra online.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: React, TailwindCSS, Shadcn UI, Framer Motion
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL (opcional, modo em memória disponível)
- **Pagamentos**: Stripe
- **Validações**: Zod
- **ORM**: Drizzle ORM
- **Estado Global**: React Context API + React Query
- **Animações**: Framer Motion
- **Design Responsivo**: Mobile First com Tailwind

---

## 📦 Requisitos

- Node.js 18+
- NPM ou Yarn
- Conta no Stripe (para habilitar pagamentos)

---

## ⚙️ Configuração Inicial

1. Clone o repositório:
   ```bash
   git clone https://github.com/LuisCarlos01/nexashop.git
   cd nexashop
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz e adicione:

   ```env
   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   VITE_STRIPE_PUBLIC_KEY=pk_test_...

   # Sessão
   SESSION_SECRET=alguma_string_secreta_aleatoria
   ```

---

## ▶️ Execução do Projeto

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:5000`.

---

## 🧱 Estrutura do Projeto

```
/
├── client/           # Frontend React
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       └── App.tsx
├── server/           # Backend Node.js/Express
│   ├── auth.ts
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── vite.ts
├── shared/           # Código compartilhado
│   └── schema.ts
└── theme.json        # Configuração de tema
```

---

## ✨ Funcionalidades

- ✅ Autenticação de usuários (login, registro, sessões)
- ✅ Catálogo com filtros e visualização rápida
- ✅ Carrinho de compras dinâmico
- ✅ Checkout com integração Stripe
- ✅ Painel administrativo para gerenciamento de produtos
- ✅ Tema claro/escuro com alternância em tempo real
- ✅ Design moderno, responsivo e com animações suaves
- ✅ Tipagem completa com TypeScript

---

## 💳 Chaves do Stripe

1. Crie sua conta em [stripe.com](https://stripe.com)
2. Copie suas chaves de teste:
   - `VITE_STRIPE_PUBLIC_KEY` (pk_test_...)
   - `STRIPE_SECRET_KEY` (sk_test_...)
3. Cole no `.env`

---

## 🤝 Contribuição

Contribuições são muito bem-vindas!  
Você pode abrir uma issue ou enviar um pull request.

---

## 👨‍💻 Autor

Desenvolvido com 💜 por **Luis Carlos**  
[GitHub](https://github.com/LuisCarlos01) | [LinkedIn](https://www.linkedin.com/in/luizcarloss/)

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.
