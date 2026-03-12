# Open Standards Proposals

This repository contains proposals for open standards that aim to improve technical communication and documentation practices.

Published site: [standards.digitalmercenaries.ai](https://standards.digitalmercenaries.ai)

## Current Proposals

### 1. OSSS — Open Specification Structure Standard

**Status:** Proposal (v0.1)  
**Location:** [OSSS/osss.md](OSSS/osss.md)

OSSS is a minimal, opinionated, governance-agnostic document structure for technical specifications and proposals. It eliminates the structural design phase that every standards project faces by providing a sensible default structure — similar to how Semantic Versioning standardizes version numbers or Conventional Commits standardizes commit messages.

**Key Features:**
- Anti-bikeshedding tool for standards projects
- 9 required sections that encode decades of wisdom from Rust RFCs, PEPs, KEPs, and IETF RFCs
- Governance-agnostic (works with any decision-making process)
- Markup-agnostic (can be implemented in Markdown, reStructuredText, etc.)
- Self-demonstrating (the proposal itself conforms to OSSS structure)

**Target Audience:** Standards authors, working groups, and open-source maintainers who need a proposal structure but don't want to design one from scratch.

### 2. README.llm vNext — Retrieval-Aware, Multi-File, and Behavioural Extensions

**Status:** Draft Proposal (v0.1)  
**Location:** [README.llms-vNext/readme-llm-vnext.md](README.llms-vNext/readme-llm-vnext.md)

An extension to the ReadMe.LLM framework (Wijaya et al., 2025) that adds machine-readable indexing, multi-file documentation sets, retrieval-optimised metadata, and behavioural contract sections. This proposal enables documentation to scale from a single README.llm file for small libraries to navigable, retrieval-efficient corpuses for large SDKs.

**Key Features:**
- Machine-readable indexing for discovery
- Multi-file documentation architecture
- Retrieval-optimised metadata
- Behavioural contract sections for semantic precision
- Backward-compatible with original ReadMe.LLM format

**Target Audience:** Library maintainers, SDK authors, CLI tool developers, and documentation platform vendors working with LLM-oriented documentation.

## About This Repository

These proposals are designed to be practical, adoptable standards that solve real problems in technical communication. Each proposal:
- Follows the OSSS structure (where applicable)
- Includes clear scope and limitations
- Provides concrete examples and use cases
- Is licensed under MIT for maximum permissiveness

## Website and Deployment

This repository includes an Astro site in `ai-open-standards/` used to publish the proposals as web pages.

### Local run

```bash
cd ai-open-standards
npm install
npm run dev
```

### Netlify

Deployment is configured at repository root via `netlify.toml`:
- Build base: `ai-open-standards`
- Build command: `npm run build`
- Publish directory: `dist`

## License

All content in this repository is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 Robert Barbour
