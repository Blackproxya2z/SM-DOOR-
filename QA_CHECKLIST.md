# Launch QA Checklist & Production Sign-Off
**Project:** SM Door (এস এম ডোর)  
**Version:** 2.0  

---

## 1. Public Storefront Checklist
- [x] **Homepage (`/`)**: Hero carousel, category cards, featured doors, sawmill showcase, customer reviews, footer links.
- [x] **Catalog (`/doors`)**: Category filter, wood species filter, search query, sorting (price, popularity), empty state with reset button.
- [x] **Product Detail (`/doors/[slug]`)**:
  - [x] Desktop 2.25x cursor-following zoom lens.
  - [x] Mobile tap-to-fullscreen lightbox with pinch/zoom & double-tap.
  - [x] Wood variant selector dynamically updates live price, stock status, and specifications.
  - [x] Add to Quote button adds item to localStorage cart with notification.
  - [x] Direct WhatsApp order button generates pre-filled message with product title and selected wood.
- [x] **Categories (`/categories` & `/categories/[slug]`)**: Category cards with image previews, item counts, and category-filtered product grids.
- [x] **Wood Species (`/wood` & `/wood/[slug]`)**: Comprehensive species guides for Chittagong Teak, Seasoned Mahogany, Gamari, and Sal wood with CFT rates and durability stars.
- [x] **Calculators (`/calculator`, `/calculator/cft`, `/calculator/log`, `/calculator/frame`)**:
  - [x] Sawn Timber CFT formula: `(L_ft × W_in × T_in) / 144`.
  - [x] Round Log CFT formula: Hoppus Quarter-Girth `(Girth / 4)² × Length / 144`.
  - [x] Door Frame Estimator: Computes linear feet, net/gross CFT with 12% wastage, cutting labor, seasoning charges, and cost per frame.
  - [x] Add Calculator estimate to Quote list.
  - [x] WhatsApp quote export button.
- [x] **Custom Order (`/custom-order`)**:
  - [x] File upload accepts JPG, PNG, WebP up to 5MB.
  - [x] File preview before submit.
  - [x] Generates reference ID and saves to database.
  - [x] WhatsApp confirmation link.
- [x] **Quote Cart (`/quote`)**:
  - [x] Displays all quote items stored in localStorage.
  - [x] Quantity increment/decrement and item removal.
  - [x] Total cost calculation.
  - [x] "Send All Items via WhatsApp" deep link.
  - [x] Server inquiry submission.
- [x] **Institutional Pages**: `/factory`, `/about`, `/contact`, `/privacy-policy`, `/terms`.

---

## 2. Admin CMS Checklist
- [x] **Authentication**:
  - [x] Protected login at `/admin`.
  - [x] HttpOnly, SameSite cookie authentication.
  - [x] Unauthenticated API requests to `/api/products`, `/api/inquiries`, `/api/settings` return `401 Unauthorized`.
  - [x] Rate limiting prevents brute force PIN/password guessing (5 attempts / 15 mins).
- [x] **Dashboard**: Metrics for products, wood species, inquiries, and orders.
- [x] **Product Manager**: Add, edit, delete, multi-image manager, variant pricing per wood species.
- [x] **Category & Species Manager**: Edit wood species rates and durability; changes immediately reflect on storefront calculators.
- [x] **Inquiry Manager**: Status filtering (`new`, `contacted`, `in_progress`, `completed`, `cancelled`), customer notes, WhatsApp launcher, phone launcher.
- [x] **Custom Order Manager**: View customer design images, download images, change status.
- [x] **Banner & Settings Editor**: Edit top notice ticker, phone, WhatsApp number, showroom addresses.

---

## 3. Security & Abuse Mitigation Checklist
- [x] **No Secrets Leaked**: `.gitignore` created protecting `.env`, `*.db`, and local files.
- [x] **Phone Number Masking**: Customer phone numbers masked in logs (`018****5678`).
- [x] **Magic Bytes File Upload Validation**: Blocks executable or HTML files disguised with `.jpg` extensions.
- [x] **Path Traversal Prevention**: Uploaded files renamed with random UUIDs.
- [x] **Security Headers**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- [x] **Search Engine Admin Disallow**: `X-Robots-Tag: noindex, nofollow` on admin routes.
- [x] **DDoS Throttling**: Public inquiries capped at 10/hour/IP; uploads capped at 20/hour/IP.

---

## 4. SEO & Accessibility Checklist
- [x] **Dynamic Sitemap**: Complete XML sitemap at `/sitemap.xml` with priority and change frequencies.
- [x] **Robots Configuration**: `/robots.txt` disallows `/admin/` and `/api/`.
- [x] **Structured Data (JSON-LD)**: `LocalBusiness` schema in root layout and `Product` schema on `/doors/[slug]`.
- [x] **Bilingual Lang Attributes**: Dynamic toggle between `bn` and `en`.
- [x] **Keyboard Accessibility**: Modal close on Escape, tab navigation, aria-labels on icon triggers.

---

## 5. Final Launch Sign-Off
- **Status:** **APPROVED FOR PRODUCTION SHIPMENT**
- **Tested Build:** All 48 routes passing Next.js production build (`Exit Code 0`).
