# Next Steps (Post-Stabilization)

**Current Status:** ✅ Repository is STABLE
- TypeCheck: ✅ 0 errors
- Build: ✅ Success
- Dev Server: ✅ Runs without errors
- Tests: ⚠️ 16/20 passing (4 need provider wrappers)

---

## Priority 1: Fix Remaining Tests (15 minutes)

**Problem:** Guard tests fail because they don't have `SessionProvider` wrapper.

**Solution:**
```tsx
// In src/__tests__/guards.test.tsx
import { SessionProvider } from '../context/SessionContext';

// Wrap components with:
<SessionProvider>
  <MemoryRouter>
    <RouteGuard module={testModule}>
      {children}
    </RouteGuard>
  </MemoryRouter>
</SessionProvider>
```

---

## Priority 2: Replace AI Guide Mock (30 minutes)

**Current State:** `aiGuideService.ts` uses mock response (Google Gemini SDK not configured).

**Action:**
1. Install real SDK: `npm install @google/generative-ai`
2. Update import in `src/services/aiGuideService.ts`:
   ```ts
   import { GoogleGenerativeAI } from '@google/generative-ai';
   ```
3. Configure API key in `.env.local`:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```
4. Update service to use real SDK

---

## Priority 3: Home Sections Registry (1 hour)

**Goal:** Make Home screen fully modular using sections registry.

**Current State:** Home has hardcoded sections.

**Target Architecture:**
```ts
// src/features/home/sectionsRegistry.ts
export const homeSections: HomeSection[] = [
  {
    id: 'upcoming-session',
    component: UpcomingSessionSection,
    order: 1,
    requiresAuth: true,
  },
  {
    id: 'daily-insight',
    component: DailyInsightSection,
    order: 2,
  },
  // ... more sections
];
```

**Benefits:**
- Easy to add/remove/reorder sections
- Conditional rendering based on flags/entitlements
- Cleaner Home screen code

---

## Priority 4: Real Natal/Astrology/HD Engines (Later)

**Current State:** Mock engines with seeded random data.

**Future Integration:**
1. **Astrology:**
   - Library: `swisseph` or `astronomia`
   - Calculate Sun/Moon/Ascendant from birth data
   
2. **Natal Chart:**
   - SVG generation with real planetary positions
   - Consider: `astro-charts` library
   
3. **Human Design:**
   - Library: TBD (no standard JS lib exists)
   - May need custom calculation logic

**Interface Prepared:** Engine interfaces in `src/features/*/engine/types.ts` are ready for real implementations.

---

## Priority 5: Stripe Integration (2 hours)

**Current State:** Payment service is mocked.

**Action:**
1. Install Stripe SDK: `npm install @stripe/stripe-js`
2. Create Stripe checkout session
3. Handle webhooks for subscription status
4. Update `paymentsService.ts`

---

## Priority 6: Jitsi/Video Integration (1 hour)

**Current State:** Video service uses mock links.

**Action:**
1. Install Jitsi SDK or use iframe embed
2. Generate real session rooms
3. Update `videoService.ts`

---

## Priority 7: i18n Optimization (30 minutes)

**Current State:** All locales loaded eagerly.

**Optimization:**
```ts
// Lazy load locales
const locales = import.meta.glob('./locales/*.ts');
const currentLocale = await locales[`./locales/${lang}.ts`]();
```

**Benefits:** Faster initial load, smaller bundle

---

## Priority 8: PWA Setup (1 hour)

**Action:**
1. Install: `npm install vite-plugin-pwa -D`
2. Configure in `vite.config.ts`
3. Create `manifest.json`
4. Add service worker

---

## Priority 9: CI/CD Pipeline (2 hours)

**Target:** GitHub Actions workflow

**Jobs:**
- Typecheck
- Build
- Test
- Deploy to Vercel/Netlify

**File:** `.github/workflows/ci.yml`

---

## Priority 10: Performance Optimization

**Metrics to Track:**
- Lighthouse score
- Bundle size
- Time to Interactive

**Actions:**
- Code splitting per route
- Image optimization
- Lazy load non-critical features

---

## Development Workflow (Daily)

**Before starting work:**
```bash
git pull
npm install
npm run dev
```

**Before committing:**
```bash
npm run typecheck
npm run build
npm run test
```

**If build breaks:**
1. Check `docs/PROMPTS_LOG.md` for last known good state
2. Review `docs/REPO_LAYOUT.md` for architecture rules
3. Never add importmap or dual entrypoints
4. Keep all code in `src/`

---

## Emergency Rollback Procedure

**If something breaks badly:**

1. Check git history: `git log --oneline`
2. Find last "Prompt #07" commit
3. Rollback: `git reset --hard <commit-hash>`
4. Re-verify: `npm run doctor`

**Prevention:**
- Commit after each successful prompt execution
- Tag stable checkpoints: `git tag v0.1-stable`

---

## Questions / Blockers?

Document here and tag in next prompt session:
- [ ] Issue 1: ...
- [ ] Issue 2: ...

---

Last Updated: 2024-12-17 (Prompt #07)
