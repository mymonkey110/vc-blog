import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

interface VditorEditorProps {
  value: string;
  onChange: (value: string) => void;
  mode?: 'wysiwyg' | 'ir' | 'sv';
  onChangeMode?: (mode: 'wysiwyg' | 'ir' | 'sv') => void;
  placeholder?: string;
  options?: Partial<Vditor.Options>;
}

const VditorEditor = forwardRef<{
  getInstance: () => Vditor | null;
  focus: () => void;
  blur: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
}, VditorEditorProps>(({
  value,
  onChange,
  mode = 'ir',
  onChangeMode,
  placeholder = '',
  options = {},
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const vditorRef = useRef<Vditor | null>(null);

  // 暴露实例方法给父组件
  useImperativeHandle(ref, () => ({
    getInstance: () => vditorRef.current,
    focus: () => vditorRef.current?.focus(),
    blur: () => vditorRef.current?.blur(),
    getValue: () => vditorRef.current?.getValue() || '',
    setValue: (newValue: string) => {
      vditorRef.current?.setValue(newValue);
      onChange(newValue);
    },
  }));

  useEffect(() => {
    if (!editorRef.current) return;

    // 合并默认配置和用户配置
    const defaultOptions: Vditor.Options = {
      mode,
      value,
      placeholder,
      preview: {
        theme: {
          current: 'light',
        },
        delay: 200,
      },
      cache: {
        enable: false, // 保持原有功能，不启用缓存
      },
      upload: {
        url: '/api/upload',
        fieldName: 'file',
        max: 10 * 1024 * 1024,
        accept: 'image/*',
        multiple: false,
        token: '',
        linkToImgUrl: '',
        filename(name: string) {
          return `${Date.now()}-${name}`;
        },
        success: (editor: Vditor, msg: any) => {
          const json = JSON.parse(msg);
          if (json.url) {
            editor.insertValue(`![${json.title || '图片'}](${json.url})`);
          }
        },
      },
      height: 600,
      width: '100%',
      toolbar: [
        'emoji',
        'headings',
        'bold',
        'italic',
        'strike',
        'line',
        'quote',
        'list',
        'ordered-list',
        'check',
        'link',
        'image',
        'code',
        'code-block',
        'table',
        'line',
        'preview',
        'fullscreen',
        'edit-mode',
        'undo',
        'redo',
      ],
      counter: {
        enable: true,
        type: 'markdown',
      },
      paste: {
        enable: true,
        parseMarkdown: true,
        parseImage: true,
      },
      onChange: (val: string) => {
        onChange(val);
      },
    };

    // 合并用户配置
    const mergedOptions: Vditor.Options = {
      ...defaultOptions,
      ...options,
      // 确保onChange不会被覆盖
      onChange: (val: string) => {
        options.onChange?.(val);
        onChange(val);
      },
      // 合并工具栏配置
      toolbar: options.toolbar || defaultOptions.toolbar,
      // 合并上传配置
      upload: {
        ...defaultOptions.upload,
        ...options.upload,
      },
      // 合并缓存配置
      cache: {
        ...defaultOptions.cache,
        ...options.cache,
      },
      // 合并其他子配置
      ...Object.keys(options).reduce((acc: any, key: string) => {
        if (!['onChange', 'toolbar', 'upload', 'cache'].includes(key)) {
          acc[key] = options[key as keyof typeof options];
        }
        return acc;
      }, {}),
    };

    // 初始化Vditor
    vditorRef.current = new Vditor(editorRef.current, mergedOptions);

    // 模式切换监听
    const setupModeListeners = () => {
      if (onChangeMode) {
        const modeButtons = editorRef.current?.querySelectorAll('.vditor-toolbar__item--mode');
        modeButtons?.forEach(button => {
          button.addEventListener('click', () => {
            const newMode = button.getAttribute('data-mode') as 'wysiwyg' | 'ir' | 'sv';
            if (newMode) {
              onChangeMode(newMode);
            }
          });
        });
      }
    };

    // 当编辑器初始化完成后设置模式监听
    vditorRef.current?.ready(() => {
      setupModeListeners();
    });

    return () => {
      // 清理Vditor实例
      if (vditorRef.current) {
        vditorRef.current.destroy();
        vditorRef.current = null;
      }
    };
  }, [mode, onChangeMode, placeholder, options]);

  // 当mode改变时更新编辑器模式
  useEffect(() => {
    if (vditorRef.current) {
      vditorRef.current.setMode(mode);
    }
  }, [mode]);

  // 监听内容变化（仅当外部value变化且与编辑器内容不同时更新）
  useEffect(() => {
    if (vditorRef.current && vditorRef.current.getValue() !== value) {
      vditorRef.current.setValue(value);
    }
  }, [value]);

  return <div ref={editorRef} className="w-full"></div>;
});

VditorEditor.displayName = 'VditorEditor';

export default VditorEditor;