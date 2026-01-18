'use client';

import { useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import Vditor from 'vditor';
import { upload } from '@vercel/blob/client';
import { showToast } from './Toast'; // 确保路径正确
import 'vditor/dist/index.css';

type EditorMode = 'wysiwyg' | 'ir' | 'sv';

interface Props {
  value: string;
  onChange: (value: string) => void;
  mode: EditorMode;
  onChangeMode?: (mode: EditorMode) => void;
  placeholder?: string;
  options?: any;
  className?: string; // Add optional className prop
  height?: number; // Add optional height prop
}

const VditorEditor = forwardRef<any, Props>(function VditorEditor(
  { value, onChange, mode, onChangeMode, placeholder, options, className, height },
  ref,
) {
  // 生成唯一ID，避免多实例冲突
  const idRef = useRef<string>(`vditor-${Math.random().toString(36).slice(2)}`);

  // 保存 Vditor 实例
  const instanceRef = useRef<Vditor | null>(null);

  // 1. 标记 Vditor 是否完全初始化完成 (解决 'currentMode' undefined 报错)
  const isReadyRef = useRef(false);

  // 2. 标记是否正在输入 (解决光标跳动和内容被重置问题)
  const isTypingRef = useRef(false);

  // 暴露实例给父组件
  useImperativeHandle(ref, () => instanceRef.current);

  useEffect(() => {
    const vditor = new Vditor(idRef.current, {
      mode,
      placeholder,
      value, // 初始值
      cache: { enable: false }, // 必须关闭缓存，避免 SSR/Hydration 问题

      // 3. 修复 Vditor 内部 bug: "customWysiwygToolbar is not a function"
      customWysiwygToolbar: () => {},

      // 4. 初始化完成回调
      after: () => {
        isReadyRef.current = true;
      },

      // 5. 输入事件处理
      input: (v: string) => {
        // 标记正在输入，阻止 useEffect 中的 setValue 覆盖当前输入
        isTypingRef.current = true;
        onChange(v);
        // 延时释放锁
        setTimeout(() => {
          isTypingRef.current = false;
        }, 100);
      },

      // 6. 上传配置
      height: height || 500, // Use height prop or default
      upload: {
        accept: 'image/*',
        multiple: false,
        max: 5 * 1024 * 1024,

        // 自定义文件名生成 (可选，Vditor 内部使用)
        filename: (name: string) => {
          const ext = name.split('.').pop() || 'png';
          return `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        },

        // 核心上传逻辑
        handler: async (files: File[]) => {
          const vditorInstance = instanceRef.current;
          if (!vditorInstance || files.length === 0) return null;

          const file = files[0];
          showToast('图片上传中...', 'info', 0);

          try {
            // 生成文件名
            const ext = file.name.split('.').pop() || 'png';
            const filename = `images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

            // 上传到 Vercel Blob
            const blob = await upload(filename, file, {
              access: 'public',
              handleUploadUrl: '/admin/api/upload/auth', // 确保此 API 路由存在
            });

            // 构造 Markdown 图片语法
            const markdownImage = `![${file.name}](${blob.url})`;

            // 插入图片到编辑器当前光标位置
            vditorInstance.insertValue(markdownImage);

            // 7. 关键：手动触发状态同步
            // 告诉组件"这是用户操作"，防止外部 props.value 覆盖它
            isTypingRef.current = true;
            onChange(vditorInstance.getValue());
            setTimeout(() => {
              isTypingRef.current = false;
            }, 100);

            showToast('图片上传成功', 'success', 2000);
            return null; // 返回 null 停止 Vditor 默认处理
          } catch (error) {
            console.error('Upload error:', error);
            showToast('图片上传失败', 'error', 3000);
            return null;
          }
        },
      },
      ...options, // 合并用户自定义配置
    });

    instanceRef.current = vditor;

    // 清理函数
    return () => {
      // 先断开引用
      instanceRef.current = null;
      isReadyRef.current = false;

      // 8. 安全销毁：使用 try-catch 防止 React 卸载时的 "reading 'element'" 报错
      try {
        vditor?.destroy();
      } catch (e) {
        // 忽略销毁时的潜在错误
      }
    };
  }, []); // 空依赖数组，只在组件挂载时初始化一次

  // 9. 监听 value 变化 (外部更新同步到编辑器)
  useEffect(() => {
    // 只有当实例存在、已就绪、且用户不在打字时，才同步值
    if (instanceRef.current && isReadyRef.current) {
      const currentValue = instanceRef.current.getValue();
      if (value !== currentValue && !isTypingRef.current) {
        instanceRef.current.setValue(value);
      }
    }
  }, [value]);

  // 10. 监听 mode 变化
  useEffect(() => {
    if (instanceRef.current && isReadyRef.current && mode) {
      // 这里的类型检查是因为 Vditor 的 TS 定义可能不完整
      // @ts-ignore
      if (typeof instanceRef.current.setEditMode === 'function') {
        // @ts-ignore
        instanceRef.current.setEditMode(mode);
      }
      if (onChangeMode) onChangeMode(mode);
    }
  }, [mode]);

  return <div id={idRef.current} className={`vditor-container ${className || ''}`} />;
});

export default VditorEditor;
