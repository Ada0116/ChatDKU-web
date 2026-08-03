# ChatDKU Website Developer Documentation

## Our Stack:

We're using the Next.js framework for its quick development opportunities and rich open-source community. The site runs as a **real Node server** (`next build` + `next start`) on port 3000 on GPU4, behind nginx. Our chat, session, and user data comes from the Django backend.

Because we run a Node server rather than a static export, the route handlers under `app/api/` and `app/user/` are live in production, not just dev mocks. `app/api/chat/` and `app/api/chat/[chatId]/` proxy to the Django backend; `app/api/get_session/` mints a session UUID here in the app. The handlers under `app/api/c/` (conversation list/messages) and `app/user/` still return **mock data** — check them against nginx's routing before relying on either in production.

We're using the [shadcn/ui](https://ui.shadcn.com/) open-source UI library. This is a widely used, simple, and customizable UI library that uses Tailwind CSS for globally consistent styling.

Try to stick to these shadcn/ui components as much as possible, and only create custom components when necessary. This is to keep accessibility standards and consistency.

## Development Guide:

### Dependencies:

- The latest Node.js LTS runtime must be installed on the machine you're using to develop.

### Development flow:

1. Run `npm install` in the frontend directory to install Node dependencies.
2. Run `npm run dev` to spin up a localhost server and navigate to http://localhost:3000/ to see the homepage. The dev server will hot-reload whenever you save.
3. Make necessary edits, and review changes on both a desktop screen and a mobile screen. Test with many aspect ratios to make sure nothing clips or looks broken. `npm run dev` serves mock chat responses with markdown in them, so check that responses stay clear and legible (this is important — users must be able to read ChatDKU's answers easily). Set `MOCK_API=false` in `.env.local` to hit the real backend instead, which needs internal network access.
4. Use `npm run test` to run the suite (`npm run test:watch` while working, `npm run test:coverage` for a report).
5. Check that `npm run typecheck`, `npm run lint` and `npm run build` all succeed before pushing to the main branch.

### Testing:

Tests run on [Vitest](https://vitest.dev) with Testing Library, split into two projects:

- **ui** — components and browser-side `lib/` code, in jsdom.
- **api** — the route handlers under `app/`, in node, against real `Request`/`Response` objects.

Because the route handlers are proxies, the useful seam to stub is Django itself, not our own
endpoints. `integration/chat-flow.test.tsx` does exactly that: the component's `fetch` calls are
routed into the actual route handlers, and only the backend beyond them is faked, so a mismatch
between the client, the proxy and the documented backend contract fails the suite.

When you change an endpoint, update the contract notes in `lib/server/backend.ts` and the fake
backend in the integration test together — they are the two places that describe what Django
returns.

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
