# SM Door (এস এম ডোর) — M/S Farhan Enterprise

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#)

A high-performance, bilingual (Bengali & English) web platform and management system designed for **M/S Farhan Enterprise (মেসার্স ফারহান এন্টারপ্রাইজ) / SM Door**. The platform offers interactive wood and door catalogs, engineering woodworking calculators (Sawn Timber CFT, Hoppus Round Log, and Chowkath / Door Frame Estimator), instant WhatsApp quotation generation, a multi-step custom door order wizard with phone image uploads, and a comprehensive protected Admin CMS.

---

## 🚀 Key Features

- **🌐 Complete Bilingual Support**: Fluid switching between Bengali (বাংলা) and English across all catalog pages, specs, forms, and calculators.
- **🪵 Specialized Woodworking Calculators**:
  - **Sawn Timber (চেরা কাঠ) Calculator**: Precision formula `(Length_ft × Width_in × Thickness_in) / 144 × Quantity`.
  - **Round Log (গোল গুঁড়ি কাঠ) Hoppus Rule**: Formula `((Girth_in / 4)^2 × Length_ft) / 144 × Quantity`.
  - **Door Frame / Chowkath (চৌকাঠ) Estimator**: Calculates linear feet, gross CFT with custom wastage margin (12–15%), wood cost, treatment, and labor.
- **📱 Custom Order Wizard & Mobile Upload**:
  - Multi-step inquiry builder with dimension inputs and finish selections.
  - Camera & gallery photo upload with server-side magic byte validation.
  - Direct WhatsApp deep-link generation with formatted inquiry IDs.
- **🛡️ Enterprise-Grade Security Architecture**:
  - HMAC-SHA256 cryptographically signed HttpOnly admin session tokens.
  - Brute-force rate limiting on `/api/auth/login` (5 attempts / 15 mins) and public inquiry endpoints.
  - Server-side file upload protection (magic bytes inspection, size caps, random UUID renaming).
  - Strict Zod validation on all API endpoints.
  - Sensitive environment variables and database files protected via `.gitignore`.
- **⚡ Next.js 14 App Router Performance**:
  - Static Site Generation (SSG) for all door and species catalog details.
  - Core Web Vitals optimized image configurations (`next/image`, AVIF/WebP support).
  - Security HTTP headers (`X-Frame-Options`, `X-Content-Type-Options`, strict referrer policies).
- **💼 Full-Featured Admin CMS**:
  - Manage product catalogs, wood species, and calculator pricing in real time.
  - Track, filter, and respond to incoming customer inquiries and orders.
  - Live sawmill showcase and testimonial editor.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide Icons, clsx, tailwind-merge
- **Validation**: Zod
- **Database / Cache**: Lightweight JSON persistence with in-memory caching and serverless-safe fallbacks

---

## 📦 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- npm / yarn / pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/sm-door.git
   cd sm-door
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment | `production` / `development` |
| `NEXT_PUBLIC_SITE_URL` | Public site canonical URL | `https://smdoorbd.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Contact phone for WhatsApp links | `8801819345678` |
| `NEXT_PUBLIC_PHONE_NUMBER` | Formatted phone number for UI | `+8801819345678` |
| `ADMIN_PASSWORD` | Secure password for Admin CMS | Set a strong random password |
| `SESSION_SECRET` | 64+ char secret for HMAC signing | Run `openssl rand -hex 32` |
| `DATABASE_URL` | Optional DB connection string | `file:./data/dev.db` |

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)
1. Push this repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Under **Project Settings > Environment Variables**, add the values from `.env.example`.
4. Deploy! Vercel automatically builds and optimizes the project.

### Deploy to Ubuntu / VPS (Node.js + PM2 + Nginx)
Detailed VPS deployment steps with PM2 and Nginx reverse proxy configuration are available in [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 🧪 Quality Assurance & Security

- Complete QA checklist: [QA_CHECKLIST.md](QA_CHECKLIST.md)
- Security audit details: [SECURITY.md](SECURITY.md)
- Full testing report: [TEST_REPORT.md](TEST_REPORT.md)

---

## 📄 License
Proprietary © M/S Farhan Enterprise (মেসার্স ফারহান এন্টারপ্রাইজ) / SM Door. All rights reserved.
