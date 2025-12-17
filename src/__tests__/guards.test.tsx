
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RouteGuard } from '../app/guards/RouteGuard';
import { AppModule } from '../app/modules/types';
import { MemoryRouter } from 'react-router-dom';

// Mock Hooks
vi.mock('../../context/SessionContext', () => ({
  useSession: () => ({ user: { id: 'u1', role: 'seeker' } })
}));

vi.mock('../../hooks/useFeatureFlags', () => ({
  useFeatureFlags: () => ({ flags: { testFeature: true, disabledFeature: false } })
}));

vi.mock('../../hooks/useEntitlements', () => ({
  useEntitlements: () => ({ isPro: false })
}));

vi.mock('../../services/notificationsService', () => ({
  pushNotification: vi.fn()
}));

describe('RouteGuard', () => {
  const renderGuard = (module: AppModule) => {
    return render(
      <MemoryRouter>
        <RouteGuard module={module}>
          <div>Protected Content</div>
        </RouteGuard>
      </MemoryRouter>
    );
  };

  it('renders children if checks pass', () => {
    const module: AppModule = { id: 'test', routes: [] };
    renderGuard(module);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows access denied if role mismatch', () => {
    const module: AppModule = { id: 'admin-only', routes: [], roles: ['admin'] };
    renderGuard(module);
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows upgrade screen if pro required', () => {
    const module: AppModule = { id: 'pro-only', routes: [], entitlements: { proOnly: true } };
    renderGuard(module);
    expect(screen.getByText('Pro Feature Locked')).toBeInTheDocument();
  });

  it('shows feature unavailable if flag disabled', () => {
    const module: AppModule = { id: 'disabled', routes: [], featureFlag: 'disabledFeature' as any };
    renderGuard(module);
    expect(screen.getByText('Feature Unavailable')).toBeInTheDocument();
  });
});
