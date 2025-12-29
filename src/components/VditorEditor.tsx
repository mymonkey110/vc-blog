'use client';

import React, { useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import Vditor from 'vditor';
import { upload } from '@vercel/blob/client';
import { showToast } from './Toast';

type EditorMode = 'wysiwyg' | 'ir' | 'sv';

interface Props {
  value: string;
  onChange: (value: string) => void;
  mode: EditorMode;
  onChangeMode?: (mode: EditorMode) => void;
  placeholder?: string;
  options?: any;
}

const VditorEditor = forwardRef<any, Props>(function VditorEditor(
  { value, onChange, mode, onChangeMode, placeholder, options },
  ref,
) {
  const idRef = useRef<string>(`vditor-${Math.random().toString(36).slice(2)}`);
  const instanceRef = useRef<any>(null);

  useImperativeHandle(ref, () => instanceRef.current);

  useEffect(() => {
    instanceRef.current = new Vditor(idRef.current, {
      mode,
      placeholder,
      value,
      input: (v: string) => onChange(v),
      upload: {
        handler: async (files: File[]) => {
          if (files.length === 0) {
            return { errFiles: [], succMap: {} };
          }

          const file = files[0];
          showToast('图片上传中...', 'info', 0);

          try {
            const ext = file.name.split('.').pop() || 'png';
            const filename = `images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

            const blob = await upload(filename, file, {
              access: 'public',
              handleUploadUrl: '/admin/api/upload/auth',
            });

            showToast('图片上传成功', 'success', 2000);

            return {
              errFiles: [],
              succMap: {
                [file.name]: blob.url,
              },
            };
          } catch (error) {
            console.error('Upload error:', error);
            showToast('图片上传失败', 'error', 3000);
            return {
              errFiles: [file.name],
              succMap: {},
            };
          }
        },
        filename: (name: string) => {
          const ext = name.split('.').pop() || 'png';
          return `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        },
        max: 5 * 1024 * 1024,
      },
      ...options,
    });
    return () => {
      if (instanceRef.current && typeof instanceRef.current.destroy === 'function') {
        instanceRef.current.destroy();
      }
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (instanceRef.current && typeof value === 'string') {
      instanceRef.current.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (instanceRef.current) {
      if (typeof instanceRef.current.setEditMode === 'function') {
        instanceRef.current.setEditMode(mode);
      }
      if (onChangeMode) onChangeMode(mode);
    }
  }, [mode]);

  return <div id={idRef.current} />;
});

export default VditorEditor;
