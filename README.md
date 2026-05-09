# projeto-vamos

Portal de análise e gestão para o projeto Vamos.

## Estrutura do Projeto

```
projeto-vamos/
├── portal/          # Aplicação Next.js (frontend + API)
└── wireframes/      # Protótipos HTML estáticos
```

## Desenvolvimento Local

```bash
cd portal
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Crie um arquivo `portal/.env.local` com as variáveis de ambiente necessárias (Supabase, etc.).

## Deploy em Produção (Vercel)

**URL de produção:** https://projeto-vamos.vercel.app

O deploy é automático via Vercel a cada push para o branch `master`.

### Fluxo de deploy

```
git add <arquivos>
git commit -m "feat: descrição da mudança"
git push origin master
```

O Vercel detecta o push, faz o build (`npm run build` dentro de `portal/`) e publica automaticamente em ~1-2 minutos.

### Deploy manual via CLI (opcional)

```bash
npm install -g vercel
cd portal
vercel --prod
```

### Configurações necessárias no Vercel

No painel do Vercel (https://vercel.com/dashboard), configurar em **Settings → Environment Variables**:

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |

> **Root Directory:** definir como `portal` nas configurações do projeto no Vercel.

### Verificar o deploy

Após o push, acompanhe o status em:
- https://vercel.com/dashboard → projeto `projeto-vamos`
- Ou via CLI: `vercel ls`

Se o deploy falhar, consulte os logs em **Vercel → Deployments → [deploy recente] → Build Logs**.

## Stack

- **Frontend:** Next.js 16 + React 19 + Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL + Auth)
- **Hospedagem:** Vercel
