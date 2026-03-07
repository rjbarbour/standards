LLM-META-LINES: 8
Title: AI Open Standards Retrieval Recipes
Scope: Task-oriented examples for loading the minimum useful site context
Summary: Example retrieval flows for common questions about the published standards site.
Topics: examples, retrieval, recipes, agents
ApproxTokens: 390
SpecVersion: 0.1
---

# AI Open Standards Retrieval Recipes

## Recipe: Find the current standards on the site

1. Load `/.well-known/llm-index.json`.
2. Load `/` if the task is only to identify published drafts.
3. Stop there unless the user asks for the full text of a specific proposal.

## Recipe: Read the README.llm vNext proposal

1. Load `/readme-llm-vnext/`.
2. Use `/llm/routes.md` only if the task also concerns machine-facing site
   artifacts or canonical URL guidance.

## Recipe: Explain the site's machine-readable implementation

1. Load `/.well-known/llm-index.json`.
2. Load `/README.llm`.
3. Load `/llm/overview.md` and `/llm/routes.md`.
4. Load `/llm/retrieval-recipes.md` only if example workflows are useful.

## Recipe: Start from web discovery

1. Load `/llms.txt` when only a simple discovery document is available.
2. Follow its links to `/README.llm` and `/.well-known/llm-index.json`.
3. Continue with targeted `/llm/*.md` retrieval from the manifest.

## Recipe: Minimize context for an agent

1. Read the manifest and compare requested topics against each document's
   `topics`, `symbols`, and `short_description`.
2. Prefer one focused `/llm/*.md` document over loading multiple proposal pages.
3. Load proposal pages only when the user asks about the actual standard text.
