
# Repository Layout Invariants

This project follows a strict **Single Source of Truth** architecture to prevent dual-boot issues with Vite and TypeScript.

## 1. Single Entry Point
- **HTML Entry**: `index.html` MUST ONLY load `/src/main.tsx`.
- **React Root**: `src/main.tsx` is the only place `ReactDOM.createRoot` is called.
- **NO ImportMaps**: We use Vite to bundle local `node_modules`. Do not add `<script type="importmap">`.

## 2. Canonical Source (`src/`)
- All application code resides in `src/`.
- Root-level `App.tsx`, `index.tsx`, `types.ts`, `constants.ts` are **DEPRECATED** and should be deleted.
- Root folders `components/`, `services/`, `context/`, `utils/` are **DEPRECATED**.

## 3. Directory Structure
```
/
├── index.html          # Entry
├── src/
│   ├── main.tsx        # Boot
│   ├── App.tsx         # Routing & Providers
│   ├── app/            # App-wide modules & registry
│   ├── components/     # UI Components
│   ├── context/        # React Contexts
│   ├── features/       # Feature-specific logic
│   ├── services/       # Data Access Layer
│   └── ...
├── docs/               # Documentation
└── vite.config.ts
```

## 4. Imports
- Always import from `src/...` or relative paths inside `src`.
- Do not import from `../` if it lands outside `src/`.
