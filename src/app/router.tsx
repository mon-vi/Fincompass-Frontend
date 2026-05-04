import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { RequireAuth } from './guards/RequireAuth';
import { RequireOnboarding } from './guards/RequireOnboarding';
import { RedirectIfAuth } from './guards/RedirectIfAuth';
import { RequireTier } from './guards/RequireTier';
import { RouteErrorBoundary } from './RouteErrorBoundary';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { DebtsPage } from '@/pages/debts/DebtsPage';
import { AddDebtPage } from '@/pages/debts/AddDebtPage';
import { EditDebtPage } from '@/pages/debts/EditDebtPage';
import { BudgetPage } from '@/pages/budget/BudgetPage';
import { HealthScorePage } from '@/pages/health-score/HealthScorePage';
import { TimelinePage } from '@/pages/timeline/TimelinePage';
import { ActionPlanPage } from '@/pages/action-plan/ActionPlanPage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { BillingPage } from '@/pages/billing/BillingPage';
import { ExpensesPage } from '@/pages/expenses/ExpensesPage';
import { OcrUploadPage } from '@/pages/ocr/OcrUploadPage';
import { OcrReviewPage } from '@/pages/ocr/OcrReviewPage';
import { EmailParserPage } from '@/pages/email-parser/EmailParserPage';
import { AriaPage } from '@/pages/aria/AriaPage';
import { LandingPage } from '@/pages/landing/LandingPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <RedirectIfAuth />,
    errorElement: <RouteErrorBoundary />,
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
    element: <RequireAuth />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: ROUTES.ONBOARDING,
        element: <OnboardingPage />,
      },
      {
        element: <RequireOnboarding />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
              { path: ROUTES.DEBTS, element: <DebtsPage /> },
              { path: `${ROUTES.DEBTS}/add`, element: <AddDebtPage /> },
              { path: `${ROUTES.DEBTS}/:id/edit`, element: <EditDebtPage /> },
              { path: ROUTES.BUDGET, element: <BudgetPage /> },
              { path: ROUTES.EXPENSES, element: <ExpensesPage /> },
              {
                element: <RequireTier required="navigator" feature="OCR import" />,
                children: [
                  { path: ROUTES.OCR_UPLOAD, element: <OcrUploadPage /> },
                  { path: ROUTES.OCR_REVIEW, element: <OcrReviewPage /> },
                  { path: ROUTES.EMAIL_PARSER, element: <EmailParserPage /> },
                ],
              },
              { path: ROUTES.HEALTH_SCORE, element: <HealthScorePage /> },
              { path: ROUTES.TIMELINE, element: <TimelinePage /> },
              { path: ROUTES.ACTION_PLAN, element: <ActionPlanPage /> },
              { path: ROUTES.NOTIFICATIONS, element: <NotificationsPage /> },
              { path: ROUTES.PROFILE, element: <ProfilePage /> },
              { path: ROUTES.SETTINGS, element: <ProfilePage /> },
              { path: ROUTES.BILLING, element: <BillingPage /> },
              // CFO-tier gated
              {
                element: <RequireTier required="cfo" feature="ARIA" />,
                children: [
                  { path: ROUTES.ARIA, element: <AriaPage /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { path: ROUTES.HOME, element: <LandingPage />, errorElement: <RouteErrorBoundary /> },
  { path: ROUTES.NOT_FOUND, element: <NotFoundPage />, errorElement: <RouteErrorBoundary /> },
]);
