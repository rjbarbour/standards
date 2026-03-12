---
layout: ../ai-open-standards/src/layouts/BaseLayout.astro
title: "CLOAKD: Cloaking Secrets from Agentic AI"
description: "a security standard for credential handling in agentic development environments"
---

# CLOAKD: Cloaking Secrets from Agentic AI

| | |
| :--- | :--- |
| **Version** | `1.0` |
| **Status** | `Release` |
| **Author(s)** | R.J. Barbour, with Manus AI |
| **Created** | 11 Mar 2026 |
| **Last Modified** | 12 Mar 2026 |
| **License** | CC BY-SA 4.0 |

## 1. Abstract

This document outlines a security standard for managing credentials in agentic AI development environments. It provides a practical, procedural framework for implementing the security recommendations of bodies like OWASP and NIST, addressing the unique risks posed by AI agents—including prompt injection, context window observation, and insecure tool use. The standard prefers a "secrets-never-touch-disk-or-context" approach through local environment security, native or federated credential delivery, and automated multi-stage scanning. Where current platform limitations make that impossible, it defines degraded fallback procedures that reduce credential lifetime and blast radius without claiming zero-knowledge handling. It introduces the concept of a platform-agnostic "Security Context Artifact" to programmatically prime agents with security constraints. The standard concludes with a call to action for platform developers: for locally-run tools to integrate with native OS keychains, and for cloud-hosted agents to build equivalent secure secret-injection mechanisms.

## 2. Scope, Applicability & Limitations

This standard is applicable to any software development project that utilizes AI agents, assistants, or copilots with access to a local or remote shell, filesystem, or development environment. This includes, but is not limited to, platforms such as Manus, Anthropic's Claude Code, GitHub Copilot, and Cursor.

**This standard is NOT applicable to:**

*   Traditional (non-agentic) software development workflows.
*   AI models without agency (i.e., without the ability to execute commands, use tools, or interact with an environment).
*   The security of the underlying Large Language Model (LLM) itself.

## 3. Problem Statement

AI agents introduce novel attack surfaces for credential leakage that traditional security models do not account for. The core problem is that the agent, the code it operates on, and the developer's environment create a complex, permeable boundary where secrets can be inadvertently exposed and exfiltrated. For example, an agent may be instructed to read a secret from an on-disk `.env` file and include it in a log file or commit it to Git history [1]. This standard provides concrete mitigations for three primary risks:

1.  **Accidental Leakage:** Developers or agents inadvertently committing secrets to version control. This is mitigated by automated pre-commit and CI/CD scanning (E1, E2).
2.  **Instruction-Based Exfiltration:** Malicious actors using prompt injection to instruct an agent to find and reveal secrets from its environment (e.g., from shell history or environment variables). This is mitigated by preventing secrets from entering the shell environment or agent context in the first place (P1, P2, PR1).
3.  **Insecure Handoff & Storage:** Developers insecurely passing credentials to an agent (e.g., via chat) or storing them in plaintext on disk. This is mitigated by preferring native or federated credential delivery, using OS-integrated secret stores (PR1), and falling back to ephemeral, time-bound degraded handoff only where stronger platform capabilities are unavailable (PR2).

## 4. Prior Art & Rationale

This standard serves as the practical implementation layer for high-level principles established by other bodies. It translates broad recommendations into specific, actionable procedures for developers using agentic tools.

| Prior Art | Contribution | Gap Filled by CLOAKD |
| :--- | :--- | :--- |
| **OWASP LLM Top 10** [4] | Identifies risks like "Sensitive Information Disclosure" and "Insecure Plugin Design." | Provides a concrete, multi-layered procedural framework (local security, scanning, handoff) to directly mitigate these risks in a development context. |
| **OWASP NHI Top 10** [6] | Defines risks for Non-Human Identities, including "Secret Leakage." | Translates high-level recommendations (e.g., "Use Ephemeral Credentials") into a specific, developer-ready workflow for degraded credential handoff, scoped delegation, and secret lifecycle controls (PR2, PR4). |
| **NIST AI RMF** [7] | Establishes a comprehensive risk management framework for AI systems. | Provides a concrete, implementable security control that fits directly into the "Govern," "Map," and "Measure" functions of the NIST framework. |
| **The Twelve-Factor App** [3] | Advocates storing config in the environment. | Explicitly rejects this practice for agentic workflows, as it makes secrets directly visible to the agent, and instead prefers local keychain-backed handling and native or federated delivery, with PR2 retained only as a degraded fallback. |
| **Community Prototypes & Vendor Requests** [5][8] | Vendor feature requests and emerging tools such as `mirage-proxy` show demand for sensitive-path controls and transport-layer secret filtering in agent workflows. | Integrates these emerging ideas into a broader lifecycle standard that includes local environment controls, degraded handoff rules, scanning, and human-gated review rather than relying on a single tool or vendor capability. |

## 5. Design Goals / Non-Goals

**Design Goals:**

*   **Zero-Knowledge Principle:** An agent should be able to perform its tasks without the actual value of a secret ever entering its context window, memory, or logs.
*   **Practicality:** The procedures must be achievable by individual developers and small teams using freely available tools.
*   **Layered Defense:** The framework must combine preventative controls, detective controls, and corrective controls.
*   **Platform Agnosticism:** The principles should be adaptable to any agentic development platform.

**Non-Goals:**

*   To address general application security vulnerabilities outside the scope of credential management.
*   To solve the problem of prompt injection itself.

## 6. Core Specification

This section details the normative requirements of the standard, structured as a set of Principles, operating modes, their corresponding implementing Procedures, and Enforcement Controls.

### 6.1. Principles & Procedures

#### P1: Secrets Never Hit Disk in Plaintext
Plaintext credentials MUST NOT be stored in version-controlled files, configuration files, or any other on-disk artifact. This includes shell history, log files, and temporary files.

*   **Procedure PR1: Local Environment Security.** To prevent leakage from on-disk files like `~/.aws/credentials`, developers MUST use a tool that integrates with their operating system's secure keychain to manage local credentials (e.g., `aws-vault`).

#### P2: Secrets Never Enter Agent Context
The raw value of a secret MUST NOT be passed to an agent via chat, visible in its terminal output, or otherwise enter its context window. This is the primary mitigation for the agent context window being a critical in-memory leakage vector.

*   **Procedure PR2: Degraded Credential Handoff for Remote Agents.** For cloud-hosted or remote-VM agents that lack a native secret-injection channel, a project MAY define a tightly-scoped fallback handoff procedure for temporary credentials. This fallback MUST be treated as a degraded mode, not a compliant implementation of the Zero-Knowledge Principle. The handoff MUST use the shortest practical lifetime, MUST prefer scoped delegation (e.g., `aws sts assume-role`) over session credentials that inherit a user's full permissions, and MUST be documented as an exception path for platforms that cannot yet support PR1-style native secret handling.

*   **Credential Source Hierarchy.** When selecting a credential delivery pattern for agentic workflows, projects SHOULD prefer the following order:

    1.  **Native or Federated Temporary Credentials:** A platform-native secret injection channel, attached runtime role, workload identity, or federated login that keeps credential values out of chat and out of the agent's visible shell.
    2.  **Restricted Bootstrap Identity with Scoped Delegation:** A minimally privileged bootstrap identity that is used only to obtain a short-lived task role via a mechanism such as `aws sts assume-role`.
    3.  **Dedicated Restricted User with Temporary Session Credentials:** A dedicated IAM user whose standing permissions are already tightly limited to the task, combined with a short-lived session mechanism such as `aws sts get-session-token`.

    Projects MUST NOT treat option 3 as equivalent to option 2. It reduces credential lifetime, but it does not reduce permissions below those of the underlying IAM user.

*   **Access Pattern Decision Order.** Projects SHOULD document which of the
    following access patterns they permit:

    1.  Native secret injection, attached runtime roles, or federated temporary
        credentials.
    2.  Scoped delegation through a minimally privileged bootstrap identity.
    3.  A task-appropriate operating mode:
        Use Iterative Diagnostic Mode for low-risk, non-production,
        control-plane troubleshooting.
        Use Human-Gated Execution Mode for production, sensitive, data-plane,
        or destructive work.
    4.  Manual short-lived scoped credential handoff as a last resort.

#### P3: Automate Detection at Multiple Stages
Secret scanning MUST be automated both locally (pre-commit) and in the CI/CD pipeline to act as a layered defense against accidental commits.

*   **Procedure PR3: Baseline Management for Scanning.** To manage false positives from scanning tools (e.g., `detect-secrets`), a baseline of known, acceptable findings (e.g., in a `.secrets.baseline` file) MUST be generated and audited before implementing automated scanning. An agent MAY mechanically generate or refresh the baseline file only through the approved update procedure. The final audit, review, and acceptance of the baseline contents is a **human-gated action**; a human MUST make the final judgment call on whether to accept its contents.

#### P4: Human-in-the-Loop Verification
The developer MUST treat the agent as an untrusted party and verify the context and legitimacy of any request that involves credentials.

*(This principle is procedural in nature and is implemented by the developer's adherence to the other procedures, especially PR2 and PR3.)*

#### P5: Enforce a Documented Secret Lifecycle
All secrets MUST have a defined owner, a documented rotation schedule, and a clear procedure for revocation and replacement.

*   **Procedure PR4: Secret Rotation.** Secrets MUST be rotated according to the schedule defined in the project's Security Context Artifact.

### 6.2. Operational Modes

CLOAKD defines two practical operating modes so that teams can balance security
and iteration speed without treating all workflows as equivalent.

#### M1: Iterative Diagnostic Mode

This mode is intended for low-risk, non-production troubleshooting where fast
agent feedback loops are valuable.

*   Agents MAY use short-lived, tightly scoped diagnostic credentials when no
    native injection or federated path exists.
*   Diagnostic credentials SHOULD be limited to control-plane visibility (for
    example, `Describe*`, `List*`, narrowly scoped log inspection, and metadata
    reads).
*   Diagnostic credentials MUST NOT grant access to business data, secret
    material, or broad content retrieval paths (for example, `s3:GetObject`,
    database queries, `secretsmanager:GetSecretValue`, or secure parameter
    reads).
*   This mode SHOULD NOT be used for production changes, destructive actions,
    or operations that expose sensitive data.

#### M2: Human-Gated Execution Mode

This mode is intended for production systems, sensitive environments, data-plane
operations, and any action that mutates infrastructure or application state.

*   The agent MAY prepare code, scripts, infrastructure changes, and exact
    commands.
*   Execution MUST occur in a trusted local or otherwise controlled environment
    under human review using securely managed credentials.
*   Projects SHOULD default to this mode whenever the task involves sensitive
    data access, secret-adjacent operations, or destructive capabilities.

### 6.3. Enforcement Controls

#### E1: Pre-Commit Scanning
To prevent secrets from entering Git history, every local commit MUST be scanned. The scan SHOULD check for both high-entropy strings and known patterns (e.g., using `detect-secrets`).

#### E2: CI/CD Pipeline Scanning
To catch any secrets that bypass local scanning, every push and pull request MUST trigger a secret scanning job in the CI/CD pipeline. This scan SHOULD perform active verification of found credentials where possible (e.g., using `TruffleHog`), but it MUST NOT discard high-confidence findings solely because automated verification was unavailable or inconclusive.

#### E3: Alerting and Remediation
A verified, high-confidence secret finding from a CI/CD scan MUST trigger an automated, high-priority alert.

A high-confidence finding that could not be automatically verified MUST trigger
mandatory human review and bounded triage, even if it does not meet the bar for
an automated high-priority alert.

### 6.4. Security Context Artifact (SCA)

To ensure agents are programmatically aware of security constraints, projects MUST include a **Security Context Artifact (SCA)**. This is necessary because agents, unlike humans, lack durable memory between sessions; they start each task as a blank slate and must be re-primed with operational context. The SCA is the mechanism to overcome this inherent amnesia.

The SCA is implemented as a two-tier system:

1.  **A Standalone `SCA.md` File:** The full content of the SCA, containing all agent-facing rules and procedures, MUST be stored in a dedicated file within the project repository (e.g., `SCA.md` or `.github/SCA.md`). A reference template is provided in Appendix C.

2.  **A Mandatory Directive:** The platform's auto-loaded context mechanism MUST contain a non-optional directive instructing the agent to read and adhere to the `SCA.md` file before beginning any other action.

This two-tier pattern ensures the full SCA content is loaded reliably, even on platforms that do not natively auto-load a specific file for this purpose.

| Platform | Auto-Loaded Context Location | Example Directive |
| :--- | :--- | :--- |
| **Manus** | Project Instructions | `At the start of every task, you MUST read and adhere to the rules in /home/ubuntu/projects/your-project/SCA.md before taking any other action.` |
| **Claude Code** | `CLAUDE.md` | `This project is governed by the rules in SCA.md. Read and adhere to them.` |
| **GitHub Copilot** | `.github/copilot-instructions.md` | `All agent actions must comply with the rules defined in the project's SCA.md file.` |
| **Cursor** | `.cursorrules` | `rules: ["@SCA.md"]` |


## 7. A Call to Action for Native Secrets Management

This standard is a necessary stopgap. The procedures outlined are workarounds for a fundamental gap in current agentic tooling.

**CLOAKD formally calls upon the developers of agentic platforms to implement native secrets management appropriate to their architecture.**

*   **For Locally-Run Agents (e.g., Claude Code, Cursor):** These tools run on the user's machine and therefore *can* and *should* integrate directly with the host operating system's native keychain (macOS Keychain, Windows Credential Manager, etc.). This is an architecturally straightforward and achievable goal.

*   **For Cloud-Hosted Agents (e.g., Manus):** These tools run in a remote environment and cannot access the user's local OS keychain. Their providers MUST build an equivalent, secure secrets injection mechanism that allows users to store secrets in a managed vault and have them securely provided to the agent's environment at runtime, without the secret value ever traversing the chat interface or being stored on disk in the sandbox.

The ideal end-state for both architectures is a **zero-knowledge proxy model**, where the agent operates only on secret *names*, and a trusted proxy injects the real values at the transport layer, keeping them out of the agent's context entirely.

## 8. Compliance Model

Compliance is measured across a five-level maturity model.

*   **Level 1 (Basic):** Secrets are not stored in version control.
*   **Level 2 (Controlled Workflow):** The project documents an approved access-pattern decision order and uses at least one approved credential-requiring pattern appropriate to the task, such as native or federated delivery, scoped delegation, Iterative Diagnostic Mode, or Human-Gated Execution Mode. Any manual short-lived scoped credential handoff MUST be recorded as an explicit exception path rather than normal operation.
*   **Level 3 (Proactive Detection):** Automated pre-commit (E1) and CI/CD (E2) scanning are implemented.
*   **Level 4 (Managed Environment):** Local environment security (PR1) is enforced and degraded handoff paths are explicitly exception-only.
*   **Level 5 (Auto-Primed):** A Security Context Artifact (SCA) is implemented (6.4).

## 9. Trade-Off Analysis

*   **Security vs. Convenience:** The primary trade-off. This standard defines the minimum acceptable point on this spectrum for agentic development.
*   **Tool Specificity vs. Generality:** The standard recommends capabilities while providing concrete tools as examples, balancing applicability with practicality.

## 10. Consequences & Risks

*   **Adoption Friction:** The procedures introduce friction into the development workflow.
*   **False Positives:** Secret scanners can generate false positives, requiring disciplined, human-gated baseline management (PR3).
*   **Incomplete Coverage:** This standard focuses on credentials and does not mitigate all possible agent-related security risks.

## 11. Future Directions

*   **Native Platform Integration:** The ultimate future direction is the deprecation of this standard's procedural workarounds in favor of native secrets management as described in Section 7.
*   **Standardized SCA Format:** Development of a formal, cross-platform standard for the Security Context Artifact.

## 12. References

[1] Knostic. (2025, December 16). *From .env to Leakage: Mishandling of Secrets by Coding Agents*. [https://www.knostic.ai/blog/claude-cursor-env-file-secret-leakage](https://www.knostic.ai/blog/claude-cursor-env-file-secret-leakage)
[2] The Seventeen. (2026, March 1). *Agentic Secrets Infrastructure: The Missing Layer in Every AI Agent Stack*. [https://dev.to/the_seventeen/agentic-secrets-infrastructure-the-missing-layer-in-every-ai-agent-stack-42li](https://dev.to/the_seventeen/agentic-secrets-infrastructure-the-missing-layer-in-every-ai-agent-stack-42li)
[3] Wiggins, A. (n.d.). *The Twelve-Factor App*. [https://12factor.net/](https://12factor.net/)
[4] OWASP. (2025). *OWASP Top 10 for Large Language Model Applications*. [https://owasp.org/www-project-top-10-for-large-language-model-applications/](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
[5] Patons, O. (2026, February 11). *[FEATURE] Mark sensitive environment variables and file paths to prevent secret exposure*. GitHub Issue #25053. [https://github.com/anthropics/claude-code/issues/25053](https://github.com/anthropics/claude-code/issues/25053)
[6] OWASP. (2025). *OWASP Non-Human Identities Top 10*. [https://owasp.org/www-project-non-human-identities-top-10/](https://owasp.org/www-project-non-human-identities-top-10/)
[7] NIST. (2024). *AI Risk Management Framework (AI RMF 1.0)*. [https://www.nist.gov/itl/ai-risk-management-framework](https://www.nist.gov/itl/ai-risk-management-framework)
[8] chandika. (2026). *mirage-proxy*. GitHub. [https://github.com/chandika/mirage-proxy](https://github.com/chandika/mirage-proxy)

## Appendix A: Leakage Vectors & Mitigations

| Category | Vector | Mitigation |
| :--- | :--- | :--- |
| **On-Disk** | `.env` files | Pre-commit scanning (E1); SCA rule to block path. |
| | `~/.aws/credentials` | OS keychain integration (PR1, e.g., `aws-vault`). |
| | Shell History | OS keychain integration (PR1) prevents secrets in commands. |
| | Git History | Pre-commit scanning (E1) to block commit; `git-filter-repo` for remediation. |
| **In-Memory** | Agent Context Window | The core problem. Mitigated by all procedures working in concert, especially PR1 and PR2. |
| | Shell Environment | OS keychain integration (PR1) avoids `export`; degraded PR2 handoff should use scoped, short-lived credentials only when no native channel exists. |
| **Network** | Chat/Response History | PR2 does not prevent exposure; it only reduces persistence and blast radius by requiring scoped, short-lived credentials. |
| | CI/CD Logs | Proper scanner configuration; avoid echoing secrets in scripts. |

## Appendix B: Implementation Quickstart

This appendix provides an opinionated, step-by-step guide to implementing CLOAKD in a Manus-like remote-VM workflow using AWS and GitHub. It is intentionally a pragmatic example for platforms that do not yet provide native secret injection or vendor-supported federation, and therefore it demonstrates a degraded but more defensible operating pattern rather than the ideal end-state described in Section 7. Where stronger native, federated, or brokered options exist, they SHOULD be preferred over this quickstart.

### Step 1: Secure Local AWS Credentials (PR1)

**Goal:** Stop storing plaintext AWS credentials in `~/.aws/credentials`.

1.  **Install `aws-vault`:**

    ```bash
    # On macOS
    brew install aws-vault
    ```

2.  **Add a bootstrap identity to the vault:** Prefer a federated or otherwise
    minimally privileged bootstrap identity if your environment supports it. In
    Manus-like remote-VM workflows, this quickstart assumes you may need to use
    a dedicated restricted bootstrap identity as a practical fallback, not as
    the preferred default.

    ```bash
    aws-vault add your-profile-name
    ```

    This will prompt for the bootstrap credential material and store it
    securely in your OS keychain. If your environment supports a federated
    bootstrap flow instead of access keys, use that stronger pattern instead of
    creating a dedicated IAM user.

3.  **Configure and use a scoped role profile for local execution:**

    Add a role profile to your AWS config so local commands run under the
    assumed role rather than under the bootstrap identity itself:

    ```ini
    [profile scoped-role-profile]
    source_profile = your-profile-name
    role_arn = arn:aws:iam::123456789012:role/REPLACE_WITH_SCOPED_ROLE
    role_session_name = cloakd-local-session
    duration_seconds = 900
    ```

    ```bash
    aws-vault exec scoped-role-profile -- aws s3 ls
    ```

    For agent-facing workflows, prefer using this bootstrap identity only to
    obtain a tightly scoped task role rather than granting the bootstrap
    identity direct standing access to sensitive operations. Execute local
    commands through the scoped role profile rather than the bootstrap identity
    itself.

### Step 2: Set Up Pre-Commit Scanning (E1)

**Goal:** Automatically scan for secrets on every commit, before they enter Git history.

1.  **Install `detect-secrets` and `pre-commit`:**

    ```bash
    pip3 install detect-secrets pre-commit
    ```

2.  **Create a `.pre-commit-config.yaml` file** in your project root with this content:

    ```yaml
    repos:
      - repo: https://github.com/Yelp/detect-secrets
        rev: v1.5.0
        hooks:
          - id: detect-secrets
            args: ["--baseline", ".secrets.baseline"]
    ```

3.  **Install the Git hook:**

    ```bash
    pre-commit install
    ```

### Step 3: Generate and Audit the Baseline (PR3)

**Goal:** Create an initial set of allowed "secrets" to prevent the pre-commit hook from blocking on harmless false positives.

1.  **Generate the initial baseline file:**

    ```bash
    detect-secrets scan > .secrets.baseline
    ```

2.  **Audit the baseline interactively:** This is a **human-gated** step.

    ```bash
    detect-secrets audit .secrets.baseline
    ```

    For each finding, the tool will ask you to label it as a true or false positive. Be diligent. Once you have audited all findings, the pre-commit hook will only fail if *new* secrets are introduced.

### Step 4: Set Up CI/CD Scanning (E2)

**Goal:** Add a second layer of defense in your GitHub repository.

1.  **Create a `.github/workflows/trufflehog.yml` file** with this content:

    ```yaml
    name: Secret Scanning
    on: [push, pull_request]
    jobs:
      trufflehog:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
            with:
              fetch-depth: 0
          - uses: trufflesecurity/trufflehog@main
            with:
              extra_args: --results=verified,unknown
    ```

    This GitHub Action will run on every push and pull request, returning both
    verified findings and findings whose verification could not be completed.
    This preserves visibility into potentially valid secrets that a verifier
    could not conclusively check during the CI run.

### Step 5: Create and Reference the SCA (6.4)

**Goal:** Create a standalone `SCA.md` file and reference it from your platform's auto-loaded context.

1.  **Create an `SCA.md` file** in your project root with the content from Appendix C.

2.  **Add a mandatory directive** to your platform's auto-loaded context location, per the table in Section 6.4. For example, in Manus, you would add this to your Project Instructions:

    > At the start of every task, you MUST read and adhere to the rules in `/home/ubuntu/projects/your-project/SCA.md` before taking any other action.

## Appendix C: Reference Security Context Artifact (`SCA.md`)

This appendix provides a reference template for a Security Context Artifact, designed to be placed in a standalone `SCA.md` file and adapted to the project's actual secret inventory and workflows.

```markdown
# Project Security & Credential Handling (CLOAKD)

## Purpose

This document primes the agent with the security rules and procedures required by
CLOAKD. Agents lack durable memory between sessions; this file is the
mechanism for overcoming that amnesia and ensuring consistent, secure behavior
in every task.

## Agent Rules

You MUST adhere to the following rules at all times during this session:

1.  **Zero-Knowledge Principle.** Operate without ever needing to see the raw
    value of a secret. Use tools and procedures that manage secrets
    transparently on your behalf.

    If the platform lacks a native secret-injection mechanism and the project
    explicitly authorizes a degraded fallback handoff procedure, treat that
    procedure as an exception with elevated risk, not as normal operation.

2.  **Never Request Secrets.** Do not ask the user to provide any secret,
    password, token, or credential directly in chat during normal operation.
    If credentials are needed and the project explicitly permits the degraded
    fallback described below, state that this is an exception path with elevated
    risk and use the most constrained temporary credentials available.

3.  **Never Persist Secrets.** Do not write secrets to disk, include them in
    log output, print them to the console, embed them in code, or save them in
    any file — including temporary files.

4.  **Treat Yourself as Untrusted.** Assume that your context window, your
    tool outputs, and your response history may be observed. Behave accordingly.

5.  **Respect Human Gates.** Certain actions — such as auditing a secrets
    baseline — require human judgment. You may prepare the command, but you
    MUST ask the user to execute it and make the final decision.

## Sensitive Leakage Vectors

The following patterns represent high-risk leakage vectors. You MUST NOT read,
cat, echo, or otherwise inspect their contents unless a later procedure in this
document explicitly allows a limited interaction.

### Files

| Pattern | Rationale |
| :--- | :--- |
| `.env*` | Plaintext environment files containing credentials. |
| `*.pem`, `*.key` | Private key files. |
| `*credentials*` | Credential configuration files (e.g., `~/.aws/credentials`). |
| `.secrets.baseline` | Contains a catalogue of detected secrets in the codebase; agents MAY update it only through the approved baseline-refresh command and MUST NOT read, summarize, classify, or audit its findings. |
| `*.p12`, `*.pfx` | Certificate stores that may contain private keys. |
| `*_rsa`, `*_ed25519` | SSH private key files. |

### Environment Variables

| Pattern | Rationale |
| :--- | :--- |
| `*_SECRET` | Convention for secret values. |
| `*_KEY` | Convention for API and access keys. |
| `*_TOKEN` | Convention for bearer and session tokens. |
| `*_PASSWORD` | Convention for passwords. |
| `*_PRIVATE_*` | Convention for private key material. |

### Commands to Avoid

| Command | Rationale |
| :--- | :--- |
| `export SECRET=...` | Writes the secret to shell history and the environment. |
| `echo $SECRET` | Prints the secret to stdout, which enters the context window. |
| `cat .env` | Reads a sensitive file into the context window. |
| `history` | May reveal past commands that contained secrets. |
| `env` or `printenv` | Dumps all environment variables, which may include secrets. |

## Approved Procedures

### Operating Mode Selection

Before requesting credentials or preparing a sensitive action, choose the
operating mode that matches the task:

1.  **Iterative Diagnostic Mode:** Use only for low-risk, non-production,
    control-plane troubleshooting where fast agent iteration is valuable.
    If credentials are needed, use the narrowest short-lived diagnostic scope
    available and avoid business-data access, secret retrieval, or destructive
    actions.
2.  **Human-Gated Execution Mode:** Use for production systems, sensitive
    environments, data-plane access, or any destructive or state-changing work.
    In this mode, prepare code or commands for human review and local execution
    rather than expecting the agent to perform the sensitive step directly.

### Requesting AWS Credentials (PR2)

If you need AWS credentials to perform a task on a cloud-hosted or remote-VM
agent that has no native secrets channel, first inform the user that this is a
degraded fallback with elevated exposure risk. Then present the user with this
instruction template and ask them to replace the placeholders with a
least-privilege role and the shortest practical duration:

> "To proceed on this remote agent, I need short-lived, scoped AWS credentials.
> This is a degraded fallback until the platform supports native secret
> injection. Use this path only if no native or federated mechanism is
> available. Please assume a least-privilege role and provide only the resulting
> temporary credentials for this single task.
>
> ```
> aws-vault exec your-profile-name -- aws sts assume-role \
>   --role-arn arn:aws:iam::123456789012:role/REPLACE_WITH_SCOPED_ROLE \
>   --role-session-name cloakd-agent-session \
>   --duration-seconds 900
> ```
>
> Please send only the resulting `AccessKeyId`, `SecretAccessKey`, and
> `SessionToken`, and only for the minimum time needed to complete this task.
> Do not treat this as a normal or reusable workflow. These credentials should
> expire as quickly as your workflow allows."

Do NOT suggest `aws sts get-session-token` when a scoped role can be assumed.
If a scoped role does not exist, stop and ask the user to provision one rather
than defaulting to broader credentials.

### Credential Selection Order

When choosing an AWS access pattern for an agented workflow, apply this order:

1.  **Prefer a native runtime or federated identity path.** If the platform or
    environment can provide temporary credentials without exposing them in chat
    or shell output, use that mechanism instead of any manual handoff.
2.  **Otherwise prefer scoped delegation.** Use a minimally privileged
    bootstrap identity only to assume a tightly scoped task role with a short
    duration.
3.  **Use a dedicated restricted IAM user only as a last fallback.** If no
    role assumption or federated path exists, the standing permissions of that
    IAM user MUST already be tightly limited to the intended task before any
    temporary session is created from it.

This order exists because short-lived credentials and least-privilege
credentials solve different problems. Short lifetime reduces persistence after
exposure; scoped delegation reduces blast radius during the credential's valid
lifetime.

### Updating the Secrets Baseline (PR3)

If the pre-commit hook fails due to a new finding that appears to be a false
positive, guide the user as follows:

> "The pre-commit scan has flagged a new finding. To update the baseline,
> please run these commands in your terminal:
>
> ```
> detect-secrets scan --baseline .secrets.baseline
> detect-secrets audit .secrets.baseline
> ```
>
> The audit step will ask you to classify each finding. This is a human-gated
> action — please review each one carefully before accepting."

You MAY instruct or execute the approved baseline-refresh command, but you MUST
NOT inspect the resulting `.secrets.baseline` contents, summarize its findings,
or perform the audit on the user's behalf.

Do NOT run `detect-secrets audit` yourself.

### Secret Rotation (PR4)

When a secret approaches its rotation date, or when you are informed that a
secret may have been compromised, remind the user of the rotation procedure
and offer to help with the non-sensitive steps (e.g., updating configuration
files to reference a new secret name, but not handling the secret value
itself).

## Secret Inventory Requirements

The project MUST maintain a machine-readable or human-readable inventory of the
secrets and delegated credential classes this agented workflow depends on. For
each secret or credential class, record at minimum:

| Field | Requirement |
| :--- | :--- |
| Owner | The team or individual accountable for the secret. |
| Scope | The systems, roles, or APIs the secret can access. |
| Rotation Interval | The maximum allowed age before rotation. |
| Revocation Procedure | How to disable or invalidate the secret. |
| Replacement Procedure | How to issue a new secret or update the delegated role. |

If this inventory is missing, remind the user that the project is not fully
compliant with PR4/P5.

### Example Secret Inventory Entry

| Secret / Credential Class | Owner | Scope | Rotation Interval | Revocation Procedure | Replacement Procedure |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `temporary-staging-deploy-session` | Platform Engineering | Short-lived assumed-role credential used to read deployment metadata for service `payments-api` in the staging AWS account | 30 days for role review; 15-minute session lifetime | Disable the underlying IAM role or remove the bootstrap identity's ability to assume it | Create a replacement least-privilege role, update the trusted bootstrap identity, and update the role ARN in the agent handoff procedure |

## Emergency Stop

If you believe you have accidentally been exposed to a live credential — for
example, if a user pastes one into chat, or if a command unexpectedly outputs
a secret value — you MUST immediately:

1.  Inform the user: "**EMERGENCY STOP: I have been exposed to a potential
    credential. Please revoke it immediately and rotate to a new one.**"
2.  Cease all other operations until the user confirms the credential has been
    revoked.
3.  Do not use, store, or repeat the credential value for any purpose.
```
