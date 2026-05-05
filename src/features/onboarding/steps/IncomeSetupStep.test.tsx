import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IncomeSetupStep } from './IncomeSetupStep';

describe('IncomeSetupStep', () => {
  it('submits monthly income and income type', async () => {
    const onComplete = vi.fn();
    render(<IncomeSetupStep onComplete={onComplete} onBack={vi.fn()} />);

    await userEvent.type(screen.getByLabelText(/monthly take-home income/i), '3000');
    await userEvent.click(screen.getByRole('radio', { name: /salary \/ employed/i }));
    await userEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(onComplete).toHaveBeenCalledWith({ monthlyIncome: 3000, incomeType: 'salary' }, expect.anything());
  });

  it('does not submit empty income', async () => {
    const onComplete = vi.fn();
    render(<IncomeSetupStep onComplete={onComplete} onBack={vi.fn()} />);

    await userEvent.click(screen.getByRole('radio', { name: /salary \/ employed/i }));
    await userEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(onComplete).not.toHaveBeenCalled();
  });
});
