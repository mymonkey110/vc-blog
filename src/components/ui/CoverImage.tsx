import { Suspense } from 'react';
import Image from 'next/image';
import { ImagePlaceholder } from './ImagePlaceholder';
import { CoverImageClient } from './CoverImageClient';

interface CoverImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function CoverImage({ src, alt, className = '', priority = false }: CoverImageProps) {
  // If no src, show placeholder - this is SSG compatible
  if (!src) {
    return <ImagePlaceholder className={`rounded ${className}`} />;
  }

  // For SSG compatibility, we use a Suspense boundary with the client component
  // This allows the server to render the fallback while the client handles interactivity
  return (
    <Suspense fallback={<ImagePlaceholder className={`rounded ${className}`} />}>
      <CoverImageClient
        src={src}
        alt={alt}
        className={className}
        priority={priority}
      />
    </Suspense>
  );
}