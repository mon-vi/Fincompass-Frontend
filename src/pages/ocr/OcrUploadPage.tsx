import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { PremiumErrorAlert } from '@/components/ui/PremiumErrorAlert';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { UploadDropzone } from '@/features/ocr/components';
import { useOcrUpload, useOcrSession } from '@/features/ocr/hooks';
import { ROUTES } from '@/constants/routes';

export function OcrUploadPage() {
  const navigate = useNavigate();
  const [validationError, setValidationError] = useState<string | null>(null);
  const { mutate: upload, isPending, isError, error, sessionId, progress } = useOcrUpload();

  // Poll while processing so we can auto-navigate when ready
  const { data: session } = useOcrSession(sessionId);

  useEffect(() => {
    if (session?.status === 'review_ready') {
      navigate(ROUTES.OCR_REVIEW.replace(':id', session.id), { replace: true });
    }
  }, [navigate, session]);

  const isProcessing = isPending || session?.status === 'uploaded' || session?.status === 'pending' || session?.status === 'processing' || session?.status === 'uploading';

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <SectionHeader
        title="Import via OCR"
        subtitle="Upload a statement, receipt, or invoice. FinCompass will extract the details, then you stay in control before anything is imported."
      />

      <Card className="p-4 sm:p-7">
        <UploadDropzone
          onFile={(file) => {
            setValidationError(null);
            upload(file);
          }}
          onError={setValidationError}
          isUploading={isProcessing}
        />

        {isPending && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Uploading document</span>
              <span>{progress}%</span>
            </div>
            <ProgressBar value={progress} max={100} />
          </div>
        )}

        {isProcessing && session?.status !== 'uploading' && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#12355b]/5 px-4 py-3 text-sm font-medium text-[#12355b] ring-1 ring-[#12355b]/10">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V0a12 12 0 00-12 12h4z" />
            </svg>
            <span>Processing your document… this may take a moment.</span>
          </div>
        )}

        {session?.status === 'failed' && (
          <Alert variant="error" className="mt-4" title="Document could not be read">
            {session.errorMessage ?? 'Try a clearer file, a supported format, or upload a different document.'}
          </Alert>
        )}

        {validationError && (
          <Alert variant="error" className="mt-4" title="Upload needs a different file">
            {validationError}
          </Alert>
        )}

        {isError && (
          <PremiumErrorAlert className="mt-4" message={(error as Error)?.message ?? 'The upload did not finish. Check your connection and try again.'} />
        )}
      </Card>

      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-500 shadow-sm shadow-slate-900/[0.03]">
        <p className="font-bold text-slate-800">Supported formats</p>
        <ul className="ml-4 list-disc space-y-1 leading-6">
          <li>PDF bank statements</li>
          <li>PNG / JPG receipts and invoices</li>
          <li>Max file size: 10 MB</li>
        </ul>
      </div>
    </div>
  );
}
