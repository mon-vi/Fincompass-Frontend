import { Outlet } from 'react-router-dom';

/**
 * Minimal centered layout for auth pages (login, register, forgot password).
 */
export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold text-indigo-600">FinCompass</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
