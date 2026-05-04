import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DebtForm } from '@/features/debts/components/DebtForm';
import { useCreateDebt } from '@/features/debts/hooks';
import { ROUTES } from '@/constants/routes';
import type { DebtFormData } from '@/features/debts/validation';

export function AddDebtPage() {
  const navigate = useNavigate();
  const create = useCreateDebt();

  const handleSubmit = (data: DebtFormData) => {
    create.mutate(data, {
      onSuccess: () => navigate(ROUTES.DEBTS),
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <SectionHeader title="Add debt" subtitle="Add the details once. FinCompass will keep the payoff picture visible." />
      <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-5 shadow-xl shadow-slate-900/[0.05] sm:p-7">
        <DebtForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.DEBTS)}
          isSubmitting={create.isPending}
          submitError={create.error instanceof Error ? create.error : null}
          submitLabel="Add debt"
        />
      </div>
    </div>
  );
}
