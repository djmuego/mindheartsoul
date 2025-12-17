
import { AppModule, RegistryContext } from './types';
import { homeModule } from './homeModule';
import { mentorsModule } from './mentorsModule';
import { natalModule } from './natalModule';
import { communityModule } from './communityModule';
import { profileModule } from './profileModule';
import { chatModule } from './chatModule';
import { notificationsModule } from './notificationsModule';
import { coursesModule } from './coursesModule';
import { settingsModule } from './settingsModule';
import { proModule } from './proModule';
import { adminModule } from './adminModule';
import { mentorDashboardModule } from './mentorDashboardModule';
import { astrologyModule } from './astrologyModule';
import { humanDesignModule } from './humanDesignModule';
import { paymentsModule } from './paymentsModule';
import { numerologyModule } from './numerologyModule';
import { meditationModule } from './meditationModule';

export const ALL_MODULES: AppModule[] = [
  homeModule,
  mentorsModule,
  natalModule,
  communityModule,
  profileModule,
  chatModule,
  notificationsModule,
  coursesModule,
  settingsModule,
  proModule,
  adminModule,
  mentorDashboardModule,
  astrologyModule,
  numerologyModule,
  meditationModule,
  humanDesignModule,
  paymentsModule
];

export const getAllModules = () => ALL_MODULES;

/**
 * Helper to check if a module is enabled for the current context.
 */
export function isModuleEnabled(module: AppModule, ctx: RegistryContext): boolean {
  // 1. Feature Flag
  if (module.featureFlag && !ctx.flags[module.featureFlag]) {
    return false;
  }

  // 2. Role Check (Legacy & New)
  const roles = module.roles || (module.minRole ? [module.minRole] : []);
  if (roles.length > 0) {
    if (!ctx.user) return false;
    if (!roles.includes(ctx.user.role)) return false;
  }

  // 3. Pro Check
  if ((module.requiresPro || module.entitlements?.proOnly) && !ctx.isPro) {
    // We generally allow rendering the link but might block the route. 
    // However, if strict hiding is desired, return false.
    // For now, let's keep it visible so users see what they are missing (Upgrade flow).
    return true;
  }

  return true;
}

export function getBottomNavModules(ctx: RegistryContext) {
  return ALL_MODULES
    .filter(m => m.nav && m.nav.placement === 'bottom' && isModuleEnabled(m, ctx))
    .map(m => ({
      ...m.nav!,
      id: m.id // Ensure ID is present for keys
    }))
    .sort((a, b) => a.order - b.order);
}

export function getHeaderActionModules(ctx: RegistryContext) {
  const actions = ALL_MODULES
    .filter(m => m.headerActions && isModuleEnabled(m, ctx))
    .flatMap(m => m.headerActions!);
  
  return actions.sort((a, b) => a.order - b.order);
}
