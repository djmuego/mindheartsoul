
# Routing Guards

The application uses a unified `RouteGuard` system to protect modules and routes based on:
1. **Feature Flags**: Is the feature enabled globally?
2. **Roles**: Is the user allowed to access this (e.g. Admin, Mentor)?
3. **Entitlements**: Does the user have a Pro subscription?

## Usage

Guards are defined in the `AppModule` interface in `src/app/modules/types.ts`.

### Defining Guards in a Module

You can use the shorthand properties or the explicit `guards` array.

**Shorthand (Recommended for simple cases):**
```typescript
export const adminModule: AppModule = {
  id: 'admin',
  roles: ['admin'], // User must have 'admin' role
  routes: [...]
};

export const proModule: AppModule = {
  id: 'pro-stuff',
  entitlements: { proOnly: true }, // User must be Pro
  routes: [...]
};
```

**Explicit Guards (For future complex logic):**
```typescript
export const complexModule: AppModule = {
  id: 'complex',
  guards: [
    { type: 'role', role: 'mentor' },
    { type: 'feature', flag: 'betaFeatures' }
  ],
  routes: [...]
};
```

## Behavior

When a user accesses a guarded route:
1. `App.tsx` generates the route wrapped in `<RouteGuard>`.
2. `RouteGuard` checks the current session context.
3. If a check fails:
   - **Role Failure**: Shows `AccessDeniedScreen` (Red shield).
   - **Pro Failure**: Shows `AccessDeniedScreen` (Yellow sparkle) with "Upgrade" CTA.
   - **Feature Failure**: Shows `AccessDeniedScreen` (Grey lock) saying feature is disabled.
4. A notification is automatically pushed to the user's notification center (if logged in).

## Adding New Guard Types
1. Update `GuardType` in `src/app/modules/types.ts`.
2. Update logic in `src/app/guards/RouteGuard.tsx`.
3. Update `AccessDeniedScreen.tsx` to handle the new reason code.
