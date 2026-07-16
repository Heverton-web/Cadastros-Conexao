---
name: designing-ai-interfaces
description: >- Principios de design e padroes de interface para sistemas de IA — UX de copiloto, dashboards e design de agentes
---

# Designing AI Interfaces — Interface Design Principles for AI Systems

## 1. Computation Pipeline: Input → Routing → Generation

### 1.1 Input Processing and Preparation
1. Understand tokenization: text is broken into subword tokens, mapped to numeric IDs, then transformed into vector embeddings (hundreds/thousands of dimensions).
2. Account for formatting sensitivity: capitalization, spacing, and punctuation create distinct token sequences — "Design", "design", and " design" are all different to the model. Prompt formatting directly shapes output.
3. Design for context assembly: the system packages user input with conversation history, user preferences, knowledge base documents, and environmental factors (time, location).
4. For images: use convolutional neural networks (CNNs) that process in layers — edge detection → shapes → textures → object parts → complete concepts.
5. For audio: convert sound to spectral representations (frequency over time).
6. For video: encode each frame as image plus track motion and temporal relationships between frames.

### 1.2 Routing
1. Modern AI systems rarely use a single model — route to document parsers, summarization models, slide generators, design models, and chart models.
2. Determine whether to generate from training data or retrieve from external sources (web, databases, knowledge bases).
3. Transform user prompts into search terms, execute across databases/search engines, rank and filter results by relevance and reliability.
4. Consider that external retrieval is more current/citable; generated content may be less precise.
5. Expose routing metadata to users when it affects output interpretation (which model, which source).

### 1.3 Generation and Inference
1. LLMs generate one token at a time based on probability distributions — like improvisational speaking, not careful planning.
2. Use chain-of-thought (CoT) prompting to force models to break down tasks step by step.
3. Design for known failure modes: rambling/repetition (probability loops), contradictory conclusions (no predetermined endpoint), hallucinations (optimizing for plausible sound, not truth).
4. Image generation (diffusion): starts with random noise, applies learned transformations step by step to match the prompt.
5. Account for multimodal orchestration: requests across content types take longer and can fail in more complex ways.

## 2. Agentic Computation and Task Management

### 2.1 Core Agentic Capabilities
1. System must interpret high-level goals from user: what does the output need to communicate/achieve.
2. Decompose goals into interdependent tasks: gather metrics, summarize updates, find inspiration, create drafts.
3. Manage and sequence tasks across tools and time — track dependencies, tools needed, time estimates.
4. Keep state: which subtasks completed, decisions made, outputs generated, information still unknown.
5. Adjust dynamically: detect when data is missing or results contradict the goal, generate fallback plans.

### 2.2 MCP (Model Context Protocol)
1. Use MCP to share context between steps, tools, and models so agents carry out extended tasks without losing track.
2. MCP provides structured metadata: available tools, how to use them, shared memory, execution log.
3. Enable continuity: agents and tools communicate via MCP, moving fluidly between planning, doing, and adjusting.

### 2.3 Exposing Planning as Structure
1. Surface a draft plan early, even if incomplete — let users see a scaffolded outline before full execution. Example: "Step 1: Gather data. Step 2: Summarize findings. Step 3: Generate presentation."
2. Offer adaptive, interpretable views of the plan as it emerges (not fixed workflow diagrams).
3. Mirror traditional workflow setup phase to help users align expectations.

### 2.4 Step-Level Review and Intervention
1. Allow users to inspect intermediate states: what was input, what happened at each step, what was output.
2. Conduct user research to discover how much each user segment prefers to watch agentic tasks unfold vs. ignore until complete vs. find balance.
3. When users want structured task lists, ensure they're populated with descriptive content about steps, tools, and sources.
4. Support expand/collapse so users control information density.

### 2.5 Visualizing Logic
1. Make retries and loops visible: "Tried summarization with Approach A, then retried with alternate phrasing."
2. Acknowledge processing phases: "Waiting for real-time data to arrive" or "Holding to check time zone settings."
3. Don't let agentic unpredictability excuse opacity — system must remain transparent throughout.

## 3. Output Design Principles

### 3.1 Designing for Clarity
1. Structure outputs with hierarchy: title → H2 section headings → H3 subsections → bulleted/numbered lists → concise paragraphs (max 3 sentences each).
2. Define output templates in system instructions — e.g., Title, Introduction, Key Concepts, Steps, Conclusion/Next Steps, Sources.
3. Specify tone explicitly: "Use a clear, friendly, moderately formal tone. Avoid jargon unless appropriate. Prioritize clarity over creativity."
4. Handle trade-offs with heuristics: "Prioritize readability and logical flow over exhaustive completeness."
5. Plan for missing data: explicitly instruct model to output "No data provided" rather than invent content.
6. Balance structure with flexibility — overly rigid templates increase hallucination rates and erode trust (outputs feel mechanical).

### 3.2 Designing for Verifiability
1. Do NOT rely on confidence indicators from models — LLMs are bad estimators of their own confidence. High token probability ≠ correctness.
2. Instead of confidence scores, ask: can the user independently validate this information?
3. When objective information drives action, provide: traceable sources, side-by-side comparisons, explicit human review opportunities.
4. Use hedging language: "this seems to be true" or "it's difficult to verify" for unverifiable claims.
5. Use AI for quickly-verifiable decisions or subjective tasks (copyediting, rewriting, brainstorming) where usefulness is the benchmark.
6. Surface source attribution inline — Perplexity-style superscript links to origin material.
7. Understand AI overreliance: cognitive forcing functions interrupt automatic acceptance; progressive disclosure builds realistic mental models.

### 3.3 Human-in-the-Loop (HITL)
1. Use HITL for high-risk domains: AI handles routine decisions, escalates edge cases to human reviewers.
2. For highest-risk areas (mental health, legal, medical), use curated libraries of pre-approved content — model selects from safe options, does not generate freely.
3. Research shows well-designed HITL outperforms full automation in domains requiring creativity, ethical reasoning, or edge case handling.

### 3.4 Designing Grounding
1. Surface contextual signals with each output: model name/version, agent/tool responsible, geographic/locale grounding, task/mode, interaction history.
2. Implement "Why we suggested this" affordance — inline, on hover, or behind info icon — revealing what data/files the model consulted, preferences/history used, and which model generated the response.
3. Disclose AI-generated content: comply with regulations (California SB-1001, EU AI Act, FTC guidance). Label AI content clearly and early.
4. Make grounding metadata actionable — let users correct assumptions (e.g., wrong jurisdiction, wrong time period).

### 3.5 Designing for Actionability
1. Provide forward actions: save, buy, book, export, send, cite, navigate — the real value is what users can DO next.
2. Layer secondary interactions on outputs: maps for locations, purchase links for products, itinerary integration for travel.
3. Signal review-before-execute vs. immediate action — "drafting" vs "sending" distinction.
4. Notify users when actions have final impact vs. when they can review.
5. Mark external links and provide returnability cues.

### 3.6 Canvas Pattern
1. Provide interactive, editable workspace for AI-generated content — distinct from linear chat.
2. Canvas traits: editable/composable, spatial layout (not linear), persistent state, multi-modal integration.
3. Support versioning: let users select between versions, publish, save favorites, organize by project/workspace.
4. Allow undo/redo step-by-step in generative edits (image, video, document).
5. Support sharing and collaboration on canvas artifacts.

### 3.7 Designing for Adjustability
1. Support inline edits without restarting — iteration preserves working content and maintains continuity.
2. Offer versions (alternative outputs based on same input) and temperature-like controls.
3. Implement prompt augmentation: when user selects text and clicks "Elaborate", append directive to original prompt and regenerate only that section.
4. Surface available adjustment tools clearly — users must know they CAN select and modify.
5. Support iterative refinement: clicking "Elaborate" multiple times gradually increases length/depth.

## 4. Multi-turn Output Design

### 4.1 Continuity and Clarity
1. Use turn markers or visual separators to distinguish new steps or phases.
2. Inline edits with change annotations — show how one step builds on or modifies the last.
3. Provide rolling side panels or timelines showing the structure of ongoing tasks.
4. Named threads or tasks that can be returned to later.
5. Always make clear the relationship between current output and what came before — if user says "revise the second paragraph", show which paragraph is being changed and what else may be impacted.

### 4.2 State Management
1. Treat interactions as sessions, threads, or workflows — extended arcs that can be paused, resumed, branched, or redirected.
2. Support context continuity across turns: the system must track topic shifts, emotional tone, intention changes.
3. Allow forking, revision, or abandonment without penalty.
4. Design for outputs as milestones in a long-form dialogue — auditable, interruptible, steerable.

## 5. Error Design

### 5.1 Understand Failure Types
1. System errors (detectable): servers crash, connections timeout, APIs return error codes — system KNOWS it failed.
2. Reasoning errors (undetectable): model confidently states wrong information — NO error flag, no uncertainty signal. The burden shifts to the user.

### 5.2 Making Errors Understandable
1. Use plainspoken, specific copy: "We couldn't upload your file. Try a PDF or JPG." — not "Error 413" or "CORS policy."
2. Place error messages near the issue location (next to form field, under disabled button).
3. Avoid implying user fault: "Let's try a different approach" instead of "We couldn't understand your input."
4. Acknowledge that AI errors can look like success — grammatically correct but factually wrong.

### 5.3 Making It Recoverable
1. Offer undo for seemingly irreversible actions.
2. Provide retry buttons in context for momentary glitches.
3. Preserve input after failure — show respect for user's time.
4. For AI outputs, offer choices: "Regenerate with same input," "Edit and retry," or "Start fresh."
5. Let users revise the output (not the input) — the problem may be in interpretation, not the query.
6. Provide guided suggestions: "Make it shorter," "Add more detail," "Focus on tone" as gentle nudges.

### 5.4 Preventing Errors
1. Provide real-time validation on forms/structured inputs — but don't overwhelm with too many checks too early.
2. Offer hints, examples, smart defaults: "e.g., your-work@email.com."
3. Support users with starter phrases and examples for effective prompting.
4. Set expectations early about what the AI can/cannot do — surface limits before failure.
5. Frame limitations as helping the user get better results, not as restrictions.

### 5.5 Degrading Gracefully
1. Preserve progress during failures — local saves, drafts, checkpointing.
2. Show what IS available and note what is NOT — let user decide to continue, pause, or return.
3. For soft AI failures: preserve good parts of output, let user continue from there.
4. Surface non-obvious issues: "We're having trouble completing this. Want to try again or revise it?"
5. Save full context (prompt, prior messages, output so far) when results cut off unexpectedly.

### 5.6 Surfacing System State Honestly
1. Acknowledge delays: "Saving is currently delayed" or "This feature is temporarily offline."
2. Use calm, clear, matter-of-fact tone — not humor for serious failures.
3. When the AI doesn't know it's wrong: highlight information that should be verified, provide gentle prompts like "Double-check important details."
4. Localize status updates to individual issues rather than system-wide banners.
5. Name limitations up front: what the model cannot provide or doesn't support.

## 6. Watermarking and Content Attribution

### 6.1 AI Content Identification
1. Text watermarking works through statistical bias during generation — subtle preferences for specific words/sentence structures that create detectable patterns.
2. Image watermarking: explicit (visible overlays), invisible (modifying pixel values, least significant bits), or metadata (C2PA standard).
3. Video watermarking extends image concepts but faces complexity from compression and temporal changes.
4. Detection-only approaches (classifiers) are unreliable — OpenAI's tool had 26% accuracy, false-flagged human text, and showed bias against non-native English speakers.

### 6.2 Managing Problematic Outputs
1. Use layered approach: RLHF (reinforcement learning from human feedback) or Constitutional AI during training.
2. Run red teaming: simulate worst-case users trying to bypass safeguards, repeated in multiple rounds with updated models.
3. Publish safety/system cards documenting training, known issues, and mitigations — set expectations for developers and users.
4. Design refusals that feel conversational, not punitive — embed naturally in system voice, explain briefly, signal continuation.

### 6.3 Scripting AI Outputs for Design
1. Start with grounded examples from real model behavior (logs, transcripts, experiments) — not polished idealizations.
2. Mix different tones, formats, and levels of certainty to test UI variability.
3. Script edge cases: misinterpreted prompts, subtly wrong outputs, refusals — to test fallback states and trust cues.
4. Collaborate with engineers to ensure script outputs are realistic for the specific model being used.
