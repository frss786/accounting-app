# Family Accounting App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive family financial transparency application with features like manual entry, multi-dimensional tracking, CSV import from major apps (WeChat and Alipay), and role-based sharing.

**Architecture:** MERN-like stack mapped to Relational concepts. Frontend: React + Vite + TailwindCSS. Backend: Node.js (Express) + TypeScript. Database: PostgreSQL with Prisma ORM.

**Tech Stack:** React, TailwindCSS, Express.js, TypeScript, PostgreSQL, Prisma, Vitest/Jest(Testing).

---

### Task 1: Environment Setup & Project Initialization

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`

- [ ] **Step 1: Initialize Backend Node.js Environment with TypeScript**
Run: `mkdir backend && cd backend && npm init -y && npm install express cors dotenv && npm install -D typescript ts-node @types/node @types/express @types/cors`
Run: `npx tsc --init`

- [ ] **Step 2: Initialize Frontend React Environment**
Run: `npm create vite@latest frontend -- --template react-ts`
Run: `cd frontend && npm install && npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`

- [ ] **Step 3: Commit Initialization**
```bash
git add backend/ frontend/
git commit -m "chore: setup initial frontend and backend projects"
```

---

### Task 2: Database and Schema Setup (Prisma)

**Files:**
- Create: `backend/prisma/schema.prisma`
- Create: `backend/.env`

- [ ] **Step 1: Init Prisma**
Run: `cd backend && npm install prisma --save-dev && npx prisma init`
Configure `.env` with a dummy connection string format (e.g., `DATABASE_URL="postgresql://user:password@localhost:5432/accounting?schema=public"`).

- [ ] **Step 2: Define Prisma Schema (User, Ledger, Category, Account, Transaction)**
Create the models inside `schema.prisma`. 
Crucial constraints from spec: `external_id` MUST be `@unique` on Transaction. Store timestamps in UTC format. Users must have a role enum (`ADMIN` / `MEMBER`).

- [ ] **Step 3: Database Migration**
Run `npx prisma migrate dev --name init` to generate SQL and push to local postgres instance.

- [ ] **Step 4: Optional Test validation for Prisma Types**
Run: `cd backend && npx prisma format && npx prisma validate`
Expected: Output showing schema is valid.

- [ ] **Step 5: Commit Schema**
```bash
git add backend/prisma backend/.env.example
git commit -m "feat(db): define core prisma schema for accounting app"
```

---

### Task 2.5: Authentication & Ledger Scoping Middleware

**Files:**
- Create: `backend/src/middleware/auth.ts`
- Modify: `backend/package.json`

- [ ] **Step 1: Install JWT Dependencies**
Run: `cd backend && npm install jsonwebtoken bcrypt && npm install -D @types/jsonwebtoken @types/bcrypt`

- [ ] **Step 2: Create JWT extraction middleware**
Define `requireAuth` function that reads JWT from headers, verifies it, and attaches `req.user_id` and `req.ledger_id`.

- [ ] **Step 3: Commit Auth Middleware**
```bash
git add backend/src/middleware/ backend/package.json
git commit -m "feat(auth): jwt middleware and request scoping"
```

---

### Task 3: Backend Core Entity API (Ledger & Categories)

**Files:**
- Create: `backend/src/routes/ledger.ts`
- Create: `backend/src/routes/category.ts`
- Create: `backend/src/index.ts`
- Modify: `backend/tsconfig.json`
- Create: `backend/tests/category.test.ts` (if TDD environment configured later, else focus on controller creation)

- [ ] **Step 1: Setup Express Core App (`backend/src/index.ts`)**
Create minimal express listener and basic error handler middleware.

- [ ] **Step 2: Implement CRUD for Categories**
Create an API to pull Categories shared across the Ledger scope (`GET /api/ledgers/:id/categories`).

- [ ] **Step 3: Implement Ledger/User basic linking logic**
Placeholder APIs for Ledger data loading, strongly enforcing the `req.ledger_id` boundaries introduced in Task 2.5 to ensure data isolation.

- [ ] **Step 4: Commit Core API**
```bash
git add backend/src/
git commit -m "feat(api): implement ledger and category core routes"
```

---

### Task 4: Transaction Entry & Listing API

**Files:**
- Create: `backend/src/routes/transaction.ts`
- Modify: `backend/src/index.ts`

- [ ] **Step 1: POST /api/transactions endpoint**
Implement manual entry. Parse body checking for amount, types, category_id, account_id. Implement validation and save using Prisma. Include Decimal saving validation.

- [ ] **Step 2: GET /api/transactions endpoint**
Implement a feed view. Requires query params: `ledger_id`, `startDate`, `endDate`, and optional `user_id`. Ensure it supports ordering by `timestamp` DESC.

- [ ] **Step 3: Commit Transaction API**
```bash
git add backend/src/routes/transaction.ts backend/src/index.ts
git commit -m "feat(api): transaction creation and listing routes"
```

---

### Task 5: CSV Import Engine (Alipay/WeChat)

**Files:**
- Create: `backend/src/services/csvParser.ts`
- Create: `backend/src/routes/import.ts`

- [ ] **Step 1: Install CSV & Encoding Dependencies**
Run: `cd backend && npm install csv-parse iconv-lite && npm install -D @types/iconv-lite`

- [ ] **Step 2: Implement GBK Decoded CSV Parsing Logic (`csvParser.ts`)**
Write a service function that takes a raw buffer, detects/converts GBK to UTF-8 using `iconv-lite`, and loops over rows.

- [ ] **Step 3: Category Mapping Rule & Deduplication checks**
Inside the import route, attempt to map transaction descriptions to Category terms. Catch `external_id` duplicates (simulate `INSERT ON CONFLICT`). 

- [ ] **Step 4: Endpoint for Staging Data**
`POST /api/import/upload` - returns JSON structured preview data of the CSV without committing.

- [ ] **Step 5: Commit Import Engine**
```bash
git add backend/src/services/ backend/src/routes/import.ts backend/package.json
git commit -m "feat(import): alipay/wechat csv parsing engine with gbk support"
```

---

### Task 6: Frontend - Core Application Shell & Routing

**Files:**
- Modify: `frontend/src/App.tsx`
- Create: `frontend/src/pages/Dashboard.tsx`
- Create: `frontend/src/pages/LedgerFeed.tsx`
- Create: `frontend/src/pages/ImportData.tsx`

- [ ] **Step 1: Install Router and HTTP Client**
Run: `cd frontend && npm install react-router-dom axios`

- [ ] **Step 2: Define basic Navigation Layout**
Modify `App.tsx` with a sidebar/nav for: Dashboard, Feed, Import. Add Tailwind utility classes for layout.

- [ ] **Step 3: Commit App Shell**
```bash
git add frontend/
git commit -m "feat(ui): base application layout and routing"
```

---

### Task 7: Frontend - Ledger Feed (Transaction Display)

**Files:**
- Modify: `frontend/src/pages/LedgerFeed.tsx`
- Create: `frontend/src/components/TransactionItem.tsx`

- [ ] **Step 1: Fetch Transactions**
Write an Axios call to `GET /api/transactions` and hold in state. Add Timezone/Date parsing using native `Intl` or `date-fns`, explicitly defaulting grouping logics to `Asia/Shanghai` if not set.

- [ ] **Step 2: Create Feed UI**
Loop through transactions and display them gracefully marking differences between Income (Green) vs Expenses (Red) via Tailwind.

- [ ] **Step 3: Commit Feed UI**
```bash
git add frontend/src/pages/LedgerFeed.tsx frontend/src/components/TransactionItem.tsx
git commit -m "feat(ui): implement shared ledger timeline feed"
```

---

### Task 8: Frontend - Multi-Dimensional Analytics Dashboard

**Files:**
- Modify: `frontend/src/pages/Dashboard.tsx`

- [ ] **Step 1: Install Charting Library**
Run: `cd frontend && npm install recharts`

- [ ] **Step 2: Top-level Metrics Component**
Fetch timeframe aggregated data. Display Net Balance, Total Income, Total Expenses.

- [ ] **Step 3: Render Proportion and Trend Charts**
Implement a Recharts `PieChart` for Expense proportion by Category. Implement `BarChart` for ranked expenses. Include Time-range toggle buttons (Month/3 Months/6 Months).

- [ ] **Step 4: Commit Dashboard**
```bash
git add frontend/package.json frontend/src/pages/Dashboard.tsx
git commit -m "feat(ui): analytics dashboard with recharts integration"
```

---

### Task 9: Frontend - CSV Import Review UI

**Files:**
- Modify: `frontend/src/pages/ImportData.tsx`

- [ ] **Step 1: File Upload Component**
Implement `<input type="file" accept=".csv" />` that posts FormData to `POST /api/import/upload`.

- [ ] **Step 2: Staging/Preview Table**
Render the server's returned JSON as an editable table. Allow users to correct "Unknown" categories.

- [ ] **Step 3: Commit to Database**
Submit the corrected staging data back to the server (`POST /api/import/commit`).

- [ ] **Step 4: Commit Import UI**
```bash
git add frontend/src/pages/ImportData.tsx
git commit -m "feat(ui): csv import upload and staging review table"
```