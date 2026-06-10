# Gotchas and Tradeoffs

## `"use client"` Spreads

If you put `"use client"` too high, you drag more code into the browser bundle.
Keep the boundary at the smallest interactive component.

## Server Components Can Render Client Components

But Client Components cannot import Server Components directly. Pass server data
down as serializable props.

## Search State Belongs in the URL When It Should Be Shareable

For a feed search, URL params are better than hidden component state:

```txt
/?query=health
```

This gives refresh, share, back button, and server rendering.

## Cache Is a Product Decision

"Why is my data stale?" is usually not a Next bug. It is an unclear freshness
contract.

Ask:

- Can users see stale data?
- For how long?
- What invalidates it?
- Does a write require immediate read-after-write consistency?

## CDN Reads Can Break Auth Enrichment

If you create a user and immediately query for it through a cached/CDN client,
you may read stale data. Auth callbacks should prefer fresh server reads.

## Markdown Editors Are Client Components

A markdown editor uses state, DOM events, and often browser-only libraries.
Keep only the editor client-side; submit to a Server Action.

## Server Actions Are Not Magic Security

They run on the server, but you still need:

- authentication
- authorization
- schema validation
- rate limiting when exposed to abusive flows
- safe error messages

## AI JSON Is Not a Contract

The contract is the schema. Ask for structured output and validate it. Never
parse arbitrary model prose as if it is reliable API data.

## `ignoreBuildErrors` Is a Smell

It may unblock a tutorial deployment. It should not survive in a serious app.

