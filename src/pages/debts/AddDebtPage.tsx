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
    <div className="mx-auto max-w-lg space-y-6">
      <SectionHeader title="Add debt" subtitle="Enter your debt details below" />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
