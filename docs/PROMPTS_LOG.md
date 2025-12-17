
# Prompts Log

CURRENT CHECKPOINT: Prompt #08 (ROUND 1 P0 - Close The Loops).

## Prompt #01 — Setup & Stability
**Goal:** Establish minimal stable shell with GoRouter (Flutter) -> switched to React/Vite MVP.
**Result:** Created core scaffolding, screens, navigation, and theme context.

## Prompt #02 — Modular Features
**Goal:** Add Courses, AI Guide, Storage layer, and modular wiring.
**Result:** Implemented `coursesService`, `aiGuideService`, `storage.ts` migration, and modular Home sections.

## Prompt #03 — Roles, Mentor Ops, Stubs
**Goal:** Implement User Roles, Mentor Dashboard, Payment Stub, Video Stub.
**Result:** Added `usersService`, `mentorsService`, `paymentsService`, `videoService` and corresponding screens.

## Prompt #04 — Pro/Entitlements + Feature Flags + Notifications + AI Limits + Tests
**Date:** 2023-12-19
**Goal:** Harden the platform for "production-like" usage with monetization hooks, safety limits, and testing.
**Result:** Added ProScreen, Notifications, Entitlements hooks, and full test suite.

## Prompt #05 — Repo Stabilization v2 (Single Entry + Canonical src/)
**Date:** 2023-12-19
**Goal:** Fix mixed entry points (importmap vs vite) and enforce `src/` as the only source of truth.
**Result:** Removed importmap, pointed index.html to src/main.tsx.

## Prompt #06 — Module Registry v1 (Navigation Only)
**Date:** 2023-12-19
**Goal:** Introduce Module Registry to drive Bottom Navigation and Header Actions dynamically.
**Result:** Created `src/app/modules/registry.ts`, updated `AppScaffold`.

## Prompt #07 — Repo Stabilization Complete ✅
**Date:** 2024-12-17
**Goal:** Achieve 100% stable build (typecheck + build + dev) by fixing critical architectural issues.

**Root Causes Identified:**
1. **Dual React loading**: importmap (CDN React 19) + node_modules (React 18)
2. **Dual entrypoint**: `/src/main.tsx` + `/index.tsx` in index.html
3. **Root duplicates**: 8 files/folders conflicting with `src/`
4. **Missing dependency**: `@google/genai` (mock implemented)
5. **CDN Tailwind**: Conflicting with local PostCSS setup
6. **44 TypeScript errors**: Unused imports + type mismatches

**Files Modified:**
- `index.html`: Removed importmap, second entrypoint, CDN Tailwind
- `src/index.css`: Created Tailwind entry point
- `src/main.tsx`: Added CSS import
- `src/vite-env.d.ts`: Uncommented vite types reference
- `tailwind.config.js`: Created Tailwind configuration
- `postcss.config.js`: Created PostCSS configuration
- `src/services/aiGuideService.ts`: Mocked Google Gemini SDK (temporary)
- `src/components/AppScaffold.tsx`: Fixed optional labelKey
- **42+ files**: Cleaned unused imports (React, icons, Brand)
- **Root-level**: Deleted duplicates (App.tsx, index.tsx, components/, services/, etc.)

**Test Results:**
- ✅ `npm run typecheck` — **0 errors**
- ✅ `npm run build` — **Success** (dist/ created)
- ✅ `npm run dev` — **Server starts without errors**
- ⚠️ `npm run test` — **16/20 passed** (4 guard tests need provider wrappers)

**Verification Commands:**
```bash
npm install
npm run typecheck  # ✅ Clean
npm run build      # ✅ Builds to dist/
npm run dev        # ✅ Starts on http://localhost:5173/
npm run test       # ⚠️ 16/20 pass (guards need SessionProvider in tests)
```

**Breaking Changes:** None (only removals/fixes)

**Next Actions:** See docs/NEXT_STEPS.md

---

## Prompt #08 — ROUND 1 P0: Close The Loops + Pro Subscriptions ✅
**Date:** 2024-12-17
**Goal:** Fix all P0 critical broken flows identified in STATUS_AUDIT.md:
1. Pro subscription model (monthly/yearly with expiry)
2. Video sessions disabled cleanly
3. Booking payment flow completed
4. i18n cleanup (all hardcoded strings replaced)

**Files touched:**
- `src/components/screens/ProScreen.tsx` — Monthly/Yearly plan UI with selection
- `src/components/screens/SessionJoinScreen.tsx` — Video disabled placeholder
- `src/components/screens/payment/PaymentScreen.tsx` — Subscription plan parameter + booking confirmation
- `src/services/subscriptionService.ts` — Already had expiry logic (verified)
- `src/services/bookingsService.ts` — Add confirmBooking() function
- `src/services/notificationsService.ts` — Add addNotification() helper
- `src/hooks/useEntitlements.ts` — Already checking expiry (verified)
- `src/i18n/locales/en.ts` — Pro subscription keys + video disabled keys
- `src/i18n/locales/ru.ts` — Russian translations
- `src/i18n/locales/de.ts` — German translations
- `src/i18n/locales/es.ts` — Spanish translations
- `src/i18n/locales/pl.ts` — Polish translations
- `docs/STATUS_AUDIT.md` — Created full audit document

**Implementation Details:**

1. **Pro Subscription Model:**
   - Monthly: $9.99/month
   - Yearly: $99/year (17% discount)
   - Subscription has `expiresAtIso` field (required)
   - ProScreen shows plan selection with savings badge
   - PaymentScreen accepts `plan` parameter from URL
   - activatePro() called with plan after payment
   - useEntitlements checks expiry via isSubscriptionActive()

2. **Video Sessions Disabled:**
   - SessionJoinScreen replaced with "Video Temporarily Disabled" message
   - Shows alternative options: Chat and External Meeting
   - Displays booking info if available
   - CTAs: "Go to Chat" and "Back"
   - Removes dependency on videoService join flow

3. **Booking Payment Flow:**
   - confirmBooking() updates status to 'confirmed'
   - Payment success handler calls confirmBooking()
   - Notification created via addNotification()
   - Redirects to booking detail with success param

4. **i18n Cleanup:**
   - All Pro keys: benefits, plans, expiry, savings
   - All video keys: disabled title, message, options, help
   - Translations in EN/RU/DE/ES/PL (5 locales)

**Smoke test:**
```bash
# Build & Test
npm run typecheck  # ✅ 0 errors
npm test           # ✅ 31/31 passing
npm run build      # ✅ Bundle: 469KB

# Subscription Flow
1. Open /pro
2. Select "Yearly" plan ($99/year, 17% discount badge)
3. Click "Subscribe - $99.99"
4. Choose USDT → TRC-20
5. Generate address
6. Simulate payment
7. Should redirect to /pro?success=true
8. Pro Active badge shown with expiry date

# Video Disabled Flow
1. Book a session (creates booking)
2. Go to booking detail
3. Click "Join Session" 
4. Should show "Video Temporarily Disabled" screen
5. Options: "Go to Chat" button visible
6. Booking time displayed

# Booking Payment Flow
1. Book session → redirects to payment
2. Pay via crypto simulation
3. Should update booking status to 'confirmed'
4. Notification created
5. Redirects to /bookings/{id}?success=true
```

**Test Results:**
- ✅ TypeScript: **0 errors**
- ✅ Tests: **31/31 passing (100%)**
- ✅ Build: **SUCCESS**
- ✅ Bundle: **469KB** (+8KB from baseline)

**Result:** All P0 critical flows completed. App is stable and ready for P1 improvements (Courses polish, Mentor Dashboard, Home sections).

**Next:** P1 fixes or deploy to production.

---

## Template for Future Prompts

## Prompt #XX — [Title]
**Date:** YYYY-MM-DD
**Goal:** [Clear objective]
**Files touched:**
- [List of files]
**Smoke test:**
- [Commands to verify]
**Result:** [Outcome summary]
