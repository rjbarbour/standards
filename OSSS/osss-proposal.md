# OSSS — Open Specification Structure Standard

**Version:** 0.1
**Status:** Proposal
**Author:** Robert J. Barbour
**Date:** February 2026
**License:** MIT

---

## 1. Abstract

Every standards project that needs a proposal template reinvents one from scratch — borrowing from Rust RFCs, Python PEPs, or IETF RFCs, discarding ecosystem-specific sections, and debating which sections to include. OSSS eliminates this structural design phase. It is an anti-bikeshedding tool for standards projects: a minimal, opinionated, governance-agnostic document structure that makes the routine structural decisions so that authors can focus on the specification itself. Like Semantic Versioning for version numbers or Conventional Commits for commit messages, OSSS provides a sensible default where one is needed — in this case, for the structure of technical specifications and proposals. This document both defines and demonstrates the standard by conforming to its own structure.

---

## 2. Scope, Applicability, and Limitations

### What This Document Covers

OSSS defines the *structure* of specification documents. It does not define:

- **Governance processes.** How proposals are reviewed, approved, or rejected is out of scope. Whether decisions are made by a BDFL, a committee, community vote, or rough consensus is orthogonal to document structure.
- **Markup syntax.** OSSS defines sections and their semantics, not heading levels, frontmatter formats, or rendering conventions. Markdown is RECOMMENDED for its ubiquity on GitHub, but OSSS-compliant documents may be written in any format that preserves section semantics.
- **Subject matter.** OSSS applies to specifications about APIs, protocols, documentation formats, data schemas, architectural decisions, tooling standards, and any other domain where structured technical proposals are useful. It does not constrain what the proposal is *about*.
- **Formal verification.** Compliance with OSSS means "the document contains the required sections with substantive content." It does not mean "the proposal's technical claims are correct."

**Assumed audience.** The primary audience is standards authors and working groups writing technical specifications outside formal standards bodies (IETF, W3C, ISO) — people who need a proposal structure and would rather adopt a reasonable default than design one from scratch. Secondary audiences include open-source maintainers establishing proposal processes, developer tooling vendors, and technical writers. Projects with mature, well-established proposal processes (Rust, TC39) are unlikely to adopt OSSS — they have already solved this problem for their specific domains. OSSS targets the long tail of standards projects that need a proposal structure and do not yet have one, as well as cross-domain proposals that do not naturally belong to any single ecosystem's template.

### Where OSSS Applies

OSSS is designed for asynchronous, written proposal processes where a structured document is the primary medium of communication. It applies to:

- **Projects initiating a proposal process without an existing template.** This is the primary use case. OSSS provides a ready-made structure that encodes decades of accumulated wisdom from Rust RFCs, PEPs, KEPs, and IETF RFCs.
- **Cross-domain specification efforts** that do not fit a single ecosystem's template — for example, a proposal that spans multiple languages, libraries, or infrastructure layers.
- **Communities seeking structured proposal guidelines** that are governance-agnostic and adaptable to their specific review processes.
- **Standards organisations and working groups** outside formal bodies that want structured proposals without IETF-level ceremony.

### Where OSSS Does NOT Apply

- **Projects with mature, stable proposal processes** (Rust, TC39, Python) that have domain-specific requirements embedded in their templates. Adopting OSSS would require removing ecosystem-specific sections (guide-level explanation, backwards compatibility, graduation criteria) that serve those communities well.
- **Internal architectural decisions.** Use ADRs (Architecture Decision Records) instead. ADRs are optimised for internal teams with shared context; OSSS is optimised for public specifications that must build their own context.
- **Proposal systems requiring formal governance machinery.** IETF-style committee oversight, working group charters, and formal balloting processes require governance integration that OSSS deliberately excludes.
- **Micro-specifications under ~500 words.** A proposal to add a single configuration flag may find OSSS's 9 required sections disproportionate. Projects SHOULD define a lightweight profile (see Section 10.4) for trivial proposals.

### Known Limitations

- **OSSS assumes asynchronous, written review.** Real-time governance mechanisms (live committee votes, synchronous design reviews) may require additional structural support beyond what OSSS provides.
- **OSSS assumes specification documents of 2,000-10,000 words.** Documents significantly shorter may find the structure excessive; documents significantly longer may need additional sub-section guidance that OSSS does not provide.
- **OSSS has been validated against one concrete case study** (README.llm vNext, Appendix B). Broader empirical validation across diverse domains is needed before claiming universal applicability.
- **OSSS does not address internationalisation.** Section names, metadata fields, and normative keywords are defined in English. Multi-language specification workflows are out of scope for v0.1.

**Estimated per-proposal effort.** A first-time OSSS proposal for a non-trivial specification typically requires 4-8 hours of writing. Subsequent proposals by the same author, with the structure already internalised, typically require 2-4 hours. The structural overhead is front-loaded: the sections themselves serve as a checklist that surfaces considerations (non-goals, trade-offs, risks) that would otherwise emerge during review, shifting effort from review cycles to initial drafting.

---

## 3. Problem Statement

### 3.1 The Reinvention Problem

When a new open-source project, working group, or technical community needs a proposal process, the typical workflow is: someone looks at Rust RFCs or Python PEPs, extracts what seems relevant, discards ecosystem-specific sections, and writes a custom template. The result varies widely in quality. Some templates omit prior art analysis, producing proposals that unknowingly duplicate existing work. Some omit trade-off reasoning, producing proposals that present contested decisions as obvious. Some omit scope limitations, producing proposals that invite misapplication.

This reinvention is not merely inefficient — it is systematically biased toward omission. Authors include the sections they personally consider important and omit those they have not encountered in the templates they happened to reference. A standard that codifies the convergent structure across mature proposal processes corrects this bias by surfacing sections that experience has shown to be necessary.

### 3.2 The Reviewer Burden

A reviewer encountering a Rust RFC knows exactly where to find the motivation, the prior art analysis, and the unresolved questions. A reviewer encountering an ad-hoc proposal from an unfamiliar project must first learn the document's structure before evaluating its content. This structural overhead compounds across the hundreds of small-to-medium projects that publish proposals without standardised templates.

A shared structural vocabulary reduces this burden. A reviewer familiar with the OSSS structure can navigate any OSSS-compliant document immediately, regardless of its subject matter.

### 3.3 The Tooling Gap

Generic proposal management tooling — linters that check section completeness, review bots that flag missing risk analysis, indexers that extract metadata for search — cannot be built when every project uses a different document structure. A shared structural contract enables a shared tooling ecosystem.

### 3.4 Quantifying the Problem

The scale of this problem can be estimated indirectly. GitHub hosts millions of repositories, of which tens of thousands maintain some form of proposal or RFC process. An informal survey of GitHub repositories with RFC or proposal directories suggests that the majority use custom templates derived from one of the major formats (Rust, Python, IETF), with significant variation in section completeness. Anecdotally, the most commonly omitted sections are: explicit non-goals, compliance or conformance criteria, adoption friction analysis, and scope limitations. These are precisely the sections that mature proposal processes have converged on as necessary. A rigorous empirical study quantifying these omission rates across a representative sample would strengthen this claim — such a study is identified as future work in Section 10.5.

---

## 4. Prior Art and Positioning

### 4.1 Rust RFCs

Rust's RFC process is among the most mature in the open-source ecosystem. The template includes: motivation, guide-level explanation, reference-level explanation, drawbacks, rationale and alternatives, prior art, unresolved questions, and future possibilities.

**Strengths.** The separation of guide-level and reference-level explanation is pedagogically excellent — it forces authors to communicate at two levels of detail. The explicit "drawbacks" section normalises honest assessment of trade-offs. The process is well-documented and widely imitated.

**Structural limitation.** The template is deeply embedded in Rust's governance model. Sections like "guide-level explanation" assume a language specification context. The FCP (final comment period) and team-based review process are governance concerns woven into the template. Extracting the structural pattern requires disentangling document structure from process mechanics.

### 4.2 Python PEPs

PEPs (Python Enhancement Proposals) are one of the oldest structured proposal formats in open source, dating to 2000. The template includes: preamble metadata, abstract, motivation, specification, rationale, backwards compatibility, reference implementation, and rejected ideas.

**Strengths.** The preamble metadata block (PEP number, status, type, author, created date) is a model for machine-readable proposal metadata. The "rejected ideas" section is valuable — it documents the decision space, not just the chosen path.

**Structural limitation.** PEPs are tightly coupled to Python's governance model (originally BDFL, now steering council). The template assumes a language-level specification context. The "backwards compatibility" section is Python-specific; a generalised standard would frame this as "consequences and risks."

### 4.3 TC39 Proposals

TC39 (the ECMAScript standards committee) uses a stage-based proposal process. Proposals advance from Stage 0 (strawperson) through Stage 4 (finished), with increasing requirements at each stage.

**Strengths.** The staged approach explicitly separates exploration from specification. Stage 0-1 proposals need only motivation and high-level design; Stage 2-3 proposals require formal specification text. This graduated rigour prevents premature specification while still demanding rigour when it matters.

**Structural limitation.** The process is inseparable from TC39's committee governance. The stages are defined in terms of committee actions (champion presents, committee achieves consensus). The document structure at each stage is loosely defined — TC39 proposals vary widely in format.

### 4.4 Kubernetes KEPs

Kubernetes Enhancement Proposals include: summary, motivation, proposal, design details, production readiness review, test plan, graduation criteria, and alternatives.

**Strengths.** The production readiness review (PRR) is notable — it forces authors to address operational concerns (monitoring, rollback, scalability) before approval. The graduation criteria (alpha → beta → GA) provide a concrete adoption ladder.

**Structural limitation.** KEPs are infrastructure-specific. The PRR, test plan, and graduation criteria assume a deployed system with SLOs and rollout processes. These sections are irrelevant for a documentation standard, a data format, or a library API proposal.

### 4.5 Go Proposals

Go's proposal process is deliberately lightweight: a design document (often a Google Doc or GitHub markdown file) plus a discussion issue.

**Strengths.** Low friction encourages contribution. The simplicity reflects Go's cultural emphasis on minimalism.

**Structural limitation.** The lack of structural requirements produces inconsistency. Some Go proposals include thorough prior art analysis; others skip it entirely. The quality depends on the author's habits rather than the template's guidance. This is the opposite extreme from IETF RFCs.

### 4.6 IETF RFCs

IETF RFCs are the gold standard for interoperability specifications. They include: abstract, introduction, terminology (RFC 2119 normative keywords), specification sections, security considerations, IANA considerations, and references.

**Strengths.** Normative language conventions (MUST/SHOULD/MAY from RFC 2119) have become the de facto standard for specification precision across the industry. The mandatory "security considerations" section has measurably improved the security quality of internet standards.

**Structural limitation.** The IETF process is heavy: formal working groups, multiple review stages, IESG approval, RFC Editor processing. The template includes IANA-specific sections that are meaningless outside internet infrastructure. The formality is justified for internet protocols but is overkill for most open-source specifications.

### 4.7 Architecture Decision Records (ADRs)

ADRs follow a minimal structure: title, status, context, decision, consequences.

**Strengths.** The brevity is appropriate for internal architectural decisions where the audience is small and shares context. ADRs are easy to write, easy to review, and easy to maintain.

**Structural limitation.** ADRs omit prior art analysis, trade-off reasoning, compliance criteria, and scope limitations. They are internal documents, not public specifications. A public specification that followed ADR structure would appear incomplete and under-argued.

### 4.8 Anti-Bikeshedding Precedents

OSSS belongs to a lineage of opinionated-defaults standards that succeed by making routine decisions easy so that teams can focus on substantive work:

- **Semantic Versioning (SemVer)** solves the "how should I number versions" decision. **Strengths:** Its three-part numbering scheme (MAJOR.MINOR.PATCH) communicates compatibility intent at a glance, enabling automated dependency resolution across package managers. It didn't need to prove that bad version numbers caused project failures — it just needed to be a reasonable default that saved people from arguing about format.
- **Conventional Commits** solves the "how should I format commit messages" decision. **Strengths:** The structured prefix (`feat:`, `fix:`, `chore:`) enables automated changelog generation and semantic version bumping. Adoption requires accepting an opinionated structure in exchange for consistency and tooling compatibility.
- **Keep a Changelog** solves the "how should I structure changelogs" decision. **Strengths:** The categorisation scheme (Added, Changed, Deprecated, Removed, Fixed, Security) provides a predictable structure that readers can scan quickly across projects. It prescribes a format that is good enough for most projects, freeing maintainers to focus on the content of their changelogs rather than their structure.
- **SPDX License Identifiers** solve the "how should I refer to licenses" decision. **Strengths:** A shared vocabulary eliminates ambiguity without requiring formal standardisation of the licenses themselves, enabling machine-readable license declarations across ecosystems.

**Structural limitations.** Each of these standards succeeds by accepting specific constraints. SemVer does not address pre-release stability or non-library versioning contexts. Conventional Commits does not enforce message quality — a commit labelled `fix:` may describe a trivial or incorrect fix. Keep a Changelog requires manual maintenance and does not integrate with automated release tooling. SPDX requires license expression literacy and does not resolve the underlying complexity of multi-license projects. In each case, the constraint is accepted because the structural default provides more value than the flexibility it sacrifices.

OSSS applies this same pattern to specification structure: it provides an opinionated default for how to organise a technical proposal, so that standards authors can invest their deliberative energy in the specification's content rather than its format. The success of SemVer, Conventional Commits, and similar standards suggests that communities are willing to adopt reasonable structural defaults when the alternative is reinvention.

### 4.9 The Convergent Pattern

Despite their differences, these formats share a structural core. OSSS formalises that core and adds sections — Scope/Applicability, Non-Goals — that accumulated experience across these communities suggests are consistently valuable when present, and consistently missed when absent:

| Concern | Rust RFC | PEP | KEP | IETF RFC | ADR | OSSS |
|---|---|---|---|---|---|---|
| Metadata | — | Preamble | YAML header | Header | Title/Status | **REQUIRED** |
| Abstract/Summary | — | Abstract | Summary | Abstract | — | **REQUIRED** |
| Scope/Applicability | — | — | — | — | — | **REQUIRED** |
| Problem/Motivation | Motivation | Motivation | Motivation | Introduction | Context | **REQUIRED** |
| Prior Art | Prior Art | — | — | — | — | **REQUIRED** |
| Goals/Non-Goals | — | — | Goals/Non-Goals | — | — | **REQUIRED** |
| Specification | Reference | Specification | Design Details | Spec sections | Decision | **REQUIRED** |
| Compliance Model | — | — | Graduation | — | — | **RECOMMENDED** |
| Trade-offs/Alternatives | Rationale | Rejected Ideas | Alternatives | — | — | **REQUIRED** |
| Risks/Consequences | Drawbacks | Backwards Compat | PRR | Security | Consequences | **REQUIRED** |
| Future Work | Future Possibilities | — | — | — | — | **RECOMMENDED** |
| References | — | References | — | References | — | **RECOMMENDED** |

The "—" entries are not necessarily absent but are not required by the template. Some OSSS sections (Scope/Applicability, Non-Goals) represent opinionated additions rather than observed convergences — sections that the author believes are necessary based on reasoning about failure modes, even though existing formats have not formalised them. The remaining sections codify patterns that appear independently across multiple formats.

---

## 5. Design Goals and Explicit Non-Goals

### 5.1 Design Goals

**Cross-domain applicability.** The structure must work for API specifications, documentation standards, protocol definitions, data format proposals, tooling standards, and architectural decisions. No domain-specific assumption may be embedded in required sections.

**Minimal section count.** Every required section must justify its existence through a specific failure mode that occurs when it is absent. Sections that are "nice to have" are RECOMMENDED or OPTIONAL, never REQUIRED.

**Progressive disclosure.** A reader should be able to assess relevance from the Abstract alone, understand scope from the first three sections, and engage with technical detail only when they choose to read further. This is not merely a readability concern — it respects reviewers' time.

**Machine-parseability.** Section names should be predictable enough that automated tools can validate structure, extract metadata, and index proposals. This does not require rigid syntax (tooling can be flexible) but does require consistent semantics.

**Governance agnosticism.** OSSS defines what goes in a document, not what happens to it after it is written. Review processes, approval criteria, and authority structures are out of scope.

**Ease of adoption.** A project adopting OSSS should be able to create a compliant template in under an hour. The standard should be simple enough to hold in working memory.

### 5.2 Non-Goals

**Replacing mature processes.** Rust's RFC process works for Rust. TC39's process works for ECMAScript. OSSS does not claim to improve on these ecosystem-specific solutions within their own domains.

**Defining document rendering.** How a proposal is rendered (Markdown to HTML, PDF generation, web publishing) is out of scope.

**Prescribing governance.** Who reviews proposals, how consensus is reached, and what authority structure makes decisions are orthogonal to document structure.

**Ensuring quality.** OSSS can ensure that a proposal *addresses* prior art. It cannot ensure that the analysis is *good*. Structure is necessary but not sufficient for quality.

**Formal standardisation.** OSSS is a community convention, not an IETF RFC or ISO standard. Formal standardisation may be appropriate in the future but is premature for v0.1.

---

## 6. Core Specification

### 6.1 Document Structure Overview

An OSSS-compliant document MUST contain the sections marked REQUIRED and SHOULD contain sections marked RECOMMENDED. Sections marked OPTIONAL may be included at the author's discretion. The order below is RECOMMENDED but not strictly required — authors MAY reorder sections if a different sequence serves their argument better.

| # | Section | Requirement | Purpose |
|---|---|---|---|
| — | Metadata Block | REQUIRED | Identity, versioning, status tracking |
| 1 | Abstract | REQUIRED | Problem + solution + scope in one paragraph |
| 2 | Scope, Applicability, and Limitations | REQUIRED | What the proposal does NOT cover, where the system applies, and known limits |
| 3 | Problem Statement | REQUIRED | What problem exists and why it matters |
| 4 | Prior Art | REQUIRED | How this relates to existing work |
| 5 | Design Goals and Explicit Non-Goals | REQUIRED | What the proposal optimises for and explicitly avoids |
| 6 | Core Specification | REQUIRED | The normative technical content |
| 7 | Compliance Model | RECOMMENDED | What constitutes conformance |
| 8 | Trade-Off Analysis | REQUIRED | Alternatives considered and why they were rejected |
| 9 | Consequences and Risks | REQUIRED | Benefits, risks, and mitigations |
| 10 | Future Directions | RECOMMENDED | Trajectory without overloading the current version |
| — | Appendices | OPTIONAL | Worked examples, schemas, reference tables |
| — | References | RECOMMENDED | Cited works with stable identifiers |

### 6.2 Metadata Block

Every OSSS-compliant document MUST begin with a metadata block containing at minimum:

| Field | Requirement | Purpose |
|---|---|---|
| **Title** | REQUIRED | Document identity |
| **Version** | REQUIRED | Enables stable references and change tracking |
| **Status** | REQUIRED | Enables workflow tooling and reader expectations |
| **Author(s)** | REQUIRED | Attribution and point of contact |
| **Date** | REQUIRED | Temporal context |
| **License** | RECOMMENDED | Reuse and derivative work clarity |

**Status values.** OSSS does not prescribe a fixed set of status values, but the following are RECOMMENDED as a minimal vocabulary:

- `Draft` — Work in progress, not yet submitted for review.
- `Proposal` — Submitted for community review.
- `Accepted` — Approved for implementation or adoption.
- `Rejected` — Reviewed and declined.
- `Superseded` — Replaced by a newer document.
- `Withdrawn` — Retracted by the author.

Projects MAY define additional status values appropriate to their governance model.

**Format.** The metadata block SHOULD be rendered as bold key-value pairs at the document head. Projects that use YAML frontmatter, TOML headers, or other structured formats MAY use those instead, provided the same fields are present.

**Why this section matters.** A document without version metadata cannot be stably referenced. A document without status cannot be reliably assessed — readers cannot distinguish a working draft from an accepted standard. A document without an author has no point of contact for questions or amendments. These are the minimum requirements for a document to function as a living artefact in a community process.

### 6.3 Abstract

The Abstract MUST be a single paragraph (3-8 sentences) that communicates:

1. What problem exists.
2. What this proposal does about it.
3. What scope it covers.

The Abstract SHOULD be self-contained: a reader who reads only the Abstract should understand whether the proposal is relevant to their interests.

**Why this section matters.** Proposals without abstracts force readers to scan the entire document to assess relevance. In a project with dozens of active proposals, this creates a sorting problem that wastes reviewer time. A strong abstract functions as a filter: it attracts the right reviewers and correctly repels those for whom the proposal is irrelevant.

**Failure mode when absent.** Proposals that begin with the problem statement (skipping the abstract) require readers to absorb 500-2000 words before understanding the proposal's purpose. This discourages review and biases feedback toward readers with pre-existing interest.

### 6.4 Scope, Applicability, and Limitations

The Scope, Applicability, and Limitations section MUST explicitly state what the proposal does NOT cover, where the specified system applies and where it does not, and what its known limitations are. This section addresses both document boundaries (what this proposal discusses) and system boundaries (where the specified system should be deployed) in a single location.

This is a departure from most existing proposal templates, which do not include a dedicated scope-limitation section. The omission is a structural weakness that OSSS corrects. Explicit limitations increase rather than decrease credibility. A proposal that acknowledges what it cannot do signals intellectual maturity. A proposal that claims universal applicability usually indicates that the question of boundaries has not been considered.

Authors SHOULD organise this section into subsections when both document scope and system applicability need to be addressed. A typical structure:

- **What this document covers / does not cover** — the boundaries of the proposal itself.
- **Where the system applies** — the contexts in which the specified system is designed to work.
- **Where the system does not apply** — the contexts in which it should not be used, with reasons.
- **Known limitations** — honest acknowledgement of constraints, gaps, or unvalidated assumptions.

For simpler specifications where document scope and system applicability overlap substantially, a single integrated discussion is acceptable. Redundancy in boundary-setting is a minor cost compared to omission.

### 6.5 Problem Statement

The Problem Statement MUST describe a concrete, evidenced problem. It SHOULD include quantitative or operational evidence where available.

A problem statement that begins "It would be nice if..." is a feature request, not a specification motivation. A problem statement that begins "X% of projects encounter Y failure when Z occurs" is an engineering argument. The Problem Statement should read as the latter.

### 6.6 Prior Art and Positioning

The Prior Art section MUST identify existing work that addresses the same or adjacent problem space. For each related work, the section SHOULD state: its scope, its strengths, its structural limitations, and how the current proposal complements or extends it.

The framing SHOULD be comparative and respectful. Dismissive treatment of prior art ("X is terrible, so we built Y") signals poor scholarship and alienates communities that maintain the dismissed work.

### 6.7 Design Goals and Explicit Non-Goals

The Design Goals section MUST state what the proposal optimises for. The Non-Goals section MUST state what the proposal explicitly does NOT attempt to achieve.

Non-Goals are the critical differentiator between adequate and strong proposals. Most weak specifications fail not because their goals are unclear but because their boundaries are. A specification with clear goals and no non-goals invites the question: "But what about X?" for every adjacent concern. Explicit non-goals pre-empt these questions.

### 6.8 Core Specification (Normative Section)

The Core Specification section MUST contain the normative technical content of the proposal: the actual design, schema, format, protocol, or standard being proposed. It MUST be precise enough that two independent implementers can produce interoperable results.

**Normative language.** OSSS RECOMMENDS using the normative keywords defined in RFC 2119 (MUST, MUST NOT, SHOULD, SHOULD NOT, MAY) when precision about obligation levels is important. However, normative language should be used sparingly. A specification where every sentence contains MUST loses its signal value — the reader cannot distinguish critical requirements from minor conventions. Reserve MUST for interoperability-critical requirements and SHOULD for strongly recommended practices.

**Examples.** The normative section SHOULD include concrete examples: JSON snippets, Markdown blocks, code samples, or diagrams as appropriate. Examples serve as informal tests of the specification — if a specification cannot be illustrated with a concrete example, it may be too abstract to implement.

### 6.9 Compliance Model

An OSSS-compliant document SHOULD include a Compliance Model section that defines what constitutes conformance to the specification.

A specification without a compliance model is a suggestion. It may describe a desirable state of affairs, but it provides no mechanism for determining whether an implementation achieves that state. The Compliance Model should address:

- What does it mean to "comply" with or "implement" this specification?
- Are there levels of compliance (e.g., minimal, standard, full)?
- How can compliance be tested or verified?

Testable criteria are strongly preferred over subjective assessments. "The manifest MUST contain a `version` field" is testable. "The documentation should be comprehensive" is not.

### 6.10 Trade-Off Analysis and Alternatives Considered

The Trade-Off Analysis section MUST explain, for each significant design decision: what alternatives were considered, why each was rejected, and what trade-offs the chosen approach accepts.

This is REQUIRED, not optional, because specifications that present design decisions as self-evident usually indicate incomplete analysis. Most non-trivial design decisions involve trade-offs. Making these explicit serves multiple purposes: it demonstrates intellectual rigour, it helps reviewers understand the decision space, and it provides future maintainers with the reasoning they need to evaluate whether circumstances have changed enough to revisit the decision.

**Comparative reasoning is essential.** "We chose JSON" is a decision. "We chose JSON over YAML because of deterministic parsing, and over XML because of ecosystem simplicity, accepting the trade-off that JSON does not support comments" is a reasoned trade-off. The latter is what this section requires.

### 6.11 Consequences and Risks

The Consequences and Risks section MUST separately identify positive consequences (benefits) and risks (potential negative outcomes). Risks MUST include mitigation strategies or an explicit acknowledgement that no mitigation exists.

This section serves as a counterweight to the Core Specification. Where the specification describes what the proposal *does*, Consequences and Risks describes what the proposal *causes* — both intended and unintended.

**On risk-free proposals.** A proposal that lists no risks usually indicates incomplete analysis of deployment, maintenance, evolution, or failure modes. Mature technical communities treat risk-free proposals with scepticism. Including genuine risks, even uncomfortable ones, strengthens rather than weakens a proposal.

### 6.12 Future Directions

An OSSS-compliant document SHOULD include a Future Directions section that outlines plausible evolution without committing to it.

This section serves a boundary function: it tells reviewers "yes, we have thought about X, and it belongs in a future version, not this one." Without it, reviewers who identify adjacent concerns have no way to distinguish "the authors did not consider this" from "the authors considered this and deferred it." The result is scope-expanding review feedback that delays the current proposal.

Future Directions content is explicitly non-normative. It describes aspirations, not commitments. It SHOULD be clearly separated from the Core Specification to prevent confusion about what is currently proposed versus what is aspirational.

### 6.13 Appendices

Appendices are OPTIONAL and non-normative. They SHOULD be used for:

- **Worked examples** — complete, end-to-end demonstrations of the specification applied to a realistic scenario.
- **Formal schemas** — machine-readable definitions (JSON Schema, BNF grammars, etc.) that complement the prose specification.
- **Reference tables** — quick-reference summaries of fields, sections, or requirements.
- **Glossaries** — term definitions when the specification introduces or redefines terminology.

Appendices improve implementability without increasing the cognitive load of the core document. A reviewer who wants to understand the specification reads the normative sections. A developer who wants to implement it reads the appendices.

### 6.14 References

An OSSS-compliant document SHOULD include a References section citing external works mentioned in the document. References SHOULD use stable identifiers: DOIs for academic papers, permanent URLs for web resources, version-pinned identifiers for specifications.

Unstable references (links to blog posts that may be edited, URLs without archival guarantees, references to "current version" of a living document) SHOULD note their instability.

---

## 7. Compliance Model

### 7.1 Document-Level Compliance

An OSSS-compliant document MUST contain all REQUIRED sections with substantive content. "Substantive" is defined operationally as meeting all of the following criteria:

**Machine-verifiable criteria** (can be checked by a linter):

1. **Section presence.** All REQUIRED sections exist with the correct headings.
2. **Minimum length.** Each REQUIRED section contains at least two sentences of analytical prose (not solely bullet points) that address the section's stated purpose.
3. **No placeholder text.** Sections containing only "TBD," "Not applicable," "To be determined," or equivalent placeholders do not satisfy the requirement.
4. **Metadata completeness.** All REQUIRED metadata fields (Title, Version, Status, Author, Date) are present.

**Reviewer-assessed criteria** (require human judgment):

5. **Evidence of engagement.** The section must demonstrate active analysis, not mere listing or assertion:
   - Prior Art sections MUST state scope, strengths, and limitations for each related work — not merely cite them.
   - Trade-Off Analysis sections MUST include explicit comparison between alternatives — not merely "we chose X" without rationale for rejecting Y.
   - Compliance Model sections MUST define testable conformance criteria — not vague assertions of quality.
   - Problem Statement sections MUST describe a concrete problem with evidence — not hypothetical concerns.

The machine-verifiable criteria enable automated structural linting. The reviewer-assessed criteria define quality standards that tooling can flag for human attention but cannot evaluate autonomously. Both categories are part of compliance, but projects should expect different enforcement mechanisms for each.

Projects MAY define exemption policies for edge cases (e.g., a proposal with genuinely no prior art, or a trivial feature with no meaningful trade-offs). Such exemptions SHOULD be documented in the project's proposal guidelines, not asserted ad hoc by individual authors.

An OSSS-compliant document SHOULD contain all RECOMMENDED sections.

### 7.2 Compliance Checklist

| Section | Requirement | Compliance Test |
|---|---|---|
| Metadata Block | REQUIRED | All REQUIRED fields (Title, Version, Status, Author, Date) present |
| Abstract | REQUIRED | Single paragraph, ≥ 3 sentences, addresses problem + solution + scope |
| Scope, Applicability & Limitations | REQUIRED | Explicitly states ≥ 1 exclusion or limitation; states where the system applies and where it does not |
| Problem Statement | REQUIRED | Describes a concrete problem with ≥ 1 form of evidence |
| Prior Art | REQUIRED | Identifies ≥ 1 related work; for each: (a) states scope, (b) identifies ≥ 1 strength, (c) identifies ≥ 1 limitation |
| Design Goals / Non-Goals | REQUIRED | States ≥ 1 design goal and ≥ 1 explicit non-goal |
| Core Specification | REQUIRED | Contains normative content with ≥ 1 concrete example |
| Compliance Model | RECOMMENDED | Defines what conformance means and how to test it |
| Trade-Off Analysis | REQUIRED | For ≥ 1 design decision: alternative, reasoning, trade-off |
| Consequences and Risks | REQUIRED | ≥ 1 benefit and ≥ 1 risk with mitigation or acknowledgement |
| Future Directions | RECOMMENDED | ≥ 1 future possibility, clearly separated from normative content |
| Appendices | OPTIONAL | Non-normative supporting material (worked examples, schemas, reference tables) |
| References | RECOMMENDED | Cited works use stable identifiers |

### 7.3 Worked Example: This Document's Compliance

This document conforms to its own structure. The table below serves both as a compliance verification and as a worked example of how to apply the checklist from Section 7.2 to a real document:

| OSSS Section | This Document | Compliance Verification |
|---|---|---|
| Metadata Block | Document header | ✓ Title, Version (0.1), Status (Proposal), Author (Robert J. Barbour), Date (February 2026), License (MIT) — all REQUIRED fields present |
| Abstract | Section 1 | ✓ Single paragraph, 5 sentences, addresses problem (reinvented templates), solution (anti-bikeshedding default structure), scope (document structure, not governance) |
| Scope, Applicability & Limitations | Section 2 | ✓ States 4 document-scope exclusions (governance, markup syntax, subject matter, formal verification), states where OSSS applies and does not, identifies 4 known limitations |
| Problem Statement | Section 3 | ✓ Concrete problem (reinvention, reviewer burden, tooling gap) with informal survey evidence (3.4) |
| Prior Art | Section 4 | ✓ 7 proposal formats (§4.1-4.7) and 4 anti-bikeshedding precedents (§4.8), each with stated scope, ≥ 1 strength, ≥ 1 structural limitation; convergent pattern synthesis (§4.9) |
| Design Goals / Non-Goals | Section 5 | ✓ 6 design goals, 5 explicit non-goals with rationale |
| Core Specification | Section 6 | ✓ 14 normative subsections defining each OSSS section, with concrete examples (document structure overview table in 6.1, metadata field table in 6.2, status vocabulary in 6.2) |
| Compliance Model | Section 7 | ✓ Defines conformance with machine-verifiable and reviewer-assessed criteria (7.1), provides testable checklist (7.2), includes worked example (7.3) |
| Trade-Off Analysis | Section 8 | ✓ 5 design decisions, each with: alternative considered, reasoning for rejection, trade-off explicitly accepted |
| Consequences & Risks | Section 9 | ✓ 4 benefits, 5 risks each with explicit mitigation strategy |
| Future Directions | Section 10 | ✓ 6 future possibilities, clearly separated from normative content, labelled as aspirational |
| Appendices | Appendices A-D | ✓ Quick reference table, worked case study, adoption guidance, failure-mode reasoning |
| References | References section | ✓ 11 cited works with URLs; most are permanent (RFC Editor, GitHub repos), though branch-pinned URLs may drift over time |

Self-description demonstrates that the structure is expressive enough to handle a non-trivial specification. It does not, by itself, validate that the structure produces better proposals — that validation requires empirical evidence from diverse adopters (see Section 10.5).

---

## 8. Trade-Off Analysis and Alternatives

### 8.1 Minimal Structure (ADR-style) vs Comprehensive Structure

**The appeal of minimal structure.** ADRs demonstrate that a four-section template (context, decision, consequences) can capture essential technical decisions. Adopting a similar minimal structure for OSSS would lower adoption friction and reduce authoring burden.

**Why comprehensive structure was chosen.** ADRs work for internal decisions where the audience shares context. Public specifications lack this shared context — they must build their own through problem statements, prior art, and trade-off reasoning. A specification that omits prior art analysis is not merely less thorough; it is less *trustworthy*, because readers cannot assess whether the author has surveyed the existing landscape. The additional sections in OSSS are not bureaucratic overhead — each addresses a specific failure mode documented across decades of open-source specification work.

**Trade-off accepted.** Higher authoring burden for higher document quality. Mitigated by making non-essential sections RECOMMENDED rather than REQUIRED.

### 8.2 Prescriptive Section Order vs Flexible Ordering

**The appeal of flexible ordering.** Different subject matters suggest different narrative flows. A specification motivated primarily by a competitive landscape might lead with Prior Art. A specification motivated by a specific failure might lead with the Problem Statement.

**Why recommended ordering was chosen.** Flexible ordering improves authoring comfort but reduces reviewer efficiency. A reviewer familiar with OSSS who knows that Prior Art is always Section 4 can navigate any OSSS-compliant document instantly. If sections may appear in any order, this navigability is lost. The compromise — RECOMMENDED order, not REQUIRED — preserves flexibility while encouraging consistency.

**Trade-off accepted.** Slight authoring constraint for significant reviewer efficiency.

### 8.3 Governance-Inclusive vs Governance-Agnostic

**The appeal of including governance.** Most proposal processes involve governance: who reviews, how consensus is reached, what authority approves. Including governance guidance would make OSSS a more complete proposal-process toolkit.

**Why governance was excluded.** Governance is the primary reason existing templates are ecosystem-specific. Rust's FCP, TC39's stage gates, Python's steering council — these are governance mechanisms deeply embedded in their respective communities. Including governance guidance would either be too generic to be useful or too specific to be cross-domain. Separating structure from governance is the key design decision that enables cross-domain applicability.

**Trade-off accepted.** OSSS is less complete as a "proposal process in a box" but more portable across communities.

### 8.4 Strict Markdown Requirement vs Format Agnosticism

**The appeal of requiring Markdown.** Mandating Markdown would simplify tooling, ensure consistency, and leverage GitHub's rendering capabilities.

**Why format agnosticism was chosen.** Some communities use reStructuredText (Python), AsciiDoc (Eclipse), or plain text (IETF). Requiring Markdown would exclude these communities or force format conversion. Since OSSS defines sections and semantics rather than rendering, format agnosticism preserves broad applicability. Markdown is RECOMMENDED because of GitHub's dominance in open-source hosting, but it is not required.

**Trade-off accepted.** Tooling must handle format variation, increasing implementation complexity.

### 8.5 Mandatory Prior Art vs Optional Prior Art

**The appeal of making Prior Art optional.** Small specifications with no predecessors genuinely have no prior art to discuss. Requiring a prior art section in these cases produces empty or forced content.

**Why Prior Art is required.** In practice, proposals with "no prior art" almost always have adjacent work the author has not discovered. Requiring the section forces the author to search, even briefly. A prior art section that says "We surveyed X and Y and found no directly comparable work" is more informative than an absent section, because it tells reviewers the author has looked. The cost of occasionally producing thin Prior Art sections is outweighed by the benefit of consistently preventing duplicative proposals.

**Trade-off accepted.** Occasional thin sections for systematically better landscape awareness.

---

## 9. Consequences and Risks

### 9.1 Benefits

**Reduced reinvention.** Projects adopting OSSS skip the template design phase and begin writing proposals immediately. The accumulated structural wisdom of Rust RFCs, PEPs, KEPs, and IETF RFCs is available without rediscovery.

**Improved proposal quality.** Required sections (Scope and Limitations, Non-Goals, Trade-Off Analysis, Risks) systematically address failure modes that ad-hoc templates commonly omit.

**Cross-domain reviewability.** A reviewer familiar with OSSS can navigate any OSSS-compliant document regardless of subject matter, reducing the cognitive overhead of engaging with unfamiliar projects.

**Tooling ecosystem.** A shared structural contract enables generic tools: linters, indexers, review bots, and renderers that work across all OSSS-compliant proposals.

### 9.2 Risks

**Adoption friction for small proposals.** A small proposal (e.g., adding a configuration option) may find 9 required sections excessive. *Mitigation:* Projects may define a "lightweight OSSS" profile that relaxes requirements for minor proposals while maintaining full OSSS for significant ones. OSSS does not prohibit this — it defines the full structure but does not require its use for every document a project produces.

**Structural cargo-culting.** Authors may fill sections mechanically without substantive content, producing documents that are OSSS-compliant but intellectually vacuous. *Mitigation:* The compliance checklist (Section 7.2) includes minimum substantiveness criteria. Tooling can detect placeholder content. Ultimately, however, structure cannot guarantee quality — it can only ensure that the spaces for quality exist.

**Perception of overhead.** Communities with lightweight cultures (Go's minimalism, early-stage startups) may perceive OSSS as bureaucratic. *Mitigation:* OSSS is voluntary and modular. Projects adopt it when they recognise the need for structured proposals, not before. Positioning as a tool rather than a mandate reduces resistance.

**Competing meta-standards.** If multiple proposal-structure standards emerge, the meta-standard space itself fragments — the very problem OSSS aims to solve at the specification level. *Mitigation:* OSSS is deliberately minimal and MIT-licensed. It aims to be the obvious default rather than competing on features. The strongest defence against fragmentation is simplicity: it is harder to justify an alternative when the existing standard is small enough to adopt in an afternoon.

**Ossification.** A standard that is too rigid prevents adaptation to new proposal types or community needs. *Mitigation:* The REQUIRED/RECOMMENDED/OPTIONAL tiering provides flexibility. Future versions of OSSS may add new OPTIONAL sections without invalidating existing documents.

---

## 10. Future Directions

### 10.1 Tooling

The most impactful near-term development would be a simple CLI tool that validates OSSS compliance: checking section presence, metadata completeness, and minimum substantiveness criteria. A secondary tool could scaffold an OSSS-compliant template for a new proposal, pre-populated with section headings and guidance comments.

### 10.2 Template Library

A collection of OSSS-compliant templates adapted for common domains — API specifications, data format proposals, documentation standards, protocol definitions, CLI tool specifications — would reduce authoring friction further. Each template would include domain-specific guidance within the standard OSSS structure.

### 10.3 Integration with Proposal Management

GitHub Actions, GitLab CI, or similar automation could validate OSSS compliance on pull requests, ensuring that proposals meet structural requirements before human review begins. This extends the "linter" concept into the proposal review workflow.

### 10.4 Staged Compliance

Inspired by TC39's staged approach, a future OSSS version could define compliance levels that correspond to proposal maturity:

- **Stage 0 (Exploration):** Metadata, Abstract, Problem Statement, and Design Goals only. Sufficient to communicate intent and solicit early feedback.
- **Stage 1 (Proposal):** All REQUIRED sections. Sufficient for structured community review.
- **Stage 2 (Specification):** All REQUIRED and RECOMMENDED sections, including compliance model and comprehensive examples. Sufficient for implementation.

This graduated approach would address the "too heavy for small proposals" concern while maintaining full rigour for specifications that need it.

### 10.5 OSSS Versioning Strategy

OSSS itself needs a versioning policy. Key questions for a future version: What constitutes a breaking change to the standard? If OSSS v0.2 adds a new REQUIRED section, are v0.1-compliant documents now non-compliant? The SemVer analogy suggests: adding REQUIRED sections is a major version change; adding RECOMMENDED or OPTIONAL sections is a minor version change; clarifying existing section definitions is a patch. This policy should be formalised before OSSS reaches v1.0 to prevent an anti-bikeshedding tool from introducing its own versioning bikeshed.

### 10.6 Empirical Validation

A study comparing proposal quality (as measured by reviewer satisfaction, time to consensus, and implementation fidelity) between OSSS-compliant and ad-hoc proposals across multiple projects would provide empirical grounding for the standard's value proposition. This is aspirational but would significantly strengthen the case for adoption.

---

## Appendix A: OSSS Section Quick Reference

| Section | Req. Level | Key Question It Answers |
|---|---|---|
| Metadata | REQUIRED | Who wrote this, when, and what is its status? |
| Abstract | REQUIRED | What is this proposal about? |
| Scope, Applicability & Limitations | REQUIRED | What does this NOT cover, where does it apply, and what are its limits? |
| Problem Statement | REQUIRED | What problem justifies this proposal's existence? |
| Prior Art | REQUIRED | What already exists and how does this relate? |
| Design Goals / Non-Goals | REQUIRED | What does this optimise for and explicitly avoid? |
| Core Specification | REQUIRED | What exactly is being proposed? |
| Compliance Model | RECOMMENDED | How do you know if you've implemented this correctly? |
| Trade-Off Analysis | REQUIRED | What alternatives exist and why were they rejected? |
| Consequences & Risks | REQUIRED | What happens if this is adopted? What could go wrong? |
| Future Directions | RECOMMENDED | Where might this go next? |
| Appendices | OPTIONAL | Can you show me a complete example? |
| References | RECOMMENDED | What external works are cited? |

---

## Appendix B: Case Study — README.llm vNext

The README.llm vNext proposal (Barbour, 2026) — a specification extending the ReadMe.LLM framework for retrieval-aware LLM documentation — was developed concurrently with OSSS and closely mirrors its structure. The following mapping demonstrates how OSSS sections apply to a concrete, real-world specification:

| OSSS Section | README.llm vNext | Content |
|---|---|---|
| Metadata Block | Document header | Title, Version 0.1, Draft, Author, Date, License |
| Abstract | Section 1 | Extends ReadMe.LLM with retrieval, multi-file, contracts |
| Scope, Applicability & Limitations | Sections 1a, 7 | Document scope: 8K-200K tokens, synchronous APIs, not concurrent systems; System applicability: not IDEs, not concurrent systems |
| Problem Statement | Section 2 | Documentation-consumption mismatch, cross-interface problem, retrieval gap |
| Prior Art | Section 3 | ReadMe.LLM, llms.txt, LLMS.md, OpenAPI, JSDoc, MCP — 7 comparisons |
| Design Goals / Non-Goals | Section 4 | Cross-interface, retrieval-efficient; not replacing OpenAPI, not formal verification |
| Core Specification | Section 6 | Manifest schema, metadata headers, retrieval algorithm, contracts, validation |
| Compliance Model | Section 5 | Capability-based: `retrieval-indexed`, `metadata-rich`, `contract-annotated`, `validation-equipped` |
| Trade-Off Analysis | Section 9 | JSON vs YAML, single vs multi-file, embedded vs external metadata, extending OpenAPI, RAG vs structure |
| Consequences & Risks | Section 10 | Reduced token costs, maintenance burden, fragmentation, overfitting, vendor capture |
| Future Directions | Section 12 | Auto-generation, symbol indexing, IDE integration, empirical validation |
| Appendices | Appendices A-E | JSON schema, quick references, worked example (csvtool), adoption realism |
| References | References | 5 cited works with stable URLs |

This mapping demonstrates two things. First, that the OSSS structure accommodates a non-trivial technical specification without forcing awkward contortions. Second, that the structure the README.llm vNext authors arrived at independently converges with what OSSS codifies — evidence that the pattern is emergent, not imposed.

---

## Appendix C: Adoption Guidance

### C.1 For Projects Without an Existing Proposal Process

This is OSSS's primary audience. To adopt:

1. Copy the section structure from Appendix A into a proposal template file (e.g., `proposal-template.md`).
2. Add project-specific guidance within each section (e.g., "In Prior Art, always reference our existing API documentation standards").
3. Add the template to your repository's contributing guidelines.
4. Optionally, add a CI check that validates section presence using an OSSS linter (when available).

Expected effort: 30-60 minutes for initial setup.

### C.2 For Projects Migrating from an Ad-Hoc Process

Map existing proposal sections to OSSS equivalents. Identify sections your current template omits (Scope and Limitations and Non-Goals are the most commonly missing). Add the missing sections to your template. Existing proposals need not be retroactively converted — OSSS applies to new proposals going forward.

Expected effort: 1-2 hours for template migration, plus gradual cultural adaptation.

### C.3 For Projects with Mature Existing Processes

OSSS is unlikely to replace a well-functioning ecosystem-specific template. However, it may be useful as: a reference for validating that your existing template covers known-important sections, a bridge format for cross-project proposals that span ecosystem boundaries, or a starting point for new sub-projects or working groups within your ecosystem that need their own proposal process.

---

## Appendix D: Failure Modes Addressed by Each Section

Each OSSS section exists to address a specific failure mode observed across specification processes. This appendix consolidates the reasoning that justifies each section's inclusion, separated from the normative definitions in Section 6 for readability.

| Section | Why It Matters | Failure Mode When Absent |
|---|---|---|
| **Metadata Block** | Documents must be stably referenceable; status must be unambiguous so readers can distinguish working drafts from accepted standards. | A document without version metadata cannot be stably cited. A document without status cannot be reliably assessed — readers cannot distinguish a working draft from an accepted standard. A document without an author has no point of contact for questions or amendments. |
| **Abstract** | Readers need rapid relevance assessment. In a project with dozens of active proposals, forcing readers to scan the full document to assess relevance wastes reviewer time. | Proposals that begin with the problem statement (skipping the abstract) require readers to absorb 500-2000 words before understanding the proposal's purpose. This discourages review and biases feedback toward readers with pre-existing interest. |
| **Scope, Applicability & Limitations** | Specifications that do not state their boundaries invite scope creep and misapplication. Reviewers extend the spec beyond its intended domain; users apply it to unsuitable contexts and blame the spec rather than the mismatch. | A database query specification without "does not cover distributed transactions" gets deployed in distributed contexts, fails, and generates bug reports the authors must triage. |
| **Problem Statement** | If the problem is not clearly stated, reviewers cannot evaluate whether the solution is appropriate. A well-articulated problem constrains the solution space. | Proposals without clear problem statements tend toward solution-first thinking: the author has an elegant design and constructs a post-hoc justification. |
| **Prior Art** | Reviewers' first question is "does this already exist?" Without an answer, they reject the proposal as duplicative or answer incorrectly themselves. | Proposals that ignore prior art miss interoperability opportunities. Related work that is acknowledged can be complemented; related work that is ignored becomes a competing standard. |
| **Design Goals / Non-Goals** | Goals orient evaluation; non-goals bound scope. Without non-goals, every reviewer contributes additional requirements. | Specifications without non-goals become unbounded — scope expands until the specification collapses under its own weight. |
| **Core Specification** | This is the core artefact. Without normative content, a document is aspirational rather than implementable. | A proposal without a clear normative section may generate productive discussion but cannot drive adoption or interoperability. |
| **Compliance Model** | Without a compliance model, two implementations can both claim conformance while producing different results. | Vague compliance leads to fragmentation: the "two implementations, one standard, zero interoperability" failure mode. |
| **Trade-Off Analysis** | Reviewers who disagree with a decision need to understand why it was made. Written trade-off analysis outlasts the author's recollection. | Specifications without trade-off analysis accumulate contested decisions that generate recurring debates in issue trackers. |
| **Consequences & Risks** | Every specification creates externalities. Acknowledging them honestly builds trust and enables informed adoption decisions. | Specifications that omit risk analysis surprise adopters with consequences the authors could have predicted. |
| **Future Directions** | Tells reviewers "we considered X and deferred it." Without this, reviewers cannot distinguish oversight from deliberate deferral. | Scope-expanding review feedback delays the current proposal because reviewers surface adjacent concerns the authors have already considered. |

---

## References

- Rust RFC Process. https://github.com/rust-lang/rfcs
- TC39 Proposal Process. https://tc39.es/process-document/
- Python PEP Process (PEP 1). https://peps.python.org/pep-0001/
- Kubernetes Enhancement Proposals. https://github.com/kubernetes/enhancements/tree/master/keps
- Go Proposal Process. https://github.com/golang/proposal
- Bradner, S. (1997). RFC 2119: *Key words for use in RFCs to Indicate Requirement Levels*. IETF. https://www.rfc-editor.org/rfc/rfc2119
- Nygard, M. (2011). *Documenting Architecture Decisions*. https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- Barbour, R. J. (2026). *README.llm vNext: Retrieval-Aware, Multi-File, and Behavioural Extensions*. https://github.com/rjbarbour/standards/tree/main/README.llms-vNext
- Semantic Versioning 2.0.0. https://semver.org/
- Conventional Commits 1.0.0. https://www.conventionalcommits.org/
- Keep a Changelog 1.1.0. https://keepachangelog.com/

---

*This proposal follows its own specification structure (OSSS v0.1). It is intended for community review and iterative refinement. Contributions, critiques, and alternative proposals are welcome.*
