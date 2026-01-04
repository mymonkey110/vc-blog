import { ImageIcon } from 'lucide-react';

interface ImagePlaceholderProps {
  className?: string;
  showIcon?: boolean;
}

export function ImagePlaceholder({ className = '', showIcon = true }: ImagePlaceholderProps) {
  return (
    <div className={`bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border border-gray-200 ${className}`}>
      {showIcon && <ImageIcon className="w-8 h-8 text-gray-400" />}
    </div>
  );
}