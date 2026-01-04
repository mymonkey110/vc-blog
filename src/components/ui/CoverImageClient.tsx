'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImagePlaceholder } from './ImagePlaceholder';

interface CoverImageClientProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function CoverImageClient({ src, alt, className = '', priority = false }: CoverImageClientProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return <ImagePlaceholder className={`rounded ${className}`} />;
  }

  return (
    <div className={`relative overflow-hidden rounded bg-gray-100 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
        sizes="(max-width: 640px) 100vw, 200px"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        onError={() => setImageError(true)}
      />
    </div>
  );
}