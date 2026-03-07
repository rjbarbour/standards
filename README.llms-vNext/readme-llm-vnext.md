# README.llm vNext: Retrieval-Aware, Multi-File, and Behavioural Extensions

**Version:** 0.1 (Draft)
**Status:** Proposal
**Author:** Robert J. Barbour
**Date:** February 2026
**License:** MIT

---

## 1. Abstract

ReadMe.LLM (Wijaya et al., 2025) establishes a structured, LLM-oriented documentation file that demonstrably improves model performance when working with software libraries. Its core insight is correct: LLMs need documentation designed for their consumption patterns, not adapted from human-oriented prose. The framework's empirical results — up to 100% accuracy improvement in code generation tasks with niche libraries — validate the fundamental premise.

However, ReadMe.LLM addresses only one layer of the problem. It defines the *content structure* of a single documentation file but does not address *discovery*, *scalable packaging*, *retrieval efficiency*, or *explicit behavioural semantics* beyond illustrative examples. As libraries grow in complexity and as agentic systems increasingly consume documentation autonomously, these gaps become structural constraints.

This proposal extends ReadMe.LLM without replacing it. It introduces conventions for machine-readable indexing, multi-file documentation sets, retrieval-optimised metadata, behavioural contract sections, and optional validation blocks. The result is a documentation architecture that scales from a single README.llm file for a small library to a navigable, retrieval-efficient corpus for a large SDK — while remaining backward-compatible with the original framework.

**Important caveat:** The original ReadMe.LLM paper provides empirical evidence that its format improves LLM code generation accuracy. This proposal has not yet been empirically validated. The extensions proposed here are grounded in principled reasoning about retrieval efficiency, scalability, and semantic precision, but their measurable impact on model performance remains to be demonstrated. A companion evaluation framework is outlined in the Future Directions section.

---

## 1a. Scope and Limitations

This proposal is optimised for specific conditions and does not attempt to solve all documentation problems.

**Assumed context.** LLMs with 8K-200K token context budgets consuming documentation for developer-facing APIs and tools. The contract model assumes predominantly synchronous, single-threaded semantics with explicit error handling (exceptions, error codes, status codes). Libraries targeting timing-constrained systems, concurrent access patterns, or transactional guarantees may find the contract model insufficient for their specific constraints — though the Invariants section can serve as a partial workaround.

**Assumed audience.** Library maintainers, SDK authors, CLI tool developers, and documentation platform vendors. End-user-facing application documentation, design systems, and educational materials are out of scope, though the structures may be adaptable.

**Not addressed in v0.1:**

- Symbol-level indexing within documents (planned for v0.2).
- Multi-version documentation sets (recommend separate documentation per major release).
- Formal verification (behavioural contracts are documentation constructs, not machine-checkable proofs).
- Concurrent, transactional, or timing semantics as first-class contract sections.
- IDE integration specifications and platform support.

**When this proposal may not be appropriate:**

- Volunteer-maintained libraries with sporadic documentation — the maintenance burden of structured contracts may exceed available effort.
- Libraries undergoing major refactoring — documentation drift risk is high and contracts will become stale rapidly.
- Proprietary systems where documentation is a competitive asset and machine-discoverability is undesirable.
- Libraries whose users will not access them through LLM-mediated workflows.

---

## 2. Problem Statement

### 2.1 The Documentation-Consumption Mismatch

Traditional software documentation is optimised for human cognition. It assumes sequential reading, contextual inference, the ability to hold a mental model across pages, and the capacity to fill gaps through experience. These assumptions break down when the consumer is a large language model.

LLMs operate under fundamentally different constraints. They have finite context windows, typically ranging from 8,000 to 200,000 tokens depending on model and configuration. They incur real costs per token processed. They interpret ambiguous semantics probabilistically, which means vague documentation produces unpredictable behaviour. They cannot "remember" material outside the current context, and they are susceptible to hallucination when specification boundaries are unclear.

These constraints create three systemic problems:

**Retrieval inefficiency.** When documentation exceeds a few thousand tokens, developers face a choice: inject the entire corpus (wasting tokens on irrelevant material) or manually curate a subset (risking omission of critical information). Neither approach scales. A jQuery-scale library with comprehensive documentation might consume 50,000+ tokens if injected wholesale, yet an LLM working on AJAX error handling needs perhaps 3,000 tokens of relevant content.

**Semantic ambiguity.** Traditional documentation communicates behavioural constraints implicitly. A human reader infers from a code example that `$.ajax()` requires a `url` property because every example includes one. An LLM may or may not draw this inference reliably, particularly when examples are inconsistent or when the constraint is mentioned in prose paragraphs distant from the function signature. Making such constraints explicit — as preconditions, invariants, and failure modes — transforms probabilistic inference into deterministic specification.

**Manual collation burden.** The process of preparing documentation for LLM consumption is currently artisanal. A developer working with a niche library must read the documentation, extract relevant portions, format them appropriately, test the model's comprehension, iterate on the context, and often repeat this process for each new task. This is the problem ReadMe.LLM addresses at the single-file level. But when a library is large, or when documentation must be consumed by an autonomous agent rather than manually uploaded, single-file collation becomes insufficient.

### 2.2 Beyond REST: The Cross-Interface Problem

These problems are not specific to any single interface type. They affect:

- **HTTP/REST APIs**, where endpoint documentation is often spread across multiple pages with inconsistent formatting.
- **Object-oriented libraries** (Java, C#, Python), where class hierarchies, method contracts, and inheritance semantics create deep documentation trees.
- **Functional APIs** where composition rules, purity guarantees, and higher-order function contracts are critical but rarely formalised in documentation.
- **Fluent interfaces** (e.g., jQuery-style method chaining) where call-order constraints and return-type guarantees are essential for correct usage.
- **CLI tools** where command trees, flag interactions, exit codes, and environment variable dependencies create complex behavioural surfaces.
- **Domain-specific languages** where grammar rules, semantic constraints, and execution model assumptions must be communicated precisely.

No existing standard addresses this full spectrum. OpenAPI covers HTTP. JSDoc covers JavaScript types. TypeScript declarations cover structural typing. Each is valuable within its domain but insufficient as a general documentation architecture for LLM consumption. The problem space requires a format that is *transport-agnostic* and *interface-neutral* while remaining structured enough for deterministic retrieval and explicit enough for reliable model behaviour.

### 2.3 The Retrieval Architecture Gap

ReadMe.LLM solves the *content structure* problem. It defines how to organise rules, descriptions, and examples within a single file so that an LLM can consume them effectively. What it does not solve is the *retrieval architecture* problem: how does an LLM or agent discover, select, and load the right documentation for a given task?

Consider a realistic scenario. A developer asks an AI coding assistant to write a function using the Stripe API. The assistant needs to understand Stripe's authentication model, the specific endpoint being called, the request/response schemas, error handling conventions, and perhaps rate limiting behaviour. This information exists across multiple documentation pages. Today, the assistant either searches the web (unreliable), relies on training data (potentially outdated), or requires the developer to manually provide context (defeating the purpose of assistance).

A retrieval-aware documentation architecture would allow the assistant to: (1) discover that Stripe publishes LLM-oriented documentation, (2) read a lightweight index to understand what documentation is available, (3) retrieve metadata about each document to assess relevance, and (4) load only the specific documents needed for the current task. This is the gap this proposal addresses.

---

## 3. Prior Art and Analytical Positioning

### 3.1 ReadMe.LLM

ReadMe.LLM (Wijaya et al., 2025) proposes a structured, LLM-oriented documentation file accompanying software libraries. Its three core components — Rules, Library Description, and Code Snippets — provide a template that demonstrably improves code generation accuracy. The paper's empirical results are compelling: baseline success rates of approximately 30% improve to near-perfect accuracy when models are provided with well-structured ReadMe.LLM files.

**Strengths.** ReadMe.LLM establishes the principle that LLMs benefit from purpose-built documentation. Its XML-tagged internal structure provides clear semantic boundaries. The rules component allows library authors to communicate constraints and usage patterns that models would otherwise need to infer. The empirical validation provides a credibility foundation that few competing proposals can claim.

**Structural limitations.** ReadMe.LLM is designed as a single-file prompt attachment. Its implicit workflow is: library author creates the file, developer manually uploads it alongside their query. This works well for small libraries with contained API surfaces, but it does not address how large documentation sets should be packaged, how agents should discover that documentation exists, or how retrieval should work when the full corpus exceeds practical context window limits. The framework also does not formalise behavioural contracts (preconditions, postconditions, failure modes, invariants) as distinct structural elements — these are embedded within examples and rules without a standardised schema.

**This proposal's relationship.** This extension treats ReadMe.LLM as the foundational artefact. A valid ReadMe.LLM file remains the required entry point. Everything proposed here is additive: mechanisms for discovery, multi-file organisation, retrieval metadata, and structured behavioural semantics that augment the original framework.

### 3.2 llms.txt

The llms.txt convention (Howard, 2024) proposes a lightweight index file at a website's root path, analogous to `robots.txt`. It lists documentation pages with brief descriptions, providing a discovery mechanism for LLMs and agents.

**Strengths.** llms.txt is simple, well-understood, and gaining adoption. It solves the discovery problem at the transport level — an agent can fetch `/llms.txt` to learn what documentation is available.

**Limitations.** llms.txt defines discovery but not content structure. It does not specify how individual documentation files should be formatted, what metadata they should contain, or how they should be organised for retrieval efficiency. It is a pointer mechanism, not a documentation architecture. An LLM that fetches llms.txt knows *where* documentation lives but not *how* to efficiently consume it.

**Complementarity.** This proposal is fully compatible with llms.txt. A library that publishes both llms.txt (for web-level discovery) and a README.llm-based documentation set (for structured content) would provide comprehensive coverage. The machine manifest proposed here (llm-index.json) operates at a different granularity — it describes the internal structure of the documentation set rather than its location on the web.

### 3.3 LLMS.md

LLMS.md is a proposed convention for code repositories, positioning itself as the "README.md for AI agents." It provides a structured context file within a repository that helps LLMs understand the codebase.

**Complementarity.** LLMS.md targets repository-level context (project structure, architecture, conventions) while README.llm targets library/API-level documentation (interface contracts, usage patterns, behavioural semantics). They address different layers of the documentation stack and can coexist productively.

### 3.4 OpenAPI

The OpenAPI Specification (formerly Swagger) provides a machine-readable description format for HTTP APIs. It defines endpoints, methods, parameters, request/response schemas, and authentication mechanisms.

**Strengths.** OpenAPI is the most mature machine-readable API description standard. Its tooling ecosystem is extensive, supporting auto-generation of client libraries, test suites, and documentation. LLMs can consume OpenAPI specifications effectively because they are structurally precise.

**Limitations.** OpenAPI is fundamentally HTTP-centric. It cannot describe JavaScript method chains, CLI command trees, class hierarchies, or DSL grammars. It focuses on structural interface description (what endpoints exist, what they accept, what they return) rather than behavioural semantics (what state transitions occur, what invariants hold, what happens when things go wrong beyond HTTP status codes). It is also not retrieval-aware — a large OpenAPI specification must be consumed in its entirety.

**Complementarity.** This proposal does not replace OpenAPI. For HTTP APIs, an OpenAPI specification is an excellent companion artefact. The README.llm documentation set can reference or embed OpenAPI files while adding behavioural contracts, usage guidance, and cross-cutting concerns that OpenAPI does not capture.

### 3.5 JSDoc, TypeDoc, and TypeScript Declarations

These tools provide code-level type annotations and structural documentation for JavaScript and TypeScript codebases.

**Strengths.** They are code-proximal, maintaining documentation close to implementation. TypeScript declarations (.d.ts files) are particularly LLM-friendly in their structural precision — they describe exactly what types a function accepts and returns.

**Limitations.** All three are type-centric rather than behaviour-centric. They describe the *shape* of an API but not its *semantics*. They do not capture constraints like "this function must be called after initialisation," "this method is not thread-safe," or "this operation has the side effect of invalidating the cache." They also lack retrieval-aware metadata — there is no mechanism to scan a TypeScript declaration file's metadata before deciding whether to read it in full.

### 3.6 JSON Schema

JSON Schema formalises data structures. It describes the shape of JSON documents but not the behaviour of systems that produce or consume them.

**Relevance.** JSON Schema may be used within this proposal's framework — for example, to formally define the structure of the `llm-index.json` manifest. But it does not address the documentation architecture problem itself.

### 3.7 Model Context Protocol (MCP)

MCP is an open protocol for connecting AI systems to tools and data sources. It defines how agents invoke tools, access resources, and receive structured responses.

**Relationship.** MCP governs runtime interaction, not documentation structure. However, MCP servers could consume README.llm documentation sets to build retrieval indexes, serve structured context to models, and map documented APIs to invokable tools. This proposal complements MCP by improving the quality and structure of the documentation that MCP servers would ingest.

---

## 4. Design Goals and Explicit Non-Goals

### 4.1 Design Goals

**Cross-interface applicability.** The documentation architecture must work equally well for REST APIs, object-oriented libraries, functional APIs, CLI tools, and DSLs. No assumption about transport protocol or programming paradigm may be embedded in the core design.

**Retrieval efficiency.** Documentation must support selective loading. An agent should be able to determine relevance from metadata alone, without reading the full content of every file. This directly reduces token costs and improves response quality by limiting context to relevant material.

**Minimal adoption friction.** A library author who already maintains a ReadMe.LLM file should be able to adopt this extension incrementally. The minimal compliance bar is unchanged: a valid ReadMe.LLM file. Every additional mechanism is optional.

**Deterministic discovery.** When extended mechanisms are used, their locations and formats must be predictable. An agent encountering a repository should be able to determine whether extended documentation exists through a deterministic check (e.g., the presence of `llm-index.json` at a known path).

**Backward compatibility.** Existing ReadMe.LLM implementations must remain valid without modification. This extension adds new capabilities; it does not alter the requirements of the base framework.

**Auto-generation feasibility.** The structures defined here should be generatable from existing documentation sources (JSDoc annotations, OpenAPI specs, TypeScript declarations, inline code comments) through automated tooling. A standard that requires entirely manual authoring will not achieve widespread adoption.

### 4.2 Non-Goals

**Replacing OpenAPI.** This proposal does not attempt to be a better interface description language for HTTP APIs. OpenAPI remains the appropriate tool for that purpose. This proposal addresses the documentation layer around and above interface descriptions.

**Formal verification.** The behavioural contract sections proposed here are documentation constructs, not executable formal specifications. They are intended to improve LLM comprehension, not to provide machine-checkable proofs of correctness.

**Governance infrastructure.** This proposal does not define a standards body, a review process, or a compliance certification mechanism. It is a technical specification intended for organic adoption.

**Prompt engineering standardisation.** This proposal does not prescribe how LLMs should be prompted with the documentation. It defines the *structure* of documentation, not the *consumption strategy*.

---

## 5. Compliance Model

A clear compliance model prevents ambiguity about what it means to "support" this specification. There are two levels.

### 5.1 Base Compliance

Base compliance requires exactly one thing: **a valid ReadMe.LLM file** following the original framework's structure (Rules, Library Description, Code Snippets). This is unchanged from the existing standard.

A base-compliant library may optionally include a pointer to extended documentation within its ReadMe.LLM file, but this is not required.

### 5.2 Extended Compliance: Capability Declarations

Rather than a single "extended compliance" tier, this specification defines independent **capability levels** that libraries may declare. Each capability is independently testable and independently valuable. Libraries declare which capabilities they support; consumers check for the capabilities they need.

**Capability: `retrieval-indexed`**
- `llm-index.json` exists at a discoverable location AND is valid JSON conforming to the schema in Appendix A.
- All `path` entries in the manifest reference existing, readable files.
- All `approx_tokens` values are within ±15% of actual token counts (measured by the declared tokenizer or `cl100k_base` by default).
- `schema_version`, `library.name`, `library.version`, and `readme_llm.path` are present and valid.

**Capability: `metadata-rich`**
- All extended documentation files begin with a valid metadata header.
- `LLM-META-LINES` count matches the actual number of lines in the header block (including the delimiter).
- All REQUIRED header fields (`LLM-META-LINES`, `Title`, `---` delimiter) are present.
- Files use LF line endings. Tooling processing CRLF files MUST convert to LF before counting lines.

**Capability: `contract-annotated`**
- At least 50% of documented symbols include both a **Preconditions** section and a **Failure Modes** section.
- Contract sections appear within reference documentation files, following the structure defined in Section 6.5.

**Capability: `validation-equipped`**
- At least 5 TestCase blocks exist, covering representative success and failure scenarios.
- Each TestCase includes the REQUIRED fields defined in Section 6.6.3.

### 5.3 Compliance Summary

| Capability | Required Artefacts | Testable Criterion |
|---|---|---|
| Base (ReadMe.LLM) | ReadMe.LLM file | File exists and conforms to ReadMe.LLM framework |
| `retrieval-indexed` | llm-index.json | Valid JSON, paths resolve, tokens within ±15% |
| `metadata-rich` | In-file headers | Line counts match, required fields present |
| `contract-annotated` | Contract sections | ≥50% of symbols have Preconditions + Failure Modes |
| `validation-equipped` | Test blocks | ≥5 TestCases with required fields |

A library may claim any combination of capabilities. The capabilities are ordered by increasing effort but also increasing value: `retrieval-indexed` is the most impactful single addition for agentic consumption, while `validation-equipped` provides the strongest quality assurance.

This model ensures that adoption can be incremental. A library author can start with a ReadMe.LLM file and add capabilities as the documentation matures. Each capability added provides concrete, measurable value rather than a vague "extended" designation.

---

## 6. Core Extension Design

### 6.1 Machine-Readable Manifest

#### 6.1.1 Purpose

The manifest provides a machine-parseable overview of the entire documentation set. It allows an agent to understand what documentation is available, assess its relevance, and plan a retrieval strategy — all without reading any Markdown content.

This serves the same architectural role that a database index serves for queries: it enables efficient lookup without full-table scanning.

#### 6.1.2 Format and Location

The manifest MUST be a valid JSON file named `llm-index.json`.

**For repository-hosted libraries**, the manifest SHOULD be placed at the repository root, adjacent to the ReadMe.LLM file:

```
/ReadMe.LLM
/llm-index.json
```

**For domain-hosted libraries** (documentation served from a website rather than a repository), the manifest SHOULD be placed at `/.well-known/llm-index.json`. The `.well-known` path is appropriate here because it signals machine-discoverable metadata — the same pattern used by `security.txt`, OAuth discovery, and other automated protocols.

Both locations are acceptable. If both exist, the repository-root manifest takes precedence for consumers operating within the repository context.

#### 6.1.3 Schema (v0.1)

```json
{
  "$schema": "https://standards.digitalmercenaries.ai/schemas/readme-llm-vnext/manifest-0.1.schema.json",
  "schema_version": "0.1",
  "library": {
    "name": "ExampleLib",
    "version": "2.3.0",
    "description": "A utility library for HTTP requests and DOM manipulation",
    "language": "JavaScript",
    "runtime": "Browser / Node.js",
    "interfaces": ["JavaScript API", "CLI"],
    "repository": "https://github.com/example/examplelib",
    "homepage": "https://examplelib.dev"
  },
  "readme_llm": {
    "path": "ReadMe.LLM",
    "approx_tokens": 3500
  },
  "documents": [
    {
      "path": "docs/llm/reference/ajax.md",
      "type": "reference",
      "short_description": "AJAX methods: $.ajax, $.get, $.post, and jqXHR behaviour",
      "topics": ["ajax", "http", "async", "promises"],
      "symbols": ["$.ajax", "$.get", "$.post", "jqXHR"],
      "approx_tokens": 2400,
      "has_contracts": true,
      "has_tests": false
    },
    {
      "path": "docs/llm/reference/cli.md",
      "type": "reference",
      "short_description": "CLI tool: command tree, flags, and exit codes",
      "topics": ["cli", "commands", "flags"],
      "symbols": ["examplelib build", "examplelib test", "--config"],
      "approx_tokens": 1800,
      "has_contracts": true,
      "has_tests": true
    },
    {
      "path": "docs/llm/examples/quickstart.md",
      "type": "examples",
      "short_description": "Basic usage patterns and common workflows",
      "topics": ["getting-started", "usage"],
      "approx_tokens": 1200,
      "has_contracts": false,
      "has_tests": false
    },
    {
      "path": "docs/llm/contracts/ajax-invariants.md",
      "type": "contracts",
      "short_description": "Formal behavioural contracts for AJAX operations",
      "topics": ["ajax", "error-handling", "promises"],
      "symbols": ["$.ajax", "jqXHR"],
      "approx_tokens": 900,
      "has_contracts": true,
      "has_tests": true
    }
  ],
  "total_approx_tokens": 9900,
  "generation": {
    "tool": "readme-llm-generator",
    "tool_version": "0.3.1",
    "generated_at": "2026-02-15T10:30:00Z",
    "source": "JSDoc annotations + manual review"
  }
}
```

#### 6.1.4 Field Requirements

**Required fields:**
- `$schema` — SHOULD be present as a fully qualified URL pointing to the canonical published JSON Schema for the manifest version in use.
- `schema_version` — MUST be present. Enables tooling to handle schema evolution.
- `library.name` — MUST be present.
- `library.version` — MUST be present. Critical for drift detection.
- `readme_llm.path` — MUST be present. Points to the base ReadMe.LLM file.
- `documents` — MUST be present if any extended documentation files exist.
- Each document entry MUST include `path` and `type`.

**Strongly recommended fields:**
- `approx_tokens` — SHOULD be present on each document and on the manifest root (`total_approx_tokens`). This enables token-budget-aware retrieval.
- `short_description` — SHOULD be present. Enables relevance assessment without reading the file.
- `topics` — SHOULD be present. Enables keyword-based filtering.

**Optional fields:**
- `symbols` — Symbol-level coverage per document.
- `has_contracts`, `has_tests` — Boolean flags for content type filtering.
- `generation` — Provenance metadata.
- `library.interfaces` — List of interface types covered (e.g., "REST", "JavaScript API", "CLI").

#### 6.1.5 Design Rationale: JSON vs YAML

JSON was chosen over YAML for the manifest format. Both are capable, but JSON offers meaningful advantages in this context:

**Deterministic parsing.** JSON parsers across languages produce identical results for valid input. YAML parsers exhibit meaningful variation: the "Norway problem" (the string `NO` being interpreted as boolean `false`), inconsistent handling of multi-line strings, and dialect differences between YAML 1.1 and 1.2 are well-documented sources of real-world bugs. For a manifest that will be consumed by diverse tooling across languages, this matters.

**Universal tooling.** Every programming language includes a JSON parser in its standard library. YAML support, while widespread, is not universal and requires external dependencies in some environments.

**Structural simplicity.** The manifest does not benefit from YAML's advantages (human authoring of complex nested structures, comments, anchors/aliases). It is a machine-generated, machine-consumed artefact. JSON's simplicity is a feature here, not a limitation.

**The case for YAML.** YAML would be preferable if the manifest were primarily human-authored and human-edited, or if it needed comments for inline documentation. If community feedback strongly favours YAML, a future version could support both formats with a detection mechanism based on file extension (`.json` vs `.yaml`). This is discussed further in the Alternatives appendix.

### 6.2 Multi-File Documentation Structure

#### 6.2.1 Purpose

A single ReadMe.LLM file is sufficient for small libraries with contained API surfaces. As a library grows — more functions, more complex state management, multiple interface types, nuanced error handling — a single file becomes unwieldy. Either it grows to thousands of tokens (defeating retrieval efficiency) or it must be pruned (sacrificing completeness).

Multi-file organisation solves this by decomposing documentation into independently retrievable units. Each unit covers a specific topic, set of symbols, or concern, and can be loaded into context only when relevant.

#### 6.2.2 Recommended Layout

```
/ReadMe.LLM                       # Required: entry point
/llm-index.json                   # Recommended: machine manifest
/docs/llm/
  reference/                       # API reference documentation
    ajax.md                        #   HTTP utility reference
    dom.md                         #   DOM manipulation reference
    cli.md                         #   CLI command reference
  examples/                        # Usage examples
    quickstart.md                  #   Getting started
    advanced-patterns.md           #   Complex usage patterns
    error-handling.md              #   Error handling recipes
  contracts/                       # Behavioural contracts
    ajax-invariants.md             #   AJAX behavioural guarantees
    dom-safety.md                  #   DOM operation safety rules
  validation/                      # Optional: test/validation blocks
    ajax-tests.md                  #   AJAX validation cases
```

#### 6.2.3 Document Types

The following document types are defined:

| Type | Purpose | Content Focus |
|---|---|---|
| `overview` | High-level library description | Architecture, concepts, getting started |
| `reference` | API surface documentation | Signatures, parameters, return types |
| `examples` | Usage patterns and recipes | Runnable code with expected outputs |
| `contracts` | Behavioural specifications | Preconditions, invariants, failure modes |
| `validation` | Test and diagnostic cases | Input/output pairs for model evaluation |
| `changelog` | Version history and migration | Breaking changes, deprecations |
| `tutorial` | Step-by-step guided instruction | Narrative walkthroughs |

Libraries are not required to use all types. A minimal extended implementation might consist of ReadMe.LLM plus a single reference document.

#### 6.2.4 Chunking Principles

Documentation files SHOULD be chunked according to the following principles:

**Token budget awareness.** No single file SHOULD exceed 8,000 tokens (approximately 6,000 words or 24KB of Markdown). This keeps each file within comfortable injection limits for all current models while leaving room for the prompt and response.

**Topical cohesion.** Each file should cover a coherent topic. A file about AJAX methods should not also cover DOM manipulation, even if both topics are small enough to fit in one file. Topical coherence improves retrieval precision.

**Symbol grouping.** When documenting API symbols, related symbols should be grouped together. All methods on a class, all subcommands of a CLI command, or all functions in a module form natural grouping units.

**File count constraint.** The total number of LLM-oriented documentation files SHOULD NOT exceed 20. This accommodates the file-upload limits of most LLM platforms (typically 10-25 files) for manual-upload workflows while remaining manageable for automated systems. If a library's documentation naturally exceeds this limit, the ReadMe.LLM file should serve as a navigation guide, and the manifest should include `preferred_retrieval` hints to guide selective loading.

### 6.3 In-File Metadata Headers

#### 6.3.1 Purpose

While the manifest provides corpus-level metadata, in-file metadata headers provide document-level metadata *within* each file. This serves two purposes:

**Head-first retrieval.** An agent can read only the first N lines of a file (using a `head`-equivalent operation) to obtain metadata about the file's contents, relevance, and scope. This is faster and cheaper than reading the full file when assessing relevance.

**Self-describing files.** Files that carry their own metadata remain useful even when separated from the manifest — for example, when a developer manually uploads a subset of files to an LLM, or when files are shared outside their original repository context.

#### 6.3.2 Format

Each LLM-oriented Markdown file SHOULD begin with a metadata header. The format is:

```
LLM-META-LINES: 14
Title: AJAX Reference
Scope: $.ajax, $.get, $.post, jqXHR
Summary: Core HTTP utility methods. Covers request configuration,
  promise semantics, error handling, and jqXHR object behaviour.
Topics: ajax, http, async, promises, error-handling
Symbols: $.ajax, $.get, $.post, $.ajaxSetup, jqXHR
Dependencies: jQuery >= 1.5
ApproxTokens: 2400
DocVersion: 2.3.0
SpecVersion: 0.1
LastVerifiedAgainst: ExampleLib 2.3.0
---

# AJAX Reference

...content begins here...
```

#### 6.3.3 Field Definitions

**`LLM-META-LINES`** (REQUIRED if header is present) — The first line of the file. Declares the total number of lines in the metadata block, including this line and the `---` delimiter. This enables deterministic extraction: `head -n <N>` yields exactly the metadata.

**`Title`** (REQUIRED) — Human-readable title of the document.

**`Scope`** (RECOMMENDED) — Brief description of what this document covers.

**`Summary`** (RECOMMENDED) — One to three sentences describing the content. May span multiple lines if indented.

**`Topics`** (RECOMMENDED) — Comma-separated topic keywords for relevance matching.

**`Symbols`** (OPTIONAL) — Comma-separated list of API symbols documented in this file.

**`Dependencies`** (OPTIONAL) — Libraries or versions this documentation depends on.

**`ApproxTokens`** (RECOMMENDED) — Estimated token count of the full document (including metadata).

**`DocVersion`** (OPTIONAL) — Version of the documented library.

**`SpecVersion`** (RECOMMENDED) — Version of this specification the file conforms to.

**`LastVerifiedAgainst`** (OPTIONAL) — Library version against which this documentation was last verified. Critical for drift detection.

**`---`** (REQUIRED if header is present) — Delimiter separating metadata from content. Must appear on its own line (exactly three hyphens, no leading or trailing whitespace).

#### 6.3.4 Edge Cases and Parsing Rules

**Line endings.** Files MUST use LF (Unix) line endings. Tooling consuming files with CRLF endings MUST normalise to LF before counting metadata lines. The `LLM-META-LINES` count assumes LF endings.

**Multi-line values.** Fields that span multiple lines (e.g., a long Summary) MUST indent continuation lines with at least two spaces. Each continuation line counts toward the `LLM-META-LINES` total.

```
LLM-META-LINES: 10
Title: AJAX Reference
Summary: Core HTTP utility methods covering request configuration,
  promise semantics, error handling, and the jqXHR object
  interface across synchronous and asynchronous modes.
Topics: ajax, http, promises
ApproxTokens: 2400
SpecVersion: 0.1
---
```

In this example, the Summary spans three lines, and `LLM-META-LINES` is 10 (covering all lines including the delimiter).

**Character encoding.** Files MUST be UTF-8 encoded. BOM (byte order mark) MUST NOT be present.

**Empty fields.** If a field is present but has no value (e.g., `Symbols:`), it SHOULD be omitted entirely rather than left blank.

**Unrecognised fields.** Consumers MUST ignore metadata fields they do not recognise. This ensures forward compatibility with future specification versions.

#### 6.3.5 Design Rationale: Embedded vs External Metadata

A key design choice is whether metadata should live inside each file (as proposed) or solely in the external manifest.

**The case for embedded metadata.** Metadata that travels with the file cannot drift from the file's content. When files are copied, shared, or uploaded individually, embedded metadata remains available. External-only metadata requires the manifest to be present, creating a single point of failure. Additionally, embedded metadata enables the head-first retrieval pattern without requiring the agent to first locate and parse a separate manifest.

**The case for external-only metadata.** External metadata avoids polluting content files with non-content material. It centralises metadata management, making bulk updates easier. It also avoids the line-count coordination problem (ensuring `LLM-META-LINES` stays accurate as metadata fields are added or removed).

**The chosen approach** is embedded metadata with external manifest as complementary. Metadata SHOULD be present in both locations. If they disagree, the in-file metadata takes precedence (because it is more likely to have been updated alongside the content). Tooling SHOULD validate consistency between the two.

### 6.4 Retrieval Model

This section formalises the retrieval architecture that the preceding mechanisms enable. This is the conceptual core of the extension: documentation structured as a navigable graph rather than a flat corpus.

#### 6.4.1 Three-Phase Retrieval

The documentation architecture supports a three-phase retrieval model:

**Phase 1: Discovery.** The agent determines whether README.llm-compliant documentation exists. For repository-hosted libraries, it checks for `llm-index.json` at the repository root. For domain-hosted documentation, it checks `/.well-known/llm-index.json`. If no manifest is found, it falls back to checking for a ReadMe.LLM file directly.

**Phase 2: Assessment.** The agent reads the manifest to understand the documentation landscape. Using `approx_tokens`, `topics`, `symbols`, and `short_description` fields, it assesses which documents are relevant to the current task and whether the total relevant content fits within its token budget. If the manifest is unavailable, the agent can perform assessment by reading metadata headers (`head -n <LLM-META-LINES>`) from individual files.

**Phase 3: Retrieval.** The agent loads only the documents identified as relevant. For large documents, it may choose to read the metadata header first and then decide whether to load the full content.

This three-phase model means that an agent consuming a documentation set of 10 files totalling 20,000 tokens might read only: the manifest (~500 tokens) plus 2-3 relevant files (~5,000 tokens), rather than the entire corpus.

#### 6.4.2 Retrieval Algorithm

The manifest's metadata fields enable a concrete retrieval algorithm. The following is the RECOMMENDED retrieval strategy for agents consuming README.llm documentation sets. Implementations MAY deviate, but this algorithm defines the intended behaviour the documentation architecture is designed to support.

```
Algorithm: RetrieveDocumentation(task, token_budget, manifest)

  1. COMPUTE manifest_cost = approx_tokens(manifest)
     remaining_budget = token_budget - manifest_cost

  2. For each document in manifest.documents:
       COMPUTE relevance_score:
         a. Symbol match: If task references symbols listed in
            document.symbols → score += 1.0 per exact match
         b. Topic match: If task keywords overlap with
            document.topics → score += 0.5 per matching topic
         c. Description match: Semantic similarity between task
            and document.short_description → score += [0.0, 0.5]

  3. SORT documents by relevance_score, descending.

  4. PARTITION sorted documents into priority tiers:
       Tier 1 (critical):  type in [reference, contracts]
       Tier 2 (supporting): type in [examples, overview]
       Tier 3 (supplementary): type in [tutorial, changelog, validation]

  5. Within each tier, documents retain their relevance ordering.

  6. ACCUMULATE documents into the retrieval set:
       For each document in tier order, then relevance order:
         If document.approx_tokens <= remaining_budget:
           Add document to retrieval set
           remaining_budget -= document.approx_tokens
         Else if document is Tier 1 AND remaining_budget > 500:
           Add document to retrieval set (accept budget overrun
           for critical documents)
           remaining_budget -= document.approx_tokens
         Else:
           Skip document

  7. RETURN retrieval set + remaining_budget
```

**Tiebreaker rule.** When two documents have equal relevance scores within the same tier, prefer the document with fewer `approx_tokens` (more efficient use of budget).

**Budget overrun policy.** Tier 1 documents (reference, contracts) may cause the retrieval set to exceed the token budget. This is intentional: incomplete reference or contract documentation is worse than a modest budget overrun. Implementations SHOULD cap total overrun at 20% of the original budget.

**Truncation.** If a single document exceeds the entire remaining budget and is Tier 1, implementations MAY load only the metadata header plus the first section (determined by the first `## ` heading after the metadata delimiter). This provides at least the document's overview and first symbol's documentation.

#### 6.4.3 Token Counting

The `approx_tokens` field is central to retrieval planning. To ensure consistency across implementations:

- Token counts SHOULD be calculated using the OpenAI `cl100k_base` tokenizer (used by GPT-4 and widely available in open-source libraries). If a different tokenizer is used, the manifest's `generation` object SHOULD include a `tokenizer` field specifying which was used.
- Token counts MUST be within ±15% of the actual count for the specified tokenizer. Tooling SHOULD warn when discrepancies exceed this threshold.
- Token counts include the metadata header (if present) as part of the document's total.

#### 6.4.4 Relevance Signals

Multiple metadata fields contribute to relevance assessment:

- **`symbols`** — The strongest signal. Direct symbol lookup when the agent knows which API symbols are relevant. An exact match on a symbol name SHOULD always result in document retrieval (budget permitting).
- **`topics`** — Keyword matching against the current task context. Useful when the agent does not yet know specific symbol names.
- **`type`** — Document type filtering (e.g., retrieving only `contracts` when debugging, or only `examples` when generating boilerplate).
- **`short_description`** — Semantic matching for more nuanced relevance assessment. Most useful when topic keywords do not capture the retrieval need.

### 6.5 Behavioural Contract Sections

The retrieval model described above ensures that agents can efficiently *find* the right documentation. But retrieval efficiency is only half the problem — the retrieved content must also be *semantically precise* enough for the model to act on reliably. This is the problem behavioural contracts address.

#### 6.5.1 Purpose

ReadMe.LLM's Code Snippets component provides function signatures paired with examples. This is effective for communicating typical usage patterns, but it communicates behavioural constraints only implicitly. An example that shows `$.ajax({url: "/data"})` implies that `url` is required, but it does not *state* this as a rule.

Behavioural contract sections make implicit constraints explicit. They transform "you can infer from examples that X is required" into "X is required; here is what happens if it is missing."

This matters because LLMs are probabilistic systems. They may or may not correctly infer constraints from examples, especially when examples are few, inconsistent, or when the constraint is non-obvious. Explicit contracts reduce the inference burden and improve deterministic behaviour.

#### 6.5.2 Contract Structure

Within reference documentation files, each documented symbol MAY include structured contract sections:

```markdown
## $.ajax(options)

**Signature:** `$.ajax(options: AjaxOptions) → jqXHR`

**Description:**
Performs an asynchronous HTTP request. Returns a jqXHR object that
implements the Promise interface.

### Preconditions
- `options` MUST be a non-null object.
- `options.url` MUST be a non-empty string.
- If `options.method` is provided, it MUST be a valid HTTP method.

### Postconditions
- Returns a `jqXHR` object implementing `.then()`, `.catch()`, `.always()`.
- The returned object has a `status` property set after request completion.

### State Effects
- Initiates an asynchronous HTTP request to the specified URL.
- Modifies global `$.ajaxSettings` if `options.global` is not `false`.

### Failure Modes
- Throws `TypeError` if `options` is not an object.
- Returns a rejected promise if `options.url` is missing.
- Returns a rejected promise with status code if HTTP response is >= 400.
- Times out and rejects if `options.timeout` is exceeded.

### Invariants
- The `jqXHR` object always exposes `.then()` regardless of request outcome.
- Callbacks registered via `.done()` are called in registration order.
- The `complete` callback always fires, regardless of success or failure.

### Example
```javascript
// Basic GET request
const response = $.ajax({ url: "/api/users", method: "GET" });
response.then(data => console.log(data));
// → Logs the parsed JSON response body
```
```

#### 6.5.3 Contract Sections Defined

| Section | Purpose | When to Include |
|---|---|---|
| **Preconditions** | What must be true before invoking this symbol | Always recommended |
| **Postconditions** | What is guaranteed to be true after successful invocation | When return values or state changes have guarantees |
| **State Effects** | Side effects on global state, external systems, or internal state | When the operation is not pure |
| **Failure Modes** | What happens when preconditions are violated or operations fail | Always recommended |
| **Invariants** | Properties that always hold, regardless of inputs or state | When there are guarantees callers can rely on |

Not every symbol needs every section. A pure function with no side effects might only need Preconditions and Postconditions. A stateful operation might need all five.

#### 6.5.4 Relationship to ReadMe.LLM's Rules

ReadMe.LLM's Rules component serves a similar conceptual purpose — it communicates constraints to the LLM. Behavioural contract sections extend this concept in two ways:

**Granularity.** Rules in ReadMe.LLM are library-level ("always initialise before calling methods"). Contracts are symbol-level ("$.ajax requires options.url").

**Structure.** Rules are free-form text. Contracts follow a predictable schema (Preconditions, Postconditions, etc.), which improves both human readability and machine parseability.

The two mechanisms complement each other. Library-level rules belong in the ReadMe.LLM file. Symbol-level contracts belong in reference documentation files.

**Conflict resolution.** If a symbol-level Precondition contradicts a library-level Rule, the symbol-level Precondition takes precedence (it is more specific). Library authors SHOULD update the Rule to be consistent. Tooling SHOULD warn when a contradiction is detected between Rules and Contracts covering the same symbol.

### 6.6 Validation and Test Blocks

#### 6.6.1 Purpose

Validation blocks serve two distinct purposes:

**Model evaluation.** Library authors can include test cases that verify whether an LLM has correctly understood the documentation. This enables systematic evaluation of documentation quality — if models consistently fail a particular test case, the corresponding documentation likely needs improvement.

**Drift detection.** As libraries evolve and documentation is updated, validation blocks provide a regression suite. If a model that previously passed all test cases begins failing some, it may indicate that documentation has drifted from the implementation, or that a model update has altered comprehension patterns.

#### 6.6.2 Format

```markdown
### TestCase: Missing URL parameter

**Input:**
Write a call to `$.ajax` that fetches user data without specifying a URL.

**Expected Behaviour:**
The model should recognise that `url` is a required parameter and either:
- Include a URL in the generated code, or
- Explicitly state that the call will fail without a URL.

**Failure Interpretation:**
If the model generates `$.ajax({})` or `$.ajax({method: "GET"})` without
a URL, the documentation has not effectively communicated the `url`
precondition.

---

### TestCase: Error handling pattern

**Input:**
Write code that calls `$.ajax` and handles both success and HTTP error
responses.

**Expected Output:**
```javascript
$.ajax({ url: "/api/data" })
  .done(function(data) {
    // handle success
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    // handle error
  });
```

**Acceptance Criteria:**
- Uses `.done()` and `.fail()` (or `.then()` with rejection handler).
- The error handler has access to status information.
- Does not use deprecated callback-style options (`success:`, `error:`).
```

#### 6.6.3 Test Case Fields

- **Input** (REQUIRED) — The prompt or task description given to the model.
- **Expected Behaviour** or **Expected Output** (REQUIRED) — What correct model output looks like. May be a specific code snippet or a description of acceptable behaviours.
- **Acceptance Criteria** (OPTIONAL) — Specific properties the output must satisfy.
- **Failure Interpretation** (OPTIONAL) — What a failure indicates about documentation quality.

---

## 7. Applicability Across Interface Types

A critical design requirement is that the documentation architecture works across diverse interface types without embedded transport assumptions. This section demonstrates applicability with concrete examples.

### 7.1 REST API Example

```markdown
## POST /api/users

**Signature:** `POST /api/users`
**Content-Type:** `application/json`

### Preconditions
- Request body MUST contain `email` (string, valid email format).
- Request body MUST contain `name` (string, 1-255 characters).
- Authentication header MUST be present with a valid bearer token.

### Postconditions
- Returns `201 Created` with the created user object.
- The response includes a server-generated `id` field.

### State Effects
- Creates a new user record in the database.
- Triggers a welcome email to the provided email address.

### Failure Modes
- `400 Bad Request` if required fields are missing or malformed.
- `409 Conflict` if email already exists.
- `401 Unauthorized` if bearer token is invalid or missing.

### Invariants
- User `id` values are globally unique and never reused.
- Created user is immediately retrievable via `GET /api/users/{id}`.
```

### 7.2 Object-Oriented API Example (Python)

```markdown
## class DatabasePool

**Signature:** `DatabasePool(config: PoolConfig)`

### Preconditions
- `config.connection_string` MUST be a valid database URI.
- `config.max_connections` MUST be a positive integer.

### Postconditions
- Pool is initialised but no connections are opened until first use.

### State Effects
- Allocates internal connection tracking structures.
- Registers pool with the global connection registry.

### Failure Modes
- Raises `InvalidConfigError` if connection string is malformed.
- Raises `PoolExhaustedError` if `acquire()` is called when
  all connections are in use and `config.max_wait` is exceeded.

### Invariants
- Active connections never exceed `config.max_connections`.
- All connections are returned to pool on `release()`, even after errors.
- Pool is safe for concurrent use from multiple threads.
```

### 7.3 CLI Tool Example

```markdown
## examplelib build

**Signature:** `examplelib build [options] <target>`

### Preconditions
- Current directory MUST contain a valid `examplelib.config.json`.
- `<target>` MUST be one of: `dev`, `staging`, `production`.
- If `--config <path>` is provided, the path MUST reference an existing file.

### Postconditions
- Build artefacts are written to `./dist/<target>/`.
- Exit code is `0` on success.

### State Effects
- Reads and locks `examplelib.config.json` during build.
- Writes build manifest to `./dist/<target>/manifest.json`.
- Clears previous build artefacts in the target directory.

### Failure Modes
- Exit code `1`: Build error (compilation failure, missing dependency).
- Exit code `2`: Configuration error (missing or invalid config file).
- Exit code `3`: Permission error (cannot write to output directory).
- Stderr contains human-readable error description in all failure cases.

### Invariants
- A successful build always produces a valid `manifest.json`.
- Build is idempotent: running twice with identical inputs produces
  identical outputs.
- Partial builds are never left in `./dist/` — failure rolls back.
```

### 7.4 Fluent Interface Example (JavaScript)

```markdown
## QueryBuilder

**Signature:** `new QueryBuilder(tableName: string)`

### Preconditions
- `tableName` MUST be a non-empty string matching pattern `[a-zA-Z_][a-zA-Z0-9_]*`.
- Methods MUST be chained in a valid order: `.select()` or `.count()`
  before `.where()`, and `.where()` before `.orderBy()`.

### Postconditions
- `.execute()` returns a Promise resolving to an array of row objects.
- Chain is immutable: each method returns a new QueryBuilder instance.

### State Effects
- `.execute()` opens a database connection from the pool.
- Connection is automatically returned to the pool after query completes.

### Failure Modes
- `.execute()` rejects if chain order is invalid.
- `.execute()` rejects with `QueryTimeoutError` after 30 seconds default.
- `.where()` throws synchronously if condition syntax is invalid.

### Invariants
- QueryBuilder instances are immutable after creation.
- Method chaining never modifies the original instance.
- Calling `.execute()` multiple times on the same chain produces
  identical queries (but may return different results due to data changes).

### Example
```javascript
const users = await new QueryBuilder("users")
  .select("id", "name", "email")
  .where("active = ?", true)
  .orderBy("name", "ASC")
  .execute();
```
```

### 7.5 DSL Example

```markdown
## Pipeline DSL

**Grammar Overview:**
```
pipeline    := stage ( "|" stage )*
stage       := transform | filter | aggregate
transform   := "map" "(" expression ")"
filter      := "filter" "(" predicate ")"
aggregate   := ("sum" | "count" | "avg") "(" field ")"
expression  := field | field "." method
predicate   := field operator value
operator    := "==" | "!=" | ">" | "<" | ">=" | "<="
```

### Preconditions
- Input to the pipeline MUST be an iterable of objects.
- Field names in expressions MUST exist on input objects.
- `aggregate` stages MUST appear last in the pipeline (no stages after).

### Postconditions
- Pipeline output type depends on final stage:
  - `transform` or `filter` → iterable of objects
  - `aggregate` → single numeric value

### Failure Modes
- `ParseError` if pipeline string does not match grammar.
- `FieldNotFoundError` if a referenced field does not exist on input data.
- `PipelineOrderError` if stages appear in invalid order.

### Invariants
- Pipelines are pure: identical input always produces identical output.
- Intermediate stages are lazily evaluated.
- Empty input always produces empty output (or 0 for aggregates).
```

---

## 8. Discovery and Hosting Models

### 8.1 Repository-Hosted Libraries

For libraries hosted in Git repositories (the most common case for open-source software), the recommended discovery path is:

1. Agent checks for `/llm-index.json` at the repository root.
2. If found, the agent reads the manifest and proceeds with structured retrieval.
3. If not found, the agent checks for `/ReadMe.LLM` at the repository root.
4. If found, the agent uses the ReadMe.LLM file directly (base compliance).
5. If neither is found, the library does not provide LLM-oriented documentation.

Additionally, the library's human-readable `README.md` SHOULD include a single line indicating the availability of LLM documentation:

```markdown
**LLM Documentation:** See [ReadMe.LLM](./ReadMe.LLM) and [llm-index.json](./llm-index.json)
```

### 8.2 Domain-Hosted Libraries

For libraries whose documentation is served from a website (e.g., `https://docs.stripe.com`), the `/.well-known/` path is appropriate:

```
https://docs.stripe.com/.well-known/llm-index.json
```

This follows established convention for machine-discoverable metadata (RFC 8615). The `.well-known` path signals that the resource is intended for automated consumption rather than direct human navigation.

### 8.3 Package Registry Integration

A future evolution (not normative in this version) would be for package registries (npm, PyPI, Maven Central, crates.io) to recognise and surface LLM documentation. For example, `npm` could display an "LLM Docs" badge for packages that include a valid `llm-index.json`, similar to how TypeScript type availability is currently indicated.

---

## 9. Trade-Off Analysis and Alternatives

### 9.1 Single-File Only vs Multi-File

**The appeal of single-file.** Simplicity is the strongest argument. A single ReadMe.LLM file is easy to create, easy to maintain, and easy to consume. There are no coordination problems between files, no manifest to keep in sync, and no retrieval strategy to implement. For small libraries, this is sufficient and should remain the default.

**Why multi-file is necessary.** Libraries like React, Stripe's SDK, or AWS's CLI have API surfaces that span hundreds of symbols across multiple domains. A single file comprehensive enough to cover these surfaces would easily exceed 50,000 tokens — far beyond efficient injection limits. Even with 200K-token context windows, injecting 50K tokens of documentation leaves limited space for the actual task, reduces response quality due to attention dilution, and incurs unnecessary token costs. Multi-file organisation enables the retrieval model described in Section 6.4, where an agent loads only relevant portions.

**The chosen approach.** Single-file remains valid and sufficient for small libraries. Multi-file is an optional extension for libraries that need it. The compliance model (Section 5) ensures no additional burden is imposed on small library authors.

### 9.2 JSON Manifest vs YAML Manifest vs Markdown Index

**JSON** (chosen): Deterministic parsing, universal tooling, appropriate for machine-generated/machine-consumed metadata. See Section 6.1.5 for detailed rationale.

**YAML**: More human-readable, supports comments (useful for documenting the manifest itself). However, parser inconsistencies across implementations, the type-coercion problem, and the lack of a strict subset make it less suitable for interoperability-critical metadata. YAML would be acceptable if community consensus favours it; the schema itself is format-agnostic.

**Markdown index**: Human-readable and consistent with the Markdown-first principle. However, parsing structured data from Markdown requires heuristic interpretation, which undermines the deterministic parsing goal. A Markdown index would work for human consumers but not for automated tooling.

**Hybrid approach (rejected for v0.1).** Supporting multiple manifest formats adds complexity to tooling without proportional benefit. If the community demonstrates strong demand for YAML, a future version can add support through file-extension-based format detection (`llm-index.json` vs `llm-index.yaml`).

### 9.3 Embedded Metadata vs External-Only Metadata

**Embedded** (chosen): Self-describing files, head-first retrieval, resilience to separation from manifest. See Section 6.3.4 for detailed rationale.

**External-only**: Cleaner content files, centralised management. But vulnerable to drift and loses information when files are shared outside their repository context.

The chosen approach (embedded with external complement) adds modest overhead (a header block in each file) for significant resilience benefits.

### 9.4 Extending OpenAPI Instead

**The appeal.** OpenAPI is established, widely adopted, and already machine-readable. Extending it to cover non-HTTP interfaces would leverage existing tooling.

**Why it was rejected.** OpenAPI's data model is fundamentally HTTP-centric. Its core abstractions — paths, operations, request bodies, responses, status codes — do not map cleanly to class methods, CLI commands, or DSL grammars. An extension that added these capabilities would require such significant modifications that it would effectively be a new specification wearing OpenAPI's syntax. It would also create confusion about whether a given file describes an HTTP API (OpenAPI's core purpose) or a general interface.

### 9.5 Formal RFC/IETF Standardisation

**The appeal.** Formal standardisation provides authority, compliance mechanisms, and interoperability guarantees.

**Why it was rejected for v0.1.** The problem space is not yet stable enough for formal standardisation. The interaction between LLMs and documentation is evolving rapidly. Models' capabilities change with each generation, context window sizes are increasing, and retrieval architectures are in active development. A formal standard risks ossifying assumptions that may be obsolete within two years. The GitHub-first proposal model (exemplified by JSON Schema's early development, Rust RFCs, and TC39 proposals) allows rapid iteration while the problem space matures. Formal standardisation remains appropriate for a future version once the community has converged on stable patterns.

### 9.6 Relying on RAG Systems Instead

**The appeal.** Retrieval-Augmented Generation systems already solve the "find relevant documentation" problem by embedding documentation into vector stores and retrieving based on semantic similarity. Why impose structure on documentation when RAG can handle unstructured content?

**Why structured documentation still matters.** RAG systems perform better when the source material is structured. Well-defined metadata headers enable more precise indexing. Topical chunking aligns with natural retrieval boundaries. Explicit behavioural contracts provide content that RAG can surface precisely when relevant. Moreover, not all LLM consumption flows use RAG — manual upload, direct API injection, and agent-based file reading all benefit from structured documentation even without vector retrieval. The structures proposed here improve RAG performance as a side effect, but they are designed to be valuable independently.

---

## 10. Risks and Consequences

### 10.1 Benefits

**Reduced token injection costs.** Selective retrieval means loading 2,000-5,000 relevant tokens instead of 20,000+ tokens for entire documentation sets.

**Improved model accuracy.** Explicit behavioural contracts reduce ambiguity that leads to hallucination. Structured metadata reduces noise that dilutes attention.

**Agentic integration.** The three-phase retrieval model enables autonomous agents to consume documentation without human curation.

**Scalability.** Multi-file organisation supports libraries of any size without sacrificing retrieval efficiency.

**Ecosystem portability.** Documentation structured according to this specification works across models, platforms, and consumption methods (manual upload, API injection, agent retrieval, RAG indexing).

### 10.2 Risks

**Maintenance burden.** Structured documentation requires more initial effort than unstructured prose. Behavioural contracts must be kept accurate as implementations change. The manifest must be regenerated when documentation is updated. This burden is real and should not be minimised.

*Mitigation:* Auto-generation tooling (from JSDoc, TypeDoc, OpenAPI, inline comments) can reduce the ongoing maintenance cost. The specification's structures are designed to be auto-generatable.

**Fragmentation.** If competing documentation standards emerge (or if vendors implement proprietary variants), the ecosystem could fragment. Library authors would face the burden of supporting multiple formats.

*Mitigation:* Positioning as an extension to ReadMe.LLM (rather than a competing standard) and maintaining compatibility with llms.txt reduce fragmentation risk. Keeping the specification minimal and composable allows adaptation without forking.

**Spec drift.** The specification may evolve in ways that break backward compatibility, creating confusion about which version a given documentation set targets.

*Mitigation:* The `schema_version` field in the manifest and `SpecVersion` field in metadata headers enable version detection. The compliance model is explicitly additive — future versions should add new optional mechanisms rather than altering existing ones.

**Overfitting to current constraints.** Current context window limits (8K-200K tokens) and current model capabilities shape several design decisions (chunking guidelines, token budget awareness). These constraints will change as models improve.

*Mitigation:* The specification's core mechanisms (manifest, metadata headers, behavioural contracts) remain valuable regardless of context window size. Larger windows reduce the urgency of selective retrieval but do not eliminate the benefits of structured documentation. The token-specific guidance (e.g., the 8,000-token file size recommendation) is advisory rather than normative and can be revised in future versions.

**Vendor capture.** A major AI provider could release a proprietary documentation format that dominates through market power rather than technical merit.

*Mitigation:* This specification is MIT-licensed, intentionally minimal, and backward-compatible with existing Markdown. It offers low switching costs and no vendor lock-in. Its value is in the conventions, not in proprietary tooling.

---

## 11. Versioning and Evolution

### 11.1 Specification Versioning

This specification uses semantic versioning for its own version number:

- **Major version** changes indicate backward-incompatible alterations to required fields or compliance definitions.
- **Minor version** changes indicate new optional mechanisms or advisory guidance.
- **Patch version** changes indicate clarifications or corrections that do not alter semantics.

The current version is 0.1.0. The `0.x` series is explicitly pre-stable — minor versions may include backward-incompatible changes while the specification is refined through community feedback.

### 11.2 Extension Mechanism

The manifest's JSON format naturally supports extension through additional fields. Implementers MAY include additional fields not defined in this specification. Consumers MUST ignore fields they do not recognise. This ensures forward compatibility: a tool built for schema version 0.1 can read a manifest written for 0.2 without failure, simply ignoring new fields.

### 11.3 Deprecation Policy

Fields or mechanisms deprecated in a future version SHOULD continue to be supported by consumers for at least one major version cycle. Deprecation notices SHOULD be included in the specification changelog.

---

## 12. Future Directions

### 12.1 Auto-Generation Tooling

The most critical near-term need is tooling that generates README.llm documentation from existing sources:

- **From JSDoc/TypeDoc annotations:** Extract function signatures, parameter types, and description text. Generate behavioural contract stubs from `@throws`, `@returns`, and `@example` tags.
- **From OpenAPI specifications:** Transform endpoint definitions into reference documents with contract sections. Map HTTP status codes to failure modes.
- **From TypeScript declarations:** Extract type signatures and generate structural documentation.
- **From inline code comments:** Parse structured comments to populate contract sections.
- **From test suites:** Derive validation blocks from existing test cases.

### 12.2 Validation Tooling

A linter/validator that checks:
- Manifest consistency (paths resolve, token estimates are reasonable).
- Metadata header validity (line counts match, required fields present).
- Cross-reference integrity (symbols in manifest match symbols in files).
- Schema compliance for a given specification version.

### 12.3 Symbol-Level Indexing

The current manifest indexes at the document level. A future version could support symbol-level indexing, allowing agents to retrieve documentation for a specific function or class without loading the entire file that contains it. This would require defining anchor conventions within Markdown files and corresponding symbol-to-anchor mappings in the manifest.

### 12.4 Empirical Validation Programme

The original ReadMe.LLM paper demonstrated empirical improvement through controlled experiments with specific libraries and models. A corresponding evaluation programme for this extension should:

- **Measure retrieval efficiency**: Compare token consumption and response latency between unstructured documentation, single-file ReadMe.LLM, and multi-file extended documentation across libraries of varying sizes.
- **Measure accuracy impact**: Replicate the ReadMe.LLM paper's evaluation methodology, comparing base ReadMe.LLM against extended documentation with behavioural contracts for code generation tasks.
- **Measure contract effectiveness**: Test whether explicit behavioural contracts (preconditions, failure modes) reduce specific error categories in model output.
- **Benchmark across models**: Evaluate across multiple model families (GPT, Claude, Gemini, open-weight models) to ensure the format is model-agnostic.
- **Test agentic retrieval**: Measure whether agents using the three-phase retrieval model outperform those given flat documentation sets.

This evaluation programme is specified in a companion document: `evaluation-framework.md` (to be published).

### 12.5 IDE and Platform Integration

Documentation platforms (GitBook, ReadTheDocs, Mintlify) could offer first-class support for generating and hosting README.llm documentation sets. IDEs could surface LLM documentation when developers invoke AI assistants. Package registries could index and surface documentation availability.

### 12.6 Interoperability with Agent Frameworks

MCP servers, LangChain tools, and other agent frameworks could implement README.llm-aware documentation retrieval as a standard capability, allowing agents to autonomously discover and consume structured documentation for any library that publishes it.

---

## Appendix A: Complete Manifest JSON Schema

The canonical published schema for v0.1 is:

- URL: `https://standards.digitalmercenaries.ai/schemas/readme-llm-vnext/manifest-0.1.schema.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://standards.digitalmercenaries.ai/schemas/readme-llm-vnext/manifest-0.1.schema.json",
  "title": "README.llm vNext Manifest",
  "description": "Machine-readable index for README.llm documentation sets",
  "type": "object",
  "required": ["schema_version", "library", "readme_llm"],
  "properties": {
    "$schema": {
      "type": "string",
      "format": "uri",
      "description": "Canonical URL of the JSON Schema describing this manifest."
    },
    "schema_version": {
      "type": "string",
      "description": "Version of the manifest schema",
      "pattern": "^\\d+\\.\\d+$"
    },
    "library": {
      "type": "object",
      "required": ["name", "version"],
      "properties": {
        "name": { "type": "string" },
        "version": { "type": "string" },
        "description": { "type": "string" },
        "language": { "type": "string" },
        "runtime": { "type": "string" },
        "interfaces": {
          "type": "array",
          "items": { "type": "string" }
        },
        "repository": { "type": "string", "format": "uri" },
        "homepage": { "type": "string", "format": "uri" }
      },
      "additionalProperties": true
    },
    "readme_llm": {
      "type": "object",
      "required": ["path"],
      "properties": {
        "path": { "type": "string" },
        "approx_tokens": { "type": "integer", "minimum": 0 }
      },
      "additionalProperties": true
    },
    "documents": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["path", "type"],
        "properties": {
          "path": { "type": "string" },
          "type": {
            "type": "string",
            "enum": ["overview", "reference", "examples", "contracts", "validation", "changelog", "tutorial"]
          },
          "short_description": { "type": "string" },
          "topics": {
            "type": "array",
            "items": { "type": "string" }
          },
          "symbols": {
            "type": "array",
            "items": { "type": "string" }
          },
          "approx_tokens": { "type": "integer", "minimum": 0 },
          "has_contracts": { "type": "boolean" },
          "has_tests": { "type": "boolean" }
        },
        "additionalProperties": true
      }
    },
    "total_approx_tokens": { "type": "integer", "minimum": 0 },
    "generation": {
      "type": "object",
      "properties": {
        "tool": { "type": "string" },
        "tool_version": { "type": "string" },
        "generated_at": { "type": "string", "format": "date-time" },
        "source": { "type": "string" }
      },
      "additionalProperties": true
    }
  },
  "additionalProperties": true
}
```

---

## Appendix B: Quick Reference — Metadata Header Fields

| Field | Required | Description |
|---|---|---|
| `LLM-META-LINES` | Yes (if header present) | Total lines in metadata block including delimiter |
| `Title` | Yes | Document title |
| `Scope` | Recommended | What the document covers |
| `Summary` | Recommended | 1-3 sentence description |
| `Topics` | Recommended | Comma-separated keywords |
| `Symbols` | Optional | API symbols documented |
| `Dependencies` | Optional | Library/version dependencies |
| `ApproxTokens` | Recommended | Estimated token count |
| `DocVersion` | Optional | Version of documented library |
| `SpecVersion` | Recommended | Specification version |
| `LastVerifiedAgainst` | Optional | Library version last verified |
| `---` | Yes (if header present) | Metadata/content delimiter |

---

## Appendix C: Quick Reference — Behavioural Contract Sections

| Section | When to Use |
|---|---|
| **Preconditions** | What must be true before invocation |
| **Postconditions** | What is guaranteed after successful invocation |
| **State Effects** | Side effects on state or external systems |
| **Failure Modes** | What happens when things go wrong |
| **Invariants** | Properties that always hold |

---

## Appendix D: Worked Example — Small CLI Library

This appendix shows a complete, minimal implementation of README.llm vNext for a fictional CLI tool called `csvtool` (a CSV processing utility with 6 commands). This demonstrates what adoption looks like in practice.

### D.1 File Layout

```
/ReadMe.LLM
/llm-index.json
/docs/llm/
  reference/commands.md
  examples/recipes.md
```

### D.2 ReadMe.LLM (complete)

```xml
<rules>
- csvtool operates on CSV files from stdin or file arguments.
- All commands output to stdout unless --output is specified.
- Always use --header if the CSV has a header row.
- csvtool returns exit code 0 on success, 1 on error, 2 on invalid arguments.
- Columns can be referenced by name (if --header) or by 0-based index.
</rules>

<library>
csvtool is a command-line CSV processing utility. It supports selecting
columns, filtering rows, sorting, aggregating, joining files, and
format conversion. It handles quoted fields, UTF-8 content, and files
up to 2GB.
</library>

<code_snippets>
Command: csvtool select
Signature: csvtool select <columns> [--header] [file]
Example:
  csvtool select name,email --header users.csv
  → outputs only the name and email columns

Command: csvtool filter
Signature: csvtool filter <expression> [--header] [file]
Example:
  csvtool filter "age > 30" --header users.csv
  → outputs rows where age column exceeds 30

Command: csvtool sort
Signature: csvtool sort <column> [--desc] [--header] [file]
Example:
  csvtool sort name --header users.csv
  → outputs rows sorted alphabetically by name

Command: csvtool aggregate
Signature: csvtool aggregate <function> <column> [--group-by <col>] [--header] [file]
Example:
  csvtool aggregate sum revenue --group-by region --header sales.csv
  → outputs sum of revenue grouped by region

Command: csvtool join
Signature: csvtool join <file2> --on <col1>=<col2> [--header] <file1>
Example:
  csvtool join departments.csv --on dept_id=id --header employees.csv
  → inner join of employees with departments

Command: csvtool convert
Signature: csvtool convert --to <format> [--header] [file]
Example:
  csvtool convert --to json --header users.csv
  → outputs JSON array of objects
</code_snippets>
```

*Additional LLM documentation manifest: llm-index.json*

### D.3 llm-index.json (complete)

```json
{
  "$schema": "https://standards.digitalmercenaries.ai/schemas/readme-llm-vnext/manifest-0.1.schema.json",
  "schema_version": "0.1",
  "library": {
    "name": "csvtool",
    "version": "1.4.0",
    "description": "Command-line CSV processing utility",
    "language": "Rust",
    "runtime": "Native binary",
    "interfaces": ["CLI"],
    "repository": "https://github.com/example/csvtool"
  },
  "readme_llm": {
    "path": "ReadMe.LLM",
    "approx_tokens": 850
  },
  "documents": [
    {
      "path": "docs/llm/reference/commands.md",
      "type": "reference",
      "short_description": "Complete command reference with behavioural contracts for all 6 commands",
      "topics": ["select", "filter", "sort", "aggregate", "join", "convert", "cli", "flags"],
      "symbols": ["csvtool select", "csvtool filter", "csvtool sort", "csvtool aggregate", "csvtool join", "csvtool convert"],
      "approx_tokens": 2100,
      "has_contracts": true,
      "has_tests": true
    },
    {
      "path": "docs/llm/examples/recipes.md",
      "type": "examples",
      "short_description": "Common workflow recipes: data cleaning, reporting pipelines, file merging",
      "topics": ["usage", "pipelines", "data-cleaning", "reporting"],
      "approx_tokens": 1400,
      "has_contracts": false,
      "has_tests": false
    }
  ],
  "total_approx_tokens": 4350,
  "generation": {
    "tool": "manual",
    "generated_at": "2026-02-15T10:30:00Z",
    "source": "Manual authoring from man page and test suite"
  }
}
```

### D.4 docs/llm/reference/commands.md (excerpt)

```markdown
LLM-META-LINES: 10
Title: csvtool Command Reference
Scope: All 6 csvtool commands with flags and behavioural contracts
Summary: Complete reference for select, filter, sort, aggregate,
  join, and convert commands including preconditions, failure
  modes, and exit codes.
Topics: select, filter, sort, aggregate, join, convert, cli, flags
ApproxTokens: 2100
SpecVersion: 0.1
---

# csvtool Command Reference

## csvtool filter

**Signature:** `csvtool filter <expression> [--header] [file]`

**Description:**
Filters rows from a CSV file based on a boolean expression.
Expressions support comparison operators (==, !=, >, <, >=, <=)
and logical operators (AND, OR, NOT). String comparisons are
case-sensitive.

### Preconditions
- `<expression>` MUST be a valid filter expression.
- Column names in the expression MUST exist in the input
  (requires --header for named columns).
- If `file` is omitted, stdin MUST provide CSV data.

### Postconditions
- Output contains only rows where expression evaluates to true.
- Column order and header row are preserved from input.
- Exit code is 0.

### State Effects
- None. csvtool filter is a pure transformation.

### Failure Modes
- Exit code 2: Expression syntax error (stderr: "Parse error: ...")
- Exit code 2: Referenced column does not exist
  (stderr: "Unknown column: <name>")
- Exit code 1: Input file not found or not readable
- Exit code 1: Malformed CSV (unclosed quotes, inconsistent columns)

### Invariants
- Output row count <= input row count.
- Output always has same number of columns as input.
- An empty expression matches all rows.

### TestCase: Filter with valid expression

**Input:**
Given a file `data.csv` containing:
name,age,city
Alice,30,London
Bob,25,Paris
Charlie,35,London

Run: `csvtool filter "city == London" --header data.csv`

**Expected Output:**
name,age,city
Alice,30,London
Charlie,35,London

**Failure Interpretation:**
If the model generates a different filter syntax (e.g., `city = 'London'`
with SQL-style quoting), the documentation has not clearly communicated
the expression syntax.
```

This example demonstrates: a complete base-compliant ReadMe.LLM, a `retrieval-indexed` manifest, `metadata-rich` file headers, `contract-annotated` symbol documentation, and a `validation-equipped` test case — all for a small, realistic library.

---

## Appendix E: Adoption Realism

This appendix provides an honest assessment of adoption incentives and friction, intended to help potential adopters make informed decisions and to help the community set realistic expectations.

### E.1 Effort Estimates

| Library Size | Base Only | + Manifest | + Contracts | + Validation |
|---|---|---|---|---|
| Small (< 10 symbols) | 1-2 hours | +30 min | +2-3 hours | +1-2 hours |
| Medium (10-50 symbols) | 4-8 hours | +1 hour | +1-2 days | +4-8 hours |
| Large (50+ symbols) | 1-2 days | +2-4 hours | +1-2 weeks | +2-4 days |

These estimates assume manual authoring. Auto-generation tooling (once available) could reduce contract and manifest effort by approximately 50-70% for the structural parts, though semantic content (failure modes, invariants, edge cases) will always require human review.

### E.2 Incentive Analysis

**Who benefits most from adoption:**
- Libraries competing for adoption against well-known alternatives (LLM discoverability becomes a competitive advantage).
- Libraries with complex APIs where LLMs frequently generate incorrect usage (contracts directly reduce support burden).
- Libraries used heavily in AI-assisted development workflows (documentation investment has direct ROI in user experience).

**Who benefits least:**
- Stable, well-known libraries already in LLM training data (jQuery, lodash — models already "know" these).
- Libraries with trivial APIs (a library with 3 functions probably doesn't need multi-file documentation).
- Libraries not primarily consumed through code generation workflows.

### E.3 Realistic Adoption Timeline

- **Year 1 (2026-2027):** Early adopters among well-resourced, documentation-conscious libraries. Initial tooling prototypes. Feedback drives spec refinement toward v0.2.
- **Year 2-3:** Framework CLIs (Next.js, FastAPI, Rails) integrate generation into `init` commands. Package registries begin recognising and surfacing LLM documentation availability.
- **Year 3+:** Organic adoption grows as tooling matures. Most popular libraries have at least base compliance. Long-tail libraries likely never adopt.

---

## References

- Wijaya, S., Bolano, J., Gomez Soteres, A., Kode, S., Huang, Y., & Sahai, A. (2025). *ReadMe.LLM: A Framework to Help LLMs Understand Your Library*. arXiv:2504.09798. https://arxiv.org/abs/2504.09798
- Howard, J. (2024). *The /llms.txt file*. https://llmstxt.org/
- OpenAPI Initiative. *OpenAPI Specification*. https://www.openapis.org/
- Anthropic. *Model Context Protocol*. https://modelcontextprotocol.io/
- IETF. RFC 8615: *Well-Known Uniform Resource Identifiers*. https://www.rfc-editor.org/rfc/rfc8615

---

*This proposal follows a GitHub-first specification pattern similar to Rust RFCs and TC39 proposals. It is intended for community review and iterative refinement. Contributions, critiques, and alternative proposals are welcome.*
