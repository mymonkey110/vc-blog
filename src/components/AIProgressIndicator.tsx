'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { aiProgressTracker, ProgressState } from '@/lib/ai-progress-tracker';

interface AIProgressIndicatorProps {
  operationId: string;
  onCancel?: () => void;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
  className?: string;
  showDetails?: boolean;
}

export default function AIProgressIndicator({
  operationId,
  onCancel,
  onComplete,
  onError,
  className = '',
  showDetails = true
}: AIProgressIndicatorProps) {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    // Subscribe to progress updates
    const unsubscribe = aiProgressTracker.subscribe(operationId, (state) => {
      setProgress(state);

      // Handle completion
      if (state.status === 'completed' && onComplete) {
        onComplete(state);
      }

      // Handle error
      if (state.status === 'error' && onError) {
        onError(state.error || '操作失败');
      }
    });

    return unsubscribe;
  }, [operationId, onComplete, onError]);

  const handleCancel = () => {
    aiProgressTracker.cancelOperation(operationId);
    onCancel?.();
  };

  if (!progress) {
    return null;
  }

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'cancelled':
        return <X className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = () => {
    switch (progress.status) {
      case 'pending':
        return '等待中';
      case 'running':
        return '进行中';
      case 'completed':
        return '已完成';
      case 'error':
        return '失败';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  };

  const getDuration = () => {
    const duration = aiProgressTracker.getDuration(operationId);
    if (!duration) return null;
    
    if (duration < 1000) {
      return `${duration}ms`;
    } else {
      return `${(duration / 1000).toFixed(1)}s`;
    }
  };

  const isActive = progress.status === 'pending' || progress.status === 'running';

  return (
    <div className={`border rounded-lg p-3 space-y-3 ${getStatusColor()} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">
            {progress.type === 'description' ? 'AI描述生成' : 'AI图片生成'}
          </span>
          <Badge variant="outline" className="text-xs">
            {getStatusText()}
          </Badge>
        </div>
        
        {isActive && onCancel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      {isActive && (
        <div className="space-y-1">
          <Progress value={progress.progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress.progress}%</span>
            {getDuration() && <span>{getDuration()}</span>}
          </div>
        </div>
      )}

      {/* Message */}
      {progress.message && (
        <p className="text-xs text-muted-foreground">
          {progress.message}
        </p>
      )}

      {/* Error Details */}
      {progress.status === 'error' && progress.error && showDetails && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border">
          <strong>错误详情：</strong> {progress.error}
        </div>
      )}

      {/* Completion Details */}
      {progress.status === 'completed' && showDetails && (
        <div className="text-xs text-green-600">
          <div className="flex items-center justify-between">
            <span>操作成功完成</span>
            {getDuration() && (
              <span className="text-muted-foreground">耗时 {getDuration()}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}