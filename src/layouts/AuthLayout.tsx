import { Outlet } from 'react-router-dom';

/**
 * Minimal centered layout for auth pages (login, register, forgot password).
 */
export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_center,rgba(18,53,91,0.14),transparent_60%)]" />
      <div className="relative grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_28rem]">
        <div className="hidden lg:block">
          <div className="max-w-md rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-xl shadow-slate-900/[0.06] backdrop-blur">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#12355b] text-base font-black text-white shadow-sm shadow-slate-900/20">
              FC
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2b6d91]">FinCompass</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Feel clear about your next money move.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Debt, budgets, and decisions in one calmer workspace. Serious finance tools, without the cold spreadsheet feeling.
            </p>
          </div>
        </div>
        <div className="w-full max-w-md justify-self-center lg:max-w-none">
          <div className="mb-6 text-center lg:hidden">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#12355b] text-sm font-black text-white shadow-sm shadow-slate-900/20">
              FC
            </span>
            <span className="mt-3 block text-2xl font-black tracking-tight text-slate-950">FinCompass</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
