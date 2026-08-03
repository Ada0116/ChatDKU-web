# ChatDKU Website Developer Documentation

## Our Stack:

We're using the Next.js framework for its quick development opportunities and rich open-source community. The site runs as a **real Node server** (`next build` + `next start`) on port 3000 on GPU4, behind Apache. Our chat, session, and user data comes from the Django backend.

### How a request reaches a backend

There are three backend services on GPU4, and Apache (`/etc/apache2/sites-enabled/chatdku.conf`) decides which one gets each prefix. It terminates TLS and enforces Shibboleth, passing the identity down as `UID` / `X-DisplayName` headers:

| Path | Goes to |
| --- | --- |
| `/api/chat`, `/api/c/`, `/api/feedback`, `/api/events` | **Django**, `127.0.0.1:8009` |
| `/api/get_session` | **Django** `/api/c/create_session` (an Apache-level rewrite) |
| `/user`, `/admin` | **Django**, `127.0.0.1:8009` |
| `/public/chat`, `/public/auth/get-token` | **FastAPI public**, `127.0.0.1:8999` |
| everything else | **this Next server**, `127.0.0.1:3000` |

One trap in that table: the `/user` rule is `ProxyPass /user http://127.0.0.1:8009/user/`, and the two sides disagree about the trailing slash. Apache appends whatever follows `/user` to a target that already ends in one, and Django's resolver never collapses repeated slashes. So `/user` works (empty remainder), while `/user/upload` reaches Django as `/user//upload` and 404s — **file uploads cannot work in production until that vhost rule is balanced** to `ProxyPass /user/ http://127.0.0.1:8009/user/`. Don't "fix" it by adding a trailing slash on the client; that just turns `/user` into `/user//`.

Two more things follow from that table:

- The student app you are working on talks to **Django**, not to the FastAPI service. The FastAPI backend on `:8999` is a separate product — the unauthenticated public chat used by `ChatDKU-web-public`, with its own JWT auth and a single-step plain-text stream. A third FastAPI service on `:8123` runs the agent itself and is only ever called by Django, through Celery.
- Apache reaches Django directly, so **the route handlers under `app/api/` and `app/user/` only run in development**. They are still written as faithful proxies that mirror Django's URLs 1:1 (see `lib/server/backend.ts` for the full contract), so dev and production behave the same and a change to the Apache config cannot silently start serving mock data. Mock responses only appear when `MOCK_API` is on, which is the default for `npm run dev`.

We're using the [shadcn/ui](https://ui.shadcn.com/) open-source UI library. This is a widely used, simple, and customizable UI library that uses Tailwind CSS for globally consistent styling.

Try to stick to these shadcn/ui components as much as possible, and only create custom components when necessary. This is to keep accessibility standards and consistency.

## Development Guide:

### Dependencies:

- The latest Node.js LTS runtime must be installed on the machine you're using to develop.

### Development flow:

1. Run `npm install` in the frontend directory to install Node dependencies.
2. Run `npm run dev` to spin up a localhost server and navigate to http://localhost:3000/ to see the homepage. The dev server will hot-reload whenever you save.
3. Make necessary edits, and review changes on both a desktop screen and a mobile screen. Test with many aspect ratios to make sure nothing clips or looks broken. `npm run dev` serves mock chat responses with markdown in them, so check that responses stay clear and legible (this is important — users must be able to read ChatDKU's answers easily). Set `MOCK_API=false` in `.env.local` to hit the real backend instead, which needs internal network access.
4. Use `npm run test` to run all tests for essential functionality. 
5. Check that `npm run build` succeeds before pushing to the main branch.

### Deploying to production:

The app runs as a long-lived `npm start` process inside a tmux session on GPU4, serving port 3000. Deploying means rebuilding in place and restarting that process:

```bash
git pull
npm ci
npm run build
```

Then attach to the tmux session running the app, stop it with `Ctrl-C`, and start the new build:

```bash
npm start
```

Detach with `Ctrl-B D` — closing the terminal without detaching kills the server.

Afterwards, visit [ChatDKU](https://chatdku.dukekunshan.edu.cn) in incognito mode. Make sure a chat response streams in and is clear and legible.

> **Rollback**: there is no build backup to restore any more — `git checkout <last-good-commit>` and rebuild.
