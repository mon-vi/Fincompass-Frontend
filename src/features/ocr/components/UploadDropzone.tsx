import { useRef, useState } from 'react';
import { cn } from '@/utils/cn';

interface UploadDropzoneProps {
  onFile: (file: File) => void;
  onError?: (message: string) => void;
  isUploading?: boolean;
  accept?: string;
}

const ACCEPTED = '.pdf,.png,.jpg,.jpeg';
const ACCEPTED_TYPES = new Set(['application/pdf', 'image/png', 'image/jpeg']);
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export function UploadDropzone({ onFile, onError, isUploading, accept = ACCEPTED }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.has(file.type)) {
      onError?.('Upload a PDF, PNG, JPG, or JPEG file.');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      onError?.('File is too large. The maximum size is 10 MB.');
      return;
    }
    onFile(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      onClick={() => !isUploading && inputRef.current?.click()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors',
        isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50',
        isUploading && 'pointer-events-none opacity-60',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7 text-indigo-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
      </div>

      {isUploading ? (
        <p className="text-sm font-medium text-indigo-700">Uploading…</p>
      ) : (
        <>
          <p className="text-sm font-medium text-slate-700">
            Drop a bank statement or receipt here
          </p>
          <p className="mt-1 text-xs text-slate-400">or click to browse — PDF, PNG, JPG accepted</p>
        </>
      )}
    </div>
  );
}
