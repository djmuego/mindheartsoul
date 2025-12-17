
import React, { useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { SessionProvider, useSession } from './context/SessionContext';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './i18n/I18nProvider';
import { AppScaffold } from './components/AppScaffold';
import { migrateStorage } from './services/storage';
import { AuthScreen } from './components/screens/AuthScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { getAllModules } from './app/modules/registry';
import { RouteGuard } from './app/guards/RouteGuard';
import { NotFoundScreen } from './components/screens/NotFoundScreen';

const AuthGuard = () => {
  const { user, birthProfile } = useSession();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!birthProfile) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

const AppRoutes: React.FC = () => {
  const { user } = useSession();

  // Load ALL modules, not just enabled ones. 
  // We want to generate routes for everything so that RouteGuard can intercept 
  // and show "Access Denied" or "Upgrade" screens instead of 404s for valid but locked paths.
  const modules = useMemo(() => getAllModules(), []);

  return (
    <Routes>
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthScreen />} />
      <Route path="/onboarding" element={user ? <OnboardingScreen /> : <Navigate to="/auth" replace />} />
      
      <Route element={<AuthGuard />}>
        {/* Scaffold Routes */}
        <Route path="/" element={<AppScaffold />}>
          <Route index element={<Navigate to="/home" replace />} />
          
          {modules.map(module => (
            <React.Fragment key={module.id}>
              {module.routes
                .filter(r => !r.layout || r.layout === 'scaffold')
                .map((route, i) => (
                  <Route 
                    key={`scaffold-${module.id}-${i}`} 
                    path={route.path} 
                    element={
                      <RouteGuard module={module}>
                        {route.element}
                      </RouteGuard>
                    } 
                    index={route.index} 
                  />
                ))
              }
            </React.Fragment>
          ))}
        </Route>
        
        {/* Fullscreen Routes (Outside Scaffold) */}
        {modules.map(module => (
          <React.Fragment key={`fs-${module.id}`}>
            {module.routes
              .filter(r => r.layout === 'fullscreen')
              .map((route, i) => (
                <Route 
                  key={`full-${module.id}-${i}`} 
                  path={route.path} 
                  element={
                    <RouteGuard module={module}>
                      {route.element}
                    </RouteGuard>
                  } 
                />
              ))
            }
          </React.Fragment>
        ))}

        {/* Catch All 404 */}
        <Route path="*" element={<NotFoundScreen />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    migrateStorage();
  }, []);

  return (
    <SessionProvider>
      <I18nProvider>
        <ThemeProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </ThemeProvider>
      </I18nProvider>
    </SessionProvider>
  );
};

export default App;
