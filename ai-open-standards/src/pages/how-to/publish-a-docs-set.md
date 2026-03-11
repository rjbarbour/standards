---
layout: ../../layouts/BaseLayout.astro
title: "Publish a README.llm vNext documentation set"
description: "A concise implementation guide for shipping README.llm, llm-index.json, and supporting files on a repository or website."
eyebrow: "How-to"
---

# Publish a README.llm vNext documentation set

Use this guide when you already know you want to publish a README.llm vNext
documentation set and just need the concrete steps.

## 1. Publish the entry point

Keep a valid README.llm file at the repository root or equivalent entry
location. This remains the base artifact.

## 2. Publish the manifest

Add `llm-index.json` at repository root or `/.well-known/llm-index.json` for
site-hosted docs. Include the canonical schema URL in `$schema`.

## 3. Split large topics into separate files

Create focused support files for reference material, task recipes, or
behavioral contracts instead of expanding the base file indefinitely.

## 4. Add metadata headers to the support files

This enables head-first retrieval and keeps files useful when copied or
uploaded independently.

## 5. Validate before release

Check the manifest against the published schema, verify that listed files
exist, and confirm that retrieval can start from the manifest without scanning
the full corpus.
