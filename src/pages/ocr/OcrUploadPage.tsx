import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { UploadDropzone } from '@/features/ocr/components';
import { useOcrUpload, useOcrSession } from '@/features/ocr/hooks';
import { ROUTES } from '@/constants/routes';

export function OcrUploadPage() {
  const navigate = useNavigate();
  const { mutate: upload, isPending, isError, error, sessionId } = useOcrUpload();

  // Poll while processing so we can auto-navigate when ready
  const { data: session } = useOcrSession(sessionId);

  if (session?.status === 'ready' || session?.status === 'failed') {
    if (session.status === 'ready') {
      navigate(ROUTES.OCR_REVIEW.replace(':id', session.id), { replace: true });
    }
  }

  const isProcessing = isPending || session?.status === 'processing' || session?.status === 'uploading';

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <SectionHeader
        title="Import via OCR"
        subtitle="Upload a bank statement, receipt, or invoice and we'll extract the expenses automatically."
      />

      <Card className="p-6">
        <UploadDropzone onFile={(file) => upload(file)} isUploading={isProcessing} />

        {isProcessing && session?.status !== 'uploading' && (
          <div className="mt-4 flex items-center gap-2 text-sm text-indigo-700">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V0a12 12 0 00-12 12h4z" />
            </svg>
            <span>Processing your document… this may take a moment.</span>
          </div>
        )}

        {session?.status === 'failed' && (
          <Alert variant="error" className="mt-4">
            OCR processing failed. Please try a different file or check the format.
          </Alert>
        )}

        {isError && (
          <Alert variant="error" className="mt-4">
            {(error as Error)?.message ?? 'Upload failed. Please try again.'}
          </Alert>
        )}
      </Card>

      <div className="space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
        <p className="font-medium text-slate-700">Supported formats</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>PDF bank statements</li>
          <li>PNG / JPG receipts and invoices</li>
          <li>Max file size: 10 MB</li>
        </ul>
      </div>
    </div>
  );
}
