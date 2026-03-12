LLM-META-LINES: 8
Title: AI Open Standards Route Reference
Scope: Canonical public routes and machine-readable artifacts for the site
Summary: Reference for important URLs, what each route returns, and when agents should load them.
Topics: routes, reference, retrieval, artifacts
ApproxTokens: 520
SpecVersion: 0.1
---

# AI Open Standards Route Reference

## `/`

**Description:** Landing page listing the currently published draft standards.

### Preconditions
- Use this route when the task starts without a specific document target.
- Expect summary-level descriptions, not full proposal text.

### Failure Modes
- If a draft is missing from the landing page, do not assume it is unpublished;
  confirm against the repository source.

## `/osss/`

**Description:** Published page for the OSSS draft.

### Preconditions
- Use this route for the current public copy of the OSSS proposal.
- Prefer this route over repository file paths when citing the website.

### Failure Modes
- Do not infer that references to README.llm vNext inside the page are machine
  entry points for the site; they are part of the proposal text.

## `/readme-llm-vnext/`

**Description:** Published page for the README.llm vNext draft.

### Preconditions
- Use this route when the user wants the proposal itself.
- Distinguish this proposal page from the site's own `README.llm` artifacts.

### Failure Modes
- Avoid mixing examples inside the proposal appendix with site implementation
  details unless the task explicitly asks for comparison.

## `/axon-v3/`

**Description:** Published page for the AXON draft.

### Preconditions
- Use this route for the current public copy of the AXON proposal.
- Prefer this route when the task is about internal agent context architecture,
  session priming, or tiered knowledge organization.

### Failure Modes
- Do not confuse AXON with the site's own machine-facing discovery files;
  AXON is a published proposal, not the site's retrieval contract.

## `/cloakd/`

**Description:** Published page for the CLOAKD draft.

### Preconditions
- Use this route for the current public copy of the CLOAKD proposal.
- Prefer this route when the task concerns secret handling, credential
  delivery, or security guidance for agentic development environments.

### Failure Modes
- Do not assume CLOAKD governs the site's deployment secrets or Netlify setup
  unless the task explicitly asks to apply the proposal to this repository.

## `/tutorials/`, `/how-to/`, `/reference/`, `/explanation/`

**Description:** Markdown documentation routes showing how a README.llm vNext
site can be organized using Diataxis-style lenses.

### Preconditions
- Use these routes when the task is about the site's example information
  architecture rather than only the raw proposal text.
- Treat them as a non-normative implementation example, not a compliance
  requirement of the standard.

### Failure Modes
- Do not assume these directory names are required by the specification.
- Do not infer a one-to-one mapping between Diataxis lenses and manifest `type`
  values unless a future spec revision defines one explicitly.

## `/README.llm`

**Description:** Base machine-facing entry point for this site.

### Preconditions
- Load this file before deeper machine docs when the task concerns site
  structure, machine retrieval, or route discovery.

### Failure Modes
- This file is intentionally concise; do not expect exhaustive per-route detail.

## `/llms.txt`

**Description:** Lightweight discovery file linking the site's machine-facing artifacts.

### Preconditions
- Use this route when a crawler or simple agent expects a plain-text discovery format.
- Prefer the manifest when structured metadata is available.

### Failure Modes
- Do not treat this file as a replacement for the manifest; it is a pointer layer,
  not a full retrieval index.

## `/.well-known/llm-index.json`

**Description:** Machine-readable manifest for discovery and targeted retrieval.

### Preconditions
- Use this as the first retrieval step whenever manifest discovery is possible.
- Trust the listed file paths as the canonical machine-facing documentation set.

### Failure Modes
- If the manifest is unavailable, fall back to `/README.llm` and then inspect
  `/llm/*.md` directly.

## `/machine-docs/`

**Description:** Human-readable index page for the published machine-facing artifacts.

### Preconditions
- Use this route when a browser user wants to inspect the machine docs without
  opening raw files directly.

### Failure Modes
- This page summarizes the artifacts; it does not replace the underlying files
  for machine consumption.
