---
layout: ../../layouts/BaseLayout.astro
title: "Why Diataxis fits README.llm vNext"
description: "A conceptual explanation of how Diataxis can complement README.llm vNext without becoming a compliance requirement."
eyebrow: "Explanation"
---

# Why Diataxis fits README.llm vNext

README.llm vNext and Diataxis operate at different layers. Diataxis structures
readable documentation by intent; README.llm vNext adds discovery and retrieval
artifacts that help LLMs consume that same documentation set.

## Why they complement each other

Diataxis provides four useful lenses:

- tutorials
- how-to guides
- reference
- explanation

That structure is helpful for people and also gives retrieval systems clearer
signals about document intent.

## Why it is non-normative

The standard should not require a single documentation framework. Some
libraries will prefer Diataxis; others will use domain-specific structures.
Treating Diataxis as recommended guidance keeps the standard compatible with
established practice without making it mandatory.

## Why the site uses it anyway

This site demonstrates the four lenses directly so the recommendation is not
just theoretical. The docs remain normal Markdown pages; the manifest and
machine-facing files simply make that structure easier for agents to discover
and retrieve.
