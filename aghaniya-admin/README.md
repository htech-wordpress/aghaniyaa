# Aghaniya Admin Panel

Aghaniya Admin is a web admin panel for Aghaniya Enterprises — a financial services platform that centralizes lead intake, processing, user and role management, import/export workflows, and application settings.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Environment & Configuration](#environment--configuration)
- [Project Structure](#project-structure)
- [Key Pages & Components](#key-pages--components)
- [Lead Data Model & CSV Format](#lead-data-model--csv-format)
- [Roles & Permissions](#roles--permissions)
- [Security & Firestore Rules](#security--firestore-rules)
- [Deployment](#deployment)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)
- [Useful Documentation & References](#useful-documentation--references)

---

## Features

- 🔐 **Authentication & RBAC** - Firebase Auth with role-based access control (Superadmin, Admin, Manager, Agent).
- 📊 **Dashboard** - Real-time lead metrics and visual charts (Recharts).
- 📝 **Lead Management** - View, filter, search, update status, and manage pipelines for Website, Manual, Contacts, Careers, and CIBIL leads.
- 📤 **Import / Export** - Import leads (CSV/XLSX) and export filtered or full datasets to CSV/XLSX.
- 👥 **User Management** - Create and manage admin users and assign roles.
- ⚙️ **Settings** - Configure application settings (site-level flags, integrations).
- 💬 **Support Management** - Capture and manage support requests/tickets.
- 🔧 **Extensible UI** - Built with React + TypeScript, Vite, Tailwind CSS, Radix UI components.

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)
- Firebase project (Auth + Firestore + Storage)

### Install

```bash
npm install
```

### Configure

Copy `.env.example` (if present) or create a `.env` file with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id # optional
```

> Note: Do not commit secrets to source control. Use environment provisioning for production deployments.

### Run locally

```bash
npm run dev
# Open http://localhost:5173
```

### Build

```bash
npm run build
npm run preview
```

### Helpful scripts

- `npm run dev` — start dev server
- `npm run build` — compile TypeScript and build production bundle
- `npm run preview` — preview production bundle locally
- `npm run lint` — run ESLint

---

## Environment & Configuration

This project reads Firebase config from environment variables (Vite prefix `VITE_`) and expects the following keys:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional)

If you integrate SMTP, CRM webhooks, or other services, add those variables here and keep them out of version control.

---

## Project Structure

```
src/
├── components/
│   ├── admin/             # Admin-specific components (LeadsPage, LeadDetailsDialog, etc.)
│   └── ui/                # Generic UI components (Button, Input, Dialog)
├── lib/
│   ├── firebase.ts        # Firebase init and helpers
│   ├── leads.ts           # Lead import/export, CSV helpers, validation
│   ├── storage.ts         # Storage / file helpers
│   └── api.ts             # Higher-level API wrappers
├── pages/                 # Route entry points (AdminDashboard, AdminLogin, AdminUsers...)
├── contexts/              # React contexts (AgentContext / Auth)
├── App.tsx                # App router and route guards
└── main.tsx               # Bootstrapping
```

---

## Key Pages & Components

- `src/pages/AdminLogin.tsx` — Firebase auth, sign-in flow
- `src/pages/AdminDashboard.tsx` — Overview, metrics, charts
- `src/pages/AdminWebsiteLeads.tsx` — Website leads view (filters, search)
- `src/pages/AdminManualLeads.tsx` — Manual lead intake
- `src/pages/AdminImportLeads.tsx` / `AdminExportLeads.tsx` — Import/Export flows
- `src/components/admin/LeadsPage.tsx` — Core UI for listing leads (filters, pagination)
- `src/components/admin/LeadDetailsDialog.tsx` — Lead details, pipeline updates, editing
- `src/lib/leads.ts` — Import/export logic, CSV parsing and validation

If you are extending the admin area, follow existing patterns (React + TypeScript + Tailwind + Radix).

---

## Lead Data Model

Leads are stored as documents with this shape (example):

```json
{
  "id": "auto-generated",
  "timestamp": "2025-12-24T10:00:00.000Z",
  "category": "contact",
  "data": {
    "fullName": "Rahul Sharma",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "mobile": "+919876543210",
    "loanType": "Personal Loan",
    "amount": "500000",
    "loanAmount": "500000",
    "source": "Website Leads",
    "status": "New",
    "pipeline": [{ "status": "New", "date": "2025-12-24T10:00:00.000Z", "comment": "Lead created via website" }],
    "reason": "Looking for personal loan for home renovation"
  }
}
```

### Pipeline

- Each status change is recorded in `data.pipeline` as an object `{ status, date, comment }`.
- The UI (`LeadDetailsDialog`) appends pipeline entries when status updates occur.

### CSV Import Format

Import expects rows with columns (headers case-insensitive):

- `fullName` or `name` (required)
- `email` (required)
- `mobile` (required)
- `loanType` (recommended)
- `amount` or `loanAmount` (optional)
- `source` (optional)
- `status` (optional)
- `timestamp` (optional ISO date; if absent, server will assign)

Example CSV header line:

```
fullName,email,mobile,loanType,amount,source,status,timestamp
```

The import will attempt to validate required fields and skip invalid rows. See `src/lib/leads.ts` for parsing and validation logic.

---

## Roles & Permissions

Default roles supported:

- **Superadmin** — Full access (manage users, settings, all admin features)
- **Admin** — Manage leads, export/import, support tickets
- **Manager** — View team leads, assign to agents (if enabled)
- **Agent** — Access assigned leads and update pipelines

Role enforcement is handled client-side for UI and server-side using Firestore security rules (see `firestore.rules` and `FIRESTORE_SECURITY_RULES.md`).

---

## Security & Firestore Rules

- Sensitive credentials must never be committed. Use environment variables or a secrets manager.
- Firestore rules are defined in `firestore.rules` at repo root; see `FIRESTORE_SECURITY_RULES.md` for the rationale and deployment steps.
- Ensure your Firebase project has proper IAM roles for users/services that deploy or manage data.

---

## Deployment

- Build the app with `npm run build`.
- Recommended static hosts: Vercel, Netlify, Firebase Hosting. Provide the `VITE_` env vars in the hosting platform dashboard.
- For Firebase Hosting, ensure your `firebase.json` and hosting site are configured in your Firebase project. See the repo `DEPLOYMENT.md` for multi-site (admin + user) deployment instructions and sample `firebase target:apply` commands.

---

## Development Notes

- Add new admin pages inside `src/pages` and export/register the route in `App.tsx`.
- Use `src/components/ui` for consistent design primitives (button, input, dialog).
- Keep Firestore access inside `src/lib/firebase.ts` and `src/lib/leads.ts` to centralize queries and data transformations.
- Use Radix UI primitives for accessible components, and Tailwind for styling.

---

## Troubleshooting

- Firebase errors: check `.env` values and ensure the Firebase project matches the provided config.
- Import issues: inspect the CSV for missing required fields and use UTF-8 encoding.
- Build failures: run `npm run lint` and address TypeScript/ESLint errors.

---

## Useful Documentation & References

- `FIRESTORE_SECURITY_RULES.md` — Details & rationale for security rules
- `ADMIN_USER_MANAGEMENT.md` — How to manage admin users and roles
- `AGENT_ROLE_BASED_ACCESS.md` — Agent role access details
- `ADMIN_PERFORMANCE_DASHBOARD.md` — Dashboard metrics & charts
- `AdminManualLeads.md`, `AdminExportLeads.md`, `AdminImportLeads.md` (see `src/pages/*` and repo root docs)

---

## Contributing

- Follow existing code patterns (TypeScript, Tailwind, Radix)
- Run `npm run lint` before publishing PRs
- All PRs should include testing steps and a short description of behavior changes

---

## Contact

For issues or questions related to admin features, contact the project maintainers in the `README` root or open an issue in your tracker.

---

## License

Private — All rights reserved

---

*Last updated: 2025-12-24*
