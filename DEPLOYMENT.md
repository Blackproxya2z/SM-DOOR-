# Production Deployment & Hosting Guide
**Project:** SM Door (এস এম ডোর)  
**Target:** Vercel / Node.js VPS / Docker  

---

## 1. Quick Start & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/sm-door.git
cd sm-door

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Start development server
npm run dev
# Open http://localhost:3000
```

---

## 2. Production Environment Variables

Ensure these environment variables are set in your hosting platform (Vercel Project Settings or VPS `.env`):

| Variable | Recommended Value / Description | Example |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | `production` |
| `NEXT_PUBLIC_SITE_URL` | Your public domain (without trailing slash) | `https://smdoorbd.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number in international format | `8801819345678` |
| `NEXT_PUBLIC_PHONE_NUMBER` | Display phone number | `+8801819345678` |
| `ADMIN_PASSWORD` | Strong password for admin panel | `Min 16 chars secure string` |
| `SESSION_SECRET` | 64+ char random hexadecimal secret | Generated via `openssl rand -hex 32` |
| `DATABASE_URL` | Database connection string | `file:./data/dev.db` |

---

## 3. Deploying to Vercel (Recommended)

1. **Connect Git Repository**: Import the project into your Vercel Dashboard.
2. **Framework Preset**: Select **Next.js**.
3. **Environment Variables**: Populate all keys from `.env.example`.
4. **Deploy**: Vercel will automatically run:
   ```bash
   npm run build
   ```
5. **Custom Domain**: Bind `smdoorbd.com` and `www.smdoorbd.com`. Vercel provisions free automatic SSL certificates.

---

## 4. Deploying to VPS (Ubuntu / Nginx / PM2)

```bash
# 1. Build production bundle
npm run build

# 2. Start using PM2 process manager
pm2 start npm --name "sm-door" -- start -- -p 3000

# 3. Configure PM2 autostart
pm2 startup
pm2 save
```

### Nginx Reverse Proxy Configuration:
```nginx
server {
    listen 80;
    server_name smdoorbd.com www.smdoorbd.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name smdoorbd.com www.smdoorbd.com;

    ssl_certificate /etc/letsencrypt/live/smdoorbd.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/smdoorbd.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 5. Cloudflare & DDoS Protection Setup
1. Point your domain nameservers to **Cloudflare**.
2. Set SSL/TLS encryption mode to **Full (Strict)**.
3. Enable **Auto Minify** (HTML, CSS, JS) and **Brotli** compression.
4. Set Security Level to **Medium** (or enable **Under Attack Mode** during DDoS incidents).
5. Add Rate Limiting rule on `/api/auth/login` to block brute-force attempts at the edge.

---

## 6. Backup Strategy
- **Database Backup**: Schedule a daily cron job to backup `data/db.json` or SQLite database files:
  ```bash
  tar -czf /backups/smdoor_db_$(date +%Y%m%d).tar.gz /path/to/sm-door/data/
  ```
- **Uploads Backup**: Periodically sync `/public/uploads` to offsite S3 or Google Cloud Storage.
