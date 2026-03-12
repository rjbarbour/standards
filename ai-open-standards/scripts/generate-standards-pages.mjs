import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(siteRoot, "..");
const pagesDir = path.join(siteRoot, "src", "pages");

const standards = [
  {
    source: path.join(repoRoot, "OSSS", "osss-proposal.md"),
    output: path.join(pagesDir, "osss-proposal.md"),
    title: "OSSS — Open Specification Structure Standard",
    description: "an anti-bikeshedding tool for standards projects",
  },
  {
    source: path.join(repoRoot, "README.llms-vNext", "readme-llm-vnext.md"),
    output: path.join(pagesDir, "readme-llm-vnext.md"),
    title: "README.llm vNext",
    description: "structured, LLM-oriented documentation file hierarchy",
  },
  {
    source: path.join(repoRoot, "AXON", "axon-v3-proposal.md"),
    output: path.join(pagesDir, "axon-v3-proposal.md"),
    title: "AXON: Agentic Context Orchestration Nexus",
    description: "a standard for structuring internal project context for AI agents",
  },
  {
    source: path.join(repoRoot, "cloakd", "cloakd-v1.0.md"),
    output: path.join(pagesDir, "cloakd-v1.0.md"),
    title: "CLOAKD: Cloaking Secrets from Agentic AI",
    description: "a security standard for credential handling in agentic development environments",
  },
];

function buildFrontmatter({ title, description, source }) {
  const sourcePath = path.relative(siteRoot, source).replaceAll(path.sep, "/");
  return [
    "---",
    "layout: ../layouts/BaseLayout.astro",
    `title: "${title}"`,
    `description: "${description}"`,
    "---",
    "",
    `<!-- GENERATED FILE: edit ${sourcePath} -->`,
    "",
  ].join("\n");
}

async function generatePage(standard) {
  const sourceBody = await readFile(standard.source, "utf8");
  const output = `${buildFrontmatter(standard)}${sourceBody.replace(/\s*$/, "\n")}`;
  await writeFile(standard.output, output, "utf8");
}

await mkdir(pagesDir, { recursive: true });
await Promise.all(standards.map(generatePage));
