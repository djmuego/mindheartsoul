# Deployment Guide — MindHeartSoul MVP

**Version:** Release Candidate 1 (RC1)  
**Date:** 2025-12-17  
**Bundle:** 489KB | Tests: 31/31 | TS: 0 errors

---

## 📋 Pre-Deployment Checklist

### 1. Quality Gates ✅

Run full quality check before deployment:

```bash
npm run doctor
```

**Expected Results:**
- ✅ i18n validation: All 199 keys consistent across 5 locales
- ✅ TypeScript: 0 errors (`npx tsc --noEmit`)
- ✅ Tests: 31/31 passing (100%)
- ✅ Build: SUCCESS
- ✅ Bundle: ~489KB (gzipped: ~131KB)

### 2. Environment Variables

Create `.env.production` file:

```env
# Required for AI features (optional in dev)
VITE_GEMINI_API_KEY=your_google_ai_key_here

# Optional: Feature flags (defaults work if omitted)
VITE_ENABLE_VIDEO_CHAT=false
VITE_ENABLE_ADMIN_TOOLS=true
VITE_ENABLE_PRO_PAYWALL=true
```

**⚠️ Important:**
- Keep `.env.local` for local development only
- Never commit API keys to version control
- Use platform-specific environment variable UI for production

### 3. Security Review

- [x] All API keys stored in `.env.local` or platform environment variables
- [x] No secrets in committed code
- [x] User authentication implemented (mock, ready for real OAuth)
- [x] Payment provider integration ready (Apirone)
- [x] Input validation via Zod schemas
- [x] XSS protection via React escaping
- [x] localStorage only for non-sensitive data
- [x] Error Boundary catches crashes gracefully

---

## 🚀 Deployment Options

### Option A: Static Hosting (Recommended)

**Platforms:** Vercel, Netlify, Cloudflare Pages, GitHub Pages

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist/
```

**Deployment Steps:**

#### Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

#### Cloudflare Pages
```bash
npm install -g wrangler
wrangler login
wrangler pages publish dist --project-name=mindheartsoul
```

### Option B: Docker Container

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Build & Deploy:
```bash
docker build -t mindheartsoul:rc1 .
docker run -p 80:80 -e VITE_GEMINI_API_KEY=your_key mindheartsoul:rc1
```

---

## 🔧 Platform Configuration

### SPA Routing

**All platforms:** Configure for Single-Page Application routing.

**Netlify:** Create `public/_redirects`:
```
/*    /index.html   200
```

**Vercel:** Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Cloudflare Pages:** Auto-configured for SPAs.

---

## 🧪 Post-Deployment Testing

### 1. Smoke Test (Quick)

1. Visit deployed URL
2. Login with test account
3. Navigate to Home → Courses → Profile
4. Verify no console errors
5. Check mobile responsiveness

### 2. Full Smoke Test (Comprehensive)

Run **all 15 steps** from `docs/SMOKE_TEST_P1.md`:

- [x] Authentication & Home
- [x] Lesson completion flow
- [x] Mentor booking management
- [x] Pro subscription purchase
- [x] Notifications delivery
- [x] i18n switching (5 locales)
- [x] Empty states rendering
- [x] Dark mode toggle

**Expected:** All tests pass, no regressions.

---

## 📊 Monitoring & Observability

### Error Tracking

**Current Implementation:**
- Global ErrorBoundary catches React errors
- User-friendly fallback UI with "Reload Page" CTA
- Dev mode: "Copy Error Details" button

**Recommended Additions (Future):**
- Sentry integration for production error tracking
- Console log aggregation (LogRocket, Datadog)
- Performance monitoring (Web Vitals)

### Analytics

**Recommended Tools:**
- Google Analytics 4 (page views, user flows)
- Plausible (privacy-friendly alternative)
- PostHog (session replay)

**Implementation:**
1. Add tracking script to `index.html`
2. Create `src/services/analytics.ts` wrapper
3. Track key events: login, course start, payment success

---

## 🔄 Rollback Plan

### Quick Rollback (Vercel/Netlify)

Both platforms keep deployment history:

**Vercel:**
```bash
vercel rollback
```

**Netlify:**
```bash
netlify sites:list
netlify deploy:rollback --site-id=YOUR_SITE_ID
```

### Manual Rollback

1. Checkout previous stable commit:
   ```bash
   git log --oneline  # Find last stable commit
   git checkout <commit-hash>
   ```

2. Rebuild and redeploy:
   ```bash
   npm run build
   # Deploy using your platform CLI
   ```

---

## 🔐 Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_GEMINI_API_KEY` | Optional | none | Google AI for AI Guide features |
| `VITE_ENABLE_VIDEO_CHAT` | No | false | Enable/disable video sessions |
| `VITE_ENABLE_ADMIN_TOOLS` | No | true | Admin dashboard access |
| `VITE_ENABLE_PRO_PAYWALL` | No | true | Pro subscription gating |

**⚠️ Security Note:** All `VITE_*` variables are embedded in client bundle. Never use for secrets.

---

## 🆘 Troubleshooting

### Build Fails

**Symptom:** `npm run build` exits with errors

**Solutions:**
1. Clear cache: `rm -rf node_modules dist && npm install`
2. Check Node version: `node -v` (requires 20.x)
3. Run `npm run typecheck` for detailed errors

### Blank Page After Deploy

**Symptom:** App shows white screen, no content

**Solutions:**
1. Check browser console for errors
2. Verify SPA routing configured (see Platform Configuration)
3. Check asset paths in `dist/index.html` (should be relative)

### API Key Not Working

**Symptom:** AI Guide features fail

**Solutions:**
1. Verify `VITE_GEMINI_API_KEY` set in platform environment variables
2. Redeploy after setting variables (may require full rebuild)
3. Check API key validity at Google AI Studio

---

## 📦 What Gets Deployed

### Production Build Includes:

- **Static HTML:** `dist/index.html` (0.62 KB)
- **CSS Bundle:** `dist/assets/*.css` (~49KB, ~8KB gzipped)
- **JS Bundle:** `dist/assets/*.js` (~489KB, ~131KB gzipped)
- **Fonts:** Embedded in CSS (if any)
- **Images:** Currently none (icons via Lucide)

### What's NOT Deployed:

- `node_modules/` (dev dependencies)
- `src/` (source code)
- `.env.local` (local secrets)
- `docs/` (documentation)
- Tests (`src/__tests__/`)

---

## 🎯 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Bundle Size (JS) | < 500KB | 489KB ✅ |
| Bundle Size (gzipped) | < 150KB | 131KB ✅ |
| First Contentful Paint | < 2s | TBD |
| Time to Interactive | < 4s | TBD |
| Lighthouse Score | > 90 | TBD |

**Note:** Run Lighthouse audit post-deployment to measure actual performance.

---

## 🚦 Release Stages

### Stage 1: Alpha (Internal)
- Deploy to staging URL
- Team testing only
- Feature flags: ALL enabled

### Stage 2: Beta (Limited)
- Deploy to public beta URL
- Invite limited users
- Monitor error rates

### Stage 3: RC1 (Current)
- Deploy to production
- Full smoke testing
- Monitor for 24-48 hours

### Stage 4: GA (General Availability)
- Public launch
- Marketing announcements
- Full monitoring active

---

## 📞 Support Contacts

**Technical Issues:**
- Repository: https://github.com/djmuego/mindheartsoul
- Issues: GitHub Issues tab

**Build/Deploy Questions:**
- Check `docs/STATUS_AUDIT.md` for current status
- See `docs/PROMPTS_LOG.md` for development history

---

## ✅ Final Deployment Checklist

Before pushing to production:

- [ ] All tests passing (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] TypeScript clean (`npm run typecheck`)
- [ ] i18n validated (`npm run lint:i18n`)
- [ ] Environment variables configured
- [ ] SPA routing configured on platform
- [ ] Error Boundary tested
- [ ] Mobile responsiveness verified
- [ ] Dark mode works
- [ ] Smoke test completed (15 steps)
- [ ] Rollback plan documented
- [ ] Monitoring/analytics ready (if applicable)

---

**Deployment Date:** _____________  
**Deployed By:** _____________  
**Platform:** _____________  
**URL:** _____________

**Status:** 🟢 READY FOR PRODUCTION

