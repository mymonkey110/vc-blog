import { Metadata } from 'next';
import AISettingsPanel from '@/components/AISettingsPanel';

export const metadata: Metadata = {
  title: 'AI 设置 - 管理后台',
  description: '配置AI功能的模型、提示词和性能参数',
};

export default function AISettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <AISettingsPanel />
      </div>
    </div>
  );
}