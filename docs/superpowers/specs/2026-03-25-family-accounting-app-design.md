# Family Accounting App - Design Spec

## 1. Overview
A lightweight, family-collaborative accounting web application. The core objective is to provide a transparent, shared ledger for family members to track joint expenses, manage budgets, and analyze spending habits across multiple dimensions, while lowering the barrier to entry via automated bill imports.

## 2. Core Features & User Flows

### Data Entry & Import
- **Manual Entry**: Quick entry for Income/Expense, selecting the amount, date, category, payer, and funding account.
- **Alipay/WeChat CSV Import (Core)**: 
  - Users can upload CSV exports from their payment apps.
  - **Category Mapping Engine**: The backend will auto-map standard transaction descriptions (e.g., "Didi", "Subway") to standardized user categories (e.g., "Transportation").
  - **Preview & Confirmation**: A staging UI where users manually review unmapped or flagged transactions before officially committing them to the database.

### Multi-dimensional Analytics
- **Time-range Slicing**: Dynamic toggles for Current Month, 3 Months, 6 Months, 1 Year, or Custom Range.
- **Visualizations**:
  - **Pie/Doughnut Charts**: To show the percentage distribution of different expense categories within the selected time range.
  - **Bar Charts**: Ranking expenditures from highest to lowest.
  - **Trend Lines**: For macro time ranges (e.g., 6 months, 1 year), showing monthly spending trends to spot anomalies.

### Shared Ledger & Feeds
- **Ledger Feed**: A timeline-based, scrollable feed of all household transactions, indicating "Who, What, When, Which Account".
- **Member Filters**: Ability to filter the household feed by a specific family member or strictly by category.

## 3. Architecture & Tech Stack
- **Frontend**: React (Vite + TailwindCSS) for a fast, component-driven UI with robust charting libraries (e.g., Recharts / ECharts).
- **Backend**: Node.js (Express or NestJS) with TypeScript.
- **Database**: PostgreSQL handled via Prisma ORM for strong relational guarantees and typed queries.

## 4. Data Models (Core Entities)
- **User**: Family member accounts.
- **Ledger**: The shared container for the family's books.
- **Category**: Defined as `INCOME` or `EXPENSE`. Shared strictly across the ledger to prevent fragmentation.
- **Account**: Real-world asset representations (e.g., "Husband's Alipay", "Joint Bank Card").
- **Transaction**: The atomic record linking an Amount (Decimal precise), User, Category, Account, Ledger, and Timestamp.

## 5. Technical Constraints & Considerations
- **Precision**: Monetary values MUST be stored as explicit `Decimal` / `Numeric` types in PostgreSQL (e.g., `DECIMAL(12,2)`). Never use floating-point types to prevent accuracy loss.
- **Idempotency for Imports**: CSV imports must implement deduplication checks (using original transaction IDs from AliPay/WeChat) to prevent double-charging the same transaction if a CSV is uploaded twice.
- **Security & Scope**: Data isolations must enforce that users can only query transactions tied to their authorized `Ledger`.