---
layout: ../layouts/BaseLayout.astro
title: "AXON: Agentic Context Orchestration Nexus"
description: "a standard for structuring internal project context for AI agents"
---

<!-- GENERATED FILE: edit ../AXON/axon-v3-proposal.md -->
# AXON: Agentic Context Orchestration Nexus

| | |
| :--- | :--- |
| **AIOS ID** | `AXON-2026.2` |
| **Version** | `3.0` |
| **Status** | `Proposal` |
| **Author(s)** | R. J. Babour, with Manus AI |
| **Created** | 11 Mar 2026 |
| **Last Modified** | 12 Mar 2026 |
| **License** | MIT |

## Abstract

This document specifies AXON, a standard for engineering the **internal knowledge architecture** of a software project to enable effective collaboration with AI agents. It defines a multi-tier framework for organizing and retrieving project context at runtime, distinguishing it from standards for external-facing documentation (`README.llm`) and higher-level intent engineering.

AXON provides a structured, tool-agnostic approach to managing the information an agent needs to perform complex tasks. It addresses the challenge of "context rot" by tiering information based on its size, volatility, and access pattern. The standard defines four tiers of knowledge, a canonical entry point (`CONTEXT.md`), and a set of principles for maintaining a single source of truth (SSoT).

Critically, AXON introduces two new concepts: the **Intent Anchor Document (`INTENT.md`)**, a companion artifact that codifies an agent's decision-making framework using the 7-component Product Compass model; and the **Tier 3 Manifest**, a structured description of a project's semantic knowledge index to solve the RAG discoverability problem. By standardizing how project context is structured and accessed, AXON aims to improve the reliability, consistency, and performance of AI agents in software development and other knowledge-work domains.

## 1. Introduction

As AI agents become increasingly integrated into software development workflows, the primary bottleneck to their effectiveness is no longer their reasoning ability, but their access to relevant, timely, and accurate context. Most agent failures are not model failures; they are context failures [1]. An agent can have superhuman coding skills, but if it doesn't know which database migration tool the project uses, what the team's policy is on dependency versioning, or the lessons learned from the last production outage, it will inevitably produce work that is at best unusable and at worst harmful.

This problem has given rise to the discipline of **Context Engineering**: the curation and maintenance of the optimal set of information an agent needs to perform a task [2]. However, the practice of context engineering has been ad-hoc and platform-specific, leading to a fragmented landscape of proprietary formats (`CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`) and a lack of a common architectural pattern.

This standard, AXON, addresses that gap. It provides a formal, tool-agnostic framework for structuring the internal knowledge of a project specifically for agent consumption. It is not a standard for writing documentation for humans or for other systems to consume via APIs; it is a standard for organizing the runtime context that an AI agent needs to collaborate effectively with a human team on a specific project.

AXON is grounded in the principle that different types of knowledge have different characteristics and require different management strategies. By separating knowledge into tiers based on volatility, size, and access pattern, AXON provides a robust and scalable architecture for building and maintaining high-performance agentic systems.

## 2. Compliance

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119 [3].

An implementation is considered AXON-compliant if it adheres to all the MUST and REQUIRED-level specifications in this document. Section 6: Core Specification defines the core structural requirements, while later sections define additional normative requirements for ingestion, maintenance, and security.

Appendix examples are intended to be AXON-compliant examples. However, project-specific policies, constraints, thresholds, and autonomy rules that appear inside those examples are illustrative instance content, not additional AXON requirements unless this specification explicitly states otherwise.

## 3. Design Goals and Non-Goals

### 3.1. Design Goals

- **Improve Agent Reliability:** To provide a structured context environment that reduces agent errors and hallucinations by ensuring access to accurate, project-specific information.
- **Enhance Scalability:** To define a tiered architecture that manages context rot and allows agentic systems to scale to large, complex projects without performance degradation.
- **Promote Interoperability:** To establish a tool-agnostic standard that can be adopted by any agentic platform, reducing vendor lock-in and fragmentation.
- **Simplify Maintenance:** To enforce a single source of truth (SSoT) principle that makes project knowledge easier to update and prevents context drift.
- **Formalize Best Practices:** To codify the emerging best practices of context engineering into a formal, repeatable standard.

### 3.2. Non-Goals

- **To Replace Human-Facing Documentation:** AXON is for internal agent consumption. It is not a replacement for well-written READMEs, architectural decision records (ADRs), or public API documentation.
- **To Define Prompting Techniques:** AXON is concerned with the structure of knowledge, not the specific wording of instructions (prompt craft).
- **To Be a Full Intent Engineering Framework:** AXON provides a mechanism (the `INTENT.md` companion artifact) to encode intent, but it is not a complete standard for defining an agent's goals, values, and ethical boundaries. A full Intent Engineering standard is a separate, higher-level concern.
- **To Standardize Specification Formats:** AXON provides the knowledge substrate for task execution, but it does not standardize the format of task specifications themselves (e.g., PRDs or PRPs).

## 4. Prior Art and Positioning

AXON builds upon a rich ecosystem of existing ideas and tools. This section positions the standard in relation to the most significant prior art.

### 4.1. The Knowledge Hierarchy: Organisation, Architecture, Project, Task

Effective agentic systems require a clear hierarchy of knowledge, mirroring how human organisations structure information. AXON is explicitly a **project-level** standard, but it is designed to exist within this broader hierarchy.

| Level | Scope | Description | Examples | AXON Relationship |
| :--- | :--- | :--- | :--- | :--- |
| **Organisation** | Cross-project | The company's purpose, values, policies, and strategic goals. | Vision/mission statement, company-wide OKRs, employee handbook. | **Referenced.** `INTENT.md` links to these artifacts. |
| **Architecture** | Cross-project | The organisation's technical standards, patterns, and reference architectures. | Coding standards, TOGAF, Clean Architecture, security policies. | **Ingested.** These large documents belong in a shared Tier 3 index. |
| **Project** | Project-specific | The project's goal, system architecture, procedural workflows, and factual knowledge. | `CONTEXT.md`, `INTENT.md`, agentic skills, project-specific RAG. | **Defines.** This is the core domain of the AXON standard. |
| **Task** | Task-specific | A detailed blueprint for a single unit of work. | User stories, acceptance criteria, PRDs, PRPs. | **Out of Scope.** The domain of Specification Engineering. |

### 4.2. Nate B. Jones's Four-Tier Framework

Researcher Nate B. Jones proposes a four-tier framework for the skills required to work effectively with AI agents [4]. This framework provides a valuable lens through which to understand AXON's specific role.

| Tier | Description | AXON's Relationship |
| :--- | :--- | :--- |
| 1. Prompt Craft | The art of writing a single, effective instruction. | **Out of Scope.** AXON is concerned with the knowledge architecture, not the phrasing of individual prompts. |
| 2. Context Engineering | The discipline of curating the information an agent has access to. | **Direct Implementation.** AXON is a formal standard for implementing the Context Engineering layer. |
| 3. Intent Engineering | The practice of defining an agent's goals, values, and strategic trade-offs. | **Complementary.** AXON's `INTENT.md` artifact provides a mechanism to encode intent, but a full Intent Engineering framework is a separate, higher-level concern. |
| 4. Specification Engineering | The process of creating detailed, structured blueprints for agent tasks. | **Complementary.** AXON provides the knowledge substrate that specifications reference and are executed within. |

### 4.3. Platform-Specific Memory Mechanisms

Several commercial and open-source tools have developed their own proprietary mechanisms for providing agents with persistent context.

- **Claude Code (`CLAUDE.md`)**: A system of hierarchical Markdown files for providing instructions to the Claude Code agent [5]. It supports project-level, user-level, and organization-level rules.
- **GitHub Copilot (`.github/copilot-instructions.md`)**: A similar mechanism for providing project-specific context to GitHub Copilot.
- **Cursor (`.cursorrules`)**: A file for defining rules and context for the Cursor editor's AI features.

These tools span two layers of the AXON model. Platform-defined system prompts, user-level custom instructions, and persistent memory features are implementations of **Tier 0 (Injected) Knowledge**. Project-scoped instruction files such as `CLAUDE.md`, `.github/copilot-instructions.md`, and `.cursorrules` are best understood as **Tier 1 (Directive) Knowledge**. AXON sits above these tools as a tool-agnostic standard, and an AXON-compliant `CONTEXT.md` file includes a dedicated Platform Directive References section for any such project-scoped directive files that the agent is expected to read during session priming.

It is also worth noting that **Obsidian**, a popular local-first knowledge management tool, is increasingly used as a Tier 2 knowledge store in agentic workflows. Agents can access Obsidian vaults through three mechanisms: direct filesystem access (for agents running on the same machine), the Obsidian Local REST API plugin (which exposes vault operations over HTTP), and dedicated MCP servers. This makes Obsidian a viable alternative to cloud-based tools like Notion for teams that prefer local-first data sovereignty, with the trade-off that remote agents require the Local REST API or an MCP bridge to be running on the host machine.

### 4.4. External Documentation Standards

Standards like `README.llm` [6] and `LLMS.md` [7] are designed to make public-facing projects, APIs, and websites more discoverable and usable by AI agents. They are standards for **external documentation**.

AXON is fundamentally different. It is a standard for **internal project context**. The two are complementary:

- `README.llm` tells an external agent how to *use* your project.
- AXON's `CONTEXT.md` tells an internal agent how to *work on* your project.

A project can and should have both.

### 4.5. Agentic Skill Frameworks

The concept of encapsulating procedural knowledge into reusable "skills" is emerging as a key pattern in agentic systems. Platforms like Manus AI provide a formal skill system, and open-source repositories of agent skills are beginning to appear. AXON formalizes this by defining **Tier 2 (Procedural) Knowledge** as a distinct layer, treating skills as first-class citizens of the context architecture.

## 5. The Problem: Context Rot and Knowledge Fragmentation

To understand why AXON is necessary, it is important to understand the two primary failure modes it is designed to address.

The first is **context rot**, a phenomenon documented by Anthropic's research [2] and others, whereby a large language model's ability to accurately recall information from its context window degrades as the number of tokens increases. This stems from the transformer architecture's quadratic attention mechanism: as context length grows, the model's ability to attend to specific information is diluted. The practical implication is that naively loading all available project knowledge into the context window at the start of every session is counterproductive. A 200,000-token context window full of loosely relevant information will produce worse results than a 10,000-token context window containing precisely the right information.

The second failure mode is **knowledge fragmentation**, which arises when the same information exists in multiple places in slightly different forms. This is the classic DRY (Don't Repeat Yourself) problem applied to agentic systems. When the project's trading strategy is described in the system prompt, the `CONTEXT.md` file, the deployment runbook, and a Notion page, an agent has no way to know which version is authoritative. Over time, these descriptions diverge, and the agent is forced to either guess or ask for clarification — both of which are expensive.

AXON addresses both failure modes directly. The tiered architecture combats context rot by ensuring that only small, high-signal Tier 1 knowledge is loaded by default, while larger Tier 2 and Tier 3 knowledge is retrieved on demand. The SSoT principle combats knowledge fragmentation by forcing each piece of information to have a single, canonical home.

## 6. Core Specification

### 6.1. The Four Tiers of Knowledge

An AXON-compliant system MUST organize project knowledge into four distinct tiers, distinguishing between knowledge that is always present (Tier 0) and knowledge that is retrieved on demand (Tiers 1-3).

| Tier | Name | Description | Characteristics | Implementation Examples |
| :--- | :--- | :--- | :--- | :--- |
| 0 | **Injected** | The agent's core identity, system prompt, custom instructions, and persistent memory. | Small, low-volatility, always present in every context window. | System Prompt (platform-defined, typically immutable), Custom Instructions (user-defined directives), Persistent Memories (Manus Knowledge Items, ChatGPT Memories) |
| 1 | **Directive** | High-level instructions, pointers, and strategic context. The agent's entry point. | Small, low-volatility, read in full at session start. | `CONTEXT.md`, `INTENT.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.cursorrules` |
| 2 | **Procedural** | Step-by-step workflows, operational runbooks, and executable scripts. | Medium-sized, read on-demand, contains executable logic. | Agentic Skills, shell scripts, Jupyter notebooks, Notion pages, Obsidian vaults (via MCP or filesystem) |
| 3 | **Factual** | Large factual corpora, raw data, and detailed technical specifications. | Large, high-volatility, requires semantic search. | Vector Database (RAG), Knowledge Graph, Full-text search index |

### 6.2. The Canonical Entry Point (`CONTEXT.md`)

A project MUST have a single `CONTEXT.md` file at its root. This file is the canonical entry point for any agent interacting with the project.

`CONTEXT.md` MUST contain:

1.  **Project Goal:** A one-sentence description of the project's purpose.
2.  **System Architecture Summary:** A brief, high-level overview of the system's components and their interactions.
3.  **Intent Anchor:** A link to the project's `INTENT.md` file.
4.  **Platform Directive References:** A section listing any project-scoped platform-specific directive files (e.g., `CLAUDE.md`, `.github/copilot-instructions.md`, `.cursorrules`) that an agent is expected to read during session priming.
5.  **Tier 2 Pointer Table:** A table listing all available Tier 2 (Procedural) resources, their descriptions, where they live, and either how to invoke them or how to access them.
6.  **Tier 3 Manifest:** A structured description of the contents of the Tier 3 (Factual) knowledge store, either inline or as a link to `MANIFEST.md`.

#### 6.2.1. The Tier 3 Manifest

The Tier 3 Manifest is critical for solving the RAG discoverability problem. `CONTEXT.md` MUST contain a Tier 3 Manifest section that either provides a structured description of the semantic knowledge index inline or links to a separate `MANIFEST.md` file at the project root. For larger projects, the manifest MAY live in that separate `MANIFEST.md`, in which case `CONTEXT.md` MUST link to it.

For each major collection of documents within the Tier 3 index, the manifest MUST specify:

- **`name`**: A short, human-readable name for the document collection (e.g., "Polymarket CLOB API Docs").
- **`description`**: A concise summary of the content and its purpose.
- **`trigger`**: The conditions under which an agent SHOULD query this collection (e.g., "When you need to understand order book mechanics, fees, or WebSocket endpoints").
- **`handle`**: A portable retrieval handle identifying the access mechanism and target collection. This value SHOULD be expressed as a URI-like identifier such as `rag://clob-api`, `rag://architecture`, or `graph://services`, rather than a raw code snippet or platform-specific function call. Implementations MAY document their concrete function calls separately, but the manifest's primary contract SHOULD remain stable across platforms.

### 6.3. The Intent Anchor Document (`INTENT.md`)

An AXON-compliant project MUST include an `INTENT.md` file at its root. This document codifies the agent's decision-making framework, based on the 7-component model from the Product Compass framework [8]. In this specification, the single "Constraints" component is represented as two required subsections: **Constraints (Steering)** and **Constraints (Hard)**.

`INTENT.md` MUST contain the following sections:

1.  **Objective:** The problem to solve and why it matters.
2.  **Desired Outcomes:** Measurable states that indicate success.
3.  **Health Metrics:** What must not degrade while pursuing the outcomes.
4.  **Strategic Context:** The system the agent operates in (with links to organisation-level documents).
5.  **Constraints:** A required parent section containing the following two subsections:
    - **5.1 Constraints (Steering):** Behavioural guardrails for the agent.
    - **5.2 Constraints (Hard):** Non-negotiable rules (with links to policy documents).
6.  **Decision Autonomy:** What the agent may decide alone vs. must escalate.
7.  **Stop Rules:** When to halt, escalate, or declare completion.

An example `INTENT.md` is provided in Appendix C.

### 6.4. The Session Priming Workflow

At the start of any new session, or at the start of a new task when the current session has not already been primed with the project's Tier 1 context, an AXON-compliant agent MUST perform the following session priming workflow:

1.  Read the project's `CONTEXT.md` file in full.
2.  Read the project's `INTENT.md` file in full.
3.  Read any platform-specific directive files referenced in `CONTEXT.md` (e.g., `CLAUDE.md`).
4.  Read any project-level instructions provided by the agentic platform.

This ensures the agent always starts from a consistent, up-to-date understanding of the project's strategic context and knowledge architecture. An implementation MAY cache previously loaded Tier 1 artifacts within the active session, but it MUST ensure the session has been primed before substantive work begins.

### 6.5. The Single Source of Truth (SSoT) Principle

To prevent context drift and simplify maintenance, an AXON-compliant system SHOULD adhere to the SSoT principle.

- Each piece of project knowledge SHOULD have a single, canonical home in one of the four tiers.
- Tier 0 SHOULD be used as a canonical home only for small, stable, always-on knowledge such as enduring user preferences, agent operating preferences, and a limited set of durable project facts.
- If Tier 0 is designated as the canonical home for project knowledge that must be shared across collaborators, tools, or agent runtimes, the implementation MUST maintain an exportable, project-visible mirror or equivalent shared representation of that knowledge.
- When Tier 0 repeats knowledge whose primary maintained source lives in Tiers 1-3, the Tier 0 representation MUST be treated as a synchronized derivative of that canonical source.
- Other tiers MAY reference or summarize that knowledge, but they MUST link back to the canonical source where linking is possible.

For example, a `CONTEXT.md` file (Tier 1) may summarize the project's deployment procedure, but it MUST link to the relevant deployment skill or runbook (Tier 2) as the canonical source of the detailed steps. Likewise, a Tier 0 memory item may store the team's preferred cloud provider for always-on access, but if that fact is also maintained in project documentation, the Tier 0 item SHOULD be kept synchronized with that canonical source.

## 7. Ingestion, Maintenance, and Note-Taking

### 7.1. The Agent's Notebook

Inspired by the note-taking strategies described by Anthropic [2], an AXON-compliant system SHOULD provide a mechanism for the agent to maintain its own persistent notebook. This notebook serves as a scratchpad for the agent to record its observations, learnings, and intermediate results. It is a critical tool for long-horizon tasks, allowing the agent to maintain coherence across multiple sessions and context resets.

The notebook SHOULD be a dedicated file or set of files within the project's Tier 1 knowledge store (e.g., `AGENT_NOTES.md`). The agent SHOULD be instructed to read its notebook at the start of each session and to update it at the end of each significant work unit. This practice of structured self-reflection is a key driver of agent performance and reliability.


### 7.2. Tier 3 Ingestion Criteria

Not all documents should be ingested into the Tier 3 semantic index. Indiscriminate ingestion increases retrieval noise and makes the Tier 3 Manifest harder to maintain. A document SHOULD be ingested into Tier 3 only if all three of the following conditions are met:

1.  **It is large.** The document is too large to load directly into the context window without causing context rot. A practical threshold is documents exceeding five pages or approximately 5,000 tokens.
2.  **It is primarily factual rather than procedural.** The document is a source of reference knowledge, not a runbook, checklist, or step-by-step workflow.
3.  **It requires semantic search.** The document is large enough, dense enough, or broad enough that an agent needs to query it with natural language questions rather than read it straight through during normal task startup.

External documents such as third-party API documentation, academic papers, and regulatory guidance are common Tier 3 candidates, but large internal factual corpora such as ADR archives, post-mortems, research repositories, and design documentation MAY also belong in Tier 3 when they meet these criteria. If a document fails any one of these criteria, it belongs in a lower tier: Tier 2 if it is primarily procedural, or Tier 1 (as a summary with a link) if it is small enough to read in full.

### 7.3. Maintenance Cadence

The `CONTEXT.md` and `INTENT.md` files SHOULD be reviewed and updated whenever a significant change is made to the project's architecture, strategy, or knowledge base. The Tier 0 (Injected) knowledge — particularly the user-defined custom instructions and persistent memories, which are the editable components of Tier 0 — SHOULD be reviewed on a regular cadence (e.g., quarterly) to ensure they reflect the user's current preferences and the agent's evolving capabilities. The system prompt itself is typically platform-defined and immutable, but custom instructions and memory items are powerful levers that the user controls directly. The Tier 3 Manifest in particular MUST be kept up to date with the actual contents of the semantic index. Stale entries in the manifest will cause agents to query for knowledge that does not exist, wasting tokens and time.

## 8. Security Considerations

The AXON framework is designed to manage project knowledge, not secrets. Credentials, API keys, private keys, and other sensitive values MUST NOT be stored in any AXON tier. They MUST be managed by a dedicated secrets management system (e.g., AWS Secrets Manager, HashiCorp Vault) and accessed at runtime via environment variables or IAM roles. AXON's `CONTEXT.md` MAY reference the secrets management system used by the project, but it MUST NOT contain the secrets themselves.

Because AXON governs agent context, implementations SHOULD explicitly address context integrity and provenance in their operating model. Tier 2 and Tier 3 sources may contain stale guidance, malicious instructions, prompt injection attempts, or content that is authoritative in one domain but unsafe to follow in another.

- Implementations SHOULD define trust boundaries for each Tier 2 and Tier 3 source and distinguish canonical project instructions from untrusted reference material.
- Retrieved or workspace-hosted content SHOULD NOT override Tier 1 directives or other canonical sources unless it is explicitly designated as authoritative for that topic.
- Content promoted from retrieved knowledge into Tier 0 or another canonical tier SHOULD pass through a trusted synchronization or review workflow.
- Canonical knowledge stores SHOULD prefer access-controlled, versioned, or otherwise auditable systems so that poisoning, drift, and unauthorized edits can be detected and reversed.

## 9. Versioning

AXON artifacts that serve as canonical or authoritative project knowledge SHOULD be versioned using the project's standard version control system (e.g., Git) or an equivalent change-tracked system. This includes `CONTEXT.md`, `INTENT.md`, a separate `MANIFEST.md` if used, and project-managed Tier 2 artifacts that are treated as canonical sources. These artifacts SHOULD be stored alongside the source code they describe whenever practical, so that the knowledge architecture evolves in lockstep with the codebase and historical versions can be retrieved for debugging or auditing purposes.

If Tier 0 knowledge is explicitly designated as the canonical home for some fact or preference, the implementation SHOULD provide equivalent auditability through revision history, change logs, or another durable tracking mechanism. Canonical knowledge without change tracking undermines AXON's maintainability goals.

## 10. Tooling Recommendations

While AXON is tool-agnostic, the following tooling categories are well-suited to each tier.

| Tier | Recommended Tooling Categories | Examples |
| :--- | :--- | :--- |
| 0 (Injected) | System prompts, custom instructions, persistent memory systems | Manus AI Memories, ChatGPT Memories, platform custom-instructions systems |
| 1 (Directive) | Version-controlled Markdown files, agentic platform project instructions | GitHub, GitLab, Manus AI Projects, `CLAUDE.md`, `.github/copilot-instructions.md`, `.cursorrules` |
| 2 (Procedural) | Agentic skill frameworks, workflow automation, collaborative workspaces | Manus AI Skills, n8n, Temporal, Notion, Obsidian (via Local REST API plugin + MCP server, or direct filesystem access for local agents) |
| 3 (Factual) | Managed RAG/vector database services, knowledge graphs | Pinecone Assistant, AWS Bedrock Knowledge Bases, Neo4j |

## 11. Known Limitations

- **Tooling Dependency:** The effectiveness of AXON is dependent on the capabilities of the underlying agentic platform. For example, the ability to use Tier 2 skills requires a platform that supports tool use.
- **Maintenance Overhead:** While AXON simplifies maintenance by enforcing a single source of truth, it still requires discipline to keep the `CONTEXT.md` and `INTENT.md` files up to date.
- **Cold Start Problem:** Establishing a comprehensive AXON framework for an existing project requires a significant upfront investment in organizing and migrating knowledge.

## Appendix A: A Prescriptive Implementation Guide

This guide provides a convention-over-configuration recipe for implementing the AXON framework in a new or existing project. It is designed to be followed sequentially and removes decision paralysis by providing sensible defaults.

### Step 1: Establish Tier 0 (Injected) Knowledge

Your first action should be to populate the persistent, always-on context mechanisms of your chosen agentic platform. This is the foundation upon which all other knowledge is built.

1.  **Custom Instructions**: Fill out your platform's user-level custom instructions (e.g., in Manus, ChatGPT, or Cursor). Focus on high-level directives about your technical preferences, communication style, and core principles.
2.  **Persistent Memories**: Add discrete, factual knowledge items to your platform's memory feature (e.g., Manus Knowledge Items, ChatGPT Memories). This should include your preferred cloud provider, timezone, core tech stack, and other immutable facts. Keep this layer small and stable; when a fact is also maintained elsewhere in the project knowledge base, treat the Tier 0 copy as a synchronized derivative unless Tier 0 is explicitly designated as the canonical home.

### Step 2: Create the Tier 1 (Directive) Layer

In the root directory of your project, create the two core Tier 1 documents.

1.  **Create `CONTEXT.md`**: This is the agent's primary entry point to the project. Use the template in Appendix B as a starting point. At a minimum, it MUST contain the Project Goal, System Architecture, Intent Anchor, Platform Directive References, Tier 2 Pointer Table, and Tier 3 Manifest sections.
2.  **Create `INTENT.md`**: This document defines the agent's decision-making framework. Use the template in Appendix C as a starting point, filling in each of the seven components of the Intent Engineering Framework. In AXON, the Constraints component is split into two explicit sections: **Constraints (Steering)** and **Constraints (Hard)**.

### Step 3: Identify and Document Tier 2 (Procedural) Knowledge

Identify recurring, multi-step tasks and operational knowledge that are critical to the project. Tier 2 is home to anything too detailed or volatile for `CONTEXT.md` but too structured for semantic search. Typical examples include deployment runbooks, strategy research notes, decision logs, incident post-mortems, environment configuration guides, and data processing workflows.

1.  **Default Convention**: For each procedure, create a shell script (e.g., `scripts/deploy.sh`) or a Markdown document with numbered steps (e.g., `docs/data_processing_runbook.md`). For less structured operational knowledge — decision logs, research notes, meeting minutes — a collaborative workspace such as Notion, Obsidian, or Confluence works well.
2.  **Agentic Skills**: If your platform supports a skills feature (e.g., Manus AI), encapsulate each procedure in a dedicated skill. This is the preferred convention as it makes the procedure directly invocable by the agent.
3.  **Update `CONTEXT.md`**: Add or update the Tier 2 Pointer Table in `CONTEXT.md`, listing each Tier 2 artifact, a brief description, where it lives, and either its invocation method or its access path.

### Step 4: Curate and Ingest Tier 3 (Factual) Knowledge

Be selective. Tier 3 is for knowledge that is large, primarily factual, and requires semantic search.

1.  **Identify Documents**: Select the 3-5 most critical factual corpora for your project (e.g., the API documentation for a key service, a foundational research paper, your organisation's architectural standards, or a large archive of internal design documents).
2.  **Set up Vector Database**: Choose and configure a vector database (e.g., Pinecone, ChromaDB, a local FAISS index).
3.  **Ingest Documents**: Chunk and embed the selected documents into the vector database.
4.  **Update Tier 3 Manifest**: In `CONTEXT.md` or `MANIFEST.md`, update the Tier 3 Manifest with an entry for each document collection. Each entry MUST describe the content, the trigger conditions for querying it, and the portable retrieval handle to use.

### Step 5: Implement the Session Priming Workflow

Ensure that the first substantive action an agent takes in any new session, or in any task within an unprimed session, is to load the Tier 1 context.

1.  **Automated (Preferred)**: If your platform supports it, create a session priming skill or startup hook that automatically reads `CONTEXT.md`, `INTENT.md`, any platform-specific directive files referenced from `CONTEXT.md`, and any project-level instructions provided by the platform into the active working context.
2.  **Manual**: If automation is not possible, the first prompt in each new session, or in any task within an unprimed session, MUST explicitly instruct the agent to read `CONTEXT.md`, `INTENT.md`, any platform-specific directive files referenced from `CONTEXT.md`, and any project-level instructions provided by the platform.

By following these five steps, you will have a robust, AXON-compliant knowledge architecture that will significantly improve the performance and reliability of any AI agent working on your project.

---

## Appendix B: `CONTEXT.md` Example

This appendix is a compliant example of an AXON `CONTEXT.md` document. Its project-specific contents are illustrative and do not create additional AXON requirements.

```markdown
# CONTEXT.md: Polymarket Trading Bot

## Project Goal

To develop and operate a low-latency arbitrage bot for the Polymarket CLOB exchange.

## System Architecture

The system consists of a Python-based trading bot (`arb_bot.py`) that connects to the Polymarket WebSocket API. It is deployed as a Docker container on an EC2 instance in `eu-west-2`. See the `polymarket-deploy` skill for the full deployment procedure.

## Intent Anchor

See `INTENT.md` for the full decision-making framework.

## Platform Directive References

| File | Purpose |
| :--- | :--- |
| `CLAUDE.md` | Project-specific operating instructions for the Claude Code agent. |

## Tier 2: Procedural Knowledge

| Resource | Description | Location | Invocation / Access |
| :--- | :--- | :--- | :--- |
| `polymarket-context` | Loads the complete operational and technical context for this project. | Manus AI Skills | `/polymarket-context` |
| `polymarket-deploy` | The definitive guide to deploying, updating, and managing the trading bot. | Manus AI Skills | `/polymarket-deploy` |
| `polymarket-trading` | The canonical source for the trading strategy, logic, and critical API knowledge. | Manus AI Skills | `/polymarket-trading` |
| Context Engineering Framework | Defines the knowledge architecture and SSoT assignments for this project. | Team Notion workspace | Open the page in the team's Notion workspace. |
| Technical Gotchas & API Learnings | The canonical source for hard-won API knowledge and edge cases. | Team Notion workspace | Open the page in the team's Notion workspace. |
| Strategy Research | Background research, market analysis, and strategy evaluation notes. | Team Notion workspace | Open the page in the team's Notion workspace. |
| Decision Log | A chronological record of key technical and strategic decisions. | Team Notion workspace | Open the page in the team's Notion workspace. |

## Tier 3: Factual Knowledge (Manifest)

| Name | Description | Trigger | Handle |
| :--- | :--- | :--- | :--- |
| Polymarket CLOB API Docs | Full documentation for the CLOB API, including order book, fees, and WebSocket endpoints. | When you need to understand order book mechanics, fees, or WebSocket endpoints. | `rag://clob-api` |
| py-clob-client Docs | Documentation for the Python SDK used by the bot. | When you need to understand the `py-clob-client` library. | `rag://py-clob-client` |
| Architectural Standards | The organisation's technical standards, patterns, and reference architectures. | When making design decisions or evaluating new technologies. | `rag://architecture` |
```

## Appendix C: `INTENT.md` Example

This appendix is a compliant example of an AXON `INTENT.md` document. Its project-specific policies, thresholds, and autonomy rules are illustrative and do not create additional AXON requirements.

```markdown
# INTENT.md: Polymarket Trading Bot

## 1. Objective

To generate consistent, low-risk profit by exploiting latency arbitrage opportunities on the Polymarket CLOB exchange, while safeguarding capital and maintaining operational stability.

## 2. Desired Outcomes

- The bot executes profitable trades that are settled on-chain.
- The bot's trading activity does not cause market disruption or attract negative attention.
- The bot operates autonomously with minimal human intervention.

## 3. Health Metrics

- **Net PnL:** Must remain positive over any 7-day rolling period.
- **Execution Errors:** Must be below 1% of all attempted trades.
- **Downtime:** Must not exceed 1 hour per month.

## 4. Strategic Context

This project is part of the organisation's broader strategy to explore and capitalize on decentralized finance (DeFi) opportunities. See the company's internal wiki for the full DeFi strategy document.

## 5. Constraints

### 5.1 Constraints (Steering)

- Prioritize capital preservation over aggressive profit-taking.
- Avoid trades with a predicted edge of less than 0.5% after fees.
- Do not engage in strategies other than latency arbitrage.

### 5.2 Constraints (Hard)

- The bot MUST NOT hold a position in any single market greater than 10% of the total bot capital.
- The bot MUST adhere to all Polymarket terms of service.
- All code MUST pass the automated test suite before deployment.

## 6. Decision Autonomy

- The bot MAY autonomously adjust trade size based on market liquidity.
- The bot MAY autonomously halt trading if it detects a high rate of execution errors.
- The bot MUST NOT deploy a new trading strategy without human approval.

## 7. Stop Rules

- **Halt:** If Net PnL drops by more than 5% in a single 24-hour period.
- **Escalate:** If the Polymarket API returns a persistent, unrecoverable error.
- **Complete:** This is a continuous operation; there is no completion state.
```

## Appendix D: A Reference Implementation

This appendix is a compliant example of an AXON implementation. Its specific tools and project choices are illustrative and do not create additional AXON requirements.

This standard was developed and refined during the implementation of a low-latency algorithmic trading bot for a prediction market. The project involved complex API interactions, a need for high reliability, and a constantly evolving strategic landscape. The initial ad-hoc approach to context management resulted in frequent agent errors and high maintenance overhead. The adoption of the tiered model described in this standard led to a measurable improvement in agent performance and a significant reduction in development time.

The project's final architecture directly maps to the AXON standard:

- **Tier 0:** Manus AI custom instructions and persistent memory items containing user preferences, core stack facts, and other always-on context.
- **Tier 1:** A `CONTEXT.md` file, an `INTENT.md` file, and project instructions in the Manus AI platform.
- **Tier 2:** Three Manus AI skills (`polymarket-context`, `polymarket-deploy`, `polymarket-trading`) and a Notion workspace containing operational knowledge pages (strategy research, decision logs, API learnings, and the context engineering framework itself).
- **Tier 3:** A Pinecone vector database containing the full Polymarket API documentation, the `py-clob-client` SDK documentation, and the organisation's architectural standards.

This real-world implementation serves as the primary validation of the principles and specifications outlined in this document.

## References

[1] Jones, N. B. (2026). *The Most Expensive AI Mistake Isn't What You Think*. Nate's Newsletter. [https://natesnewsletter.substack.com/p/the-most-expensive-ai-mistake-isnt-what-you-think](https://natesnewsletter.substack.com/p/the-most-expensive-ai-mistake-isnt-what-you-think)

[2] Anthropic. (2025). *Effective context engineering for AI agents*. Anthropic Engineering Blog. [https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

[3] Bradner, S. (1997). *Key words for use in RFCs to Indicate Requirement Levels*. RFC 2119. [https://www.rfc-editor.org/rfc/rfc2119](https://www.rfc-editor.org/rfc/rfc2119)

[4] Hijazi, F. (2026). *Nate B. Jones's 4 Skills of Prompting in 2026*. LinkedIn. [https://www.linkedin.com/posts/farishijazi_prompting-just-split-into-4-skills-you-activity-7435082175647199232-cF7U](https://www.linkedin.com/posts/farishijazi_prompting-just-split-into-4-skills-you-activity-7435082175647199232-cF7U)

[5] Claude Code. (2026). *How Claude remembers your project*. Claude Code Documentation. [https://code.claude.com/docs/en/memory](https://code.claude.com/docs/en/memory)

[6] LLM-Readme. (2025). *README.llm*. GitHub. [https://github.com/intelligent-readme/llm-readme](https://github.com/intelligent-readme/llm-readme)

[7] LLMS.md. (2025). *LLMS.md*. GitHub. [https://github.com/LLMS-md/llms-md](https://github.com/LLMS-md/llms-md)

[8] Product Compass. (2026). *The Intent Engineering Framework for AI Agents*. Product Compass. [https://www.productcompass.pm/p/intent-engineering-framework-for-ai-agents](https://www.productcompass.pm/p/intent-engineering-framework-for-ai-agents)
