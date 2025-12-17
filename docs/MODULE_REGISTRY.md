
# Module Registry

The Module Registry (`src/app/modules/registry.ts`) is the central source of truth for application modules, navigation, and feature gating.

## AppModule Structure

Each module in the registry is defined by the `AppModule` interface:

```typescript
export interface AppModule {
  id: string;                // Unique identifier
  path: string;              // Route path
  labelKey: string;          // i18n key for the label
  icon?: any;                // Icon component
  navPlacement: 'bottom' | 'header' | 'none'; // Where to show in UI
  order: number;             // Sort order
  
  // Gating Props
  requiresAuth?: boolean;    // Requires logged-in user
  minRole?: UserRole;        // 'seeker', 'mentor', 'admin'
  requiresPro?: boolean;     // Requires Pro subscription
  featureFlag?: FeatureFlagKey; // Tied to a feature flag
}
```

## Navigation Logic

The `AppScaffold` component uses `getBottomNavModules(ctx)` and `getHeaderActionModules(ctx)` to dynamically render the navigation bar and header actions.

### Context (ctx)
The registry filters modules based on the current user context:
- **User**: Is the user authenticated? What is their role?
- **Flags**: Is the feature enabled in `config/featureFlags.ts`?
- **Pro**: Does the user have an active subscription?

## Current Status (v1)

In this version, the registry **only controls the UI navigation** (Bottom Tabs and Header Icons). 
The core routing (`src/App.tsx`) is still static.

### Future Roadmap
- **v2**: Dynamic Routing generation from the Registry.
- **v2**: Centralized `RouteGuard` integration using module properties.
