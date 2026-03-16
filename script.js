
/* ─── SVG Diagram Inspector Data ─── */
const diagramData = {
  web: {
    browser: {
      type: "client",
      title: "Browser (HTTP Client)",
      desc: "The browser initiates every web interaction as an HTTP request and renders the response. Your AI feature's frontend — whether a UPI dispute chat UI, a loan eligibility panel, or an AA consent widget — runs here. In India's mobile-first market, this is often a WebView inside an Android app on a Jio 4G network.",
      analogy: "The Jan Dhan account holder at a BC (Business Correspondent) kiosk: customer-facing, handles display, forwards the request to the NBFC back-office over a low-bandwidth connection.",
      pmInsight: "Slow time-to-first-token feels broken even on Jio 4G. Own the streaming experience — progressive rendering cuts perceived latency by 40–60% for Tier 2/3 India users on 20–30 Mbps connections. Never assume 100 Mbps fibre.",
      questions: ["Does the UI render streaming responses or wait for full completion on a 4G connection?", "What is the p95 time-to-first-byte from your primary metros and Tier 2/3 cities (e.g. Patna, Surat)?"],
      metric: "Time-to-first-token (TTFT)",
      slo: "< 800ms perceived wait before first text appears on 4G",
      resources: [
        { title: "web.dev — Optimize Time to First Byte", url: "https://web.dev/articles/optimize-ttfb", type: "guide", tag: "global" },
        { title: "MDN — Streaming Fetch API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams", type: "docs", tag: "global" },
        { title: "RBI Digital Lending Guidelines 2022", url: "https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12382", type: "regulation", tag: "india" },
      ],
    },
    cdn: {
      type: "cache",
      title: "CDN (Edge Cache)",
      desc: "A CDN caches static assets (JS, CSS, images) at geographically distributed Indian edge nodes. Dynamic AI responses are not cached here, but the app shell that loads your AI feature is. Major CDN providers have PoPs in Mumbai, Delhi, Chennai, and Bengaluru.",
      analogy: "Regional NBFC branch assets printed centrally and distributed to all franchisee kiosks: closer to the customer, faster delivery.",
      pmInsight: "A slow-loading app shell kills trust before the model responds. Confirm CDN PoP coverage across your primary customer geographies — Tier 1 metros are covered, but validate Tier 2 latency separately before launch.",
      questions: ["Are static assets served from the nearest Indian edge PoP?", "What is the cache-hit rate for the app shell across Tier 2/3 traffic?"],
      metric: "Cache-hit rate for static assets",
      slo: "> 95% cache-hit rate; < 50ms TTFB from Indian metros",
      resources: [
        { title: "Google SRE Book — Ch 7: The Evolution of Automation", url: "https://sre.google/sre-book/evolution-automation/", type: "guide", tag: "global" },
        { title: "web.dev — Content Delivery Networks", url: "https://web.dev/articles/content-delivery-networks", type: "guide", tag: "global" },
      ],
    },
    server: {
      type: "server",
      title: "App Server (Business Logic)",
      desc: "The app server runs your business logic: validates the request, calls the LLM API, applies RBI/PMLA guardrails, and formats the response. This is where BRE execution, AA data enrichment, CKYC lookup, and MITC injection happen — all before the response reaches the customer.",
      analogy: "The NBFC back-office credit operations team: receives the request, runs it through the BRE, coordinates CBS and bureau data, returns the outcome — all within NPCI-mandated SLOs.",
      pmInsight: "The app server is your primary latency lever after the model. BRE execution, AA FIP data pull, CKYC lookup, and PMLA screening all add time. Profile each step independently before setting end-to-end SLOs for your RBI compliance commitments.",
      questions: ["What is the p95 server-side latency excluding model inference — BRE + AA pull + CKYC?", "Where do PMLA and DPDP Act consent guardrails run — pre-model, post-model, or both?"],
      metric: "Server-side processing latency (excl. model)",
      slo: "< 150ms for orchestration overhead including BRE and CKYC lookup",
      resources: [
        { title: "Google SRE Book — Ch 4: Service Level Objectives", url: "https://sre.google/sre-book/service-level-objectives/", type: "guide", tag: "global" },
        { title: "Anthropic — Building Effective Agents", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", type: "docs", tag: "global" },
        { title: "RBI PMLA Master Direction 2016 (amended 2023)", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11566", type: "regulation", tag: "india" },
      ],
    },
    db: {
      type: "database",
      title: "Database (Persistent Store)",
      desc: "The database persists all durable state: customer KYC profiles, AA-consented data, conversation history, RBI-format audit logs, credit decisions, and PMLA compliance records. In an RBI-regulated NBFC, the database is the source of truth for every AI-assisted decision and must be producible in RBI inspection format.",
      analogy: "The CBS (Core Banking System) ledger: every loan decision, disbursement, NACH mandate, and KYC record lives here — immutable, auditable, RBI-ready.",
      pmInsight: "Audit trail completeness is an RBI inspection requirement, not a nice-to-have. Every AI-assisted credit decision must be logged with the model version, prompt hash, CIBIL score snapshot, and AA consent reference — tied to the specific RBI Master Direction version in force at decision time.",
      questions: ["Are AI credit decisions stored with model version, CIBIL bureau snapshot, and AA consent reference?", "What is the data retention period for AI audit logs — does it meet RBI's minimum 5-year requirement for loan records?"],
      metric: "Audit log completeness rate",
      slo: "100% of AI-assisted decisions logged with full RBI-format context",
      resources: [
        { title: "Google SRE Workbook — Data Processing Pipelines", url: "https://sre.google/workbook/data-processing/", type: "guide", tag: "global" },
        { title: "RBI Master Direction — KYC 2016 (updated)", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11566", type: "regulation", tag: "india" },
        { title: "DPDP Act 2023 — Full Text (MeitY)", url: "https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9-5316-4ef0-a86f-af5f7663ffe4.pdf", type: "regulation", tag: "india" },
      ],
    },
    cache: {
      type: "cache",
      title: "Cache (Redis / In-Memory)",
      desc: "In-memory caches like Redis store hot data — customer KYC sessions, recent CIBIL bureau scores, frequent RBI policy lookups — to avoid expensive CBS or CKYC registry reads on every request. Cache-hit rate directly controls p95 latency and NPCI SLO compliance.",
      analogy: "The branch manager's pre-printed rate card and MITC sheet: common answers are at hand, so each customer doesn't trigger a fresh CBS query or bureau hit.",
      pmInsight: "Cache your most expensive retrieval paths: RBI Master Direction snippets, customer bureau scores (respect CIBIL TTL policies), and CKYC verification status. A 70% cache-hit rate on a 300ms CKYC registry read saves 210ms per request — critical for NPCI UPI sub-300ms SLOs.",
      questions: ["What is the cache-hit rate for RBI policy and CKYC context lookups?", "What is the TTL strategy — do stale CKYC or bureau caches create RBI compliance or credit risk?"],
      metric: "Cache-hit rate for policy and bureau context lookups",
      slo: "> 70% hit rate; TTL aligned with RBI circular update cadence and bureau data freshness",
      resources: [
        { title: "Redis — Caching Best Practices", url: "https://redis.io/docs/latest/develop/use/client-side-caching/", type: "docs", tag: "global" },
        { title: "Google SRE Book — Ch 22: Addressing Cascading Failures", url: "https://sre.google/sre-book/addressing-cascading-failures/", type: "guide", tag: "global" },
        { title: "CKYC Registry — Operating Guidelines", url: "https://rbi.org.in/scripts/FAQView.aspx?Id=125", type: "regulation", tag: "india" },
      ],
    },
  },

  apis: {
    client: {
      type: "client",
      title: "Client App (Mobile / Web)",
      desc: "The customer-facing application that collects intent, displays AI outputs, and renders RBI-required disclosures. In Indian fintech, this is typically an Android app serving Bharat users over Jio 4G, or an embedded widget in an NBFC's digital lending platform.",
      analogy: "The loan applicant at an NBFC's digital storefront: initiates the credit request, receives the eligibility outcome, signs the MITC digitally.",
      pmInsight: "Design for degraded-mode UX across Indian network conditions: what does the customer see on a 2G edge fallback when the AI pipeline times out? Always have a deterministic BRE-powered fallback, and ensure MITC is displayable without the AI layer.",
      questions: ["Is there a BRE fallback UI for when the AI pipeline is unavailable?", "What is the escalation path from AI response to a human GRO agent under RBI Digital Lending Guidelines?"],
      metric: "AI feature availability rate",
      slo: "> 99.9% availability with deterministic BRE fallback on NBFC lending flows",
      resources: [
        { title: "Google Material Design — Mobile UX Guidelines", url: "https://m3.material.io/", type: "guide", tag: "global" },
        { title: "RBI DLG 2022 — Customer-Facing Disclosure Requirements", url: "https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12382", type: "regulation", tag: "india" },
        { title: "NPCI UPI Developer Portal", url: "https://www.npci.org.in/what-we-do/upi/product-overview", type: "docs", tag: "india" },
      ],
    },
    gateway: {
      type: "server",
      title: "API Gateway (Auth + Routing)",
      desc: "The gateway is the single entry point for all API calls. It enforces Aadhaar/OTP or V-KYC-based authentication, per-customer rate limiting, and routing before any domain service sees traffic. DPDP Act consent validation and Aadhaar data masking often sit here.",
      analogy: "The NBFC front-desk compliance checkpoint: verify identity via Aadhaar OTP, confirm AA consent status, then route to credit or servicing desks.",
      pmInsight: "Gate-level rate limits protect CKYC registry and AA FIP APIs from AI-driven query floods. NPCI imposes API rate limits on UPI and NACH integrations — ensure your gateway enforces these before any AI feature goes live.",
      questions: ["Are per-customer rate limits set for CKYC, AA FIP, and NPCI API calls made by the AI feature?", "Does the gateway mask Aadhaar numbers and redact DPDP-sensitive PII before they reach the model service?"],
      metric: "Gateway-level policy enforcement rate",
      slo: "100% of requests authenticated and Aadhaar/PII-masked before model access",
      resources: [
        { title: "OWASP API Security Top 10", url: "https://owasp.org/API-Security/", type: "guide", tag: "global" },
        { title: "DPDP Act 2023 — Consent and Data Masking", url: "https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9-5316-4ef0-a86f-af5f7663ffe4.pdf", type: "regulation", tag: "india" },
      ],
    },
    "auth-service": {
      type: "server",
      title: "Auth Service (Aadhaar OTP / V-KYC)",
      desc: "Verifies customer identity using Aadhaar eKYC OTP flows, V-KYC video sessions, or JWT tokens for returning users. Every AI action that touches customer financial data must be authenticated — RBI's Digital Lending Guidelines 2022 prohibit anonymous credit interactions.",
      analogy: "The UIDAI-powered identity verification desk: customer authenticates via Aadhaar OTP or face match before any account data is accessed.",
      pmInsight: "AA consent scope is an auth control. The AI service account should request only the FIP data categories explicitly consented to by the customer — bank statements, salary, GST — not a blanket financial profile. Over-scoped AA consent is a regulatory audit finding under the RBI AA Master Direction.",
      questions: ["What AA data categories (bank statements, salary, GST, MF) does the AI service request, and is each justified?", "Are Aadhaar OTP token expiry and AA consent validity periods aligned with session risk level?"],
      metric: "Auth failure rate and AA consent scope compliance",
      slo: "Zero over-scoped AA consent requests; 100% Aadhaar OTP sessions expire within UIDAI-mandated TTL",
      resources: [
        { title: "OAuth 2.0 Security Best Current Practice", url: "https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics", type: "paper", tag: "global" },
        { title: "RBI AA Master Direction 2016 (amended)", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=10598", type: "regulation", tag: "india" },
        { title: "Sahamati — Account Aggregator Technical Specs", url: "https://sahamati.org.in/aa-ecosystem/", type: "docs", tag: "india" },
      ],
    },
    "policy-engine": {
      type: "server",
      title: "Policy Engine (BRE / CKYC / PMLA)",
      desc: "Applies deterministic business rules: CKYC status checks, PMLA transaction monitoring, AML/sanctions screening, RBI credit policy limits, and DPDP Act consent validation. The BRE gates what the AI is allowed to recommend or execute under RBI's risk-proportionate supervision framework.",
      analogy: "The NBFC compliance officer and credit committee: every loan request is checked against the RBI-approved credit policy, CKYC registry, and PMLA watchlist before any AI-generated recommendation is shown.",
      pmInsight: "The BRE/policy engine must run before and after the model — pre-model to restrict input scope and enforce RBI eligibility criteria, post-model to validate output safety and MITC compliance. Treating it as an afterthought is the most common architecture mistake in Indian regulated AI.",
      questions: ["Does the BRE gate model input (eligibility checks), model output (MITC compliance), or both?", "How quickly can new RBI Master Direction rules be deployed into the BRE without a model retrain?"],
      metric: "RBI policy violation detection rate",
      slo: "< 0.1% undetected RBI or PMLA policy breach rate at launch",
      resources: [
        { title: "Google SRE Book — Ch 6: Monitoring Distributed Systems", url: "https://sre.google/sre-book/monitoring-distributed-systems/", type: "guide", tag: "global" },
        { title: "RBI Fair Practices Code for NBFCs", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12256", type: "regulation", tag: "india" },
        { title: "RBI PMLA Master Direction 2016", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11566", type: "regulation", tag: "india" },
      ],
    },
    "product-service": {
      type: "server",
      title: "Product Service (NPCI / CBS / Credit)",
      desc: "Domain services that own core product logic: UPI payment execution via NPCI, NACH mandate creation, CBS loan disbursement, and NBFC credit decisioning. AI orchestration calls these services for real-world actions — all must be idempotent with NPCI-standard idempotency keys and support maker-checker patterns for RBI audit compliance.",
      analogy: "The specialist desks in the NBFC: NPCI payments desk, CBS disbursement desk, and credit appraisal committee — each owns their domain and requires formal sign-off.",
      pmInsight: "Define the exact NPCI and CBS API surface the AI can call before engineering starts. Every CBS field the AI can read is a data governance decision; every UPI or NACH action it can initiate is an RBI risk decision. Write these boundaries into the feature spec before the sprint starts.",
      questions: ["Which NPCI/CBS endpoints can the AI call autonomously vs. with maker-checker human approval?", "Are all AI-initiated UPI and NACH transactions covered by a unique idempotency key?"],
      metric: "Unauthorised NPCI/CBS action rate",
      slo: "Zero AI-initiated actions outside defined NPCI/CBS permission scope; 100% idempotency key coverage",
      resources: [
        { title: "Stripe API Design — Idempotency Keys", url: "https://stripe.com/docs/api/idempotent_requests", type: "docs", tag: "global" },
        { title: "NPCI NACH Product Overview", url: "https://www.npci.org.in/what-we-do/nach/product-overview", type: "docs", tag: "india" },
        { title: "NPCI UPI Technical Specifications", url: "https://www.npci.org.in/what-we-do/upi/product-overview", type: "docs", tag: "india" },
      ],
    },
    aggregator: {
      type: "server",
      title: "Aggregator (AA + CBS + Bureau Compose)",
      desc: "Collects responses from multiple India Stack services — AA FIP bank statement pull, CBS account summary, CIBIL/Experian bureau score, CKYC registry status — merges them into a coherent payload for the AI orchestration layer. Aggregators hide India Stack complexity from the model.",
      analogy: "The NBFC relationship manager: pulls together the customer's AA bank statement, CBS loan history, and CIBIL bureau score before presenting a complete credit picture to the underwriter.",
      pmInsight: "Aggregator latency is cumulative and blocks on the slowest upstream service. AA FIP data pull can take 2–5s for some banks — this is your critical path constraint. Set individual p95 SLOs for each: AA pull, CKYC lookup, CIBIL API, CBS query.",
      questions: ["What is the p95 latency for AA FIP data pull from your top-5 partner banks?", "Are parallel service calls used for CKYC, CIBIL, and CBS queries where AA consent allows?"],
      metric: "Aggregation p95 latency across India Stack services",
      slo: "< 3s for AA FIP pull; < 500ms for CKYC + CIBIL combined; overall aggregation < 4s",
      resources: [
        { title: "Anthropic — Prompt Engineering Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", type: "docs", tag: "global" },
        { title: "iSPIRT Account Aggregator Framework", url: "https://ispirt.in/account-aggregator/", type: "docs", tag: "india" },
        { title: "Sahamati — AA Technical Specification", url: "https://sahamati.org.in/aa-ecosystem/", type: "docs", tag: "india" },
      ],
    },
  },

  "ai-blocks": {
    input: {
      type: "client",
      title: "Text Input (User Prompt)",
      desc: "The raw text submitted by a customer or system, before any processing. In Indian fintech, input often contains highly sensitive data: Aadhaar numbers, PAN, UPI IDs, loan account numbers, and transaction amounts in ₹. DPDP Act 2023 data handling obligations begin at this boundary.",
      analogy: "The customer's loan application form handed to the NBFC branch executive — raw, unprocessed, contains KYC identifiers and financial details that are DPDP Act personal data.",
      pmInsight: "Require Aadhaar number masking, PAN tokenisation, and DPDP Act consent validation before the prompt reaches the model. Define your input validation schema: what data categories are AA-consented, what formats trigger PMLA flags, what lengths are acceptable for your BRE integration.",
      questions: ["Where does Aadhaar/PAN redaction happen — client-side, gateway, or app server?", "Is DPDP Act consent verification logged before any customer PII enters the model context?"],
      metric: "PII leak rate into model context",
      slo: "Zero Aadhaar/PAN/UPI ID reaching the model without explicit DPDP Act consent classification",
      resources: [
        { title: "Anthropic — Prompt Engineering Overview", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", type: "docs", tag: "global" },
        { title: "OWASP — LLM Top 10 (Prompt Injection)", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/", type: "guide", tag: "global" },
        { title: "DPDP Act 2023 — MeitY Full Text", url: "https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9-5316-4ef0-a86f-af5f7663ffe4.pdf", type: "regulation", tag: "india" },
      ],
    },
    tokenizer: {
      type: "server",
      title: "Tokenizer (BPE / Multilingual)",
      desc: "Converts text into tokens — sub-word units that the transformer processes. ~0.75 words per token for English, but Hindi and other Indic scripts tokenise at 2–4× higher token-per-word ratios due to Devanagari encoding in BPE vocabularies. This directly drives inference cost for vernacular Indian fintech use cases.",
      analogy: "The bank document scanner: converts the customer's Hindi or English request into a format the AI processing system understands — but a 200-word Hindi query costs as much as a 600-word English one.",
      pmInsight: "Hindi/Devanagari tokenisation cost is 2–4× English. A 500-word Hindi system prompt can cost 1,500–2,000 tokens per request. Audit your vernacular token usage before launch — especially if targeting Bharat/Tier 2/3 markets with native-language support.",
      questions: ["What is the average token count per request for Hindi vs. English queries in your feature?", "Is there a token budget alert when Hindi system prompts exceed your cost threshold?"],
      metric: "Average input tokens per request (by language)",
      slo: "Track cost-per-request by language; alert if Hindi/Indic system prompt exceeds 20% of token budget",
      resources: [
        { title: "Hugging Face — BPE Tokenization Explained", url: "https://huggingface.co/learn/nlp-course/en/chapter6/5", type: "guide", tag: "global" },
        { title: "OpenAI Tiktoken (tokenizer library)", url: "https://github.com/openai/tiktoken", type: "docs", tag: "global" },
        { title: "AI4Bharat — IndicNLP Benchmarks", url: "https://ai4bharat.iitm.ac.in/", type: "paper", tag: "india" },
      ],
    },
    transformer: {
      type: "ai",
      title: "Transformer (Self-Attention)",
      desc: "The neural network that processes tokens through multiple attention layers. Self-attention lets every token attend to every other token — enabling contextual understanding but also why long AA bank statement contexts (often 3,000–5,000 tokens) cost significantly more than short UPI queries.",
      analogy: "The NBFC credit analyst: reads the full AA bank statement and bureau report, weighs every transaction pattern, and generates a nuanced credit assessment.",
      pmInsight: "Model inference is typically 60–80% of end-to-end latency. For AA-powered credit flows, AA bank statement context can add 3,000–5,000 tokens per request — audit this before setting NBFC underwriting SLOs. Your levers are context compression, smaller models for routing, and output streaming.",
      questions: ["What model are you using, and what is its p95 inference latency at your AA bank statement token volume (typically 3,000–5,000 tokens)?", "Are you streaming output, or blocking on the full credit explanation response?"],
      metric: "Model inference latency (p50 / p95)",
      slo: "p95 inference < 3s for NBFC servicing; stream output for > 500 token responses; budget AA context tokens before launch",
      resources: [
        { title: "Vaswani et al. — Attention Is All You Need (2017)", url: "https://arxiv.org/abs/1706.03762", type: "paper", tag: "global" },
        { title: "Jay Alammar — The Illustrated Transformer", url: "https://jalammar.github.io/illustrated-transformer/", type: "guide", tag: "global" },
        { title: "Anthropic — Research on Interpretability", url: "https://www.anthropic.com/research", type: "paper", tag: "global" },
      ],
    },
    output: {
      type: "server",
      title: "Token Output (Sampled Text)",
      desc: "The model's generated tokens, sampled from a probability distribution. Temperature controls randomness — in RBI-regulated credit decisions, low temperature and constrained sampling improve consistency and support MITC compliance requirements under Digital Lending Guidelines 2022.",
      analogy: "The NBFC credit officer's drafted loan sanction letter: probabilistic at generation, but must be deterministic enough to meet RBI's MITC disclosure requirements before it reaches the customer.",
      pmInsight: "Set temperature to 0.0–0.2 for any output that constitutes a credit decision, loan eligibility statement, or MITC disclosure under RBI Digital Lending Guidelines 2022. Higher temperature may be appropriate for FAQ-style servicing but never for credit outcomes or PMLA-sensitive explanations.",
      questions: ["What temperature and sampling parameters are set for your NBFC credit decision prompts?", "Are output constraints applied to prevent the model from generating loan terms or MITC clauses not pre-approved by compliance?"],
      metric: "Output consistency rate across identical credit inputs",
      slo: "Temperature ≤ 0.2 for any output affecting a regulated NBFC credit or PMLA decision",
      resources: [
        { title: "Anthropic — Temperature and Sampling Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", type: "docs", tag: "global" },
        { title: "RBI Digital Lending Guidelines 2022 — Section 10 (Disclosure)", url: "https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12382", type: "regulation", tag: "india" },
      ],
    },
    embedder: {
      type: "ai",
      title: "Embedder (text-embedding)",
      desc: "A separate model that converts text into a fixed-dimension vector representing its semantic meaning. Embeddings power similarity search over RBI Master Directions, NBFC credit policies, and MITC documents. A multilingual embedder is needed for Hindi/Indic policy documents in Bharat-facing products.",
      analogy: "The NBFC's regulatory library indexer: reads every RBI circular and credit policy, assigns semantic coordinates, so related policy clauses surface even when the customer asks in Hindi and the policy is in English.",
      pmInsight: "Embedding model choice affects retrieval quality, not generation quality. A multilingual or India-adapted financial embedding model will outperform a general-purpose English one for RBI Master Direction retrieval — especially for vernacular queries. This is worth A/B testing before launch.",
      questions: ["Is the embedding model multilingual or adapted for Hindi/Indic financial text?", "What is the re-embedding cost when RBI issues a new Master Direction circular?"],
      metric: "Retrieval precision@k for RBI policy queries",
      slo: "Precision@5 > 0.85 on a golden evaluation set of RBI policy and MITC questions",
      resources: [
        { title: "Anthropic — Embeddings and Retrieval", url: "https://docs.anthropic.com/en/docs/build-with-claude/embeddings", type: "docs", tag: "global" },
        { title: "MTEB Leaderboard — Embedding Model Comparison", url: "https://huggingface.co/spaces/mteb/leaderboard", type: "guide", tag: "global" },
        { title: "AI4Bharat — Multilingual NLP for Indian Languages", url: "https://ai4bharat.iitm.ac.in/", type: "paper", tag: "india" },
      ],
    },
    "vector-store": {
      type: "database",
      title: "Vector Store (pgvector / Qdrant)",
      desc: "A database optimised for storing and querying high-dimensional vectors using approximate nearest-neighbour (ANN) search. Stores embeddings of RBI Master Directions, NBFC credit policies, MITC documents, and AA-consented financial data summaries. Returns top-k most relevant chunks in milliseconds.",
      analogy: "The NBFC's semantic regulatory archive: RBI circulars and credit policies organised by meaning — so the right MITC clause surfaces even when the customer asks in a different way than the policy is written.",
      pmInsight: "Vector store latency is on your RAG pipeline's critical path. pgvector adds ~5–20ms; Qdrant adds ~10–30ms. Both are acceptable. More importantly, treat the vector store as a regulated data store — DPDP Act access controls apply to any AA-consented data stored here.",
      questions: ["What is the p95 ANN query latency at your RBI circular index size?", "Are DPDP Act access controls and audit logs on the vector store equivalent to those on the AA-consented source documents?"],
      metric: "ANN query latency and RBI circular index freshness",
      slo: "< 30ms p95 retrieval; RBI circular index updates within 24h of any new Master Direction",
      resources: [
        { title: "Qdrant — Vector Database Documentation", url: "https://qdrant.tech/documentation/", type: "docs", tag: "global" },
        { title: "pgvector — Open-Source Vector Similarity for Postgres", url: "https://github.com/pgvector/pgvector", type: "docs", tag: "global" },
      ],
    },
  },

  rag: {
    docs: {
      type: "client",
      title: "Source Documents (RBI Circulars / MITC / AA Data)",
      desc: "The authoritative source data: RBI Master Directions, NBFC credit policies, MITC documents, Digital Lending Guidelines 2022, AA-consented bank statement summaries, and PMLA procedure manuals. Data quality here directly determines answer quality and RBI inspection readiness downstream.",
      analogy: "The NBFC's regulatory library and CBS ledger room: every RBI circular, credit policy, and customer financial record that the institution relies on for compliance and credit decisions.",
      pmInsight: "You own the data pipeline, not just the model. If RBI Master Directions are stale or MITC documents are outdated, the RAG system will cite incorrect policy — a direct regulatory breach under Digital Lending Guidelines 2022. Assign a named RBI compliance owner for each document category.",
      questions: ["Who is the named RBI compliance data owner for each source document type (Master Directions, MITC, DLG)?", "What is the SLA for reflecting a new RBI circular in the vector store?"],
      metric: "RBI source document freshness lag",
      slo: "RBI circulars and MITC documents re-ingested within 24h of any regulatory update",
      resources: [
        { title: "Anthropic — RAG Best Practices", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags", type: "docs", tag: "global" },
        { title: "RBI Master Direction Repository", url: "https://rbi.org.in/Scripts/BS_ViewMasterDirections.aspx", type: "regulation", tag: "india" },
        { title: "Sahamati — AA Ecosystem Technical Specs", url: "https://sahamati.org.in/aa-ecosystem/", type: "docs", tag: "india" },
      ],
    },
    chunker: {
      type: "server",
      title: "Chunker (Split + Overlap)",
      desc: "Splits RBI Master Directions, NBFC policies, and MITC documents into overlapping text segments optimised for embedding and retrieval. Chunk size (typically 256–512 tokens) and overlap (10–15%) are hyperparameters that directly affect MITC citation completeness and retrieval quality.",
      analogy: "The NBFC compliance document preparation team: breaks long RBI Master Directions into clause-level sections with context preserved at boundaries — so Section 10 of DLG 2022 is never split mid-sentence.",
      pmInsight: "Chunking strategy is a product decision with RBI compliance implications. Too-large chunks dilute relevance scores; too-small chunks lose clause context and produce incomplete MITC citations — a potential Digital Lending Guidelines violation. Run an eval against RBI policy questions before setting these parameters.",
      questions: ["Has the chunking strategy been evaluated against a golden set of RBI policy and MITC questions?", "Are chunk boundaries aware of RBI document structure (numbered clauses, annexures, tables)?"],
      metric: "Chunk-level RBI policy retrieval precision",
      slo: "Evaluate chunking strategy against 50+ golden RBI Q&A and MITC pairs before production",
      resources: [
        { title: "LangChain — Text Splitters Documentation", url: "https://python.langchain.com/docs/concepts/text_splitters/", type: "docs", tag: "global" },
        { title: "Pinecone — Chunking Strategies Guide", url: "https://www.pinecone.io/learn/chunking-strategies/", type: "guide", tag: "global" },
      ],
    },
    "embedder-ing": {
      type: "ai",
      title: "Embedder — Ingestion (Batch Encoding)",
      desc: "During ingestion, the embedding model encodes every RBI circular chunk and MITC document into a vector in batch mode. This offline, asynchronous process does not affect query latency but determines how quickly new RBI Master Directions are reflected in production — a compliance commitment, not just a technical SLO.",
      analogy: "The nightly regulatory indexing run: every new RBI circular gets a semantic fingerprint added to the NBFC's compliance knowledge base — before the next business day's credit decisions are processed.",
      pmInsight: "Re-ingestion latency is your RBI policy update lag. If re-embedding 10,000 RBI circular chunks takes 4 hours, that is how long your NBFC is operating on stale policy — a regulatory risk. Budget for incremental ingestion on every RBI circular update, not just quarterly full refreshes.",
      questions: ["What is the total re-ingestion time for a full RBI policy corpus refresh?", "Is incremental ingestion supported on new RBI Master Directions without re-embedding the entire corpus?"],
      metric: "Re-ingestion pipeline throughput for RBI circulars",
      slo: "Incremental RBI circular updates ingested within 1 hour; full refresh < 4 hours",
      resources: [
        { title: "Anthropic — Embeddings Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/embeddings", type: "docs", tag: "global" },
        { title: "MTEB Leaderboard — Embedding Benchmarks", url: "https://huggingface.co/spaces/mteb/leaderboard", type: "guide", tag: "global" },
      ],
    },
    "vector-db": {
      type: "database",
      title: "Vector Store (pgvector / Qdrant)",
      desc: "Stores chunk embeddings and metadata (RBI circular number, MITC version, effective date, section number). Serves ANN queries at retrieval time. Index health, RBI circular freshness, and DPDP Act access controls are critical — especially for AA-consented financial data stored alongside policy documents.",
      analogy: "The NBFC's indexed regulatory archive: RBI circulars and MITC clauses stored by semantic similarity, with metadata linking back to the specific circular number, effective date, and policy version.",
      pmInsight: "The vector store must be treated as an RBI-regulated data store. DPDP Act access controls, audit logs, and version tracking apply to any AA-consented financial data or customer KYC context stored here. This is not a generic tech database — it is in scope for RBI inspection.",
      questions: ["Are DPDP Act access controls on the vector store equivalent to those on the AA-consented source documents?", "Is the chunk-to-RBI-circular mapping (circular number, effective date) auditable for RBI review?"],
      metric: "RBI circular index freshness and DPDP access audit coverage",
      slo: "Full DPDP-compliant access audit trail; RBI circular freshness SLA ≤ 24h from publication",
      resources: [
        { title: "Qdrant — Vector Search Documentation", url: "https://qdrant.tech/documentation/", type: "docs", tag: "global" },
        { title: "pgvector — Postgres Vector Extension", url: "https://github.com/pgvector/pgvector", type: "docs", tag: "global" },
        { title: "DPDP Act 2023 — Data Storage Obligations", url: "https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9-5316-4ef0-a86f-af5f7663ffe4.pdf", type: "regulation", tag: "india" },
      ],
    },
    query: {
      type: "client",
      title: "User Query (Hindi / English)",
      desc: "The customer's or NBFC agent's question at runtime — in English or Hindi/Indic vernacular. This is embedded and matched against stored RBI policy and MITC chunks to retrieve relevant context. Hindi queries require a multilingual embedder; mismatches cause retrieval failures that translate to policy citation errors.",
      analogy: "The Bharat customer asking their loan question at the NBFC kiosk — in Hindi or their regional language. The more specific, the better the MITC clause the system can retrieve.",
      pmInsight: "Poorly phrased or vernacular queries return irrelevant RBI policy chunks, producing wrong or hallucinated MITC answers. Log queries in production with their language tag to identify Hindi vs. English retrieval failure patterns — these are different failure modes with different fixes.",
      questions: ["Are low-confidence RBI policy retrievals flagged for human compliance review?", "Is query logging in place by language (Hindi/English) to identify systematic MITC retrieval failures?"],
      metric: "Query intent coverage rate by language",
      slo: "Log all queries with language tag; review low-confidence RBI policy retrievals weekly",
      resources: [
        { title: "Anthropic — Prompt Engineering for RAG", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", type: "docs", tag: "global" },
        { title: "AI4Bharat — Multilingual NLP Resources", url: "https://ai4bharat.iitm.ac.in/", type: "paper", tag: "india" },
      ],
    },
    retriever: {
      type: "server",
      title: "Retriever (ANN Search)",
      desc: "Embeds the query at runtime and performs approximate nearest-neighbour search against the RBI policy vector store to return the top-k most relevant chunks. Retrieval latency is typically 10–50ms. Hybrid retrieval (semantic + BM25 keyword) is strongly recommended for queries containing RBI circular identifiers or MITC clause numbers.",
      analogy: "The NBFC compliance research assistant: given the customer's question, pulls the most relevant RBI Master Direction clauses and MITC sections from the archive in under 50ms.",
      pmInsight: "Top-k is a product tradeoff: more chunks means more RBI policy context (better MITC accuracy) but more tokens (higher cost and latency for AA bank statement + policy combined). Start with k=5 and tune based on MITC citation precision eval.",
      questions: ["What value of k is used for RBI policy retrieval, and has it been evaluated against MITC citation quality?", "Is hybrid retrieval (semantic + BM25 keyword) used for queries containing RBI circular numbers or MITC clause identifiers?"],
      metric: "Retrieval precision@k for RBI and MITC queries",
      slo: "Precision@5 > 0.85 on RBI policy eval set; p95 retrieval latency < 30ms",
      resources: [
        { title: "Lewis et al. — RAG: Retrieval-Augmented Generation (2020)", url: "https://arxiv.org/abs/2005.11401", type: "paper", tag: "global" },
        { title: "Anthropic Cookbook — RAG with Claude", url: "https://github.com/anthropics/anthropic-cookbook/tree/main/misc/retrieval_augmented_generation", type: "guide", tag: "global" },
      ],
    },
    reranker: {
      type: "ai",
      title: "Reranker (Cross-Encoder)",
      desc: "A second-pass model that re-scores retrieved RBI policy and MITC chunks for relevance using the full query context. More accurate than embedding similarity alone, but adds 30–80ms latency. Critical when incorrect MITC citation is a Digital Lending Guidelines compliance breach.",
      analogy: "The NBFC senior compliance counsel: takes the shortlisted RBI circular clauses and re-ranks them by true relevance to the specific customer question — ensuring the most regulation-accurate MITC clause surfaces first.",
      pmInsight: "Reranking is worth the latency cost for any NBFC use case where incorrect MITC or RBI policy citations have compliance consequences. A wrong credit terms citation under Digital Lending Guidelines 2022 is a regulatory breach, not a UX problem. Build reranking in at launch.",
      questions: ["Is reranking enabled for all MITC and RBI policy queries, or only high-stakes credit decision ones?", "Has the reranker been evaluated against the base retriever on your RBI Master Direction eval set?"],
      metric: "Post-rerank precision gain vs. base retriever on RBI policy queries",
      slo: "Reranking should improve MITC citation precision@3 by ≥ 10% on eval set to justify latency cost",
      resources: [
        { title: "Cross-Encoders and Reranking — SBERT Documentation", url: "https://www.sbert.net/examples/applications/cross-encoder/README.html", type: "docs", tag: "global" },
        { title: "Cohere — Rerank API Documentation", url: "https://docs.cohere.com/docs/rerank-2", type: "docs", tag: "global" },
      ],
    },
    llm: {
      type: "ai",
      title: "LLM (Generation)",
      desc: "The language model that receives the query plus retrieved RBI circular and MITC chunks and generates a grounded, cited answer. In Indian fintech RAG, the model's role is synthesis and explanation — the regulatory ground truth comes from retrieved RBI documents, not model memory. Model hallucination on RBI policy is a compliance breach.",
      analogy: "The NBFC in-house legal counsel: given the relevant RBI circular extracts and MITC clauses, drafts a clear, accurate, cited answer to the customer's credit policy question.",
      pmInsight: "Instruct the model explicitly to cite the specific RBI circular number and MITC clause, and to refuse to answer if the retrieved context does not support the claim. This is the primary mechanism for preventing RBI policy hallucination — and a requirement under Digital Lending Guidelines 2022 Section 10 traceability obligations.",
      questions: ["Does the system prompt require the model to cite the specific RBI circular number and MITC version?", "What is the model's hallucination rate on your RBI Master Direction and MITC eval set?"],
      metric: "RBI-cited answer rate and policy hallucination rate",
      slo: "100% of MITC-related answers cite a specific RBI circular and MITC version; hallucination rate < 2% on RBI eval set",
      resources: [
        { title: "Anthropic — Claude Model Card", url: "https://docs.anthropic.com/en/docs/about-claude/models", type: "docs", tag: "global" },
        { title: "RBI DLG 2022 — Section 10 (Traceability)", url: "https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12382", type: "regulation", tag: "india" },
      ],
    },
    "rag-response": {
      type: "server",
      title: "Response (RBI-Grounded Answer)",
      desc: "The final customer-facing response, with RBI circular citations, MITC clause references, confidence indicators, and a GRO escalation path. Under RBI Digital Lending Guidelines 2022 Section 10, every AI response touching a credit decision must include source traceability — this is the enforcement point.",
      analogy: "The NBFC's written policy opinion letter: clear answer, cited RBI circular and MITC clause, GRO contact for redressal, auditable for RBI inspection.",
      pmInsight: "The response layer is where RBI compliance is made visible. Design for citation visibility: customers must be able to trace every AI-generated credit answer back to a specific RBI circular, MITC version, and effective date. Regulators will ask for this in inspections.",
      questions: ["Does the UI display the RBI circular number and MITC version alongside each AI-generated credit answer?", "Is there a GRO escalation link in every AI response under RBI's Grievance Redressal Officer requirement?"],
      metric: "RBI-traceable answer rate (citation + GRO link present)",
      slo: "100% of Digital Lending-regulated answers include RBI circular citation, MITC version, and GRO escalation link",
      resources: [
        { title: "Anthropic — Citations in Claude", url: "https://docs.anthropic.com/en/docs/build-with-claude/citations", type: "docs", tag: "global" },
        { title: "RBI GRO (Grievance Redressal) Master Direction", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12552", type: "regulation", tag: "india" },
      ],
    },
  },

  agents: {
    goal: {
      type: "client",
      title: "Customer Goal / Intent",
      desc: "The customer's expressed objective: dispute a UPI payment, get a loan eligibility explanation, trigger AA consent flow, check NACH mandate status. Intent capture is the first and most critical step — a wrong intent classification in an NBFC loan agent causes every downstream BRE and CIBIL step to fail.",
      analogy: "The customer's stated purpose when walking into the NBFC branch: 'I want a home loan top-up' — determines whether they're routed to credit appraisal, servicing, or the GRO desk.",
      pmInsight: "Intent classification accuracy is your NBFC agent's first quality gate. Measure it separately from end-to-end success rate. A 90% intent accuracy with a 95% downstream success rate yields 85.5% overall — but in NBFC credit, a 10% misclassification rate can mean 10% of customers receiving wrong MITC or incorrect eligibility guidance.",
      questions: ["What is the intent classification accuracy for your top 10 NBFC/UPI use cases?", "What is the GRO escalation path when intent confidence falls below 0.7 threshold?"],
      metric: "Intent classification accuracy",
      slo: "> 92% accuracy on top 10 NBFC intents; human GRO handoff below 0.7 confidence",
      resources: [
        { title: "Anthropic — Building Effective Agents", url: "https://www.anthropic.com/engineering/building-effective-agents", type: "guide", tag: "global" },
        { title: "Google — Intent Classification Best Practices", url: "https://cloud.google.com/dialogflow/es/docs/concepts/intent", type: "docs", tag: "global" },
      ],
    },
    planner: {
      type: "ai",
      title: "Planner LLM (ReAct: Reason + Act)",
      desc: "The orchestrating model that receives the customer goal, reasons about the required steps — AA consent pull, CIBIL bureau check, BRE evaluation, MITC generation — selects tools to call, observes results, and iterates until the goal is met. Under RBI Digital Lending Guidelines 2022, every agent step in a credit decision flow must be logged for audit.",
      analogy: "The NBFC loan processing officer: assesses the credit application, decides which bureau checks and CBS queries to run, coordinates the BRE evaluation, returns the sanctioned or rejected outcome — with a full paper trail.",
      pmInsight: "Every planning step adds latency and cost, and compounds failure probability. A 6-step NBFC loan agent (AA pull → CIBIL → BRE → MITC generation → policy retrieval → decision log) at 90% step reliability = 53% end-to-end success. Budget for this explicitly in your NBFC conversion rate projections.",
      questions: ["What is the maximum number of reasoning steps allowed per NBFC loan query, and what NPCI session timeout does this need to fit within?", "Is there a ₹-denominated cost budget per agent invocation that triggers a graceful BRE-only fallback?"],
      metric: "NBFC agent task completion rate and step count distribution",
      slo: "Define max steps, max latency (NPCI session timeout aligned), and max ₹ cost per agent invocation before launch",
      resources: [
        { title: "Yao et al. — ReAct: Synergizing Reasoning and Acting (2023)", url: "https://arxiv.org/abs/2210.03629", type: "paper", tag: "global" },
        { title: "Anthropic — Tool Use Documentation", url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview", type: "docs", tag: "global" },
        { title: "Google SRE Workbook — Managing Incidents", url: "https://sre.google/workbook/incident-response/", type: "guide", tag: "global" },
      ],
    },
    "tool-web": {
      type: "server",
      title: "RBI Circular Search (Regulatory Updates)",
      desc: "Allows the agent to retrieve current information from approved regulatory sources: RBI.org.in circular updates, NPCI framework changes, SEBI/IRDAI notifications. Introduces non-determinism — RBI circulars update and cannot be audited from a fixed snapshot without versioning.",
      analogy: "The NBFC compliance desk's regulatory tracker: retrieves the latest RBI circular on digital lending or PMLA on demand — but only from RBI.org.in, not from unverified third-party sources.",
      pmInsight: "Restrict regulatory web search to an RBI/NPCI/SEBI/IRDAI domain allowlist. An NBFC agent citing a non-official or outdated RBI interpretation in a customer credit response is a Digital Lending Guidelines compliance breach. Log all retrieved RBI content with circular number and effective date.",
      questions: ["Is regulatory search restricted to RBI.org.in, NPCI.org.in, and other approved government domains?", "Are retrieved RBI circulars logged with circular number, publication date, and effective date for audit?"],
      metric: "Regulatory content audit coverage",
      slo: "100% of RBI content retrieved in regulated flows logged with source URL, circular number, and timestamp",
      resources: [
        { title: "Anthropic — Web Search Tool", url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/web-search-tool", type: "docs", tag: "global" },
        { title: "RBI Notifications Portal", url: "https://rbi.org.in/Scripts/BS_CircularIndexDisplay.aspx", type: "regulation", tag: "india" },
      ],
    },
    "tool-db": {
      type: "database",
      title: "CBS / AA Data Query (Account + Financial Data)",
      desc: "Read access to the customer's CBS loan account data (EMI schedule, outstanding principal, NACH mandates) and AA-consented financial data (bank statements, salary credits, GST filing summaries from FIPs). The most sensitive tool in the NBFC agent toolkit — must be scoped to AA-consented data categories only.",
      analogy: "The NBFC credit officer's read-only access to the customer's CBS account file and AA-consented bank statements: requires confirmed AA consent and CKYC verification before any data is accessed.",
      pmInsight: "Define the exact AA data categories and CBS fields the agent can read for each use case before engineering. Never grant broad AA or CBS access. A credit eligibility agent needs bank statement and salary data; it does not need the customer's insurance policy details or GST turnover — even if AA consent technically covers them.",
      questions: ["What AA data categories (bank statements, salary, GST, MF) are accessed per agent use case, and are all justified by the credit decision?", "Are CBS and AA data queries logged with the specific agent intent that triggered them?"],
      metric: "AA consent scope compliance rate",
      slo: "Zero agent AA or CBS queries outside the minimum consented data scope for each use case",
      resources: [
        { title: "Anthropic — Tool Use Patterns", url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview", type: "docs", tag: "global" },
        { title: "RBI AA Master Direction 2016", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=10598", type: "regulation", tag: "india" },
        { title: "Sahamati — AA FIP Technical Specs", url: "https://sahamati.org.in/aa-ecosystem/", type: "docs", tag: "india" },
      ],
    },
    "tool-api": {
      type: "server",
      title: "NPCI / CBS Action APIs (Execute)",
      desc: "Executes real-world financial actions via NPCI rails: UPI payment initiation, NACH mandate creation, IMPS transfer; and via CBS: loan disbursement, EMI reschedule, NOC issuance. These are irreversible or hard-to-reverse actions — the highest-risk tools in the NBFC agent toolkit.",
      analogy: "The NBFC's authorised payment desk and disbursement team: executes real NPCI money movements and CBS loan actions on the customer's behalf — with maker-checker sign-off above ₹50,000.",
      pmInsight: "Every NPCI and CBS API call must be idempotent (unique idempotency key per invocation) and logged with the full agent decision chain. Require maker-checker human confirmation for any UPI/NACH action above a ₹ value threshold or for first-time NACH mandate creation. This is an RBI Digital Lending Guidelines product decision, not an engineering default.",
      questions: ["What ₹ value and action category thresholds require maker-checker human confirmation before NPCI/CBS execution?", "Are all UPI and NACH API calls idempotent with a unique idempotency key per agent invocation?"],
      metric: "Unauthorised NPCI/CBS action rate",
      slo: "Zero NPCI/CBS calls outside defined scope; 100% idempotency key coverage; maker-checker for NACH mandates > ₹50,000",
      resources: [
        { title: "Stripe — Idempotent Requests Pattern", url: "https://stripe.com/docs/api/idempotent_requests", type: "docs", tag: "global" },
        { title: "NPCI UPI Settlement Framework", url: "https://www.npci.org.in/what-we-do/upi/product-overview", type: "docs", tag: "india" },
        { title: "RBI PMLA Guidelines for NBFCs", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11566", type: "regulation", tag: "india" },
      ],
    },
    "tool-code": {
      type: "server",
      title: "Code Execution (BRE / MITC / Compute)",
      desc: "Runs sandboxed code for deterministic computation: EMI schedule calculation, CIBIL score band classification, MITC document generation, amortisation table formatting. Allows the NBFC agent to perform reliable numeric computation rather than relying on LLM arithmetic — critical for RBI-compliant loan term calculations.",
      analogy: "The NBFC's credit analytics team: runs EMI calculations, generates MITC schedules, formats the loan sanction letter — with deterministic arithmetic that can be reproduced for RBI audit.",
      pmInsight: "Code execution adds reliability for NBFC numeric tasks (LLM EMI arithmetic is unreliable for large ₹ amounts and tenure calculations). Ensure the sandbox has no network access and cannot read CBS or AA data files outside its designated workspace — sandbox escapes in credit computation are a DPDP Act breach.",
      questions: ["Is the code execution sandbox fully network-isolated and DPDP Act compliant?", "What is the maximum execution time and resource limit per EMI calculation or MITC generation call?"],
      metric: "Code execution sandboxing compliance and MITC calculation accuracy",
      slo: "Zero sandbox escapes; execution timeout ≤ 30s; MITC calculations verified against CBS source of truth",
      resources: [
        { title: "Anthropic — Code Execution Tool", url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/code-execution-tool", type: "docs", tag: "global" },
        { title: "Google SRE Workbook — Safe Automation", url: "https://sre.google/workbook/non-abstract-design/", type: "guide", tag: "global" },
      ],
    },
    memory: {
      type: "database",
      title: "Memory (Context Store)",
      desc: "Stores intermediate NBFC agent results across reasoning steps: AA consent reference, CIBIL score snapshot, BRE eligibility output, current MITC version. Short-term memory lives in the active context window; long-term memory persists to a DPDP Act-compliant store for the agent to query across sessions within the AA consent validity window.",
      analogy: "The NBFC case file the credit officer maintains throughout a multi-day loan application: AA consent reference, bureau score, and BRE decision persist until the case is sanctioned or rejected — then archived per RBI loan record retention requirements.",
      pmInsight: "Memory design determines whether your NBFC agent can handle multi-turn loan workflows (Day 1: AA consent; Day 2: bureau check; Day 3: MITC sign-off). Decide what must persist across sessions (AA consent reference, CIBIL snapshot) vs. what resets per session. DPDP Act data minimisation applies to everything in the memory store.",
      questions: ["What AA consent and credit decision data persists across sessions, and what is the DPDP Act retention and deletion policy?", "Is cross-session memory subject to the same AA consent validity period and RBI audit access controls as the CBS ledger?"],
      metric: "Memory context accuracy in multi-turn NBFC loan tasks",
      slo: "Cross-session memory subject to AA consent validity period, DPDP Act data minimisation, and RBI 5-year loan record retention",
      resources: [
        { title: "Anthropic — Memory Tool Documentation", url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/memory-tool", type: "docs", tag: "global" },
        { title: "DPDP Act 2023 — Data Minimisation & Retention", url: "https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9-5316-4ef0-a86f-af5f7663ffe4.pdf", type: "regulation", tag: "india" },
      ],
    },
    "agent-response": {
      type: "server",
      title: "Response + RBI Audit Log",
      desc: "The final customer-facing NBFC answer plus a complete, immutable audit record of every step the agent took: NPCI/CBS tools called, AA data categories accessed, BRE decisions made, MITC version cited, model version used, and RBI policy version in force. Under RBI Digital Lending Guidelines 2022 and PMLA, the audit log is as important as the response.",
      analogy: "The NBFC case closure summary: the customer receives the loan decision and MITC; the RBI compliance file receives every agent decision step — AA consent reference, CIBIL score, BRE output, and MITC version — in immutable, inspection-ready format.",
      pmInsight: "Build the RBI-format audit log before the product feature. Retroactively reconstructing agent NBFC decision chains from logs is expensive and often incomplete — and RBI inspections are not forewarned. Define audit log schema, retention period (minimum 5 years for loan records), and review process in the feature spec.",
      questions: ["Is the NBFC agent audit log immutable, write-once, and in RBI-inspection-ready format?", "What is the retention period — does it meet RBI's minimum 5-year requirement for loan decision records under Digital Lending Guidelines?"],
      metric: "RBI audit log completeness rate",
      slo: "100% of NBFC agent actions logged with NPCI/CBS tool, AA data category, BRE output, MITC version, model version, and timestamp",
      resources: [
        { title: "Anthropic — Production Best Practices", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", type: "docs", tag: "global" },
        { title: "Google SRE Workbook — Postmortem Culture", url: "https://sre.google/workbook/postmortem-culture/", type: "guide", tag: "global" },
        { title: "RBI DLG 2022 — Audit & Traceability Requirements", url: "https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12382", type: "regulation", tag: "india" },
      ],
    },
  },

  stack: {
    entry: {
      type: "client",
      title: "Customer Intent Intake",
      desc: "Capture the customer's goal, account context, AA consent status, and Aadhaar-verified identity boundary before any AI action is taken. This is the intake boundary — what the customer brings in determines everything downstream.",
      analogy: "The Jan Dhan account holder at a BC (Business Correspondent) kiosk: customer-facing, handles display, and forwards the request to the NBFC back-office with KYC and consent already confirmed.",
      pmInsight: "Missing AA consent or failed Aadhaar verification at intake causes wrong financial actions downstream. Use segment-aware intake flows with mandatory AA consent confirmation and V-KYC status checks before routing to the AI pipeline.",
      questions: ["Does the intake flow confirm AA consent scope and Aadhaar/V-KYC status before routing to the AI pipeline?", "What is the fallback experience when V-KYC verification fails or the customer hasn't yet completed AA consent?"],
      metric: "Intent-to-correct-route rate",
      slo: "> 95% of intents correctly classified and routed without human re-routing",
      resources: [
        { title: "Google Material Design — Input & Forms", url: "https://m3.material.io/", type: "guide", tag: "global" },
        { title: "UIDAI — Aadhaar Authentication API", url: "https://uidai.gov.in/en/ecosystem/authentication-devices-documents.html", type: "docs", tag: "india" },
        { title: "RBI V-KYC Master Direction", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11566", type: "regulation", tag: "india" },
      ],
    },
    safety: {
      type: "server",
      title: "KYC / AML / PMLA Guardrails",
      desc: "Apply CKYC registry checks, Aadhaar eKYC, AML/PMLA transaction monitoring, OFAC/UN sanctions screening, and DPDP Act consent validation before and after generation. Both pre-model (input gate) and post-model (output gate) checks are required.",
      analogy: "The NBFC compliance officer's pre-approval checklist: every customer interaction is screened for PMLA watchlists, CKYC status, and DPDP Act consent validity before any AI recommendation is shown.",
      pmInsight: "The guardrail layer must run pre-model (to restrict input scope and enforce RBI eligibility criteria) and post-model (to validate output safety and MITC compliance). Treating it as an afterthought is the most common architecture mistake in Indian regulated AI.",
      questions: ["Does the guardrail run both pre-model (eligibility gate) and post-model (MITC compliance check)?", "How quickly can new RBI Master Direction rules be deployed into the guardrail BRE without a model retrain?"],
      metric: "Regulatory policy breach detection rate",
      slo: "< 0.1% undetected RBI or PMLA policy breach at launch; 100% DPDP consent validated before model access",
      resources: [
        { title: "Anthropic — Constitutional AI and Safety", url: "https://www.anthropic.com/research", type: "paper", tag: "global" },
        { title: "OWASP — LLM Top 10 Security Risks", url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/", type: "guide", tag: "global" },
        { title: "RBI PMLA Master Direction 2016 (amended)", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11566", type: "regulation", tag: "india" },
      ],
    },
    router: {
      type: "server",
      title: "Risk-Based Routing",
      desc: "Route requests by RBI-defined risk tier: deterministic BRE for standard servicing queries, narrow model for supervised NBFC credit queries, expert human review for high-value or low-bureau-confidence decisions.",
      analogy: "The NBFC credit committee routing desk: low-value standard requests go straight to the BRE, medium-risk queries to the AI underwriting model, high-value or low-CIBIL-score cases to a human credit officer.",
      pmInsight: "High-risk NBFC credit cases processed through a low-control automated path violate RBI's risk-proportionate supervision expectations. Route-level SLOs — latency, quality, and compliance thresholds — must be defined per tier before launch.",
      questions: ["What CIBIL score band or loan value threshold triggers escalation from BRE to AI model to human review?", "Are route-level SLOs (latency, quality, compliance) defined and monitored separately for each risk tier?"],
      metric: "Approved decision cost per case by tier",
      slo: "100% of bureau-score-below-threshold or high-value decisions routed for human review; BRE handles > 60% of standard servicing intents",
      resources: [
        { title: "Anthropic — Prompt Routing Patterns", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-of-thought", type: "docs", tag: "global" },
        { title: "Google SRE Book — Ch 5: Eliminating Toil", url: "https://sre.google/sre-book/eliminating-toil/", type: "guide", tag: "global" },
        { title: "RBI Fair Practices Code for NBFCs", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12256", type: "regulation", tag: "india" },
      ],
    },
    retrieval: {
      type: "database",
      title: "Policy + Ledger + AA Data Retrieval",
      desc: "Fetch current RBI Master Directions, NBFC credit policies, AA-consented financial data (bank statements, salary credits), and CKYC records to ground every AI response in authoritative, consent-gated data.",
      analogy: "The NBFC relationship manager assembling the credit file before the credit committee meets: AA bank statements, CBS loan history, CIBIL bureau score, and the applicable RBI Master Direction clause — all confirmed before the decision is made.",
      pmInsight: "Retrieval latency is on the AI pipeline's critical path. AA FIP data pull can take 2–5s for some banks. Set individual p95 SLOs for AA pull, CKYC lookup, CIBIL API, and vector store RBI policy search. Stale AA consent or expired CKYC must be caught here, not after the model call.",
      questions: ["What is the p95 latency for AA FIP data pull from your top-5 partner banks?", "Are stale AA consent tokens and expired CKYC records caught at retrieval time before entering the model context?"],
      metric: "Cited-answer coverage and AA data freshness rate",
      slo: "< 3s AA FIP pull p95; RBI circular index freshness ≤ 24h; retrieval precision@5 > 0.85",
      resources: [
        { title: "Lewis et al. — RAG Paper (2020)", url: "https://arxiv.org/abs/2005.11401", type: "paper", tag: "global" },
        { title: "Anthropic Cookbook — RAG Patterns", url: "https://github.com/anthropics/anthropic-cookbook/tree/main/misc/retrieval_augmented_generation", type: "guide", tag: "global" },
        { title: "Sahamati — AA Data Flow Specifications", url: "https://sahamati.org.in/aa-ecosystem/", type: "docs", tag: "india" },
      ],
    },
    model: {
      type: "ai",
      title: "Decision Intelligence Model",
      desc: "Generate credit explanations, loan eligibility assessments, and next-best actions constrained by RBI Fair Practices Code and NBFC-specific credit policy rules encoded in the prompt and BRE guardrails.",
      analogy: "The NBFC credit analyst: reads the full AA bank statement and bureau report, weighs every transaction pattern, and generates a nuanced credit assessment — within the bounds of the RBI-approved credit policy.",
      pmInsight: "Set temperature to 0.0–0.2 for any output that constitutes a credit decision or MITC disclosure. Model inference is typically 60–80% of end-to-end latency. AA bank statement context (3,000–5,000 tokens) is your biggest cost driver — audit this before setting NBFC underwriting SLOs.",
      questions: ["Is temperature ≤ 0.2 for all credit decision and MITC disclosure outputs?", "What is the p95 inference latency at your AA bank statement token volume (typically 3,000–5,000 tokens)?"],
      metric: "Decision accuracy under RBI policy constraints",
      slo: "Temperature ≤ 0.2 for credit outputs; p95 inference < 3s for NBFC servicing flows",
      resources: [
        { title: "Anthropic — Claude Model Documentation", url: "https://docs.anthropic.com/en/docs/about-claude/models", type: "docs", tag: "global" },
        { title: "Anthropic — Prompt Engineering Best Practices", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", type: "docs", tag: "global" },
      ],
    },
    tools: {
      type: "server",
      title: "NPCI / Core Banking APIs",
      desc: "Execute deterministic financial actions via NPCI rails: UPI payment initiation, NACH mandate creation, IMPS transfer, loan disbursement via CBS — all through RBI-licensed payment infrastructure with idempotency keys and maker-checker controls.",
      analogy: "The NBFC payments and disbursement desk: every UPI transfer, NACH mandate, and loan credit is executed with a formal instruction ticket, idempotency key, and maker-checker sign-off — no side effects without explicit approval.",
      pmInsight: "Define the exact NPCI and CBS API surface the AI can call before engineering starts. Every CBS field the AI reads is a data governance decision; every UPI/NACH action it initiates is an RBI risk decision. These boundaries belong in the feature spec, not the sprint backlog.",
      questions: ["Which NPCI/CBS endpoints can the AI call autonomously vs. with maker-checker human approval?", "Are all AI-initiated UPI and NACH transactions covered by a unique idempotency key per NPCI standards?"],
      metric: "Action success rate with zero unauthorised NPCI transactions",
      slo: "Zero AI-initiated actions outside defined NPCI/CBS permission scope; 100% idempotency key coverage on all NACH/UPI calls",
      resources: [
        { title: "Anthropic — Tool Use Overview", url: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview", type: "docs", tag: "global" },
        { title: "NPCI NACH Technical Specifications", url: "https://www.npci.org.in/what-we-do/nach/product-overview", type: "docs", tag: "india" },
        { title: "NPCI UPI API Integration Guide", url: "https://www.npci.org.in/what-we-do/upi/product-overview", type: "docs", tag: "india" },
      ],
    },
    response: {
      type: "client",
      title: "MITC Response & Explanation",
      desc: "Convert model and NPCI/CBS outputs into customer-safe explanations with RBI-required MITC disclosures, traceable source references, and Grievance Redressal Officer (GRO) links as mandated by Digital Lending Guidelines 2022.",
      analogy: "The NBFC loan officer handing over the sanction letter with the MITC document: clear, traceable, with the GRO contact for disputes — no ambiguous credit language, no ungrounded claims.",
      pmInsight: "Overconfident credit decision language without source traceability is a direct violation of RBI Digital Lending Guidelines 2022 Section 10. Every customer-facing credit statement must cite the source policy version and offer a GRO escalation path.",
      questions: ["Does every AI-generated credit explanation include MITC citations and a GRO escalation link as required by DLG 2022?", "What confidence label or disclaimer is shown when the model's credit explanation has low retrieval grounding?"],
      metric: "MITC disclosure rate and customer trust score",
      slo: "100% MITC disclosure rate; GRO link present in 100% of credit decision responses",
      resources: [
        { title: "Anthropic — Citations in Claude", url: "https://docs.anthropic.com/en/docs/build-with-claude/citations", type: "docs", tag: "global" },
        { title: "RBI DLG 2022 — MITC Disclosure Requirements", url: "https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12382", type: "regulation", tag: "india" },
        { title: "RBI GRO Requirements for NBFCs", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12552", type: "regulation", tag: "india" },
      ],
    },
    feedback: {
      type: "ai",
      title: "Monitoring, Audit & RBI Review Loop",
      desc: "Evaluate decision quality, segment-level fairness across CIBIL bands, PMLA leakage, DPDP Act data handling, and RBI policy compliance from live production signals — feeding results into the next model and BRE deployment cycle.",
      analogy: "The NBFC model risk committee and compliance audit function: monthly review of AI credit decision quality, fairness across income segments, and PMLA leakage — with findings feeding back into the next deployment cycle.",
      pmInsight: "Build the RBI-format audit log before the product feature launches. Retroactively reconstructing NBFC AI decision chains is expensive and often incomplete — and RBI inspections are unannounced. Define audit log schema, retention period (minimum 5 years for loan records), and the monthly model risk review process in the feature spec.",
      questions: ["Is the NBFC AI decision audit log immutable, write-once, and in RBI-inspection-ready format?", "Are monthly model risk committee reviews with compliance stakeholders scheduled before the feature goes live?"],
      metric: "Pre-release regression catch rate and RBI audit log completeness",
      slo: "100% of AI credit decisions logged with model version, CIBIL snapshot, AA consent reference; monthly fairness eval across CIBIL bands; 5-year retention",
      resources: [
        { title: "Google SRE Workbook — Monitoring and Alerting", url: "https://sre.google/workbook/alerting-on-slos/", type: "guide", tag: "global" },
        { title: "Anthropic — Evaluating AI Systems", url: "https://www.anthropic.com/research", type: "paper", tag: "global" },
        { title: "RBI Inspection and Audit Framework for NBFCs", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12256", type: "regulation", tag: "india" },
        { title: "DPDP Act 2023 — Data Audit Requirements", url: "https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9-5316-4ef0-a86f-af5f7663ffe4.pdf", type: "regulation", tag: "india" },
      ],
    },
  },
  'credit-intel': {
    bureau: {
      type: "integration",
      title: "Credit Bureau API",
      desc: "Pulls CIBIL/Experian/CRIF credit reports in real time at application. Returns bureau score, trade line history, DPD data, enquiry count, and match confidence. Bureau hit rate for salaried applicants is ~95%; for thin-file/NTC it falls to 40–60%, requiring alternative signals. RBI mandates bureau check for all retail loans above ₹5 lakh.",
      analogy: "The NBFC credit officer's first check: before meeting the customer, pull their bureau report to understand their credit history, outstanding obligations, and any red flags — before a single rupee of processing cost is spent.",
      pmInsight: "Decide bureau priority order and fallback logic. Two-bureau waterfall adds ~200ms but reduces 'no-hit' declines by ~15%. Pay-per-hit pricing (~₹12–18/pull) means a 30% approval rate justifies pulling bureau only after a pre-screen. Track bureau hit rate by segment — it directly determines your approachable market.",
      questions: ["What is the bureau hit rate for your target NTC segment, and what is the fallback scoring strategy?", "Do you have a two-bureau waterfall or single bureau primary with a manual review fallback?"],
      metric: "Bureau hit rate",
      slo: "≥92% for salaried segment",
      resources: [
        { title: "RBI — Fair Practices Code for NBFCs", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12552", type: "regulation", tag: "india" },
        { title: "TransUnion CIBIL — Developer Resources", url: "https://www.cibil.com/developer-resources", type: "docs", tag: "india" },
        { title: "IFC — Alternative Data for Credit Scoring", url: "https://www.ifc.org/content/dam/ifc/doc/mgrt/ifc-fintech-note-8-alternativedata.pdf", type: "paper", tag: "global" },
      ],
    },
    scorecard: {
      type: "ml",
      title: "Scorecard Engine",
      desc: "Translates bureau, application, and behavioral data into a credit score using logistic regression or gradient boosting. Three scorecard types: Application (AAT), Behavioral (BAT), Bureau (BKT). Scorecards are binned into Fine/Coarse bins for explainability; weights are derived via WoE/IV analysis. Models must be independently validated every 6 months per RBI model risk guidelines.",
      analogy: "The NBFC underwriter's decision matrix: bureau + income + employment data → risk tier → approve/refer/decline, with documented rationale for every tier boundary and cut-off.",
      pmInsight: "Champion-challenger framework is essential: run a new challenger at 5–10% traffic before full cutover. Define KS statistic and Gini thresholds for 'acceptable model.' Set a re-training trigger: if PSI > 0.25, escalate to model risk committee. Silent model degradation — where the model slowly drifts without anyone noticing — is the most common cause of NPA spikes at digital lenders.",
      questions: ["What is the current KS statistic for your primary application scorecard, and when was it last validated?", "How often is champion-challenger testing run, and who approves a full scorecard cutover?"],
      metric: "KS Statistic",
      slo: "≥0.35 for primary application scorecard",
      resources: [
        { title: "Naeem Siddiqi — Intelligent Credit Scoring (Scorecard Design)", url: "https://www.wiley.com/en-in/Intelligent+Credit+Scoring-p-9781119279150", type: "paper", tag: "global" },
        { title: "Kaggle — Give Me Some Credit Dataset", url: "https://www.kaggle.com/c/GiveMeSomeCredit", type: "guide", tag: "global" },
        { title: "RBI — Supervisory Framework for AI/ML in NBFCs", url: "https://rbi.org.in/Scripts/PublicationsView.aspx?id=22467", type: "regulation", tag: "india" },
      ],
    },
    bre: {
      type: "service",
      title: "BRE / Policy Engine",
      desc: "Business Rule Engine applies credit policy as structured if/then rules: hard cutoffs (CIBIL < 650 = decline), soft cutoffs (DPD in 12M = refer to credit), and override workflows for exceptions. Modern NBFCs use decision tables (Drools, custom engines). Rules are versioned and deployed without code releases, giving credit teams real autonomy over policy.",
      analogy: "The credit policy manual brought to life: every lending rule — minimum score, maximum FOIR, bureau enquiry cap — encoded and executable, with a full audit trail of every decision it made.",
      pmInsight: "Own the rules-as-code vs credit-team-owned debate. Credit needs agility (rule change in hours, not sprints). Solution: credit team owns rules in a UI, PM gates deployment via A/B traffic allocation. Set NPA impact thresholds for automatic rollback. RBI expects documented rationale for every underwriting rule change — this becomes an inspection artifact.",
      questions: ["What is the current lead time from a credit policy change request to production deployment?", "Does the BRE maintain a complete version history with business rationale for every rule change?"],
      metric: "Rule deployment lead time",
      slo: "<4 hours from credit team request to production",
      resources: [
        { title: "Drools — Business Rules Engine Documentation", url: "https://www.drools.org/learn/documentation.html", type: "docs", tag: "global" },
        { title: "RBI — Digital Lending Guidelines 2022", url: "https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12382", type: "regulation", tag: "india" },
        { title: "Martin Fowler — Rules Engines", url: "https://martinfowler.com/bliki/RulesEngine.html", type: "guide", tag: "global" },
      ],
    },
    altdata: {
      type: "data",
      title: "Alternative Data",
      desc: "Supplements bureau with non-traditional signals: device metadata (OS version, rooted phone flag), utility bill payment history, telco recharge regularity, GST filings for SMEs, and e-commerce order history. Alternative data lifts approval rates for NTC (new-to-credit) borrowers by 20–30% without worsening NPA — opening the thin-file market.",
      analogy: "Reading a customer's financial character through everyday behaviour — not just what they've borrowed, but how reliably they pay their Jio bill or recharge their DTH subscription.",
      pmInsight: "RBI digital lending guidelines require disclosure of all data points used in credit decisions. Before adding any alternative signal, run a disparate impact analysis — does it proxy for religion, caste, or gender? DPDP Act 2023 requires explicit consent for non-financial data. Validate predictive lift annually — some signals decay fast as population behaviour shifts.",
      questions: ["Has each alternative data signal been tested for disparate impact across gender and geographic segments?", "Is DPDP Act 2023 consent captured before any non-financial data is used in credit scoring?"],
      metric: "NTC approval rate lift vs bureau-only baseline",
      slo: "+15–25% NTC approval rate with no material NPA worsening",
      resources: [
        { title: "IFC — Alternative Data Transforming SME Finance", url: "https://www.ifc.org/content/dam/ifc/doc/mgrt/ifc-fintech-note-8-alternativedata.pdf", type: "paper", tag: "global" },
        { title: "iSPIRT — Account Aggregator Ecosystem", url: "https://sahamati.org.in/account-aggregator-ecosystem/", type: "guide", tag: "india" },
        { title: "DPDP Act 2023 — Consent Requirements (MeitY)", url: "https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9-5316-4ef0-a86f-af5f7663ffe4.pdf", type: "regulation", tag: "india" },
      ],
    },
    'aa-cashflow': {
      type: "integration",
      title: "AA Cash Flow Engine",
      desc: "Account Aggregator 2.0 pulls 24 months of bank statement data from FIPs (RBI-regulated banks) with user consent. Extracts salary credits, EMI debits, merchant spends, and balance volatility to build a cash flow score. Cash flow underwriting is superior to bureau for self-employed, gig workers, and thin-file borrowers. The AA ecosystem has 50+ live FIPs as of 2026.",
      analogy: "The NBFC loan officer who asks to see your last 12 bank statements — but digitally, instantly, and with your explicit one-time consent instead of a stack of physical paper printouts.",
      pmInsight: "Cash flow underwriting pipeline: AA consent → FIP data fetch (avg 18 sec) → transaction categorisation → income estimation → obligation extraction → net cash flow score. Key decision: AA as primary or supplementary data source. For salaried: supplement bureau. For self-employed: AA is primary. Monitor FIP availability — some banks have 40%+ failure rates on weekends.",
      questions: ["What is your AA consent completion rate for the self-employed segment?", "Which FIPs have the highest failure rates on your platform, and what is your retry or fallback strategy?"],
      metric: "AA consent completion rate",
      slo: "≥65% for self-employed segment; FIP data fetch P95 < 30 seconds",
      resources: [
        { title: "Sahamati — AA Technical Specifications", url: "https://sahamati.org.in/account-aggregator-ecosystem/", type: "docs", tag: "india" },
        { title: "RBI — Account Aggregator Master Direction 2021", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12153", type: "regulation", tag: "india" },
        { title: "OCEN 4.0 — Protocol Specifications", url: "https://ocen.dev", type: "docs", tag: "india" },
      ],
    },
    xai: {
      type: "governance",
      title: "Explainable AI (XAI)",
      desc: "Explainability is both a regulatory and operational requirement. RBI Fair Practices Code requires lenders to communicate the reason for rejection in plain language. LIME/SHAP generate feature-level attributions, translated to adverse action codes: 'Low income relative to obligations,' 'Recent missed payment.' XAI also supports retention messaging: 'You'd qualify if your FOIR drops below 50%.'",
      analogy: "The credit officer's decline letter: must clearly state why the loan was rejected in language the customer understands — not 'model output score too low,' but 'your existing EMIs exceed 50% of your monthly income.'",
      pmInsight: "Build an AAC (Adverse Action Code) library with 15–20 standard reason codes mapped to SHAP features. Customer-facing language must pass a grade-7 readability test. For RBI inspections, maintain an audit trail of every rejection reason issued. Never show raw SHAP values to customers — translate them to plain language. Internal XAI for credit analysts can show SHAP waterfalls.",
      questions: ["Does every loan rejection generate a customer-facing reason code in plain language as required by the RBI Fair Practices Code?", "Are SHAP feature attributions auditable per-decision for RBI inspection purposes?"],
      metric: "Customer complaint rate post-rejection",
      slo: "<3% of rejected applicants raise a complaint about inadequate explanation",
      resources: [
        { title: "Lundberg & Lee — A Unified Approach to Interpreting Model Predictions (SHAP)", url: "https://arxiv.org/abs/1705.07874", type: "paper", tag: "global" },
        { title: "RBI — Fair Practices Code for NBFCs", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12552", type: "regulation", tag: "india" },
        { title: "RBI — Customer Service Master Direction 2023", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12560", type: "regulation", tag: "india" },
      ],
    },
    mrm: {
      type: "governance",
      title: "Model Risk Governance",
      desc: "Model Risk Management (MRM) is the oversight framework for all AI/ML models in credit. Covers: model inventory (all live models documented), independent validation before deployment, monthly drift monitoring (PSI, CSI, KS), escalation pathways, and board-level reporting. RBI expects Tier-1 NBFCs to have MRM frameworks equivalent to BCBS d328 guidelines.",
      analogy: "The NBFC's internal audit function for AI: every model has a model card, a validation report, a live monitoring dashboard, and an escalation pathway — just like every loan product has a formal credit policy document.",
      pmInsight: "Own the model card for every ML model: inputs, outputs, training data vintage, known biases, escalation thresholds. Set 'model risk appetite': which models can auto-approve vs which require human overlay? Establish a monthly model governance committee with risk + data science + product. A single undocumented model found in an RBI inspection can trigger a show-cause notice.",
      questions: ["Is there a complete model inventory with last validation date for every credit model in production?", "What are the automated escalation thresholds for PSI and KS drift — who receives the alert and within what SLA?"],
      metric: "Model re-validation cycle",
      slo: "100% of production models validated within 6-month cycle; PSI > 0.25 triggers mandatory re-training",
      resources: [
        { title: "BCBS d328 — Principles for Sound Management of Operational Risk", url: "https://www.bis.org/publ/bcbs328.pdf", type: "paper", tag: "global" },
        { title: "RBI — Supervisory Framework for AI/ML in Financial Services", url: "https://rbi.org.in/Scripts/PublicationsView.aspx?id=22467", type: "regulation", tag: "india" },
        { title: "OCC 2011-12 — Supervisory Guidance on Model Risk Management", url: "https://www.occ.treas.gov/news-issuances/bulletins/2011/bulletin-2011-12.html", type: "guide", tag: "global" },
      ],
    },
  },
  'india-stack': {
    'aadhaar-kyc': {
      type: "integration",
      title: "Aadhaar eKYC / V-KYC",
      desc: "Aadhaar-based eKYC uses UIDAI OTP or biometric authentication to verify identity and pre-fill KYC fields instantly. V-KYC (Video KYC) enables full-KYC remotely via live video with an agent, face match, and document verification — mandated for accounts/loans above RBI thresholds. V-KYC completion rates average 72% for personal loans in 2026 due to connectivity and scheduling friction.",
      analogy: "The NBFC branch KYC process — conducted on a smartphone in 5 minutes, with Aadhaar as the identity anchor instead of a physical Voter ID or Passport reviewed by a branch officer.",
      pmInsight: "Design V-KYC scheduling as a product problem: offer 15-minute appointment slots, SMS reminder 30 min before, allow reschedule up to 3 times. Industry best-in-class first-attempt success rate is 82%; average is 65%. Integrate liveness detection (ISO 30107-3 compliant) to prevent spoofing. Top V-KYC failure causes: poor lighting (28%), connectivity drop (22%), document glare (19%).",
      questions: ["What is your V-KYC first-attempt success rate by device type and network tier?", "Does your liveness detection solution comply with ISO 30107-3 for presentation attack detection?"],
      metric: "V-KYC first-attempt success rate",
      slo: "≥75%",
      resources: [
        { title: "UIDAI — eKYC Authentication Developer Section", url: "https://uidai.gov.in/en/ecosystem/authentication-devices-documents/developer-section.html", type: "docs", tag: "india" },
        { title: "RBI — Video KYC Directions (KYC Master Direction 2016)", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11566", type: "regulation", tag: "india" },
        { title: "ISO 30107-3 — Biometric Presentation Attack Detection", url: "https://www.iso.org/standard/67381.html", type: "guide", tag: "global" },
      ],
    },
    digilocker: {
      type: "integration",
      title: "DigiLocker",
      desc: "DigiLocker is India's national document repository with 42.7 crore registered users (Feb 2026). Lenders pull PAN, Aadhaar, driving licence, vehicle RC, and ITR acknowledgments directly from government issuers — eliminating manual upload and document fraud. Integration uses OAuth 2.0. Document freshness is guaranteed as issuers push updates directly.",
      analogy: "A government-certified document vault on your phone: the NBFC doesn't need to verify the document because it came directly from the issuing authority — CBDT for ITR, MoRTH for driving licence.",
      pmInsight: "Use DigiLocker to eliminate document fraud and re-upload friction. Key decision: which documents to mandate vs make optional. ITR via DigiLocker reduces manual income verification processing by ~40%. Monitor DigiLocker API uptime — averages 99.2% but has maintenance windows. Always build a manual upload fallback with fraud scoring.",
      questions: ["Which documents in your LOS journey are fetched via DigiLocker vs still manually uploaded?", "What is the DigiLocker API availability SLA in your deployment, and what is the fallback path during downtime?"],
      metric: "Document fraud rate for DigiLocker-verified documents",
      slo: "<0.5% document fraud rate on DigiLocker-fetched documents",
      resources: [
        { title: "DigiLocker — Developer API Documentation", url: "https://developers.digilocker.gov.in/", type: "docs", tag: "india" },
        { title: "MeitY — Digital Locker System Rules 2016", url: "https://www.meity.gov.in/writereaddata/files/Digital_Locker_Rules_2016.pdf", type: "regulation", tag: "india" },
        { title: "DPDP Act 2023 — Document Data Processing Obligations", url: "https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9-5316-4ef0-a86f-af5f7663ffe4.pdf", type: "regulation", tag: "india" },
      ],
    },
    ckyc: {
      type: "integration",
      title: "CKYC Registry",
      desc: "Central KYC Registry (CKYCR), managed by CERSAI, stores a single KYC record per customer. Once KYC is completed with any regulated entity, a CKYC number is issued. Subsequent lenders download the record without re-doing KYC — reducing per-customer KYC cost from ₹150–300 to ~₹15. RBI mandated CKYC upload for all new customer onboardings since June 2017.",
      analogy: "A national KYC passport: do KYC once with any bank, get a CKYC number, and every subsequent NBFC can verify you with a single API call instead of a full re-KYC process.",
      pmInsight: "Implement CKYC download-first flow: check the registry before triggering fresh KYC. CKYC hit rate for banked customers is ~70%. Design fallback gracefully — if the record is outdated (>5 years), trigger re-KYC only for changed fields. CKYC upload SLA: must upload within 3 business days of onboarding per RBI circular. Non-compliance draws regulatory penalties.",
      questions: ["What is your CKYC hit rate, and what is the fallback flow for the ~30% not in the registry?", "Is CKYC upload automated within the 3-business-day compliance window after every new onboarding?"],
      metric: "CKYC upload compliance rate",
      slo: "100% of new onboardings uploaded within 3 business days",
      resources: [
        { title: "CERSAI — CKYC Registry Portal", url: "https://ckycrbi.gov.in/", type: "docs", tag: "india" },
        { title: "RBI — KYC Master Direction 2016 (CKYC provisions)", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=11566", type: "regulation", tag: "india" },
        { title: "RBI — FAQ on Central KYC Records Registry", url: "https://rbi.org.in/scripts/FAQView.aspx?Id=125", type: "regulation", tag: "india" },
      ],
    },
    aa2: {
      type: "integration",
      title: "Account Aggregator 2.0",
      desc: "The AA framework (RBI 2021) enables consent-based financial data sharing between FIPs (banks, MFs, insurance) and FIUs (lenders, wealth managers). AA 2.0 (2024) expanded to include GSTN, tax, and pension data. 50+ FIPs live as of 2026. Consent is time-bound, purpose-limited, and customer-revocable — a fundamental shift from screen-scraping to consented data access.",
      analogy: "A consent-based financial data passport: you decide which institution shares what data with which lender, for what purpose, and for how long — and you can revoke it at any time from the AA app.",
      pmInsight: "AA is transforming underwriting for self-employed, gig workers, and SMEs who lack payslips. Monitor FIP-level availability: top 5 banks average 99%+; smaller banks average 85%. Design consent flow for completion rate — industry average 58%, best-in-class 72%. Use AA data for both credit decisioning and active account monitoring (declining balance = collections early warning signal).",
      questions: ["What is your AA consent completion rate by borrower segment — salaried vs self-employed?", "How do you handle FIP failures mid-consent journey — does the customer have to restart or can they resume?"],
      metric: "AA consent completion rate",
      slo: "≥65% for self-employed segment; ≥75% for salaried segment",
      resources: [
        { title: "Sahamati — AA Technical Specifications and FIP List", url: "https://sahamati.org.in/account-aggregator-ecosystem/", type: "docs", tag: "india" },
        { title: "RBI — Account Aggregator Master Direction 2021", url: "https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12153", type: "regulation", tag: "india" },
        { title: "iSPIRT — Open Credit Enablement Network (OCEN)", url: "https://ocen.dev", type: "guide", tag: "india" },
      ],
    },
    ocen: {
      type: "protocol",
      title: "OCEN 4.0",
      desc: "Open Credit Enablement Network (OCEN) is a credit infrastructure protocol enabling any platform (LSP: Loan Service Provider) to embed lending. The LSP brings borrower context; the NBFC underwrites and disburses. OCEN 4.0 standardised loan offer, acceptance, disbursement, and repayment APIs. Key participants: iSPIRT, SIDBI, and 30+ NBFCs. ONDC-embedded credit and B2B BNPL use OCEN.",
      analogy: "A standardised API contract for embedded lending: any merchant platform or fintech app (LSP) can offer loans to their users by connecting to any NBFC lender through OCEN — the way UPI standardised payments across all banks.",
      pmInsight: "OCEN enables NBFCs to acquire borrowers without distribution cost. Design for: offer API latency (<2 sec), offer validity window (typically 30 min), co-origination credit policy. Monitor offer acceptance rate by LSP — low acceptance signals uncompetitive pricing or high onboarding friction. Be explicit about your OCEN role: LSP, Lender, or both — each has different regulatory obligations under RBI Co-Lending Directions 2026.",
      questions: ["What is your OCEN loan offer API P95 latency from request to offer delivery?", "How do you monitor offer acceptance rate by LSP partner, and what is the escalation threshold?"],
      metric: "Loan offer API P95 latency",
      slo: "<2 seconds from LSP loan request to offer API response",
      resources: [
        { title: "OCEN 4.0 — Protocol Specifications", url: "https://ocen.dev", type: "docs", tag: "india" },
        { title: "iSPIRT — OCEN Implementation Guide", url: "https://ispirt.in/ocen/", type: "guide", tag: "india" },
        { title: "RBI — Co-Lending Directions January 2026", url: "https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12671", type: "regulation", tag: "india" },
      ],
    },
    'upi-autopay': {
      type: "integration",
      title: "UPI AutoPay / NACH",
      desc: "UPI AutoPay enables recurring debit mandates for EMI collection — customer sets up once, debits execute on due date up to ₹1 lakh/transaction. NACH is the traditional bank-to-bank mandate equivalent. NACH return codes are critical operational data: R01 (insufficient funds), R07 (account closed), R08 (payment stopped by customer). Industry presentation success rate averages 85%; top lenders achieve 92%+.",
      analogy: "The NACH mandate is the NBFC's standing instruction to the customer's bank: on the 5th of every month, collect ₹12,500 — automatically, without the customer needing to log in or take any action.",
      pmInsight: "Design repayment as a channel funnel: UPI AutoPay first (cost ~₹2/debit, instant confirmation), NACH second, manual last. For R01 returns at 9am, trigger same-day re-presentation at 2pm — 35% of R01s clear on same-day retry. Define hard delinquent trigger: 2 consecutive NACH returns → field collection queue. TRAI DND regulations strictly govern all reminder SMSes and calls.",
      questions: ["What is your current NACH presentation success rate (PSR), and what is your same-day re-presentation strategy for R01 returns?", "Are all collection communications — SMS, WhatsApp, calls — DND-registry compliant and restricted to permitted hours?"],
      metric: "NACH / UPI AutoPay presentation success rate (PSR)",
      slo: "≥88% for standard EMI on due date",
      resources: [
        { title: "NPCI NACH — Technical Specification and Return Codes", url: "https://www.npci.org.in/what-we-do/nach/product-overview", type: "docs", tag: "india" },
        { title: "NPCI — UPI AutoPay Recurring Payments Documentation", url: "https://www.npci.org.in/what-we-do/upi/product-overview", type: "docs", tag: "india" },
        { title: "TRAI — Unsolicited Commercial Communication Regulations 2019", url: "https://trai.gov.in/sites/default/files/UCC_Regulation_2019.pdf", type: "regulation", tag: "india" },
      ],
    },
    cbdc: {
      type: "emerging",
      title: "e-Rupee CBDC",
      desc: "RBI's Central Bank Digital Currency (e-Rupee) launched retail pilots in 2023. Programmable money features enable: purpose-bound disbursement (loan directly to vendor, not borrower), offline NFC transactions, and instant settlement without intermediary banks. As of 2026, e-Rupee is in pilot with 16 banks — not yet mainstream for NBFC disbursement but relevant for microfinance and agri-lending.",
      analogy: "Digital cash issued by RBI directly: programmable, traceable, and usable offline — imagine disbursing a Kisan Credit Card loan directly to the fertilizer dealer's e-Rupee wallet, bypassing the borrower's bank account entirely.",
      pmInsight: "Monitor e-Rupee pilots for 'NBFC disbursement readiness.' Programmable disbursement solves end-use monitoring — an RBI requirement for priority sector lending. Design an experiment: pilot e-Rupee disbursement for 500 agri loans, measure leakage vs bank transfer. Key risk: UX complexity for first-time digital users. Likely 2–3 year runway to mainstream NBFC adoption.",
      questions: ["Is your NBFC participating in any RBI e-Rupee pilot, and what disbursement use case is being tested?", "How would programmable disbursement change your end-use monitoring process for priority sector loans?"],
      metric: "e-Rupee disbursement success rate (pilot cohort)",
      slo: "≥95% transaction success in controlled pilot cohort",
      resources: [
        { title: "RBI — Report on Currency and Finance (CBDC Chapter)", url: "https://rbi.org.in/Scripts/PublicationsView.aspx?id=22156", type: "regulation", tag: "india" },
        { title: "RBI — Digital Rupee (e-Rupee) FAQ", url: "https://rbi.org.in/scripts/FAQView.aspx?Id=145", type: "guide", tag: "india" },
        { title: "BIS — Retail CBDC Design Considerations", url: "https://www.bis.org/publ/bcbs905.pdf", type: "paper", tag: "global" },
      ],
    },
  },
};

/* ─── SVG Architecture Diagram Inspectors ─── */
const badgeClass = {
  client: "badge-client",
  server: "badge-server",
  database: "badge-database",
  ai: "badge-ai",
  cache: "badge-cache",
  integration: "badge-server",
  ml: "badge-ai",
  service: "badge-client",
  data: "badge-database",
  governance: "badge-cache",
  protocol: "badge-client",
  emerging: "badge-ai",
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
  const resourcesHtml = nodeInfo.resources && nodeInfo.resources.length
    ? `<div class="inspector-resources">
         <p class="inspector-dt" style="margin-top:10px">Learning Resources</p>
         <ul class="resource-list">${nodeInfo.resources.map(r => {
           const icon = { guide: "📖", paper: "📄", docs: "📘", video: "🎥", regulation: "⚖️" }[r.type] || "🔗";
           const badge = r.tag === "india" ? '<span class="resource-tag-india">IN</span>' : '';
           return `<li><a href="${r.url}" target="_blank" rel="noopener noreferrer" class="resource-link">
             <span class="resource-icon">${icon}</span><span class="resource-title">${r.title}</span>${badge}</a></li>`;
         }).join("")}</ul></div>` : "";

  panel.innerHTML = `
    ${badge}
    <h4 class="inspector-title">${nodeInfo.title}</h4>
    <p class="inspector-desc">${nodeInfo.desc}</p>
    ${analogyHtml}
    ${pmHtml}
    ${questionsHtml}
    <div class="inspector-dl">${metricHtml}</div>
    ${resourcesHtml}
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

/* ─── Section 9: Learning Path Generator ─── */
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
  const role = formData.get("role");
  const experience = formData.get("experience");
  const domain = formData.get("domain");
  const goals = formData.get("goals");

  lpSubmit.disabled = true;
  lpSubmit.classList.add("loading");
  lpSubmit.textContent = "Generating your learning path…";
  lpOutput.innerHTML = '<div class="lp-streaming"><em>Claude is thinking and writing your personalised plan…</em></div>';

  let fullText = "";

  try {
    const response = await fetch("/api/learning-path", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role, experience, domain, goals }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || `HTTP ${response.status}`);
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
        if (!data) continue;

        let evt;
        try { evt = JSON.parse(data); } catch { continue; }

        if (evt.text) {
          fullText += evt.text;
          outputDiv.innerHTML = `<div>${simpleMarkdown(fullText)}</div>`;
          lpOutput.scrollIntoView({ behavior: "smooth", block: "end" });
        } else if (evt.error) {
          throw new Error(evt.error);
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

