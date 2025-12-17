
# MindHeartSoul Architecture

## Overview
MindHeartSoul is a React + TypeScript PWA built with Vite. It follows a modular, feature-based architecture.

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router (HashRouter)
- **State**: React Context (Session, Theme, Language)
- **Storage**: LocalStorage (via `storage.ts` adapter)
- **Icons**: Lucide React

## Directory Structure
- `src/components`: Shared UI components and Screens (pages).
- `src/features`: Feature-specific logic (e.g., `home` sections, `courses` types).
- `src/services`: Business logic and data access (storage, api stubs).
- `src/domain`: (Optional) Shared domain types.
- `src/context`: Global state providers.
- `src/i18n`: Localization registry and hooks.

## Key Principles
1. **Service Layer**: Components should not access `localStorage` directly. Use `src/services/*`.
2. **Stub-First**: All external integrations (Payment, Video, AI) are implemented as "Stubs" in services, returning mock promises.
3. **Additive Design**: New features are added as new modules; existing code is only modified to wire them in.

## Data Persistence
All data is persisted to `localStorage` using keys defined in `src/services/storage.ts`.
A primitive migration system exists in `migrateStorage()` to handle schema updates.
