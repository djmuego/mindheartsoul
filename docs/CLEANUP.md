# Repository Cleanup Guide

This document describes how to remove deprecated root-level files that conflict with the canonical `src/` directory.

## ✅ Status: CLEANUP COMPLETE

As of **Prompt #07 (2024-12-17)**, all root duplicates have been removed.

---

## What Was Removed

The following root-level files/folders were **deprecated duplicates** of code that exists in `src/`:

```
/home/user/
├── App.tsx           ❌ REMOVED (exists in src/App.tsx)
├── index.tsx         ❌ REMOVED (second entrypoint - invalid)
├── components/       ❌ REMOVED (exists in src/components/)
├── context/          ❌ REMOVED (exists in src/context/)
├── services/         ❌ REMOVED (exists in src/services/)
├── utils/            ❌ REMOVED (exists in src/utils/)
├── types.ts          ❌ REMOVED (exists in src/types.ts)
└── constants.ts      ❌ REMOVED (exists in src/constants.ts)
```

---

## Verification

To confirm cleanup is complete:

```bash
# Should NOT show any of the above files
ls -la | grep -E "App.tsx|index.tsx|types.ts|constants.ts"

# Should NOT show these directories
ls -d components/ context/ services/ utils/ 2>/dev/null
```

If any of these return results, they need to be removed.

---

## Manual Cleanup Commands (If Needed)

**⚠️ WARNING:** Only run if files exist. Check first with `ls`.

### macOS / Linux:
```bash
cd /path/to/project
rm -f App.tsx index.tsx types.ts constants.ts
rm -rf components/ context/ services/ utils/
```

### Windows (PowerShell):
```powershell
cd C:\path\to\project
Remove-Item App.tsx, index.tsx, types.ts, constants.ts -Force -ErrorAction SilentlyContinue
Remove-Item components, context, services, utils -Recurse -Force -ErrorAction SilentlyContinue
```

### Windows (CMD):
```cmd
cd C:\path\to\project
del /F App.tsx index.tsx types.ts constants.ts 2>nul
rmdir /S /Q components context services utils 2>nul
```

---

## Post-Cleanup Verification

After cleanup, run:

```bash
npm run typecheck  # Should pass with 0 errors
npm run build      # Should succeed
npm run dev        # Should start without errors
```

---

## Why These Files Were Deprecated

**Historical Context:**
- Early iterations of the project had code in root
- Migration to `src/` structure created duplicates
- `tsconfig.json` was excluding them, but they physically existed
- This caused:
  - Developer confusion (which file is canonical?)
  - Import path ambiguity
  - Potential runtime issues with module resolution

**Solution:**
- Single Source of Truth: `src/` directory
- All imports use `src/` or relative paths within `src/`
- Root level only contains config files (vite, tsconfig, package.json, etc.)

---

## Current Repository Structure (Post-Cleanup)

```
/
├── docs/               # Documentation
├── dist/               # Build output (gitignored)
├── node_modules/       # Dependencies (gitignored)
├── src/                # 🎯 CANONICAL SOURCE CODE
│   ├── main.tsx        # Entry point
│   ├── App.tsx         # Root component
│   ├── components/     # UI components
│   ├── features/       # Feature modules
│   ├── services/       # Business logic
│   ├── context/        # React contexts
│   ├── utils/          # Utilities
│   └── ...
├── index.html          # HTML entry (loads src/main.tsx)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## Rules to Prevent Future Duplicates

1. **Never** create `.tsx/.ts` files in root (except config files)
2. **Never** create code folders in root (`components/`, `services/`, etc.)
3. **Always** write application code inside `src/`
4. **Always** import from `src/...` or relative paths within `src/`

---

## If Duplicates Appear Again

**Immediate Actions:**
1. **STOP** coding
2. Check `git status` — did someone commit them?
3. Verify `tsconfig.json` still excludes them
4. Remove manually using commands above
5. Run `npm run doctor` to confirm stability
6. Document in `docs/PROMPTS_LOG.md`

---

Last Updated: 2024-12-17 (Prompt #07)
