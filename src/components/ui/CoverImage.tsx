import { Suspense } from 'react';
import { ImagePlaceholder } from './ImagePlaceholder';
import { CoverImageClient } from './CoverImageClient';

interface CoverImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function CoverImage({ src, alt, className = '', priority = false }: CoverImageProps) {
  if (!src) {
    return <ImagePlaceholder className={`rounded-md ${className}`} />;
  }

  return (
    <Suspense fallback={<ImagePlaceholder className={`rounded-md ${className}`} />}>
      <CoverImageClient src={src} alt={alt} className={className} priority={priority} />
    </Suspense>
  );
}
