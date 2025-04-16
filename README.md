# NexaShop - E-commerce Platform

Um moderno e-commerce com tema escuro, integração com Stripe, autenticação de usuários e painel de administração.

## Tecnologias Utilizadas

- **Frontend**: React, TailwindCSS, Shadcn UI, Framer Motion
- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL (opcional, configuração em memória disponível)
- **Pagamentos**: Stripe

## Requisitos

- Node.js 18+ 
- NPM ou Yarn
- Conta no Stripe para processamento de pagamentos (opcional)

## Configuração Inicial

1. Clone o repositório:
   ```
   git clone <url-do-repositorio>
   cd nexashop
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione as seguintes variáveis:
     ```
     # Stripe (opcional, apenas se for utilizar pagamentos)
     STRIPE_SECRET_KEY=sk_test_...
     VITE_STRIPE_PUBLIC_KEY=pk_test_...
     
     # Sessão (gerado automaticamente se não fornecido)
     SESSION_SECRET=alguma_string_secreta_aleatoria
     ```

## Execução do Projeto

```
npm run dev
```

O servidor será iniciado em `http://localhost:5000`.

## Estrutura do Projeto

```
/
├── client/          # Código frontend em React
│   ├── src/
│   │   ├── components/  # Componentes React reutilizáveis
│   │   ├── hooks/       # React hooks personalizados
│   │   ├── lib/         # Utilitários e funções auxiliares
│   │   ├── pages/       # Páginas da aplicação
│   │   └── App.tsx      # Componente principal e rotas
├── server/          # Código backend em Express
│   ├── auth.ts      # Autenticação de usuários
│   ├── index.ts     # Entrada da aplicação
│   ├── routes.ts    # Rotas da API
│   ├── storage.ts   # Interface para armazenamento de dados
│   └── vite.ts      # Configuração do Vite para servidor
├── shared/          # Código compartilhado entre frontend e backend
│   └── schema.ts    # Esquema de dados e validações
└── theme.json       # Configuração de tema
```

## Funcionalidades Principais

1. **Autenticação**: Sistema completo de login e registro
2. **Catálogo de Produtos**: Listagem, filtros, detalhes
3. **Carrinho de Compras**: Adição, remoção, atualização de quantidades
4. **Checkout**: Integração com Stripe para pagamentos
5. **Tema Claro/Escuro**: Alternância entre temas
6. **Responsivo**: Adaptado para dispositivos móveis, tablets e desktop
7. **Animações**: Efeitos visuais avançados com Framer Motion
8. **Visualização Rápida**: Modal com detalhes do produto

## Características Técnicas

- **Estado Global**: React Context API e React Query para gerenciamento de estado
- **Validação de Formulários**: Zod para validação de esquemas
- **Estilização**: TailwindCSS para estilos responsivos
- **Componentes UI**: Sistema de design com Shadcn UI
- **Código Tipado**: TypeScript em todo o projeto
- **Armazenamento**: Memória (padrão) ou PostgreSQL com Drizzle ORM

## Chaves do Stripe

Para utilizar processamento de pagamentos:

1. Crie uma conta em [stripe.com](https://stripe.com)
2. Obtenha suas chaves de teste no painel do Stripe:
   - `VITE_STRIPE_PUBLIC_KEY`: Começa com `pk_test_`
   - `STRIPE_SECRET_KEY`: Começa com `sk_test_`
3. Adicione estas chaves ao arquivo `.env`

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

MIT