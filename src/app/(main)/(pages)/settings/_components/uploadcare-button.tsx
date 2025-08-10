'use client';

import { useCallback } from 'react';
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';

type Props = {
  onUpload: (cdnUrl: string) => Promise<any> | any;
};

type UploadedLike = { cdnUrl?: string | null };

export default function UploadCareButton({ onUpload }: Props) {
  const handleSuccess = useCallback(
    async (file: UploadedLike) => {
      if (file?.cdnUrl) await onUpload(file.cdnUrl);
    },
    [onUpload]
  );

  const handleUrlChange = useCallback(
    async (file: UploadedLike) => {
      if (file?.cdnUrl) await onUpload(file.cdnUrl);
    },
    [onUpload]
  );

  return (
    <div>
      <FileUploaderRegular
        pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || '2b7bec25d3d43c6446b8'}
        multiple={false}
        sourceList="local, camera, gdrive, dropbox"
        onFileUploadSuccess={handleSuccess}
        onFileUrlChanged={handleUrlChange}
        classNameUploader="ucx"
      />
    </div>
  );
}
