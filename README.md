# Note Saver — PWA (derivado da extensão)

Este repositório contém uma **Progressive Web App (PWA)** derivada da extensão *Note Saver*, 
com um backend simples em Node/Express, Docker Compose, testes E2E com Playwright e CI básico no GitHub Actions.

## Estrutura
```
../../mnt/data/note_saver_pwa_monorepo/
├─ apps/
│  ├─ web/      # PWA (vanilla)
│  └─ api/      # backend (Express)
├─ docker-compose.yml
└─ .github/workflows/ci.yml
```

## Como rodar localmente (requer Docker & Docker Compose)
```bash
docker-compose up --build
# API: http://localhost:3000/api
# Web (PWA): http://localhost:8080
```

## Endpoints principais (API)
- `GET /api/health` - healthcheck
- `GET /api/notes` - lista notas no servidor
- `POST /api/notes/sync` - sincroniza notas enviadas (body: { notes: [...] })

## Testes
Playwright E2E básico incluso em `apps/web/tests/e2e.spec.js`.
CI exemplo em `.github/workflows/ci.yml`.

## Observações
- O backend usa `apps/api/notes.json` como armazenamento simples (file-based). Para produção troque por DB.
- Para publicar como PWA, hospede `apps/web` (conteúdo estático) em GitHub Pages ou servidor estático com HTTPS.
