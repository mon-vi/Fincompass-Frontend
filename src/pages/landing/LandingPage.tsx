import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { designTokens } from '@/constants/designTokens';

const features = [
  {
    title: 'Budget clarity',
    description: 'See what is planned, what is spent, and where your month needs a gentle nudge.',
    tag: 'Budget',
  },
  {
    title: 'Debt payoff direction',
    description: 'Compare payoff strategies and keep the next best move visible without spreadsheet gymnastics.',
    tag: 'Debt',
  },
  {
    title: 'ARIA assistant',
    description: 'Ask for plain-English guidance when you want a second set of eyes on your financial plan.',
    tag: 'AI',
  },
  {
    title: 'OCR/email updates',
    description: 'Import receipts, statements, and forwarded emails so your numbers stay closer to reality.',
    tag: 'Import',
  },
];

const steps = [
  {
    number: '01',
    title: 'Connect your starting point',
    description: 'Add income, expenses, and debts with a guided setup that feels manageable.',
  },
  {
    number: '02',
    title: 'See your financial state',
    description: 'FinCompass turns the numbers into health, cash flow, due-soon alerts, and priorities.',
  },
  {
    number: '03',
    title: 'Follow the next move',
    description: 'Use your action plan, timeline, and ARIA guidance to keep momentum without guesswork.',
  },
];

const plans = [
  {
    name: 'Compass',
    price: '$0',
    description: 'Start with core tracking and a clearer monthly picture.',
    features: ['Debt tracking', 'Budget overview', 'Health score', 'Action plan'],
  },
  {
    name: 'Navigator',
    price: '$9',
    description: 'Add richer payoff tools and easier import workflows.',
    features: ['Payoff timeline', 'Guidance insights', 'OCR/email imports', 'Priority signals'],
    featured: true,
  },
  {
    name: 'CFO',
    price: '$19',
    description: 'Bring in ARIA for personalized financial coaching.',
    features: ['Everything in Navigator', 'ARIA assistant', 'Personalized projections', 'Premium planning'],
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-emerald-600">
      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-5xl rounded-[2rem] border border-slate-200/80 bg-white/85 p-3 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-300" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-emerald-300" />
          <span className="ml-3 text-xs font-semibold text-slate-500">FinCompass dashboard</span>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-[1.2fr_0.8fr] md:p-6">
          <div className="rounded-3xl bg-[#12355b] p-5 text-white shadow-lg shadow-slate-900/10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">Financial state</p>
            <h3 className="mt-3 text-2xl font-black tracking-tight">You are on track, with one bill needing attention.</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {['$2,450 left', '82 score', '2 actions'].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                  <p className="text-sm font-bold">{item}</p>
                  <p className="mt-1 text-xs text-sky-100">This month</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-950">Next best move</p>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-200">Due soon</span>
            </div>
            <p className="mt-4 text-2xl font-black tracking-tight text-slate-950">Pay Visa minimum</p>
            <p className="mt-1 text-sm text-slate-500">$75 due in 2 days. Keeps your plan steady.</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-2/3 rounded-full bg-emerald-500" />
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <div className="grid gap-4 md:grid-cols-3">
              {['Income vs obligations', 'Budget pulse', 'ARIA guidance'].map((item, index) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-[#2b6d91]" style={{ width: `${78 - index * 14}%` }} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-800">Clear signal, no noise.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-transparent text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to={ROUTES.HOME} className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91] focus-visible:ring-offset-4">
            <span className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black ${designTokens.classes.logoMark}`}>FC</span>
            <span className="text-lg font-black tracking-tight">FinCompass</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <a href="#how" className="rounded-lg px-2 py-1 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91]">How it works</a>
            <a href="#features" className="rounded-lg px-2 py-1 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91]">Features</a>
            <a href="#pricing" className="rounded-lg px-2 py-1 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91]">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to={ROUTES.LOGIN} className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91] sm:inline-flex">
              Sign in
            </Link>
            <Link to={ROUTES.REGISTER} className={`inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-bold shadow-sm shadow-orange-900/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4b460] focus-visible:ring-offset-2 ${designTokens.classes.accentButton}`}>
              Start free
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-[#2b6d91] ring-1 ring-slate-200">
                Premium money clarity
              </p>
              <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Your finances, finally in plain sight.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                FinCompass helps you understand where you are, what needs attention, and what to do next with a calm dashboard built for real financial life.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to={ROUTES.REGISTER} className={`inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 text-base font-bold shadow-lg shadow-orange-900/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4b460] focus-visible:ring-offset-2 ${designTokens.classes.accentButton}`}>
                  Get started free
                </Link>
                <a href="#preview" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-base font-bold text-slate-800 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b6d91] focus-visible:ring-offset-2">
                  See the dashboard
                </a>
              </div>
              <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-sm">
                {['No setup drama', 'Mobile friendly', 'Upgrade when ready'].map((item) => (
                  <div key={item} className="rounded-2xl bg-white/85 p-3 text-center font-semibold text-slate-600 shadow-sm shadow-slate-900/[0.03] ring-1 ring-slate-200/70">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div id="preview">
              <ProductPreview />
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-sm shadow-slate-900/[0.04] sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#2b6d91]">The problem</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Most money apps show numbers. They do not tell you what matters.</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {['Bills hide in different places.', 'Debt plans feel abstract.', 'Budgets get stale fast.'].map((item) => (
                  <div key={item} className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200/70">
                    <p className="text-base font-bold text-slate-950">{item}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">FinCompass brings the signal forward so your next step is easier to trust.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#2b6d91]">How FinCompass works</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Guided setup, clear dashboard, practical momentum.</h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-900/[0.04]">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#12355b]/10 text-sm font-black text-[#12355b]">{step.number}</span>
                  <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#2b6d91]">Features</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Serious finance tools with a friendly pulse.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-500">Built to feel trustworthy and calm, with just enough personality to make progress satisfying.</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="group rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-900/[0.04] transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/[0.07]">
                  <span className="inline-flex rounded-full bg-[#d97735]/10 px-3 py-1 text-xs font-black text-[#9a4a20] ring-1 ring-[#d97735]/15">{feature.tag}</span>
                  <h3 className="mt-5 text-lg font-black tracking-tight text-slate-950">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#2b6d91]">Pricing preview</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Start simple. Upgrade when your plan needs more horsepower.</h2>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.name} className={`relative rounded-3xl border bg-white/90 p-6 shadow-sm shadow-slate-900/[0.04] ${plan.featured ? 'border-[#d97735]/40 ring-4 ring-[#d97735]/10' : 'border-slate-200'}`}>
                  {plan.featured && (
                    <span className="absolute right-5 top-5 rounded-full bg-[#d97735] px-3 py-1 text-xs font-black text-white">Popular</span>
                  )}
                  <h3 className="text-xl font-black tracking-tight text-slate-950">{plan.name}</h3>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-4xl font-black tracking-tight text-slate-950">{plan.price}</span>
                    <span className="pb-1 text-sm font-semibold text-slate-500">/mo</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-500">{plan.description}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <CheckIcon />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#12355b] p-8 text-center text-white shadow-2xl shadow-slate-900/10 sm:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-100">Ready when you are</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Make your next money move feel obvious.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-sky-100">Start with a calmer view of your budget, debt, and priorities. Keep the pressure low and the direction clear.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to={ROUTES.REGISTER} className={`inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 text-base font-bold shadow-lg shadow-slate-950/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4b460] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12355b] ${designTokens.classes.accentButton}`}>
                Create your free account
              </Link>
              <Link to={ROUTES.LOGIN} className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-base font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#12355b]">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
