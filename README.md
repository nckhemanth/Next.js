# Next.js Field Guide

Practical notes and runnable examples for modern Next.js application work:
App Router, Server Components, rendering and caching, Server Actions, route
handlers, validation, authentication, CMS integration, deployment, and structured
AI output.

## Curriculum

1. **[Foundations](01-foundations/01-what-next-adds-to-react.md)** - what Next.js adds over React, and why server/client boundaries matter.
2. **[App Router](02-app-router/01-file-system-routing.md)** - file conventions, route groups, layouts, dynamic routes, loading/error UI, metadata.
3. **[Rendering & Caching](03-rendering-and-caching/01-rendering-strategies.md)** - CSR, SSR, SSG, ISR, PPR, Cache Components, `use cache`, Suspense.
4. **[Full-stack Patterns](04-full-stack-patterns/01-route-handlers.md)** - route handlers, Server Actions, forms, validation, auth, Sanity, observability.
5. **[Project Architecture](05-project-architecture/01-yc-directory-system-design.md)** - YC Directory domain model, folder structure, data flow, deployment.
6. **[Vercel AI SDK](06-ai-sdk/01-structured-output-with-zod.md)** - TypeScript + Zod + Next.js + AI SDK structured output end to end.
7. **[Interview Prep](07-interview-prep/01-question-bank.md)** - questions, short answers, gotchas, tradeoffs.
8. **[Labs](08-labs/README.md)** - runnable TypeScript exercises for rendering decisions, form validation, and AI output schemas.

## Version Notes

As of the docs checked during creation:

- Next.js latest on npm: `16.2.9`.
- React latest on npm: `19.2.7`.
- AI SDK latest on npm: `6.0.199`.
- AI SDK structured output: `generateObject` / `streamObject` (pass a Zod `schema`,
  get a validated `object`) is the stable primary path; `generateText` +
  `Output.object({ schema })` produces a structured object **alongside** text. The AI SDK
  is provider-agnostic — examples default to Claude (`@ai-sdk/anthropic`).
- Next.js Cache Components move caching decisions toward `cacheComponents`,
  `"use cache"`, `cacheLife`, and Suspense boundaries. Older `revalidate` and
  `fetch(..., { next: { revalidate } })` patterns remain important for projects
  not using Cache Components.

## One Mental Model

Next.js is not "React plus routing." It is a full-stack React framework that
lets you choose where code runs, when HTML is produced, how data is cached, and
which work should block the response.

The skill is not memorizing file names. The skill is answering:

1. Does this need browser state or browser APIs? If yes, isolate a Client Component.
2. Does this data need to be fresh every request, cached for a window, or live updated?
3. Is this mutation validated, authorized, and isolated on the server?
4. Can this route stream dynamic islands while keeping the rest fast?
5. Are secrets and write tokens guaranteed to stay server-side?

## License

MIT

## Connect

GitHub: [@nckhemanth](https://github.com/nckhemanth)
