<div align="center">

# 🌿 Kotonoha (言葉)

**A modern, full-stack, type-safe form builder and analytics management platform.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-kotonoha--three.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://kotonoha-three.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![tRPC](https://img.shields.io/badge/tRPC-v11-2596be?style=for-the-badge&logo=trpc&logoColor=white)](https://trpc.io/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-PostgreSQL-C5F74F?style=for-the-badge&logo=postgresql&logoColor=black)](https://orm.drizzle.team/)
[![Turborepo](https://img.shields.io/badge/Turborepo-Monorepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)

<p align="center">
  <a href="https://kotonoha-three.vercel.app/"><strong>Explore the Live Application »</strong></a>
  <br />
  <br />
  <a href="#-key-features">Key Features</a>
  ·
  <a href="#-tech-stack">Tech Stack</a>
  ·
  <a href="#-monorepo-structure">Monorepo Structure</a>
  ·
  <a href="#-getting-started">Getting Started</a>
  ·
  <a href="#-environment-variables">Environment Variables</a>
  ·
  <a href="#-api-documentation">API Docs</a>
</p>

---

</div>

## 🌐 Live Deployment

Kotonoha is deployed and accessible online:

- 🚀 **Live Application:** [https://kotonoha-three.vercel.app/](https://kotonoha-three.vercel.app/)
- 📄 **Interactive API Docs (Scalar):** Available locally at `http://localhost:8000/docs` (or your deployed API instance)

---

## 📖 Overview

**Kotonoha** (言葉, meaning _"words"_ or _"language"_) is an end-to-end form management ecosystem designed to streamline how forms are created, shared, and analyzed. Built with an emphasis on developer ergonomics and user delight, Kotonoha combines a drag-and-drop builder canvas, conditional logic branching, instant QR code sharing, real-time response analytics, and automated form archiving into a unified monorepo.

---

## ✨ Key Features

- **🎨 Drag-and-Drop Form Builder:** Visually compose complex forms with ease using a smooth, intuitive `@dnd-kit` powered canvas.
- **📝 14+ Rich Field Types:** Support for Short Text, Long Text, Numbers, Emails, Phone Numbers, Select Dropdowns, Radio Buttons, Checkboxes, Yes/No Toggles, Dates, Times, Combined Date & Time, Star Ratings, and Passwords.
- **🔀 Smart Conditional Branching:** Dynamically display or conceal questions based on users' previous responses with custom conditional rules.
- **🚀 1-Click Publishing & Sharing:** Publish forms instantly to generate public, shareable links and downloadable QR codes for mobile & offline workflows.
- **⏳ Scheduled Expiration & Auto-Archiving:** Set expiration dates for time-sensitive forms; a background cron worker automatically archives closed forms.
- **📊 Real-Time Analytics Dashboard:** View completion rates, response count trends, top-performing forms, and submission distributions powered by Recharts.
- **📥 CSV Export:** Export collected responses with one click into spreadsheet-ready CSV files via PapaParse.
- **📑 Templates & Drafts System:** Choose from curated default form templates or save drafts automatically to pick up right where you left off.
- **🔐 Secure Authentication:** Password hashing with bcrypt, JWT token rotation, OTP verification delivered via transactional email (Resend), and Google OAuth support.
- **⚡ End-to-End Type Safety:** Unbroken type consistency from database schema (Drizzle ORM) through backend procedures (tRPC v11) to frontend UI components.
- **📚 Interactive Scalar OpenAPI Documentation:** Auto-generated OpenAPI specs and high-performance interactive documentation served via Scalar.

---

## 🛠️ Tech Stack

### **Frontend (`apps/web`)**

| Technology                                                                           | Description                                                                           |
| :----------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| **[Next.js 16](https://nextjs.org/)**                                                | React framework utilizing App Router, Server/Client components, and font optimization |
| **[React 19](https://react.dev/)**                                                   | Core UI rendering library                                                             |
| **[Tailwind CSS v4](https://tailwindcss.com/)**                                      | Modern utility-first styling                                                          |
| **[Radix UI](https://www.radix-ui.com/)**                                            | Headless, accessible UI primitives (Dialogs, Dropdowns, Tabs, Tooltips, Accordions)   |
| **[@dnd-kit](https://dndkit.com/)**                                                  | Lightweight, modular drag-and-drop toolkit for form composition                       |
| **[tRPC React Query](https://trpc.io/)**                                             | Type-safe query client integrated with TanStack React Query v5                        |
| **[Zustand](https://zustand-demo.pmnd.rs/)**                                         | Minimalist, robust client state management                                            |
| **[Framer Motion](https://www.framer.com/motion/) & [GSAP](https://greensock.com/)** | Smooth micro-animations and transition choreography                                   |
| **[Recharts](https://recharts.org/)**                                                | Composable charting library for response analytics                                    |
| **[React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)**        | Performant form state validation and schema parsing                                   |
| **[qrcode.react](https://github.com/zpao/qrcode.react)**                             | Client-side QR code generator for shareable links                                     |
| **[Sonner](https://sonner.emilkowal.ski/)**                                          | Clean, customizable toast notification system                                         |

### **Backend & API (`apps/api`)**

| Technology                                                                          | Description                                                      |
| :---------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| **[Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/)**            | Fast, flexible backend server runtime                            |
| **[tRPC v11](https://trpc.io/)**                                                    | End-to-end type-safe API router and procedure handler            |
| **[Scalar API Reference](https://scalar.com/)**                                     | Modern, beautiful interactive OpenAPI documentation at `/docs`   |
| **[trpc-to-openapi](https://github.com/jlalmes/trpc-to-openapi)**                   | Automatically outputs OpenAPI v3 specification from tRPC routers |
| **[node-cron](https://github.com/node-cron/node-cron)**                             | Scheduled jobs for automatic form expiration checks              |
| **[Resend](https://resend.com/)**                                                   | Transactional email delivery for OTP verification codes          |
| **[Bcrypt & JWT](https://jwt.io/)**                                                 | Credential hashing and access/refresh token authentication       |
| **[Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs)** | Google authentication verification                               |

### **Database & Data Layer (`packages/database`)**

| Technology                                                    | Description                                                      |
| :------------------------------------------------------------ | :--------------------------------------------------------------- |
| **[PostgreSQL 15](https://www.postgresql.org/)**              | Primary relational database                                      |
| **[Drizzle ORM](https://orm.drizzle.team/)**                  | High-performance, lightweight TypeScript ORM                     |
| **[Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)** | Automated migration generator and visual studio schema inspector |

### **Monorepo & Tooling**

| Technology                                             | Description                                                     |
| :----------------------------------------------------- | :-------------------------------------------------------------- |
| **[Turborepo](https://turbo.build/)**                  | High-performance build system with intelligent pipeline caching |
| **[pnpm Workspaces](https://pnpm.io/workspaces)**      | Fast, disk-space-efficient package management                   |
| **[Docker Compose](https://docs.docker.com/compose/)** | Local containerized PostgreSQL environment                      |
| **[TypeScript 5.9](https://www.typescriptlang.org/)**  | Strict type-checking across apps and shared packages            |
| **[ESLint & Prettier](https://eslint.org/)**           | Code quality enforcement and automated formatting               |

---

## 📂 Monorepo Structure

```text
kotonoha/
├── apps/
│   ├── web/                    # Next.js 16 App Router frontend application
│   │   ├── app/                # Pages: (auth), (dashboard), landing page, forms
│   │   ├── components/         # Reusable UI & form builder components
│   │   ├── hooks/              # Custom React & tRPC hooks
│   │   ├── stores/             # Zustand global state stores
│   │   └── providers/          # Theme, query, and tRPC providers
│   │
│   └── api/                    # Express 5 backend server
│       └── src/
│           ├── server.ts       # Express app, tRPC middleware, Scalar docs
│           ├── cron.ts         # Scheduled background jobs (form expiration)
│           └── index.ts        # Server entrypoint
│
├── packages/
│   ├── database/               # PostgreSQL schema & Drizzle ORM models
│   │   ├── models/             # Users, OTPs, Forms, Fields, Responses, Templates
│   │   ├── drizzle/            # Auto-generated SQL migrations
│   │   └── seed.ts             # Default form templates seeder
│   │
│   ├── trpc/                   # Shared tRPC contracts & routers
│   │   ├── client/             # tRPC client setup
│   │   └── server/             # Routers: auth, form, draft, response, analytics...
│   │
│   ├── services/               # Reusable domain business logic
│   │   ├── analytics/          # Aggregations & completion statistics
│   │   ├── auth/ & user/       # Authentication, password hashing, user models
│   │   ├── email/ & otp/       # Resend email templates & verification codes
│   │   ├── form/ & draft/      # Form builder models & draft storage
│   │   ├── publishForm/        # Published form lifecycle & access
│   │   ├── response/           # Submissions collection & CSV generation
│   │   └── expiration/         # Form expiration handler
│   │
│   ├── logger/                 # Shared logging utility
│   ├── eslint-config/          # Shared ESLint rules across the monorepo
│   └── typescript-config/      # Base tsconfig configurations
│
├── docker-compose.yml          # PostgreSQL 15 container definition
├── turbo.json                  # Turborepo task pipeline configuration
├── pnpm-workspace.yaml         # PNPM workspace package boundaries
└── setup.sh                    # Automated symlink & environment initialization script
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your system:

- **Node.js**: `v18.0.0` or higher
- **pnpm**: `v9.0.0` or higher (`npm install -g pnpm`)
- **Docker & Docker Compose**: (for local PostgreSQL database)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/ZemonGst/kotonoha.git
cd kotonoha
```

---

### Step 2: Install Dependencies

Install workspace dependencies across all applications and shared packages:

```bash
pnpm install
```

---

### Step 3: Configure Environment Variables

Create your `.env` file from the provided template:

```bash
cp .env.example .env
```

You can also run the automated environment link script:

```bash
bash setup.sh
```

Ensure your `.env` contains the required credentials:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dev

# Email Service (Resend)
RESEND_API_KEY=re_your_api_key_here

# JWT Secret & Expiration
JWT_SECRET=your_jwt_secret_key_here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# URLs
BASE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/trpc
```

---

### Step 4: Start PostgreSQL Database

Spin up the local PostgreSQL 15 container using Docker Compose:

```bash
docker compose up -d
```

---

### Step 5: Run Database Migrations & Seed

Initialize your database schema and seed default form templates:

```bash
# Generate migrations from Drizzle schema
pnpm db:generate

# Apply migrations to PostgreSQL
pnpm db:migrate

# Seed default pre-built form templates
pnpm db:seed
```

_(Optional)_ Launch Drizzle Studio to visually view and edit your database records:

```bash
pnpm --filter @repo/database dev
```

---

### Step 6: Start Development Server

Start both the **Next.js Web frontend** and **Express tRPC backend** concurrently via Turborepo:

```bash
pnpm dev
```

Once running, access the services:

- 💻 **Web Application:** [http://localhost:3000](http://localhost:3000)
- 🔌 **API Server:** [http://localhost:8000](http://localhost:8000)
- 📖 **Interactive Scalar API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- 🔍 **OpenAPI Specification JSON:** [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

---

## 📜 Available Scripts

Run these scripts from the repository root:

| Command            | Description                                                      |
| :----------------- | :--------------------------------------------------------------- |
| `pnpm dev`         | Starts all apps and packages in development mode with hot reload |
| `pnpm build`       | Builds all packages and compile production bundles               |
| `pnpm db:generate` | Generates SQL migrations from Drizzle schema changes             |
| `pnpm db:migrate`  | Runs all pending database migrations                             |
| `pnpm db:seed`     | Seeds default templates and initial database data                |
| `pnpm lint`        | Runs ESLint across all workspaces                                |
| `pnpm format`      | Formats all files with Prettier                                  |
| `pnpm check-types` | Type-checks all TypeScript files across the monorepo             |

To run tasks for a specific package, use Turborepo's `--filter` flag:

```bash
# Only run the web application
pnpm --filter web dev

# Only run the API server
pnpm --filter @repo/api dev
```

---

## 🔑 Environment Variables Reference

| Variable                   | Description                                                          | Required In                              |
| :------------------------- | :------------------------------------------------------------------- | :--------------------------------------- |
| `DATABASE_URL`             | PostgreSQL connection string (`postgresql://user:pass@host:port/db`) | `packages/database`, `packages/services` |
| `RESEND_API_KEY`           | Resend API key for sending verification OTP emails                   | `packages/services`                      |
| `JWT_SECRET`               | Secret key used for signing JWT access and refresh tokens            | `packages/services`                      |
| `ACCESS_TOKEN_EXPIRES_IN`  | Token validity period (e.g. `15m`)                                   | `packages/services`                      |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token validity period (e.g. `7d`)                            | `packages/services`                      |
| `BASE_URL`                 | Public base URL of the API server (e.g. `http://localhost:8000`)     | `apps/api`                               |
| `FRONTEND_URL`             | Base URL of the client application for CORS and shareable links      | `apps/api`, `packages/services`          |
| `NEXT_PUBLIC_API_URL`      | Public endpoint for tRPC requests from the client                    | `apps/web`                               |

---

## 📡 API & tRPC Architecture

Kotonoha leverages a unified type-safe architecture:

```mermaid
flowchart LR
    subgraph Frontend["apps/web (Next.js 16)"]
        UI[React 19 UI & Form Builder]
        tRPCClient["tRPC React Query Client"]
        UI --> tRPCClient
    end

    subgraph Backend["apps/api (Express 5)"]
        ServerRouter["tRPC Server Router"]
        OpenAPI["OpenAPI / Scalar (/docs)"]
        Cron["node-cron Expiration Worker"]
        tRPCClient -->|HTTP /trpc| ServerRouter
    end

    subgraph Core["packages/"]
        Services["@repo/services (Auth, Forms, Analytics, Resend)"]
        DB["@repo/database (Drizzle ORM)"]
        ServerRouter --> Services
        Services --> DB
    end

    subgraph Storage["Infrastructure"]
        Postgres[(PostgreSQL 15)]
        DB --> Postgres
    end
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
