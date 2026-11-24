import { ImageIcon } from 'lucide-react';

interface ImagePlaceholderProps {
  className?: string;
  showIcon?: boolean;
}

export function ImagePlaceholder({ className = '', showIcon = true }: ImagePlaceholderProps) {
  return (
    <div
      className={`bg-surface flex items-center justify-center border border-border ${className}`}
    >
      {showIcon && (
        <ImageIcon className="size-7 text-secondary-text/50" strokeWidth={1.5} aria-hidden="true" />
      )}
    </div>
  );
}
