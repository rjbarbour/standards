# Standards Site

Minimal Astro site for publishing proposal documents from this repository.

## Routes

- `/` - Standards landing page
- `/osss-proposal/`
- `/readme-llm-vnext/`
- `/machine-docs/`
- `/README.llm`
- `/llms.txt`
- `/.well-known/llm-index.json`
- `/schemas/readme-llm-vnext/manifest-0.1.schema.json`
- `/llm/overview.md`
- `/llm/routes.md`
- `/llm/retrieval-recipes.md`

## README.llm vNext implementation

The site now publishes a minimal README.llm vNext-style documentation set for
its own content:

- `public/README.llm` is the base machine entry point.
- `public/llms.txt` is the lightweight web-discovery companion.
- `public/.well-known/llm-index.json` is the machine-readable manifest.
- `public/schemas/readme-llm-vnext/manifest-0.1.schema.json` is the canonical
  JSON Schema for manifest validation.
- `public/llm/*.md` contains retrieval-friendly supporting documents with
  embedded metadata headers.
- `src/pages/machine-docs.astro` provides a browsable landing page for those
  artifacts.

The published schema, live manifest, and proposal example manifests were
validated locally against JSON Schema Draft 2020-12 during implementation.

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
