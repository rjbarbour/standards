# Standards Site

Minimal Astro site for publishing proposal documents from this repository.

## Routes

- `/` - Standards landing page
- `/standards/` - Index of published standards
- `/standards/osss-proposal/`
- `/standards/readme-llm-vnext/`

## Local Development

From `ai-open-standards/`:

```bash
npm install
npm run dev
```

## Production Build

From `ai-open-standards/`:

```bash
npm run build
npm run preview
```

The deployment configuration for Netlify lives at the repository root in `netlify.toml`.
