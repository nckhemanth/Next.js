# AI Feature Ideas for YC Directory

Add AI only where structure helps the product.

## Pitch Analyzer

Input:

- title
- description
- category
- markdown pitch

Output:

- score
- summary
- strengths
- risks
- suggested category
- founder questions

Use case: help founders improve before publishing.

## Category Classifier

Output can be a choice:

```ts
Output.choice({
  options: ['AI', 'Developer Tools', 'Healthcare', 'Education', 'Fintech', 'Consumer', 'Other'],
})
```

Use case: reduce messy free-text categories.

## Editor Picks Assistant

Output:

- recommended playlist
- reason
- confidence

Use case: help admins build playlists from new submissions.

## Similar Startups

Use embeddings or structured criteria:

- market
- customer
- pricing model
- technical moat

Use case: recommendations below a startup details page.

## Safety and Product Rules

- AI suggestions should not auto-publish.
- Store AI output with model/version metadata if it affects product decisions.
- Keep API keys server-side.
- Rate-limit route handlers.
- Validate output with Zod before rendering.
- Log failures to observability, not to user-facing raw error dumps.

