---
layout: ../../layouts/BaseLayout.astro
title: "First README.llm vNext documentation set"
description: "A guided tutorial for publishing a minimal multi-file documentation set with README.llm, llm-index.json, and one supporting document."
eyebrow: "Tutorial"
---

# First README.llm vNext documentation set

This tutorial shows the smallest credible README.llm vNext adoption path:
start with one existing README.llm file, add a manifest, split out one focused
supporting document, and publish the resulting set.

## Starting point

You already have:

- a library or tool with stable behavior
- a single README.llm or equivalent structured document
- one topic that is large enough to deserve its own file

## Step 1: Keep the README.llm file as the entry point

Do not replace the base file. The tutorial assumes README.llm remains the
primary orientation artifact for both people and retrieval systems.

## Step 2: Add `llm-index.json`

Publish a manifest that lists the entry point and the supporting document you
are about to create. This gives retrieval systems a deterministic place to
start.

## Step 3: Split out one focused support document

Move one coherent topic into its own file. Good first candidates are a command
reference, a behavioral contract page, or a quickstart recipe set.

## Step 4: Add document-level metadata

Start the supporting file with the metadata header so agents can inspect the
file cheaply before loading the full content.

## Step 5: Publish and validate

Validate the manifest against the published schema, confirm paths resolve, and
check that the documentation set can be navigated without reading the entire
corpus.

## Result

You now have a minimal multi-file documentation set that is still simple enough
to maintain, but already much easier for retrieval-driven systems to consume.
