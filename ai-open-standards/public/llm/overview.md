LLM-META-LINES: 8
Title: AI Open Standards Site Overview
Scope: Purpose, content boundaries, and machine-documentation entry points
Summary: Overview of the public standards site and the files agents should use first.
Topics: overview, scope, navigation, standards
ApproxTokens: 220
SpecVersion: 0.1
---

# AI Open Standards Site Overview

AI Open Standards publishes editorial drafts for open standards related to
machine-readable documentation and specification design. The published site uses
normal Markdown documentation organized with Diataxis-style routes, with a
machine-facing manifest and metadata layer wrapped around that content.

Use the machine-facing files in this order:

1. `/.well-known/llm-index.json` for discovery and retrieval planning.
2. `/README.llm` for base operating rules and top-level route pointers.
3. `/llm/routes.md` when a task depends on canonical URLs or route behaviour.
4. `/llm/retrieval-recipes.md` when a task is best handled through minimal,
   task-specific context loading.

Current public drafts:

- `/osss-proposal/` for the Open Specification Structure Standard draft.
- `/readme-llm-vnext/` for the README.llm vNext draft.
- `/tutorials/`, `/how-to/`, `/reference/`, and `/explanation/` for the site's
  Diataxis-aligned example routes.

The site content should be treated as draft proposal material. It is suitable
for citation as a published draft, but it should not be described as a ratified
or final standard unless a future status page says otherwise.

Companion discovery files:

- `/llms.txt` provides a lightweight text index for web-oriented discovery.
- `/machine-docs/` provides a human-browsable index of the machine-facing set.
