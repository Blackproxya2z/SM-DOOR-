# Security Architecture & Hardening Report
**Project:** SM Door (এস এম ডোর)  
**Version:** 2.0 Production  
**Status:** Security Hardened & Audit Passed  

---

## 1. Authentication & Session Security
- **HMAC Signed Sessions**: Session tokens are cryptographically generated and signed using `HMAC-SHA256` with a server-side `SESSION_SECRET`.
- **HttpOnly Cookies**: Admin session cookies are set with `HttpOnly`, `SameSite=Lax`, and `Secure` (in production), preventing client-side JavaScript access and cross-site scripting session exfiltration.
- **Constant-Time Verification**: All signature checks and credential validations use `crypto.timingSafeEqual()` to mitigate timing attacks.
- **Session Expiration**: Automatic 7-day token expiration enforced server-side.
- **Brute Force Protection**: Dedicated rate limiter on `/api/auth/login` restricts requests to **5 attempts per 15 minutes per IP**. Returns HTTP 429 with `Retry-After` header.

---

## 2. Authorization & Privilege Enforcement
- **Protected Admin Routes**: All mutating endpoints (`POST`, `PUT`, `DELETE` on `/api/products`, `/api/species`, `/api/calculator`, `/api/banners`, `/api/settings`, `/api/inquiries`) strictly verify `isAuthenticatedAdmin(request)`.
- **No Data Leakage to Public Clients**:
  - The inquiries list is accessible **only** to authenticated admin sessions (`GET /api/inquiries` returns 401 for unauthorized callers).
  - Admin passwords, PINs, and session secrets are never returned in public API payloads.
- **IDOR Prevention**: Product, category, and inquiry mutations perform explicit record lookups and parameter sanitization.

---

## 3. Strict Input Validation (Zod)
- All incoming payloads on public endpoints (`/api/inquiries`, `/api/upload`, `/api/auth/login`) are validated against strict Zod schemas:
  - Required fields enforced (`customerName`, `customerPhone`).
  - String length bounds (e.g. phone numbers capped at 30 chars, names at 100 chars, notes at 3000 chars) preventing buffer/memory abuse.
  - Number ranges validated (quantities clamped between 1 and 500; dimensions bounded).
  - Calculator formulas clamp negative or `NaN` values.

---

## 4. File Upload Security
- **MIME & Extension Whitelisting**: Only `image/jpeg`, `image/png`, and `image/webp` are permitted. Executables, HTML, SVG, and script files are strictly rejected.
- **Magic Bytes Verification**: File buffers are inspected for genuine binary signatures (`0xFF 0xD8 0xFF` for JPEG, `0x89 0x50 0x4E 0x47` for PNG, `RIFF/WEBP` for WebP). This stops polyglot attacks where executables are renamed to `.jpg`.
- **File Size Capping**: Server-side 5MB maximum file size enforcement.
- **Path Traversal Prevention**: Filenames are discarded and replaced with cryptographically random UUIDs (`design_[timestamp]_[uuid].[ext]`).
- **Upload Rate Limiting**: Max 20 file uploads per hour per IP.

---

## 5. DDoS & Abuse Mitigation
- **Application-Level Abuse Throttling**:
  - Login: 5 requests / 15 minutes / IP
  - Public Inquiries & Quotes: 10 requests / 1 hour / IP
  - Design Uploads: 20 requests / 1 hour / IP
- **Payload Limits**: Next.js body parser limits prevent oversized request attacks.
- **Static Generation & Caching**: Public catalog, categories, wood species, and calculator pages are statically generated and cached, insulating backend resources from traffic spikes.
- **Recommended Cloudflare Integration**: For Layer 3/4 and high-volume volumetric Layer 7 DDoS attacks, placing the domain behind **Cloudflare WAF / CDN** is recommended.

---

## 6. Secure HTTP Headers
Configured in `next.config.mjs`:
- `X-Content-Type-Options: nosniff` (prevents MIME type sniffing)
- `X-Frame-Options: DENY` (prevents clickjacking)
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `X-Robots-Tag: noindex, nofollow, noarchive` for `/admin` and `/api/admin`
- `productionBrowserSourceMaps: false` (source maps disabled in production)
- `poweredByHeader: false` (strips `X-Powered-By: Next.js`)

---

## 7. Data Leak Prevention Checklist
- [x] `.gitignore` created to prevent accidental commits of `.env`, `*.db`, or local uploads.
- [x] Customer phone numbers are masked in server logs (`018****5678`).
- [x] Passwords, PINs, and session tokens are redacted from all debug outputs.
- [x] Next.js error handlers return generic user-friendly messages without leaking internal stack traces.
- [x] No sensitive credentials stored in client localStorage (only non-sensitive quote cart items).
