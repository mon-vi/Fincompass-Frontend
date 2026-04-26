import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { RequireAuth } from './guards/RequireAuth';
import { RequireOnboarding } from './guards/RequireOnboarding';
import { RedirectIfAuth } from './guards/RedirectIfAuth';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Application route tree.
 *
 * Structure:
 *   / (redirect to /dashboard)
 *   Public (RedirectIfAuth)
 *     /login
 *     /register
 *     /forgot-password
 *     /reset-password
 *   Protected (RequireAuth)
 *     /onboarding         — authenticated but onboarding not yet complete
 *     Protected + Onboarded (RequireOnboarding)
 *       /dashboard
 *       ... all other app routes
 *   * — 404
 */
export const router = createBrowserRouter([
  {
    // Public auth routes — redirect away if already authenticated
    element: <RedirectIfAuth />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          { path: ROUTES.REGISTER, element: <RegisterPage /> },
          { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
          { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
        ],
      },
    ],
  },
  {
    // All authenticated routes
    element: <RequireAuth />,
    children: [
      {
        // Onboarding — authenticated but not yet complete
        path: ROUTES.ONBOARDING,
        element: <OnboardingPage />,
      },
      {
        // Main app — requires completed onboarding
        element: <RequireOnboarding />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
              // Additional routes added per phase:
              // { path: ROUTES.BUDGET, element: <BudgetPage /> },
              // { path: ROUTES.DEBTS, element: <DebtsPage /> },
            ],
          },
        ],
      },
    ],
  },
  // / always redirects — guards then route to login or dashboard
  { path: ROUTES.HOME, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
  { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
]);
