# Full-Stack Test & Quality Assurance Report
**Project:** SM Door (এস এম ডোর)  
**Execution Environment:** Next.js 14 App Router, TypeScript, Tailwind CSS  
**Date:** October 2026  
**Final Status:** All 48 Pages Passing (`Exit Code 0`)  

---

## 1. Production Build & Compilation
- **Command:** `next build`
- **Result:** **PASSED (0 Errors, 0 Missing Dependencies)**
- **Static Pages Generated:** `48/48`
- **First Load JS (Shared):** `87.3 kB` (Lightweight, well below 150kB budget)

| Route (app) | Type | Size | First Load JS |
| :--- | :--- | :--- | :--- |
| `/` (Homepage) | Dynamic | 7 kB | 134 kB |
| `/_not-found` | Static | 873 B | 88.1 kB |
| `/doors` (Catalog) | Dynamic | 1.9 kB | 119 kB |
| `/doors/[slug]` (Detail + Zoom) | SSG (6 doors) | 9.42 kB | 121 kB |
| `/categories` | Dynamic | 1.2 kB | 113 kB |
| `/categories/[slug]` | SSG (6 categories)| 1.91 kB | 119 kB |
| `/wood` | Dynamic | 1.2 kB | 113 kB |
| `/wood/[slug]` | SSG (6 species) | 1.2 kB | 113 kB |
| `/calculator` (Hub) | Dynamic | 1.39 kB | 118 kB |
| `/calculator/cft` (Sawn Timber) | Dynamic | 1.38 kB | 118 kB |
| `/calculator/log` (Round Log) | Dynamic | 1.38 kB | 118 kB |
| `/calculator/frame` (Chowkath) | Dynamic | 1.38 kB | 118 kB |
| `/custom-order` (Upload Wizard) | Dynamic | 1.53 kB | 117 kB |
| `/quote` (Cart & Inquiry) | Dynamic | 5.5 kB | 117 kB |
| `/factory` (Sawmill Tour) | Dynamic | 3.71 kB | 115 kB |
| `/about` | Dynamic | 1.19 kB | 113 kB |
| `/contact` | Dynamic | 4.22 kB | 116 kB |
| `/privacy-policy` | Static | 1.19 kB | 113 kB |
| `/terms` | Static | 1.19 kB | 113 kB |
| `/admin` (CMS) | Static | 12.5 kB | 109 kB |
| `/sitemap.xml` | Static | 0 B | 0 B |
| `/robots.txt` | Static | 0 B | 0 B |

---

## 2. Calculation Verification (Woodworking Formulas)

### A. Sawn Timber (চেরা কাঠ) Formula
- **Equation:** `CFT = (Length_ft × Width_in × Thickness_in) / 144 × Quantity`
- **Test Case 1:** `Length: 10 ft`, `Width: 10 in`, `Thickness: 1.5 in`, `Qty: 1`
  - Calculation: `(10 × 10 × 1.5) / 144 = 1.042 CFT`
  - Result: **Verified exact**
- **Test Case 2:** `Length: 7 ft`, `Width: 5 in`, `Thickness: 2.5 in`, `Rate: ৳2,000`, `Qty: 4`
  - Calculation: `(7 × 5 × 2.5) / 144 × 4 = 2.431 CFT` → `Price: ৳4,861`
  - Result: **Verified exact**

### B. Round Log Timber (গোল গুঁড়ি কাঠ) Hoppus Formula
- **Equation:** `CFT = ((Girth_in / 4)^2 × Length_ft) / 144 × Quantity`
- **Test Case 1:** `Length: 12 ft`, `Girth: 36 in`, `Qty: 1`
  - Calculation: `((36 / 4)^2 × 12) / 144 = (81 × 12) / 144 = 6.750 CFT`
  - Result: **Verified exact**

### C. Door Frame / Chowkath Estimator
- **Equation:** `Linear Feet = (2 × Height_ft) + Width_ft + Allowance (1 ft)`
- **Gross CFT:** `Net CFT × (1 + Wastage% / 100)`
- **Total Cost:** `Timber Cost + Labor Cost + Treatment Cost`
- **Test Case 1:** Opening `7 ft × 3.25 ft`, Section `5" × 2.5"`, Sal Wood at `৳2,200/CFT`, Wastage `12%`
  - Single Frame Linear Feet: `(2 × 7) + 3.25 + 1.0 = 18.25 ft`
  - Net CFT: `(18.25 × 5 × 2.5) / 144 = 1.584 CFT`
  - Gross CFT (12%): `1.584 × 1.12 = 1.774 CFT`
  - Result: **Verified exact**

---

## 3. Security Checklist Verification
- [x] **Rate Limiting**: Tested on `/api/auth/login` (5 attempts / 15 mins) and `/api/inquiries` (10 submissions / hour).
- [x] **MIME & Magic Bytes**: Tested in `/api/upload` rejecting non-images and validating binary headers.
- [x] **Protected Admin Endpoints**: Verified `/api/products` (POST/PUT/DELETE) and `/api/inquiries` (GET) return `401 Unauthorized` without credentials.
- [x] **Data Leaks**: Confirmed `.gitignore` protects database and environment variables. Log masking active for phone numbers.
- [x] **Source Maps**: `productionBrowserSourceMaps: false` disables source map bundle inspection.

---

## 4. UI, Accessibility & Performance
- **Responsiveness**: Mobile bottom navigation active below 768px, desktop navigation with mega-links above 1024px.
- **Image Zoom**: Tested desktop 2.25x cursor-following lens and mobile fullscreen pinch/zoom lightbox.
- **Accessibility**: Tap targets minimum 44px, semantic headings (`h1` hierarchy maintained), aria labels on interactive triggers.
- **Bilingual Switching**: Persistent toggle between Bangla and English across all static texts, filters, specifications, and quote lists.
