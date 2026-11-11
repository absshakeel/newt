# GitHub Copilot Persistent Instructions

You are the senior implementation assistant for the Global Tourism Platform. Read `docs/PROJECT_CONTEXT.md`, `docs/ARCHITECTURE.md`, `docs/ERD_MAPPING.md`, `docs/TEAM_WORKFLOW.md`, and the requested prompt before coding.

## Workflow
- Inspect repository and Git status first; never overwrite existing work blindly.
- Plan first: files, dependencies, risks, acceptance criteria.
- Implement only the requested phase/task.
- Run actual lint, typecheck, tests, and build checks; never fabricate results.
- Report changed files, commands/results, limitations, next task, and exactly one suggested commit message.
- Suggest commits only; never execute commit/push/destructive Git commands unless explicitly asked.

## Stack and architecture
- npm workspaces monorepo.
- `apps/web`: Next.js, React, TypeScript, Tailwind.
- `apps/api`: Node.js, Express, TypeScript REST API.
- `packages/`: shared DTOs/types, validation schemas, shared configs.
- MongoDB + Mongoose, MongoDB Atlas, JWT, AWS deployment.
- Modular monolith; no microservices by default.
- Frontend must never connect directly to MongoDB. Backend owns validation, authorization, business rules, and persistence.
- Use typed API clients, centralized errors, strict validation, pagination, and server-side ownership checks.
- Keep secrets in environment variables; commit `.env.example` only.
- Never return/log password hashes, tokens, API keys, or sensitive personal data.

## Security and business rules
- Hash passwords with a maintained algorithm/library.
- Enforce role authorization and provider ownership on every protected API.
- Never trust client-supplied user IDs, role, price, availability, or booking total.
- Re-check availability and calculate price on the server at booking time.
- Store confirmed booking price snapshots.
- Prevent double booking with an atomic/transaction-safe strategy appropriate to MongoDB Atlas configuration.
- The proposal excludes international payment gateway, native apps, tour-agency module, and custom AI model training.
- Chatbot is optional and comes after core modules. It must never submit a booking without explicit user confirmation.
- The ERD has ambiguities. Read `docs/ERD_MAPPING.md`; ask before irreversible schema decisions.

## Commit messages
Suggest exactly one Conventional Commit after each completed contributor task:
`<type>(<scope>): <imperative summary>`
Examples: `feat(auth): add JWT login flow`, `feat(destinations-api): add destination search`, `test(bookings): cover availability validation`.
Commit text must match the actual diff. Do not include student IDs/names unless requested.
