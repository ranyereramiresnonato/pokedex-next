# Pokédex

Aplicação full stack de Pokédex construída com Next.js (App Router), TypeScript, Tailwind CSS, PostgreSQL, Prisma e Auth.js. O catálogo, a busca, a paginação e os detalhes vêm da [PokéAPI](https://pokeapi.co/). O banco guarda apenas usuários e a relação de favoritos.

## Funcionalidades

- Catálogo paginado com 24 Pokémon por página, usando `limit`/`offset` para percorrer todo o catálogo.
- Busca parcial por nome, sem diferenciar maiúsculas/minúsculas, hífens ou acentos. A lista global de nomes é cacheada e filtrada no servidor.
- Página de detalhe em rota própria (`/pokemon/[idOrName]`) com foco em conhecer o Pokémon, no estilo de uma Pokédex do anime:
  - arte oficial e sprites principais (frontal, costas e versões brilhantes);
  - altura, peso, categoria, tipos, gênero e habitat;
  - classificação, cor, forma e geração;
  - estatísticas base com barras acessíveis;
  - habilidades (incluindo ocultas);
  - descrições da Pokédex sem textos duplicados e sem repetir versões de jogos;
  - linha evolutiva horizontal, com ramificações e condições especiais, sem níveis;
  - gritos oficiais (`cries`);
  - variedades e formas alternativas.
- Interface, rótulos e mensagens em português. A PokéAPI não aceita parâmetro de idioma e nem todo conteúdo possui pt-BR; quando não há tradução oficial, o texto descritivo usa o idioma original como fallback.
- Visual mais cartunesco inspirado em uma Pokédex de bolso, sem exibir detalhes técnicos da fonte de dados.
- Cadastro com nick e senha, login, logout e sessão segura.
- Favoritar/desfavoritar Pokémon com atualização otimista.
- Página de favoritos privada por usuário, ordenada pelos mais recentes.
- Estados de carregamento, erro, lista vazia e falha da PokéAPI.
- Layout responsivo e acessível, com foco visível e respeito a `prefers-reduced-motion`.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Linguagem | TypeScript `strict` |
| Estilos | Tailwind CSS 4 |
| Banco | PostgreSQL 17 (Docker) |
| ORM | Prisma 6 |
| Validação | Zod 3 |
| Autenticação | Auth.js (NextAuth v5, credenciais, sessão JWT) |
| Hash de senha | Argon2id via `@node-rs/argon2` |
| Testes | Vitest 5 |

## Estrutura principal

```text
pokedex/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (public)/login, register
│   │   ├── pokemon/             # catálogo e detalhe
│   │   ├── favorites/           # página protegida + Server Actions
│   │   ├── api/auth/[...nextauth]/
│   │   └── layout.tsx, page.tsx, not-found.tsx
│   ├── components/              # header, cards, busca, paginação, detail...
│   ├── lib/                     # auth, db, PokeAPI, validações, serviços
│   ├── types/                   # tipos da PokéAPI e augmentação da sessão
│   └── proxy.ts                 # redireciona /favorites sem cookie de sessão
├── docker-compose.yml           # somente PostgreSQL
├── .env.example
└── vitest.config.mts
```

## Pré-requisitos

- Node.js 22 LTS (ou >= 20.9)
- npm 10+
- Docker com Docker Compose

Confira:

```bash
node -v
npm -v
docker --version
docker compose version
```

## Setup local

```bash
git clone <url-do-repositorio> pokedex
cd pokedex
npm install
cp .env.example .env
```

Gere um segredo forte e coloque em `AUTH_SECRET` no `.env`:

```bash
openssl rand -base64 32
```

Exemplo de `.env` local:

```dotenv
DATABASE_URL="postgresql://pokedex:pokedex_dev@localhost:5432/pokedex?schema=public"
AUTH_SECRET="cole-o-valor-gerado"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

Suba o PostgreSQL:

```bash
docker compose up -d
docker compose ps
```

Aplique a migração e gere o Prisma Client:

```bash
npm run db:migrate
npm run db:generate
```

O `npm install` já executa `prisma generate` via `postinstall`, mas os comandos acima deixam o estado explícito.

Rode em desenvolvimento:

```bash
npm run dev
```

Acesse **http://localhost:3000**. A raiz redireciona para `/pokemon`.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Sobe o build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (execução única) |
| `npm run test:watch` | Vitest em watch |
| `npm run db:generate` | Gera o Prisma Client |
| `npm run db:migrate` | Cria/aplica migrações em desenvolvimento |
| `npm run db:deploy` | Aplica migrações existentes (produção) |
| `npm run db:studio` | Abre o Prisma Studio |

## Modelo de dados

O banco contém **somente** `users` e `favorites`. Nenhum dado de Pokémon é persistido.

```prisma
model User {
  id                 String     @id @default(uuid())
  nickname           String     @db.VarChar(20)
  nicknameNormalized String     @unique
  passwordHash       String
  createdAt          DateTime   @default(now())
  favorites          Favorite[]
}

model Favorite {
  id        String   @id @default(uuid())
  userId    String
  pokemonId Int
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, pokemonId])
  @@index([userId])
}
```

- `nicknameNormalized` (nick em minúsculas) garante unicidade sem diferenciar maiúsculas/minúsculas.
- A chave composta `(userId, pokemonId)` impede duplicatas.
- Excluir um usuário remove seus favoritos em cascata.
- O `userId` usado nas mutações vem sempre da sessão autenticada, nunca do cliente.

## Segurança e decisões

- **Senhas:** Argon2id com `memoryCost=19456` KiB, `timeCost=2`, `parallelism=1` e salt aleatório. Nunca são armazenadas em texto puro nem retornadas pela API. `passwordHash` fica restrito ao servidor.
- **Sessão:** Auth.js com estratégia JWT, validade de 7 dias, cookies `HttpOnly` e `SameSite=Lax`; `Secure` é aplicado em produção pela biblioteca.
- **Auth.js v5:** utilizada a versão beta estável atual (`5.0.0-beta.32`), compatível com Next.js 16. As rotas de autenticação padrão já incluem proteção CSRF; Server Actions do Next também validam a origem.
- **Rate limit:** em memória, com janela fixa, em login (10 tentativas/15 min por IP+nick) e cadastro (10/hora por IP). É adequado para uma instância local/única. Em produção com múltiplas instâncias, troque por Redis/Upstash mantendo a mesma interface de `src/lib/rate-limit.ts`.
- **Validação:** todas as entradas são validadas novamente no servidor com Zod, incluindo nick, senha, `pokemonId` e `callbackUrl` (bloqueia redirecionamento externo).
- **Privacidade:** a página `/favorites` exige sessão, as Server Actions verificam a sessão e todas as consultas filtram por `userId`.
- **Logs:** não registram senhas, hashes, cookies ou tokens.
- **Limite de entrada:** nick 3–20 caracteres (`A-Z`, `a-z`, `0-9`, `_`), senha 8–128 caracteres.

### PokéAPI: cache, concorrência e falhas

- Base: `https://pokeapi.co/api/v2/`.
- `lib/pokemon-api.ts` centraliza chamadas tipadas com timeout de 12s.
- Lista global de nomes: cache de 24h. Detalhes: cache de 1h (`fetch` + `revalidate`).
- Cards de uma página carregam detalhes resumidos com concorrência máxima de 6.
- Erros 404, 5xx e falhas de rede geram mensagens amigáveis e botão “Tentar novamente”.
- Nenhum payload da PokéAPI é salvo no PostgreSQL.

### Por que não há endpoints REST completos para favoritos?

As mutações e leituras privadas usam Server Actions, mantendo um único projeto Next.js e evitando uma API REST desnecessária. A única Route Handler é a exigida pelo Auth.js em `/api/auth/[...nextauth]`.

## Testes

```bash
npm test
```

Cobrem:

- validação de nick/senha/IDs e normalização;
- hash Argon2id, verificação e salt;
- rate limit e expiração de janela;
- cadastro sem senha em texto puro, retorno sem `passwordHash`;
- rejeição de nick duplicado ignorando caixa;
- login correto/incorreto;
- favoritos idempotentes, persistência e isolamento entre usuários;
- ID inválido rejeitado antes do repositório;
- Server Action de favoritos bloqueando anônimos e usando o `userId` da sessão;
- busca parcial, paginação nativa/clamp e elipses;
- sprites principais sem duplicatas, condições de evolução sem níveis e deduplicação de descrições;
- cliente da PokéAPI: URL de paginação, 404, falha de rede, fallback e concorrência.

As chamadas externas são mockadas nos testes; não é necessário internet.

Também foi validado manualmente o fluxo completo com dois usuários: cadastro → login → busca → detalhe → favoritar → favoritos → logout → login → persistência → isolamento → desfavoritar, além de layout móvel sem overflow.

## Produção

1. Provisione um PostgreSQL gerenciado e defina `DATABASE_URL` com SSL se necessário.
2. Gere um `AUTH_SECRET` forte e exclusivo.
3. Defina `AUTH_URL`/`NEXTAUTH_URL` com a URL pública HTTPS.
4. Aplique as migrações:

```bash
npm ci
npm run db:deploy
npm run build
npm start
```

Recomendações:

- Use HTTPS obrigatório.
- Execute atrás de um proxy confiável que preencha `X-Forwarded-For` (usado pelo rate limit).
- Troque o rate limit em memória por um armazenamento compartilhado se houver mais de uma instância.
- Monitore erros do servidor e faça backup do banco.
- Defina `NODE_ENV=production`.

## Solução de problemas

**Porta 5432 ocupada**

```bash
docker compose ps
sudo ss -ltnp | grep 5432
```

Altere a porta publicada em `docker-compose.yml` e a porta da `DATABASE_URL` juntas.

**Erro de conexão com o banco**

```bash
docker compose up -d
docker compose logs db
```

**Prisma Client desatualizado**

```bash
npm run db:generate
```

**Migração não aplicada**

```bash
npm run db:migrate
```

**Resetar o banco local (apaga os dados)**

```bash
docker compose down -v
docker compose up -d
npm run db:migrate
```

**`AUTH_SECRET` ausente ou curto**

Gere outro com `openssl rand -base64 32` e reinicie o servidor.

**PokéAPI indisponível**

As páginas mostram estado de erro com “Tentar novamente”. Verifique a conexão; nenhum dado de Pokémon fica salvo no banco.

**`node: command not found`**

Instale Node.js 22 LTS ou adicione o diretório do Node ao `PATH`. Nesta máquina o Node foi instalado em `~/.local/node/bin` e adicionado ao `~/.bashrc`/`~/.profile`.

## Referências

- PokéAPI: https://pokeapi.co/docs/v2
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Auth.js: https://authjs.dev/
