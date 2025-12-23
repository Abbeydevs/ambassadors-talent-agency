# Ambassador Talent Agency — Project Overview ✅

> This document describes the codebase, architecture, language/tech choices, folder structure, key patterns, and developer notes for the Ambassador Talent Agency project.

---

## 1) Quick summary

- **Name:** Ambassador Talent Agency
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL via Prisma
- **Auth:** NextAuth (NextAuth v5 beta) with Prisma adapter
- **Email provider:** Resend
- **File/media:** Cloudinary
- **Validation:** Zod
- **Styling:** Tailwind CSS (v4)
- **Other notable libs:** Radix UI, TanStack Query, Recharts, react-hook-form, bcryptjs, uuid

This repository implements a full-stack platform for managing talent and employer workflows (jobs, applications, profiles, admin dashboards, reporting, payouts, etc.). The app uses Next.js App Router with server actions for secure server-side logic and Prisma ORM for database access.

---

## 2) Architecture & implementation patterns 🔧

- **App Router (Next.js):** The project uses the `app/` directory and leverages server components where appropriate. UI components are placed in `components/` and page-level layouts live under `app/` and `app/admin/`.

- **Server actions & auth guard:** Reusable server actions live in `actions/` and typically start with a `"use server"` directive. They commonly call `auth()` (from `auth.ts`) to ensure the user session and role-based authorization before interacting with the database. Actions return either an `{ error: "..." }` or `{ success: "..." }` shape — a lightweight pattern used across the codebase.

- **Authentication:** Implemented with NextAuth integrated to Prisma via `@auth/prisma-adapter`. Session strategy is JWT. Custom credential provider used for email + password login (with bcrypt), and the JWT callbacks put the user's `role`, `companyName`, and `picture` into the token and session.

- **Database access (Prisma):** A single `db` export in `lib/db.ts` provides a singleton PrismaClient instance (cached in dev). Data-access helper files live in `data/` and wrap business queries in reusable functions.

- **Validation:** Input validation is done with `zod` schemas in `schemas/index.ts` (register, login, job posting, profile sections, application, etc.) and validated at action boundaries.

- **Media & emails:** Cloudinary (`lib/cloudinary.ts`) is used for image/media uploads and transformations. Email sending is implemented with Resend (`lib/resend.ts`) and helper mail functions in `lib/mail.ts` (verification, password reset, application notifications, etc.).

- **Environment & secrets:** Key runtime secrets include Cloudinary credentials, Resend API key, `AUTH_SECRET` for NextAuth, and `DATABASE_URL` for Prisma.

- **Patterns:** Typical server action flow is:
  1. `auth()` to validate user and role
  2. `zod` validation (where applicable)
  3. `db` calls to read/write models
  4. return consistent object with either `error` or `success` message, and often call `revalidatePath` for caching where needed

---

## 3) Database & Prisma model highlights 🗄️

- `prisma/schema.prisma` defines a rich domain model with models including `User`, `TalentProfile`, `EmployerProfile`, `Job`, `Application`, `Transaction`, `Course`, `Ticket`, `Report`, `Announcement`, `Wallet`, `Transaction`, `PayoutRequest`, `BlogPost`, `Comment`, etc.

- Enums used: `Role`, `Gender`, `AvailabilityStatus`, `ProfileVisibility`, `ApplicationStatus`, `JobStatus`, `TransactionType`, `TransactionStatus`, `DisputeStatus`, etc.

- The schema is designed for a marketplace-like flow (jobs published by employers, applications by talents, payment/escrow via `Transaction` and `PayoutRequest`, disputes, admin workflows, and notifications/tickets for support).

---

## 4) Folder structure and purpose (detailed) 📁

Root-level key files:
- `package.json` — scripts and dependencies (see `dev`, `build`, `start`, `lint` scripts).
- `next.config.ts` — image domain config (whitelists Cloudinary and others).
- `auth.config.ts`, `auth.ts` — NextAuth configuration and exported helpers (`auth`, `signIn`, `signOut`, and handlers) using Prisma adapter.
- `PROJECT_OVERVIEW.md` — (this file)

Top-level folders (what they contain and purpose):

- `app/` — Next.js App Router pages and layouts. Partitioned into `admin/`, `auth/`, `blog/`, `dashboard/`, `employer/`, `jobs/`, `profile/`, `talent/` etc. Server components, client components, and page-level UI live here.

- `actions/` — Server actions used by the UI and pages. Each file is a server-side operation that performs authorization using `auth()` and database writes/read operations. Examples:
  - `actions/employer/create-job.ts` — create job flow with zod validation.
  - `actions/admin/*` — admin-only operations (moderation, processing payouts, reports, etc.).

- `components/` — Reusable UI components (organized by domain: `admin/`, `auth/`, `blog/`, `common/`, `employer/`, `jobs/`, `talent/`, `ui/`). Contains inputs, widgets, and Radix + Tailwind based components.

- `data/` — Data-access helpers that encapsulate Prisma queries (e.g., `getAllJobs`, `getJobById`, `getEmployerProfileByUserId`, `talent-search.ts`). These provide a clean separation between business logic and DB queries.

- `lib/` — Utilities, external service clients, and helpers:
  - `db.ts` — Prisma client singleton and `db` export
  - `cloudinary.ts` — Cloudinary config
  - `resend.ts` & `mail.ts` — email client and email helper wrappers
  - `token.ts` — verification and password reset token generation
  - `utils.ts` — small utilities (e.g., `cn` wrapper for className merging using `clsx` + `tailwind-merge`)
  - `logger.ts`, `profile-score.ts` — logging and domain-specific helpers

- `schemas/` — Zod schemas for validating forms and server action inputs; used across auth, profile, company, job, blog, tickets, and settings flows.

- `prisma/` — `schema.prisma` (DB schema) and (presumably) migration history in local dev setups.

- `public/` — Static assets

- `hooks/` — Custom React hooks (e.g., `use-current-user.ts`, `use-auto-save.ts`)

- `components.json` — component metadata (used by some tooling or design system integration)

- `scripts/` — developer scripts (e.g., `create-new-admin.ts`)

- `actions/` nested folders: `admin/`, `employer/`, `talent/` — domain-specific server actions and operations.

---

## 5) Auth flow & role model 🔐

- **Role enum** (Prisma): `TALENT`, `EMPLOYER`, `ADMIN`, `AUTHOR`.

- **Login flow:** Credentials provider in `auth.ts` uses `LoginSchema` => fetch user by email (`getUserByEmail`) => bcrypt.compare against `user.hashedPassword` => if match returns `user` and session created.

- **Token & session enrichment:** JWT callback fetches the user from DB and places `role`, `companyName`, and `picture` into the token. `session()` callback ensures `session.user` contains `id`, `role`, and `companyName`.

- **Server-side guard:** Actions and admin operations call `auth()` (exposed from `auth.ts`) and check `session.user.role` for access control.

---

## 6) Validation & types 🧾

- **Zod schemas** live in `schemas/index.ts` and are used both client- and server-side to provide consistent validation for form inputs and server actions.
- Type inference from Zod is used to keep types accurate across server actions and UI components.

---

## 7) Media & Notifications

- **Cloudinary:** configured in `lib/cloudinary.ts` and the image host `res.cloudinary.com` is allowed in `next.config.ts`.
- **Emails:** `lib/resend.ts` wraps `Resend` with `process.env.RESEND_API_KEY`. `lib/mail.ts` contains helper functions like `sendVerificationEmail`, `sendPasswordResetEmail`, `sendNewApplicationEmail`, `sendApplicationConfirmationEmail`, and `sendJobInvitationEmail`.

---

## 8) Important environment variables (.env) ⚙️

The project uses these environment values (examples come from `.env` in the repo):

- `DATABASE_URL` — Postgres connection string (required for Prisma).
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary credentials.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY` — public-friendly Cloudinary details.
- `RESEND_API_KEY` — Resend API key for sending emails.
- `NEXT_PUBLIC_APP_URL` — App URL (used when generating links in email templates).
- `AUTH_SECRET` — NextAuth secret.

Make sure to never commit production credentials to source control.

---

## 9) How to run & developer tips 🧭

- Install dependencies: `npm install` (or `pnpm` / `yarn`).
- Start dev server: `npm run dev` (starts Next dev server at `http://localhost:3000`).
- Prisma dev workflow:
  - Generate client: `npx prisma generate`
  - Create or apply migrations: `npx prisma migrate dev` (or use `db push` for local prototyping)
- Lint: `npm run lint`.

Notes:
- The `lib/db.ts` file caches Prisma client in `globalThis` in development to avoid multiple instances and hot-reload issues.
- Use the `actions/` helpers for server-bound behavior (they consistently enforce auth and validation patterns).

---

## 10) Conventions and patterns ✅

- Actions are small and return a simple `{ error: string }` or `{ success: string }` pattern.
- All input validation should be done with Zod before DB writes.
- Business logic that hits the DB should live in `data/` helpers where possible, keeping `actions/` focused on orchestration (auth, validation, revalidation).
- Use `revalidatePath()` from `next/cache` when mutating content that is rendered in cached routes.

---

## 11) Areas to consider / next steps (ideas) 💡

- Add tests (unit & integration) for the `data/` helpers and `actions/` server actions.
- Add end-to-end tests covering auth flows and job lifecycle.
- Consider adding feature flags / observability for long-running processes (payouts, disputes)
- Add clear contributor docs (CONTRIBUTING.md) and a developer setup guide (Postgres seed data, env var templates, etc.)

---

## 12) Where to look for specifics

- Authorization & session flow: `auth.ts`, `auth.config.ts`
- DB logic: `data/*` (e.g., `data/public-jobs.ts`)
- Actions & server flows: `actions/*` and subfolders
- Validation & types: `schemas/index.ts`
- Email & tokens: `lib/mail.ts`, `lib/resend.ts`, `lib/token.ts`
- Prisma schema: `prisma/schema.prisma`

---

If you want, I can:
- add a `CONTRIBUTING.md` and a more detailed `DEVELOPER_SETUP.md` with example `.env` and Prisma seed commands, or
- generate a visual architecture diagram or a high-level component map of `app/` routes.

Would you like me to add any of the above next? 🔧
