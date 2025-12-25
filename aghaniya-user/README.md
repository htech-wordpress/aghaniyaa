# Aghaniya — User Website

This repository contains the user-facing website for Aghaniya — a financial services platform where customers can learn about loan products, calculate EMIs, and submit loan/contact inquiries.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Environment & Configuration](#environment--configuration)
- [Project Structure](#project-structure)
- [Key Pages & Components](#key-pages--components)
- [Forms & Lead Data Model](#forms--lead-data-model)
- [Assets & Content Guidelines](#assets--content-guidelines)
- [SEO & Analytics](#seo--analytics)
- [Deployment](#deployment)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)

---

## Features

- 🏠 **Marketing Pages** — Home, Loans, Loan Detail, About, Contact, Careers
- 🧾 **Loan Application Forms** — Multi-field loan/contact forms integrated with Firebase/lead storage
- 🧮 **EMI Calculator** — Client-facing calculator for loan repayments
- 📞 **WhatsApp / Contact Integration** — Quick contact buttons
- 🛠️ **Admin-ready leads** — Frontend forms submit to Firestore (consumable by the admin panel)
- 🎯 **Responsive UI** — Built with Tailwind CSS and accessible components

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project (Auth optional; Firestore required to persist leads)

### Install

```bash
npm install
```

### Environment

Create a `.env` file at the project root with your Firebase credentials (Vite `VITE_` prefix):

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id # optional
```

> Keep credentials out of source control. For production, use your hosting provider's environment variable configuration.

### Run locally

```bash
npm run dev
# Visit http://localhost:5173
```

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── admin/         # small admin helpers used by admin pages
│   ├── layout/        # site header, footer
│   ├── ui/            # design primitives (Button, Input, Select)
│   └── ...            # BannerSlider, LoanForm, TeamPreview, WhatsAppButton
├── lib/
│   ├── firebase.ts    # firebase setup & helpers
│   ├── leads.ts       # lead mapping helpers used by forms
│   └── storage.ts     # upload helpers
├── pages/             # route pages (Home, Loans, LoanDetail, Contact, Careers...)
├── App.tsx
└── main.tsx
```

---

## Key Pages & Components

- `src/pages/Home.tsx` — Marketing hero, featured loans, partner logos
- `src/pages/Loans.tsx` — List of loan products
- `src/pages/LoanDetail.tsx` — Product detail and `LoanForm` CTA
- `src/pages/Contact.tsx` — Contact form
- `src/pages/Careers.tsx` — Job listings and application
- `src/components/LoanForm.tsx` — Main loan/contact form used across pages
- `src/components/EMICalculator.tsx` — EMI calculation widget (if present)
- `src/components/WhatsAppButton.tsx` — Quick contact trigger

---

## Forms & Lead Data Model

The user site submits leads (loan/contact/career inquiries) to Firestore using the same data model that the Admin app consumes. Keep the form fields aligned to ensure the `aghaniya-admin` can process them directly.

### Required Lead Fields (website forms)

- `fullName` / `name` (string) — user's name (required)
- `email` (string) — user's email (required)
- `mobile` (string) — phone number (required)
- `loanType` (string) — product selected (if applicable)
- `amount` or `loanAmount` (number|string) — requested loan amount (optional)
- `source` (string) — default to `Website Leads` (helps admin filters)
- `status` (string) — default `New`
- `timestamp` — ISO string assigned at submit (or server time)
- `reason` / `message` (string) — optional user note
- UTM/campaign fields (optional): `utm_source`, `utm_medium`, `utm_campaign`

### Example lead object

```json
{
  "category": "contact",
  "timestamp": "2025-12-24T10:00:00.000Z",
  "data": {
    "fullName": "Sita Verma",
    "email": "sita@example.com",
    "mobile": "+919876543210",
    "loanType": "Home Loan",
    "amount": "7500000",
    "source": "Website Leads",
    "status": "New",
    "pipeline": [{ "status": "New", "date": "2025-12-24T10:00:00.000Z", "comment": "Submitted by website" }]
  }
}
```

### Consent & Privacy

Forms must include explicit consent text (checkbox) confirming the user agrees to be contacted and to the site's Privacy Policy. Capture this consent value in the lead metadata.

---

## Assets & Content Guidelines

- Logos: provide SVG (preferred) plus PNG variants (transparent and white). Use filenames like `logo.svg`, `logo-white.svg`.
- Hero images: 1600×900 (JPG/PNG), max 2MB.
- Team photos: 400×400 JPG/PNG.
- Icons: SVG preferred.
- Naming: lowercase, use hyphens (e.g., `hero-home.jpg`).

---

## SEO & Analytics

- Provide `og:image` (1200×630) and meta descriptions for main pages.
- Supply `G-` Google Analytics and GTM IDs in the environment if tracking is desired.
- Provide per-page meta titles & descriptions if available.

---

## Deployment

Recommended hosts: Vercel, Netlify, Firebase Hosting.

- Ensure `VITE_` env vars are populated in the host's dashboard.
- For Firebase Hosting, configure `firebase.json` and run `firebase deploy --only hosting` after building.

---

## Development Notes

- Keep lead field keys consistent with `aghaniya-admin`'s expected schema so leads are visible in the admin UI without mapping.
- Use `src/lib/leads.ts` to centralize lead transformations and validation for client forms.
- Use `src/components/ui` for buttons/inputs to maintain consistent styling.

---

## Troubleshooting

- Missing leads: confirm Firestore rules allow writes from the web client and that the Firebase config is correct.
- Form errors: validate required fields and check console for network/permission errors.
- Broken images: check asset paths and ensure files are present in `public/Assets` or `src/assets`.

---

## Contributing

- Follow TypeScript and Tailwind patterns used throughout the repo.
- Run `npm run dev` and check the UI across responsive breakpoints before creating PRs.

---

## License

Private — All rights reserved

---

*Last updated: 2025-12-24*
