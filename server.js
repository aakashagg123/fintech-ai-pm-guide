import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

app.post("/api/learning-path", async (req, res) => {
  const { role, experience, domain, goals } = req.body;

  if (!role || !experience || !domain || !goals) {
    return res.status(400).json({ error: "All fields are required." });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const systemPrompt = `You are a world-class AI product management coach specialising in Indian fintech and India's regulated digital financial infrastructure.
You produce highly structured, deeply specific learning paths for product managers transitioning into AI-powered product roles within India's financial ecosystem.
Your output is always in rich markdown with clear headers, bullet points, week-by-week plans, and concrete deliverables.
You are opinionated, precise, and avoid generic advice. Every recommendation is grounded in real India fintech patterns — referencing UPI/NPCI infrastructure, RBI regulations, Account Aggregator framework, NBFC digital lending, and the India Stack.`;

  const userPrompt = `Generate a personalised 12-week AI PM learning path for the following person.

Role: ${role}
Current AI/ML experience: ${experience}
Primary product domain: ${domain}
Learning goals: ${goals}

Structure your response as follows:

## Your AI PM Learning Path
_One sentence framing their specific journey._

## Week-by-Week Plan
For each week (1–12), provide:
- **Week N: [Theme]**
  - Focus: 1 sentence on what this week builds
  - Learn: 2–3 specific concepts, papers, or frameworks
  - Do: 1–2 concrete actions (write a doc, run an eval, shadow a call, etc.)
  - Deliverable: what they should have at the end of the week

## Domain-Specific Architecture Patterns to Master
3–5 India fintech AI patterns directly relevant to their domain (e.g. AA-powered RAG for RBI policy retrieval, CKYC/PMLA guardrails, NBFC underwriting with CIBIL integration, UPI real-time fraud scoring, BRE + LLM hybrid for NBFC credit decisioning).

## Key Stakeholder Conversations to Have
4–6 specific conversations, with who and what to discuss.

## Capstone Project
One concrete project idea that would demonstrate AI PM fluency in their specific domain. Include scope, success metrics, and a one-paragraph pitch.

## 3 Red Flags to Watch For
The most common mistakes a PM at this stage makes in their domain.

Be extremely specific. Reference real India fintech patterns, real metrics (e.g. "p95 < 300ms on NPCI rails", "CIBIL bureau hit rate > 95%", "AA consent completion rate > 80%", "MITC disclosure rate 100%"), and real Indian regulatory concepts (DPDP Act 2023, RBI Digital Lending Guidelines 2022, PMLA, FEMA, RBI AA Master Direction, Credit Information Companies Act, RBI Fair Practices Code, NPCI UPI framework, NACH regulations) as relevant to their specific domain. No generic global advice.`;

  try {
    const stream = client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    stream.on("text", (text) => {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    });

    await stream.finalMessage();
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("Claude API error:", err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(
    `Make sure ANTHROPIC_API_KEY is set in your environment before starting.`
  );
});
