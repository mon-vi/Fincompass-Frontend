import { useNavigate, useParams } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Alert } from '@/components/ui/Alert';
import { Skeleton } from '@/components/ui/Loader';
import { DebtForm } from '@/features/debts/components/DebtForm';
import { debtToFormDefaults } from '@/features/debts/validation';
import { useDebt, useUpdateDebt, useDeleteDebt } from '@/features/debts/hooks';
import { ROUTES } from '@/constants/routes';
import type { DebtFormData } from '@/features/debts/validation';
import { Button } from '@/components/ui/Button';

export function EditDebtPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: debt, isLoading, isError } = useDebt(id ?? '');
  const update = useUpdateDebt();
  const remove = useDeleteDebt();

  const handleSubmit = (data: DebtFormData) => {
    if (!id) return;
    update.mutate({ id, payload: data }, { onSuccess: () => navigate(ROUTES.DEBTS) });
  };

  const handleDelete = () => {
    if (!id || !confirm('Delete this debt? This cannot be undone.')) return;
    remove.mutate(id, { onSuccess: () => navigate(ROUTES.DEBTS) });
  };

  if (isError) {
    return (
      <div className="space-y-4">
        <SectionHeader title="Edit debt" />
        <Alert variant="error">Debt not found.</Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between gap-4">
        <SectionHeader title="Edit debt" />
        <Button
          variant="danger"
          size="sm"
          isLoading={remove.isPending}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : debt ? (
          <DebtForm
            defaultValues={debtToFormDefaults(debt)}
            onSubmit={handleSubmit}
            onCancel={() => navigate(ROUTES.DEBTS)}
            isSubmitting={update.isPending}
            submitError={update.error instanceof Error ? update.error : null}
            submitLabel="Save changes"
          />
        ) : null}
      </div>
    </div>
  );
}
