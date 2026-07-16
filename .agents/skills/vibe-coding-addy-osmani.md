---
name: Vibe Coding
description: >- Workflows de desenvolvimento assistido por IA — o problema dos 70%, padroes de parceria e validacao
---
# Vibe Coding — AI-Assisted Development Workflows

## 1. The 70% Problem: Understanding the Gap

### 1.1 What AI Handles Well (70%)
- Boilerplate, routine functions, common framework patterns
- Scaffolding initial codebases from zero to MVP
- Code completion and refactoring suggestions
- Generating tests and documentation
- Rapid prototyping from screenshots or specs

### 1.2 The Final 30% — Where Human Expertise Required
- Edge cases, race conditions, performance constraints
- Architecture decisions and maintainability
- Security implications and error handling
- Novel algorithms and innovative abstractions
- Production readiness beyond demo quality

### 1.3 Two Developer Patterns
- **Bootstrappers**: Use Bolt/v0/screenshot-to-code for MVP → rapid validation from zero
- **Iterators**: Use Cursor/Cline/Copilot/WindSurf for daily workflow → code completion, refactoring, tests

## 2. Common Failure Patterns

### 2.1 Two Steps Back Cycle
1. Developer tries to fix a small bug
2. AI suggests a change that seems reasonable
3. Fix breaks something else
4. Developer asks AI to fix the new issue → creates 2+ more problems
5. Rinse and repeat (whack-a-mole)

### 2.2 The Demo-Quality Trap
- AI builds impressive happy-path demos quickly
- Real users trigger error messages, crashes, confusing states, accessibility issues
- Polish (error messages, slow connections, edge cases, discoverability) requires human empathy and craft

### 2.3 Preventing Pitfalls
- Never merge code you don't fully understand
- Isolate AI changes in separate Git commits (tag with `[AI]` for traceability)
- Commit more frequently when using AI — granular history enables rollback
- Team communication before AI generation to prevent duplication

## 3. Three Workflow Patterns

### 3.1 AI as First Drafter
1. **Before drafting**: Team alignment on coding standards, prompting practices, linting rules
2. Generate initial code via AI
3. **Manual review and refactor**: modularity, error handling, tests, documentation
4. Commit with clear message (e.g. "Optimize list rendering [AI-assisted]")
5. Maintain "AI Usage Tips" section in project README for consistency

### 3.2 AI as Pair Programmer
1. Developer interacts with AI in constant conversation
2. Tight feedback loops: assess contributions, provide corrections, refine
3. Initiate new AI sessions for distinct tasks (maintain context clarity)
4. Keep prompts focused and concise
5. Review and commit changes frequently
6. Human-human pairing still better for complex problem-solving and nuanced understanding

### 3.3 AI as Validator
1. Developer writes initial code
2. AI validates via code review, security scanning (DeepCode, Snyk)
3. AI generates test cases (Qodo, TestGPT) for broader coverage
4. Human prioritizes review for critical areas: complex logic, UX, security
5. Use AI for initial assessments; reserve human review for high-stakes paths

## 4. The Golden Rules of Vibe Coding

1. **Be specific and clear** about requirements — precise prompts yield precise results
2. **Always validate AI output** against your original intent — verify functionality, logic, relevance
3. **Treat AI as a junior developer (with supervision)** — draft + oversight, never unsupervised
4. **Use AI to expand capabilities, not replace thinking** — stay actively engaged in problem-solving
5. **Coordinate upfront among the team** before generating code
6. **Treat AI usage as normal part of development conversation** — share experiences, techniques, pitfalls
7. **Isolate AI changes in Git** with separate commits for traceability
8. **All code undergoes code review** — same standards for human and AI
9. **Never merge code you don't understand** — comprehension critical for maintainability and security
10. **Prioritize documentation, comments, and ADRs** for AI-generated code
11. **Share and reuse effective prompts** — maintain a repository of proven prompts
12. **Regularly reflect and iterate** on your AI workflow

## 5. Career Strategies By Level

### 5.1 Senior Engineers
1. **Be architect and editor-in-chief**: Write prompts, review every line, prevent "high review burden"
2. **Use AI as force multiplier**: Tackle ambitious projects that were previously out of reach
3. **Mentor and set standards**: Coach juniors on self-review, testing AI output, and verification culture
4. **Cultivate domain mastery**: Historical knowledge catches AI missteps that newcomers miss
5. **Hone soft skills**: Stakeholder comms, design meetings, tool evaluation, AI coding guidelines
6. **Foresee second/third-order effects**: Trust instincts — if code looks off, dig in

### 5.2 Midlevel Engineers
1. **Specialize**: Systems integration, API design, event schemas, data models
2. **Master fundamentals**: Data structures, distributed systems, databases, network protocols
3. **Performance optimization**: Monitoring, profiling, security, cost management across full stack
4. **Code review and QA**: Treat AI output as junior dev code; verify every logic path
5. **Systems thinking**: Understand how changes cascade across the system
6. **Design skills**: UI/UX thinking, product sense, user psychology
7. **Cross-functional communication**: Requirements gathering, technical writing, project planning

### 5.3 Junior Developers
1. **Learn fundamentals (don't skip why)**: Use AI as tutor, not answer vending machine
2. **Practice without the safety net**: AI-free days, debug AI code yourself first
3. **Focus on testing**: Write unit tests for AI-generated code; challenge assumptions
4. **Build maintainability eye**: Refactor AI output — split long functions, rename variables
5. **Develop prompting skills**: Outline solutions in plain English before asking AI to implement
6. **Seek feedback and mentorship**: Discuss design trade-offs; ask seniors why they prefer one approach
7. **Communicate and collaborate**: Requirements analysis is an AI-adjacent skill
8. **Shift mindset**: From consuming solutions to creating understanding — dissect AI outputs

## 6. Durable Skills for the AI Era

1. **System design and architecture** — designing coherent systems with trade-offs
2. **Systems thinking** — understanding big picture, legacy, and business context
3. **Critical thinking, problem-solving, foresight** — enumerating edge cases, anticipating failures
4. **Specialized domain expertise** — financial, healthcare, real-time systems
5. **Code review, testing, debugging, QA** — verification remains the human differentiator
6. **Communication and collaboration** — translating business requirements to technical solutions
7. **Adaptability and continuous learning** — fundamentals + curiosity about new techniques
8. **Using AI effectively** — integrate daily; know tool strengths and weaknesses

## 7. Version Control with AI
1. Commit more frequently when using AI assistance
2. Isolate different AI-introduced changes in separate commits
3. Tag commits with `[AI]` for traceability (e.g. "Update UI copy [AI-assisted]")
4. Use descriptive commit messages — granular history enables rollback of specific AI changes
5. Treat commits as safety net: if AI change breaks things, revert cleanly
