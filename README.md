# NLW Pocket JS Node Backend - in.orbit


Este repositório contém o backend da aplicação **NLW Pocket 1.0 - In Orbit**, desenvolvida utilizando Node.js, NestJS e PostgreSQL. O backend é responsável pela lógica de metas, progresso semanal, oferecendo APIs que o frontend consome.




## Tecnologias Utilizadas


[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-29ABE2?style=flat&logo=drizzle-orm&logoColor=white)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Zod](https://img.shields.io/badge/Zod-E69F66?style=flat&logo=zod&logoColor=white)](https://zod.dev/)
[![Biome](https://img.shields.io/badge/Biome-FFCC00?style=flat&logoColor=black)](https://biomejs.dev/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![Day.js](https://img.shields.io/badge/Day.js-FFCC00?style=flat&logo=dayjs&logoColor=black)](https://day.js.org/)

nlw-pocket-js-node-in.orbit/
├── .migrations/
│   └── meta/
│       ├── 0000_calm_leo.sql             # Migração inicial
│       ├── 0001_silky_blink.sql          # Segunda migração
├── .vscode/
│   └── settings.json                     # Configurações do VSCode
├── assets/                               # Arquivos estáticos
├── src/
│   ├── db/
│   │   ├── index.ts                      # Configuração do Drizzle ORM
│   │   ├── schema.ts                     # Definição do schema do banco de dados
│   │   ├── seed.ts                       # Script para popular o banco de dados
│   ├── functions/
│   │   ├── create-goal.ts                # Função para criação de metas
│   │   ├── create-goal-completion.ts     # Função para registrar conclusão de metas
│   │   ├── get-week-summary.ts           # Função para obter resumo semanal
│   │   ├── get-week-pending-goals.ts     # Função para listar metas pendentes
│   ├── http/
│   │   ├── routes/
│   │   │   ├── create-goal.ts            # Rota para criar metas
│   │   │   ├── create-completion.ts      # Rota para registrar conclusão de metas
│   │   │   ├── get-pending-goals.ts      # Rota para listar metas pendentes
│   │   │   ├── get-week-summary.ts       # Rota para obter resumo semanal
│   ├── env.ts                            # Arquivo de variáveis de ambiente
├── package.json                          # Dependências e scripts da aplicação
├── .env                                  # Variáveis de ambiente
├── .gitignore                            # Arquivos ignorados pelo Git
├── docker-compose.yml                    # Configuração do Docker
├── drizzle.config.ts                     # Configuração do Drizzle ORM
├── biome.json                            # Configuração do Biome
├── tsconfig.json                         # Configuração do TypeScript
├── tsconfig.build.json                   # Configuração de build do TypeScript
