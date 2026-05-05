import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IncomeSetupStep } from './IncomeSetupStep';
import type { ReactNode } from 'react';

// The Continue button now lives in OnboardingPage's sticky footer and
// links to the form via `form="test-form"`. Provide it as a sibling here
// so isolated component tests can still trigger submission.
function Wrapper({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <button type="submit" form="test-form">
        Save and continue
      </button>
    </>
  );
}

describe('IncomeSetupStep', () => {
  it('submits monthly income and income type', async () => {
    const onComplete = vi.fn();
    render(
      <Wrapper>
        <IncomeSetupStep formId="test-form" onComplete={onComplete} />
      </Wrapper>,
    );

    await userEvent.type(screen.getByLabelText(/monthly take-home amount/i), '3000');
    await userEvent.click(screen.getByRole('radio', { name: /salary \/ employed/i }));
    await userEvent.click(screen.getByRole('button', { name: /save and continue/i }));

    expect(onComplete).toHaveBeenCalledWith({ monthlyIncome: 3000, incomeType: 'salary' }, expect.anything());
  });

  it('does not submit when income is empty', async () => {
    const onComplete = vi.fn();
    render(
      <Wrapper>
        <IncomeSetupStep formId="test-form" onComplete={onComplete} />
      </Wrapper>,
    );

    await userEvent.click(screen.getByRole('radio', { name: /salary \/ employed/i }));
    await userEvent.click(screen.getByRole('button', { name: /save and continue/i }));

    expect(onComplete).not.toHaveBeenCalled();
  });
});
