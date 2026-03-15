/* ─── Section 6: Product Stack node data ─── */
const nodeData = {
  entry: {
    title: "Customer Intent Intake",
    purpose: "Capture customer goal, account context, and consent boundary before any AI action.",
    metric: "Intent-to-resolution rate",
    risk: "Missing context causing wrong account action",
    lever: "Segment-aware intake forms and mandatory context checks",
  },
  safety: {
    title: "KYC/AML & Policy Guardrails",
    purpose: "Apply KYC, AML, sanctions, consent, and privacy checks before and after generation.",
    metric: "Regulatory policy breach rate",
    risk: "Non-compliant outputs or actions in regulated flows",
    lever: "Policy engines, transaction classifiers, and human escalation",
  },
  router: {
    title: "Risk-Based Routing",
    purpose: "Route requests by risk tier: deterministic rules, narrow model, or expert review.",
    metric: "Approved decision cost per case",
    risk: "High-risk cases handled with low-control path",
    lever: "Risk scoring, confidence gates, and route-level SLOs",
  },
  retrieval: {
    title: "Policy + Ledger Retrieval",
    purpose: "Fetch current policies, transaction history, and account-specific facts for grounding.",
    metric: "Cited-answer coverage",
    risk: "Stale policy snippets causing incorrect recommendations",
    lever: "Data freshness SLAs, access controls, and reranking",
  },
  model: {
    title: "Decision Intelligence Model",
    purpose: "Generate explanations, recommendations, and next-best actions with constraints.",
    metric: "Decision accuracy under policy constraints",
    risk: "Uneven quality across customer cohorts",
    lever: "Model portfolio strategy, prompt governance, and eval gates",
  },
  tools: {
    title: "Core Banking/Payments APIs",
    purpose: "Execute deterministic actions like dispute filing, payment updates, and account changes.",
    metric: "Action success with zero unauthorized changes",
    risk: "Incorrect transaction side effects",
    lever: "Scoped permissions, maker-checker approvals, and idempotent calls",
  },
  response: {
    title: "Decision Explanation Layer",
    purpose: "Convert model/tool outputs into customer-safe explanations with traceable references.",
    metric: "Customer trust + assisted resolution rate",
    risk: "Overconfident language without traceability",
    lever: "Citations, confidence labels, and escalation-to-agent UX",
  },
  feedback: {
    title: "Monitoring, Audit, and Evaluation Loop",
    purpose: "Evaluate quality, fairness, fraud leakage, and policy compliance from live signals.",
    metric: "Pre-release regression catch rate",
    risk: "Drift in fraud/compliance behavior across segments",
    lever: "Golden datasets, audit trails, and model risk committee reviews",
  },
};

/* ─── Section 7: Tradeoff Simulator patterns ─── */
const patterns = [
  {
    name: "Real-Time Servicing Copilot",
    when: (v) => v.latency >= 4 && v.risk <= 3,
    reason:
      "You need rapid customer support flows. Favor low-latency assistance with strict deterministic fallback paths.",
    actions: [
      "Use intent routing and aggressive cache for known intents",
      "Keep high-risk actions human-confirmed",
      "Set route-level latency budgets and fallback thresholds",
    ],
  },
  {
    name: "Compliance-First Fintech Assistant",
    when: (v) => v.risk >= 4,
    reason:
      "Compliance and fraud controls dominate. Architect for auditability and constrained decisioning before scale.",
    actions: [
      "Add KYC/AML/sanctions checks pre- and post-generation",
      "Require citations and analyst approval for sensitive actions",
      "Track policy violations and false approvals as release gates",
    ],
  },
  {
    name: "Underwriting Intelligence Mode",
    when: (v) => v.quality >= 4 && v.cost <= 3,
    reason:
      "Credit/underwriting quality is strategic and budget allows deeper orchestration.",
    actions: [
      "Use policy retrieval + tool augmentation + selective large-model calls",
      "Invest in cohort-level fairness and explainability evals",
      "Run champion/challenger experiments on routing and prompts",
    ],
  },
  {
    name: "Cost-Efficient Operations Assistant",
    when: (v) => v.cost >= 4,
    reason:
      "Unit economics are tight. Emphasize deterministic flows and reserve expensive model usage for complex cases.",
    actions: [
      "Gate expensive model calls behind confidence + value thresholds",
      "Use rules/templates for repetitive servicing intents",
      "Track cost per resolved case and per prevented escalation",
    ],
  },
  {
    name: "Balanced Fintech RAG Assistant",
    when: () => true,
    reason:
      "A practical starting point for fintech PM teams: grounded responses, measurable control, and manageable spend.",
    actions: [
      "Start with policy retrieval + single model + guardrail layer",
      "Define latency/quality/compliance SLOs before launch",
      "Run weekly eval and model risk incident reviews",
    ],
  },
];

/* ─── SVG Diagram Inspector Data ─── */
const diagramData = {
  web: {
    browser: {
      type: "client",
      title: "Browser (HTTP Client)",
      desc: "The browser initiates every web interaction as an HTTP request and renders the response. Your AI feature's frontend — whether a chat UI, a decision summary panel, or a servicing widget — runs here.",
      analogy: "The branch teller window: customer-facing, handles display, forwards requests to back-office.",
      pmInsight: "Slow time-to-first-token feels broken even if the model is fast. Own the frontend streaming experience — progressive rendering cuts perceived latency by 40–60%.",
      questions: ["Does the UI render streaming responses or wait for completion?", "What is the p95 time-to-first-byte from the customer's region?"],
      metric: "Time-to-first-token (TTFT)",
      slo: "< 800ms perceived wait before first text appears",
    },
    cdn: {
      type: "cache",
      title: "CDN (Edge Cache)",
      desc: "A CDN caches static assets (JS, CSS, images) at geographically distributed edge nodes. Dynamic AI responses are not cached here, but the app shell that loads your AI feature is.",
      analogy: "Regional processing centres: static materials live close to the customer, reducing round-trip time.",
      pmInsight: "A slow-loading app shell kills trust before the model even responds. Ensure CDN coverage for your primary customer geographies before launch.",
      questions: ["Are static assets served from the nearest edge PoP?", "What is the cache-hit rate for the app shell?"],
      metric: "Cache-hit rate for static assets",
      slo: "> 95% cache-hit rate globally",
    },
    server: {
      type: "server",
      title: "App Server (Business Logic)",
      desc: "The app server runs your business logic: it validates the request, calls the LLM API, applies guardrails, and formats the response. This is where prompt construction, context injection, and policy checks happen.",
      analogy: "The back-office operations team: receives the request, applies rules, coordinates data, returns the outcome.",
      pmInsight: "The app server is your primary latency lever after the model. Prompt construction, policy retrieval, and guardrail evaluation all add time here. Profile each step before setting SLOs.",
      questions: ["What is the p95 server-side latency excluding model inference?", "Where do guardrail checks run — pre-model, post-model, or both?"],
      metric: "Server-side processing latency (excl. model)",
      slo: "< 100ms for orchestration overhead",
    },
    db: {
      type: "database",
      title: "Database (Persistent Store)",
      desc: "The database persists all durable state: customer profiles, conversation history, audit logs, model decisions, and compliance records. In a regulated fintech, the database is the source of truth for every AI action.",
      analogy: "The core ledger system: every transaction, decision, and customer record lives here and must be auditable.",
      pmInsight: "Audit trail completeness is a regulatory requirement, not a nice-to-have. Every AI decision that affects a customer's account must be logged with the model version, prompt hash, and timestamp.",
      questions: ["Are AI decisions stored with model version and prompt context?", "What is the data retention period for AI audit logs?"],
      metric: "Audit log completeness rate",
      slo: "100% of AI decisions logged with full context",
    },
    cache: {
      type: "cache",
      title: "Cache (Redis / In-Memory)",
      desc: "In-memory caches like Redis store hot data — user sessions, recent decisions, frequent policy lookups — to avoid expensive database reads on every request. Cache-hit rate directly controls p95 latency.",
      analogy: "The teller's reference sheet: common answers are at hand, so each customer doesn't trigger a full back-office lookup.",
      pmInsight: "Cache your most expensive retrieval paths: system prompts, static policy snippets, and user session context. A 70% cache-hit rate on a 200ms DB read saves 140ms per request.",
      questions: ["What is the cache-hit rate for policy and context lookups?", "What is the TTL strategy — do stale policy caches create compliance risk?"],
      metric: "Cache-hit rate for context lookups",
      slo: "> 70% hit rate; TTL aligned with policy update cadence",
    },
  },

  apis: {
    client: {
      type: "client",
      title: "Client App (Mobile / Web)",
      desc: "The customer-facing application that collects intent, displays AI outputs, and renders explanations. In fintech, this is often a mobile app or embedded widget within an existing banking product.",
      analogy: "The branch customer: initiates the request and receives the outcome.",
      pmInsight: "The client app defines the customer experience. Design for degraded-mode UX: what does the customer see when the AI pipeline is slow or unavailable? Always have a deterministic fallback.",
      questions: ["Is there a fallback UI for when AI is unavailable?", "What is the escalation path from the AI response to a human agent?"],
      metric: "AI feature availability rate",
      slo: "> 99.9% availability with deterministic fallback",
    },
    gateway: {
      type: "server",
      title: "API Gateway (Auth + Routing)",
      desc: "The gateway is the single entry point for all API calls. It enforces authentication, rate limiting, and request routing before any domain service sees the traffic. Compliance middleware and PII redaction often sit here.",
      analogy: "The security checkpoint at the branch entrance: verify identity, check permissions, then route to the right desk.",
      pmInsight: "Gate-level rate limits protect downstream services from prompt injection floods and model abuse. Work with your platform team to set per-customer and per-feature rate limits before launch.",
      questions: ["Are rate limits set per customer segment and per AI feature?", "Does the gateway redact PII before it reaches the model service?"],
      metric: "Gateway-level policy enforcement rate",
      slo: "100% of requests authenticated and rate-limited before model access",
    },
    "auth-service": {
      type: "server",
      title: "Auth Service (JWT / OAuth 2)",
      desc: "Verifies customer and service identity using JWT tokens or OAuth 2.0 flows. Every AI action that touches customer data must be authorised — no anonymous model calls in a regulated environment.",
      analogy: "The ID verification desk: every person must show valid credentials before accessing their account.",
      pmInsight: "Token scope is a compliance control. Ensure AI service accounts request only the minimum data permissions needed for the feature — over-permissioned service accounts are a regulatory audit finding.",
      questions: ["What scopes does the AI service account hold?", "Are token expiry and refresh policies aligned with session risk level?"],
      metric: "Auth failure rate and scope audit coverage",
      slo: "Zero over-permissioned service tokens in production",
    },
    "policy-engine": {
      type: "server",
      title: "Policy Engine (KYC / Rules)",
      desc: "Applies deterministic business rules: KYC status checks, AML transaction flags, credit policy limits, and sanctions screening. The policy engine gates what the AI is allowed to recommend or execute.",
      analogy: "The compliance officer: reviews every request against the rulebook before it proceeds.",
      pmInsight: "The policy engine must run before and after the model — pre-model to restrict input scope, post-model to validate output safety. Treating it as an afterthought is the most common architecture mistake in regulated AI.",
      questions: ["Does the policy engine gate model input, model output, or both?", "How quickly can new policy rules be deployed without a model retrain?"],
      metric: "Policy violation detection rate",
      slo: "< 0.1% undetected policy breach rate at launch",
    },
    "product-service": {
      type: "server",
      title: "Product Service (Payments / Credit)",
      desc: "Domain services that own the core product logic: payments execution, credit decisioning, account management. AI orchestration calls these services to take real-world actions — they must be idempotent and support maker-checker patterns.",
      analogy: "The specialist desks in the branch: payments, lending, and accounts each handle their domain.",
      pmInsight: "Define the exact API surface AI can call before engineering starts. Every field the AI can read is a data governance decision; every action it can execute is a risk decision. Write these boundaries into the feature spec.",
      questions: ["Which product service endpoints can the AI call autonomously vs. with human approval?", "Are all AI-initiated transactions idempotent?"],
      metric: "Unauthorised action rate",
      slo: "Zero AI-initiated actions outside defined permission scope",
    },
    aggregator: {
      type: "server",
      title: "Aggregator (Compose Response)",
      desc: "Collects responses from multiple microservices, merges them into a coherent payload, and returns it to the client or AI orchestration layer. Aggregators hide service complexity from the model.",
      analogy: "The relationship manager: pulls together information from all departments before presenting to the customer.",
      pmInsight: "Aggregator latency is cumulative — it blocks on the slowest upstream service. Identify your critical path services and set individual p95 SLOs for each before defining the end-to-end SLO.",
      questions: ["What is the slowest upstream service in the aggregation path?", "Are parallel service calls used where upstream dependencies allow?"],
      metric: "Aggregation p95 latency",
      slo: "< 200ms aggregation overhead on the critical path",
    },
  },

  "ai-blocks": {
    input: {
      type: "client",
      title: "Text Input (User Prompt)",
      desc: "The raw text submitted by a customer or system, before any processing. In fintech, input often contains sensitive data: account numbers, transaction amounts, personal details. PII handling begins here.",
      analogy: "The customer's written request handed to the teller — raw, unprocessed, may contain sensitive information.",
      pmInsight: "Require PII detection and redaction before the prompt reaches the model. Define your input validation schema: what fields are allowed, what lengths are acceptable, what formats trigger policy blocks.",
      questions: ["Where does PII redaction happen — client-side, gateway, or app server?", "What is the maximum prompt length the product allows?"],
      metric: "PII leak rate into model context",
      slo: "Zero PII reaching the model without explicit data classification approval",
    },
    tokenizer: {
      type: "server",
      title: "Tokenizer (BPE / tiktoken)",
      desc: "Converts text into tokens — sub-word units that the transformer processes. ~0.75 words per token on average. Tokenisation determines your effective context window and directly drives inference cost.",
      analogy: "The document scanner: converts the customer's request into a format the processing system understands.",
      pmInsight: "Token count = cost. A 2,000-word system prompt costs 2,667 tokens on every single request. Audit your system prompt token usage before launch and quarterly thereafter.",
      questions: ["What is the average token count per request in your feature?", "Is there a token budget alert when system prompts exceed a cost threshold?"],
      metric: "Average input tokens per request",
      slo: "Track cost-per-request; alert if system prompt exceeds 20% of token budget",
    },
    transformer: {
      type: "ai",
      title: "Transformer (Self-Attention)",
      desc: "The neural network that processes tokens through multiple attention layers. Self-attention lets every token attend to every other token — this is what enables contextual understanding but also why long contexts cost more (attention scales quadratically with context length).",
      analogy: "The expert analyst: reads the full context, weighs every piece of information, and generates a nuanced response.",
      pmInsight: "Model inference is typically 60–80% of your end-to-end latency. You cannot speed it up directly — your levers are context length (shorter = faster), model size (smaller = faster), and output streaming.",
      questions: ["What model are you using, and what is its p95 inference latency at your expected token volume?", "Are you streaming output, or blocking on the full response?"],
      metric: "Model inference latency (p50 / p95)",
      slo: "p95 inference < 3s for servicing use cases; stream output for > 500 token responses",
    },
    output: {
      type: "server",
      title: "Token Output (Sampled Text)",
      desc: "The model's generated tokens, sampled from a probability distribution. Temperature controls randomness; top-p and top-k constrain the sampling space. In regulated fintech, low temperature and constrained sampling improve consistency.",
      analogy: "The drafted response from the expert: probabilistic, context-dependent, needs review before sending.",
      pmInsight: "Set temperature to 0.0–0.3 for factual, policy-grounded outputs in regulated contexts. Higher temperature is appropriate for creative copy but not for credit decisions or compliance explanations.",
      questions: ["What temperature and sampling parameters are set for your production prompt?", "Are output constraints applied to prevent the model from generating prohibited content types?"],
      metric: "Output consistency rate across identical inputs",
      slo: "Temperature ≤ 0.2 for any output affecting a regulated decision",
    },
    embedder: {
      type: "ai",
      title: "Embedder (text-embedding)",
      desc: "A separate model that converts text into a fixed-dimension vector representing its semantic meaning. Embeddings power similarity search: the closer two vectors, the more semantically similar the texts. Foundation of every RAG pipeline.",
      analogy: "The indexing librarian: reads every document, assigns coordinates in a semantic space, so related materials can be found quickly.",
      pmInsight: "Embedding model choice affects retrieval quality, not generation quality. A domain-specific financial embedding model will outperform a general-purpose one for policy retrieval — this is worth A/B testing.",
      questions: ["Is the embedding model domain-adapted for financial text?", "What is the re-embedding cost when source documents update?"],
      metric: "Retrieval precision@k for policy queries",
      slo: "Precision@5 > 0.85 on a golden evaluation set of policy questions",
    },
    "vector-store": {
      type: "database",
      title: "Vector Store (pgvector / Pinecone)",
      desc: "A database optimised for storing and querying high-dimensional vectors using approximate nearest-neighbour (ANN) search. Returns the top-k most semantically similar chunks to a query in milliseconds.",
      analogy: "The semantic filing cabinet: documents organised by meaning, not by keyword, so related policies surface even when exact words don't match.",
      pmInsight: "Vector store latency is part of your RAG pipeline's critical path. pgvector adds ~5–20ms on PostgreSQL; purpose-built stores like Pinecone add ~10–30ms. Both are acceptable; choose based on your existing infrastructure.",
      questions: ["What is the p95 ANN query latency at your expected index size?", "Is the vector store replicated and backed up with the same SLA as your production database?"],
      metric: "ANN query latency and index freshness",
      slo: "< 30ms p95 retrieval; index updates within 1 hour of source document changes",
    },
  },

  rag: {
    docs: {
      type: "client",
      title: "Source Documents (Policy / Ledger)",
      desc: "The authoritative source data: credit policy documents, regulatory guidelines, product terms, transaction records, and knowledge base articles. Data quality here directly determines answer quality downstream.",
      analogy: "The policy library and ledger room: every rulebook and account record that the bank relies on.",
      pmInsight: "You own the data pipeline, not just the model. If source documents are stale, ambiguous, or inconsistently formatted, the RAG system will produce wrong answers regardless of model quality.",
      questions: ["Who is the data owner for each source document type?", "What is the SLA for reflecting a policy change in the vector store?"],
      metric: "Source document freshness lag",
      slo: "Policy documents re-ingested within 24h of any change",
    },
    chunker: {
      type: "server",
      title: "Chunker (Split + Overlap)",
      desc: "Splits documents into overlapping text segments optimised for embedding and retrieval. Chunk size (typically 256–512 tokens) and overlap (10–15%) are hyperparameters that significantly affect retrieval quality.",
      analogy: "The document preparation team: breaks long policy documents into manageable sections with context preserved at boundaries.",
      pmInsight: "Chunking strategy is a product decision with compliance implications. Too-large chunks dilute relevance scores; too-small chunks lose context and produce incomplete policy citations. Run an eval before setting these parameters.",
      questions: ["Has the chunking strategy been evaluated against a golden set of policy questions?", "Are chunk boundaries aware of document structure (sections, tables, numbered clauses)?"],
      metric: "Chunk-level retrieval precision",
      slo: "Evaluate chunking strategy against 50+ golden policy Q&A pairs before production",
    },
    "embedder-ing": {
      type: "ai",
      title: "Embedder — Ingestion (Batch Encoding)",
      desc: "During ingestion, the embedding model encodes every chunk into a vector in batch mode. This is an offline, asynchronous process — it does not affect query latency but does affect how quickly policy updates are reflected.",
      analogy: "The indexing run: every new document gets a semantic fingerprint added to the catalogue overnight.",
      pmInsight: "Batch re-ingestion cost and latency determines how quickly policy changes are live in the RAG system. If re-ingesting 10,000 chunks takes 4 hours, that is your policy update lag — budget accordingly.",
      questions: ["What is the total re-ingestion time for a full corpus refresh?", "Is incremental ingestion supported, or must the full corpus be re-embedded on any change?"],
      metric: "Re-ingestion pipeline throughput",
      slo: "Incremental updates ingested within 1 hour; full refresh < 4 hours",
    },
    "vector-db": {
      type: "database",
      title: "Vector Store (pgvector / Qdrant)",
      desc: "Stores chunk embeddings and their metadata (source document, section, date, policy version). Serves ANN queries at retrieval time. Index health, freshness, and access controls are critical for a production RAG system.",
      analogy: "The indexed archive: chunks stored by semantic similarity, with metadata linking back to the source document and version.",
      pmInsight: "The vector store must be treated as a regulated data store. Access controls, audit logs, and version tracking for ingested content are compliance requirements in many jurisdictions.",
      questions: ["Are access controls on the vector store equivalent to those on the source documents?", "Is the chunk-to-source-document mapping auditable for regulatory review?"],
      metric: "Index freshness and access audit coverage",
      slo: "Full access audit trail; index freshness SLA aligned with policy update SLA",
    },
    query: {
      type: "client",
      title: "User Query",
      desc: "The customer's or agent's question at runtime. This is embedded and matched against the stored chunks to retrieve relevant context. Query quality (specificity, completeness) affects retrieval quality.",
      analogy: "The customer's question at the service desk: the more specific, the better the answer.",
      pmInsight: "Poorly phrased queries return irrelevant chunks, producing wrong answers. Consider query expansion or reformulation for complex domains. Log queries in production to identify retrieval failure patterns.",
      questions: ["Are low-confidence retrievals flagged for human review?", "Is query logging in place to identify systematic retrieval failures?"],
      metric: "Query intent coverage rate",
      slo: "Log all queries; review low-confidence retrievals weekly",
    },
    retriever: {
      type: "server",
      title: "Retriever (ANN Search)",
      desc: "Embeds the query at runtime and performs approximate nearest-neighbour search against the vector store to return the top-k most relevant chunks. Retrieval latency is typically 10–50ms.",
      analogy: "The research assistant: given the question, pulls the most relevant policy sections from the archive in seconds.",
      pmInsight: "Top-k is a product tradeoff: more chunks means more context (better answer quality) but more tokens (higher cost and latency). Start with k=5 and tune based on eval results.",
      questions: ["What value of k is used, and has it been evaluated against quality and cost tradeoffs?", "Is hybrid retrieval (semantic + keyword) used for queries with specific policy identifiers?"],
      metric: "Retrieval precision@k",
      slo: "Precision@5 > 0.85 on evaluation set; p95 retrieval latency < 30ms",
    },
    reranker: {
      type: "ai",
      title: "Reranker (Cross-Encoder)",
      desc: "A second-pass model that re-scores retrieved chunks for relevance using the full query context. More accurate than embedding similarity alone, but adds 30–80ms latency. Critical when policy answer accuracy is a compliance requirement.",
      analogy: "The senior reviewer: takes the shortlisted documents and re-ranks them by true relevance to the specific question.",
      pmInsight: "Reranking is worth the latency cost in any use case where incorrect policy citations have compliance consequences (credit decisions, regulatory Q&A, claims). Build it in from launch rather than retrofitting.",
      questions: ["Is reranking enabled for all policy queries, or only high-stakes ones?", "Has the reranker been evaluated against the base retriever on your domain-specific eval set?"],
      metric: "Post-rerank precision gain vs. base retriever",
      slo: "Reranking should improve precision@3 by ≥ 10% on eval set to justify latency cost",
    },
    llm: {
      type: "ai",
      title: "LLM (Generation)",
      desc: "The language model that receives the query plus retrieved context chunks and generates a grounded answer. In RAG, the model's role is synthesis and explanation — the ground truth comes from retrieved documents, not model memory.",
      analogy: "The policy expert: given the relevant documents, drafts a clear, accurate, cited answer to the customer's question.",
      pmInsight: "Instruct the model explicitly to cite its sources and refuse to answer if the retrieved context does not support the claim. This is the primary mechanism for preventing hallucination in regulated RAG systems.",
      questions: ["Does the system prompt require the model to cite specific retrieved chunks?", "What is the model's hallucination rate on your domain eval set?"],
      metric: "Cited-answer rate and hallucination rate",
      slo: "100% of answers cite a retrieved chunk; hallucination rate < 2% on eval set",
    },
    "rag-response": {
      type: "server",
      title: "Response (Grounded Answer)",
      desc: "The final customer-facing response, ideally with source citations, confidence indicators, and an escalation path. In fintech, every RAG response touching a regulated decision must include provenance information.",
      analogy: "The written policy opinion: clear answer, referenced sources, signed off and auditable.",
      pmInsight: "The response layer is where trust is built or broken. Design for citation visibility: customers and regulators must be able to trace every AI answer back to a specific policy document and version.",
      questions: ["Does the UI display source citations alongside the answer?", "Is there a feedback mechanism for customers to flag incorrect answers?"],
      metric: "Answer traceability rate (citation present)",
      slo: "100% of regulated answers include a traceable source citation",
    },
  },

  agents: {
    goal: {
      type: "client",
      title: "Customer Goal / Intent",
      desc: "The customer's expressed objective: dispute a charge, get a credit limit explanation, check eligibility, resolve a payment issue. Intent capture is the first and most critical step — a wrong intent classification causes every downstream step to fail.",
      analogy: "The customer's stated purpose when entering the branch: determines which specialist they're routed to.",
      pmInsight: "Intent classification accuracy is your agent's first and most impactful quality gate. Measure it separately from end-to-end success rate. A 90% intent accuracy with a 95% downstream success rate yields 85.5% overall — not 95%.",
      questions: ["What is the intent classification accuracy for your top 10 use cases?", "What is the fallback when intent confidence is below threshold?"],
      metric: "Intent classification accuracy",
      slo: "> 92% accuracy on top 10 intents; human handoff below 0.7 confidence",
    },
    planner: {
      type: "ai",
      title: "Planner LLM (ReAct: Reason + Act)",
      desc: "The orchestrating model that receives the goal, reasons about the required steps, selects tools to call, observes results, and iterates until the goal is met or a stopping condition is reached. This is the ReAct (Reason + Act) loop.",
      analogy: "The relationship manager: assesses the request, decides which specialist services to involve, coordinates the response.",
      pmInsight: "Every planning step adds latency and cost, and compounds failure probability. Before authorising an agent design with N steps, compute the expected success rate as (step reliability)^N. Six steps at 90% = 53% end-to-end success.",
      questions: ["What is the maximum number of reasoning steps allowed per customer request?", "Is there a time/cost budget that triggers a graceful early exit?"],
      metric: "Agent task completion rate and step count distribution",
      slo: "Define max steps, max latency, and max cost per agent invocation before launch",
    },
    "tool-web": {
      type: "server",
      title: "Web Search (Rates / News)",
      desc: "Allows the agent to retrieve current information from the web: regulatory updates, market rates, news. Introduces non-determinism — results change over time and cannot be audited from a fixed snapshot.",
      analogy: "The research desk: retrieves current external information on demand.",
      pmInsight: "Web search introduces uncontrolled data sources into a regulated decision flow. Restrict to approved domains or use an internal knowledge base for anything touching a customer decision. Log all retrieved content for audit.",
      questions: ["Is web search restricted to an approved domain allowlist?", "Are web search results logged and retained for the required audit period?"],
      metric: "Retrieved content audit coverage",
      slo: "100% of web content retrieved in regulated flows logged with source URL and timestamp",
    },
    "tool-db": {
      type: "database",
      title: "Ledger Query (Account Data)",
      desc: "Read-only or read-write access to the customer's account data: transaction history, balances, credit limits, payment history. The most sensitive tool in a fintech agent — must be scoped to the minimum necessary fields.",
      analogy: "Access to the customer's account file: requires strict identity verification and field-level access controls.",
      pmInsight: "Define the exact fields the agent can read for each use case before engineering. Never grant broad table-level access. A credit explanation agent needs credit fields; it does not need payment account numbers.",
      questions: ["What is the minimum data access scope required for each agent use case?", "Are ledger queries logged with the agent action that triggered them?"],
      metric: "Data access scope compliance rate",
      slo: "Zero agent queries outside defined minimum data scope",
    },
    "tool-api": {
      type: "server",
      title: "Payment API (Execute Action)",
      desc: "Executes real-world financial actions: payment initiation, dispute submission, limit adjustment. These are irreversible or hard-to-reverse actions — the highest-risk tools in the agent toolkit.",
      analogy: "The authorised transaction desk: executes real money movements on the customer's behalf.",
      pmInsight: "Every payment API call must be idempotent and logged with the agent decision chain that triggered it. Require a human confirmation step for any action above a value threshold or in a new category. This is a product decision, not an engineering default.",
      questions: ["What value and category thresholds require human confirmation before API execution?", "Are all payment API calls idempotent with a unique idempotency key per agent invocation?"],
      metric: "Unauthorised payment action rate",
      slo: "Zero payment API calls outside defined scope; 100% idempotency key coverage",
    },
    "tool-code": {
      type: "server",
      title: "Code Execution (Compute / Format)",
      desc: "Runs code in a sandboxed environment: data analysis, document generation, metric calculation, formatting. Allows the agent to perform structured computation rather than relying on model arithmetic.",
      analogy: "The analytical team: runs calculations, generates reports, formats outputs precisely.",
      pmInsight: "Code execution adds reliability for numeric tasks (model arithmetic is unreliable for large numbers), but introduces a new attack surface. Ensure the sandbox has no network access and cannot read files outside its designated workspace.",
      questions: ["Is the code execution sandbox fully network-isolated?", "What is the maximum execution time and resource limit per agent call?"],
      metric: "Code execution sandboxing compliance",
      slo: "Zero sandbox escapes; execution timeout ≤ 30s per call",
    },
    memory: {
      type: "database",
      title: "Memory (Context Store)",
      desc: "Stores intermediate results, observations, and state across reasoning steps. Short-term memory lives in the active context window; long-term memory is persisted to a database the agent can query across sessions.",
      analogy: "The case file the relationship manager maintains throughout a complex customer interaction.",
      pmInsight: "Memory design determines whether your agent can handle multi-turn, multi-session workflows. Decide what must be remembered across sessions (customer preferences, open cases) vs. what resets per interaction.",
      questions: ["What data persists across sessions, and what is the retention and deletion policy?", "Is cross-session memory subject to the same data access controls as the ledger?"],
      metric: "Memory context accuracy in multi-turn tasks",
      slo: "Cross-session memory subject to same retention and deletion policies as account data",
    },
    "agent-response": {
      type: "server",
      title: "Response + Audit Log",
      desc: "The final customer-facing answer plus a complete, immutable audit record of every step the agent took: tools called, data accessed, decisions made, model versions used. In a regulated environment, the audit log is as important as the response.",
      analogy: "The case closure summary: the customer receives the outcome; the compliance file receives every decision step.",
      pmInsight: "Build the audit log before the product feature. Retroactively reconstructing agent decision chains from logs is expensive and often incomplete. Define audit log schema, retention period, and review process as part of the feature spec.",
      questions: ["Is the audit log immutable and write-once?", "What is the retention period for agent audit logs, and is it aligned with your regulatory obligations?"],
      metric: "Audit log completeness rate",
      slo: "100% of agent actions logged with tool, input, output, model version, and timestamp",
    },
  },
};

/* ─── Section 6: Product Stack handlers ─── */
const titleEl = document.getElementById("node-title");
const purposeEl = document.getElementById("node-purpose");
const metricEl = document.getElementById("node-metric");
const riskEl = document.getElementById("node-risk");
const leverEl = document.getElementById("node-lever");

const patternNameEl = document.getElementById("pattern-name");
const patternReasonEl = document.getElementById("pattern-reason");
const patternActionsEl = document.getElementById("pattern-actions");

const ranges = {
  latency: document.getElementById("latency"),
  cost: document.getElementById("cost"),
  quality: document.getElementById("quality"),
  risk: document.getElementById("risk"),
};

function renderNode(nodeKey) {
  const node = nodeData[nodeKey];
  if (!node) return;
  titleEl.textContent = node.title;
  purposeEl.textContent = node.purpose;
  metricEl.textContent = node.metric;
  riskEl.textContent = node.risk;
  leverEl.textContent = node.lever;
}

function setActiveNode(targetButton) {
  document.querySelectorAll(".node").forEach((btn) => btn.classList.remove("active"));
  targetButton.classList.add("active");
}

document.querySelectorAll(".node").forEach((button) => {
  button.addEventListener("click", () => {
    setActiveNode(button);
    renderNode(button.dataset.node);
  });
});

/* ─── Section 7: Tradeoff Simulator ─── */
function readSliderValues() {
  return {
    latency: Number(ranges.latency.value),
    cost: Number(ranges.cost.value),
    quality: Number(ranges.quality.value),
    risk: Number(ranges.risk.value),
  };
}

function recommendPattern() {
  const values = readSliderValues();
  const match = patterns.find((pattern) => pattern.when(values));
  patternNameEl.textContent = match.name;
  patternReasonEl.textContent = match.reason;
  patternActionsEl.innerHTML = match.actions.map((item) => `<li>${item}</li>`).join("");
}

Object.values(ranges).forEach((range) => {
  range.addEventListener("input", recommendPattern);
});

/* ─── SVG Architecture Diagram Inspectors ─── */
const badgeClass = {
  client: "badge-client",
  server: "badge-server",
  database: "badge-database",
  ai: "badge-ai",
  cache: "badge-cache",
};

function renderArchInspector(panelId, nodeInfo) {
  const panel = document.getElementById(panelId);
  if (!panel || !nodeInfo) return;

  const badge = nodeInfo.type ? `<span class="type-badge ${badgeClass[nodeInfo.type] || ""}">${nodeInfo.type}</span>` : "";
  const analogyHtml = nodeInfo.analogy
    ? `<div class="analogy-box"><span class="analogy-label">Fintech Analogy</span><p class="analogy-text">${nodeInfo.analogy}</p></div>`
    : "";
  const pmHtml = nodeInfo.pmInsight
    ? `<div class="pm-insight"><strong>PM Insight</strong>${nodeInfo.pmInsight}</div>`
    : "";
  const questionsHtml = nodeInfo.questions && nodeInfo.questions.length
    ? `<p class="inspector-dt" style="margin-top:8px">Questions to ask engineering</p>
       <ul class="pm-questions">${nodeInfo.questions.map((q) => `<li>${q}</li>`).join("")}</ul>`
    : "";
  const metricHtml = nodeInfo.metric
    ? `<p class="inspector-dt">Key Metric</p><p class="inspector-dd">${nodeInfo.metric}</p>
       <p class="inspector-dt">SLO Target</p><p class="inspector-dd">${nodeInfo.slo || "—"}</p>`
    : "";

  panel.innerHTML = `
    ${badge}
    <h4 class="inspector-title">${nodeInfo.title}</h4>
    <p class="inspector-desc">${nodeInfo.desc}</p>
    ${analogyHtml}
    ${pmHtml}
    ${questionsHtml}
    <div class="inspector-dl">${metricHtml}</div>
  `;
}

document.querySelectorAll(".arch-node").forEach((node) => {
  node.addEventListener("click", () => {
    const diagram = node.dataset.diagram;
    const nodeKey = node.dataset.node;
    const inspectorId = `inspector-${diagram}`;
    const info = diagramData[diagram] && diagramData[diagram][nodeKey];

    // Active state
    document.querySelectorAll(`.arch-node[data-diagram="${diagram}"]`).forEach((n) =>
      n.classList.remove("arch-active")
    );
    node.classList.add("arch-active");

    renderArchInspector(inspectorId, info);
  });

  node.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      node.click();
    }
  });
});

/* ─── Section 9: Quiz (5 questions) ─── */
const quizForm = document.getElementById("quiz-form");
const quizResult = document.getElementById("quiz-result");

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(quizForm);
  const answers = {
    q1: data.get("q1"),
    q2: data.get("q2"),
    q3: data.get("q3"),
    q4: data.get("q4"),
    q5: data.get("q5"),
  };

  const correct = { q1: "A", q2: "B", q3: "C", q4: "B", q5: "B" };
  let score = 0;
  Object.keys(correct).forEach((key) => {
    if (answers[key] === correct[key]) score += 1;
  });

  const total = Object.keys(correct).length;
  if (score === total) {
    quizResult.textContent = `${score}/${total}: Strong fintech PM-system design fluency. You are ready to run a controlled pilot with compliance guardrails.`;
  } else if (score >= 3) {
    quizResult.textContent = `${score}/${total}: Good base. Revisit policy retrieval strategy, agent reliability math, or risk KPIs before scaling.`;
  } else if (score >= 2) {
    quizResult.textContent = `${score}/${total}: Revisit the lifecycle diagram and tradeoff simulator to tighten your fintech control model.`;
  } else {
    quizResult.textContent = `${score}/${total}: Build fundamentals first. Focus on compliance controls, evals, and outcome metrics.`;
  }
});

/* ─── Section 10: Learning Path Generator ─── */
const lpForm = document.getElementById("lp-form");
const lpOutput = document.getElementById("lp-output");
const lpSubmit = document.getElementById("lp-submit");

function simpleMarkdown(text) {
  return text
    // Escape HTML
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // Headings
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    // Bold/italic
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    // Code
    .replace(/`(.+?)`/g, "<code>$1</code>")
    // Horizontal rule
    .replace(/^---+$/gm, "<hr>")
    // Unordered lists
    .replace(/^[\-\*] (.+)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Wrap consecutive <li> in <ul>
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    // Blockquote
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Paragraphs (double newlines)
    .replace(/\n\n+/g, "</p><p>")
    .replace(/^(?!<[hup]|<li|<hr|<blockquote)(.+)$/gm, "$1");
}

lpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(lpForm);
  const apiKey = formData.get("apiKey").trim();
  const role = formData.get("role");
  const experience = formData.get("experience");
  const domain = formData.get("domain");
  const goals = formData.get("goals");

  if (!apiKey.startsWith("sk-ant-")) {
    lpOutput.innerHTML = `<p style="color:#dc2626">API key should start with <code>sk-ant-</code>. Check your key at console.anthropic.com.</p>`;
    return;
  }

  lpSubmit.disabled = true;
  lpSubmit.classList.add("loading");
  lpSubmit.textContent = "Generating your learning path…";
  lpOutput.innerHTML = '<div class="lp-streaming"><em>Claude is thinking and writing your personalised plan…</em></div>';

  const systemPrompt = `You are a world-class AI product management coach specialising in fintech and financial services.
You produce highly structured, deeply specific learning paths for product managers transitioning into AI-powered product roles.
Your output is always in rich markdown with clear headers, bullet points, week-by-week plans, and concrete deliverables.
You are opinionated, precise, and avoid generic advice. Every recommendation is grounded in real fintech patterns.`;

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
3–5 fintech AI patterns directly relevant to their domain (e.g. RAG for policy retrieval, compliance guardrails, KYC/AML decisioning, real-time fraud scoring).

## Key Stakeholder Conversations to Have
4–6 specific conversations, with who and what to discuss.

## Capstone Project
One concrete project idea that would demonstrate AI PM fluency in their specific domain. Include scope, success metrics, and a one-paragraph pitch.

## 3 Red Flags to Watch For
The most common mistakes a PM at this stage makes in their domain.

Be extremely specific. Reference real fintech patterns, real metrics (e.g. "p95 < 200ms", "false positive rate < 2%"), and real regulatory concepts (GDPR, FCRA, ECOA, PSD2, Basel III as relevant). No generic advice.`;

  let fullText = "";

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 4096,
        thinking: { type: "adaptive" },
        stream: true,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error?.message || `HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const outputDiv = lpOutput.querySelector(".lp-streaming");
    outputDiv.innerHTML = "";

    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (!data || data === "[DONE]") continue;

        let evt;
        try { evt = JSON.parse(data); } catch { continue; }

        if (evt.type === "content_block_delta") {
          const delta = evt.delta;
          if (delta?.type === "text_delta" && delta.text) {
            fullText += delta.text;
            outputDiv.innerHTML = `<div>${simpleMarkdown(fullText)}</div>`;
            lpOutput.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        }
      }
    }
  } catch (err) {
    lpOutput.innerHTML = `<p style="color:#dc2626">Error: ${err.message}</p>`;
  } finally {
    lpSubmit.disabled = false;
    lpSubmit.classList.remove("loading");
    lpSubmit.textContent = "Generate my 12-week plan →";
  }
});

/* ─── Nav active state on scroll ─── */
const sections = document.querySelectorAll(".panel[id]");
const navTabs = document.querySelectorAll(".nav-tab");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navTabs.forEach((tab) => {
          tab.classList.toggle("active", tab.dataset.section === id);
        });
      }
    });
  },
  { rootMargin: "-20% 0px -70% 0px" }
);

sections.forEach((section) => observer.observe(section));

/* ─── Init ─── */
renderNode("entry");
recommendPattern();
