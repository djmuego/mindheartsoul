
# Modular Architecture

MindHeartSoul uses a module registry system to manage features, routing, navigation, and feature flags.

## Registry
The source of truth is `src/app/modules/registry.ts`.
It exports `getEnabledModules(context)` which filters available modules based on:
1. Feature Flags (from `src/config/featureFlags.ts`)
2. User Role (e.g., admin, mentor)
3. Entitlements (e.g., pro)

## Module Definition
Each feature has a definition file in `src/app/modules/` (e.g., `homeModule.tsx`).

```typescript
export const myModule: AppModule = {
  id: 'my-feature',
  featureFlag: 'myFeatureEnabled', // Optional gating
  nav: { // Optional Bottom Nav
    placement: 'bottom',
    order: 100,
    icon: MyIcon,
    path: '/my-feature',
    labelKey: 'nav.myFeature'
  },
  headerActions: [], // Optional Header Icons
  routes: [ // React Router Definitions
    { path: 'my-feature', element: <MyScreen /> }
  ]
};
```

## Adding a New Feature
1. Create your screens/components in `src/components/screens/`.
2. Create a module file `src/app/modules/myModule.tsx`.
3. Add module to `ALL_MODULES` in `src/app/modules/registry.ts`.
4. Add feature flag to `src/config/featureFlags.ts` (optional).
5. Add i18n keys for navigation label.

## Guardrail Notes
- **AppScaffold**: Renders navigation dynamically. Do not hardcode links in `NAV_ITEMS`.
- **Routes**: `App.tsx` generates routes from the registry. Do not hardcode `<Route>` in `AppRoutes`.
