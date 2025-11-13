import React, { useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import Vditor from 'vditor';

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

