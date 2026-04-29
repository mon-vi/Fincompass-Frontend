import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OcrUploadPage } from './OcrUploadPage';

const mocks = vi.hoisted(() => ({
  upload: vi.fn(),
}));

vi.mock('@/features/ocr/hooks', () => ({
  useOcrUpload: () => ({ mutate: mocks.upload, isPending: false, isError: false, error: null, sessionId: null, progress: 0 }),
  useOcrSession: () => ({ data: null }),
}));

describe('OcrUploadPage', () => {
  beforeEach(() => {
    mocks.upload.mockReset();
  });

  it('validates files before uploading', async () => {
    render(<OcrUploadPage />, { wrapper: MemoryRouter });

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, new File(['hello'], 'notes.txt', { type: 'text/plain' }));

    expect(screen.getByText('Upload a PDF, PNG, JPG, or JPEG file.')).toBeInTheDocument();
    expect(mocks.upload).not.toHaveBeenCalled();
  });

  it('uploads accepted documents', async () => {
    render(<OcrUploadPage />, { wrapper: MemoryRouter });

    const file = new File(['pdf'], 'statement.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, file);

    expect(mocks.upload).toHaveBeenCalledWith(file);
  });
});
