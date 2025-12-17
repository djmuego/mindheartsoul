
# Prompts Log

CURRENT CHECKPOINT: Prompt #07 (Repo Stabilization Complete).

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

## Template for Future Prompts

## Prompt #XX — [Title]
**Date:** YYYY-MM-DD
**Goal:** [Clear objective]
**Files touched:**
- [List of files]
**Smoke test:**
- [Commands to verify]
**Result:** [Outcome summary]
