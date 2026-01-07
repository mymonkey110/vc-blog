'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { aiSettingsManager } from '@/lib/ai-settings-manager';
import { AISettings, AISettingsValidation } from '@/types/ai-config';

interface AISettingsPanelProps {
  className?: string;
}

export default function AISettingsPanel({ className = '' }: AISettingsPanelProps) {
  const [settings, setSettings] = useState<AISettings>(aiSettingsManager.getSettings());
  const [validation, setValidation] = useState<AISettingsValidation>({ isValid: true, errors: {} });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [importExportText, setImportExportText] = useState('');
  const [showImportExport, setShowImportExport] = useState(false);

  // Load settings on mount
  useEffect(() => {
    setSettings(aiSettingsManager.getSettings());
  }, []);

  // Handle settings change
  const handleSettingsChange = (updates: Partial<AISettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    
    // Validate in real-time
    const validation = aiSettingsManager.validateSettings(newSettings);
    setValidation(validation);
  };

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const result = aiSettingsManager.updateSettings(settings);
      setValidation(result);

      if (result.isValid) {
        setSaveMessage('设置已保存');
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage('保存失败，请检查输入');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveMessage('保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (confirm('确定要重置所有设置为默认值吗？')) {
      aiSettingsManager.resetToDefaults();
      const defaultSettings = aiSettingsManager.getSettings();
      setSettings(defaultSettings);
      setValidation({ isValid: true, errors: {} });
      setSaveMessage('已重置为默认设置');
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // Export settings
  const handleExport = () => {
    const exported = aiSettingsManager.exportSettings();
    setImportExportText(exported);
    setShowImportExport(true);
  };

  // Import settings
  const handleImport = () => {
    if (!importExportText.trim()) {
      return;
    }

    const result = aiSettingsManager.importSettings(importExportText);
    setValidation(result);

    if (result.isValid) {
      setSettings(aiSettingsManager.getSettings());
      setSaveMessage('设置已导入');
      setImportExportText('');
      setShowImportExport(false);
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setSaveMessage('导入失败，请检查JSON格式');
    }
  };

  const textModels = aiSettingsManager.getAvailableTextModels();
  const imageModels = aiSettingsManager.getAvailableImageModels();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h2 className="text-lg font-semibold">AI 设置</h2>
        </div>
        <div className="flex items-center gap-2">
          {saveMessage && (
            <Badge variant={validation.isValid ? "default" : "destructive"} className="flex items-center gap-1">
              {validation.isValid ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
              {saveMessage}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            重置
          </Button>
          <Button
            onClick={handleSave}
            disabled={!validation.isValid || isSaving}
            className="flex items-center gap-1"
          >
            <Save className="h-3 w-3" />
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="models" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="models">模型配置</TabsTrigger>
          <TabsTrigger value="prompts">提示词</TabsTrigger>
          <TabsTrigger value="features">功能开关</TabsTrigger>
          <TabsTrigger value="advanced">高级设置</TabsTrigger>
        </TabsList>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">模型选择</CardTitle>
              <CardDescription>
                选择用于文本生成和图片生成的AI模型
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Text Model */}
              <div className="space-y-2">
                <Label htmlFor="text-model">文本生成模型</Label>
                <Select
                  value={settings.textModel}
                  onValueChange={(value) => handleSettingsChange({ textModel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择文本模型" />
                  </SelectTrigger>
                  <SelectContent>
                    {textModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div className="flex flex-col">
                          <span>{model.label}</span>
                          <span className="text-xs text-muted-foreground">{model.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validation.errors.textModel && (
                  <p className="text-xs text-red-600">{validation.errors.textModel}</p>
                )}
              </div>

              {/* Image Model */}
              <div className="space-y-2">
                <Label htmlFor="image-model">图片生成模型</Label>
                <Select
                  value={settings.imageModel}
                  onValueChange={(value) => handleSettingsChange({ imageModel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择图片模型" />
                  </SelectTrigger>
                  <SelectContent>
                    {imageModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div className="flex flex-col">
                          <span>{model.label}</span>
                          <span className="text-xs text-muted-foreground">{model.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validation.errors.imageModel && (
                  <p className="text-xs text-red-600">{validation.errors.imageModel}</p>
                )}
              </div>

              {/* API Key */}
              <div className="space-y-2">
                <Label htmlFor="api-key">Google API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type={showApiKey ? "text" : "password"}
                    value={settings.googleApiKey || ''}
                    onChange={(e) => handleSettingsChange({ googleApiKey: e.target.value })}
                    placeholder="输入Google API Key"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  API Key将存储在浏览器本地，不会上传到服务器
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prompts Tab */}
        <TabsContent value="prompts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">提示词模板</CardTitle>
              <CardDescription>
                自定义AI生成内容的提示词模板
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description Prompt */}
              <div className="space-y-2">
                <Label htmlFor="description-prompt">描述生成提示词</Label>
                <Textarea
                  id="description-prompt"
                  value={settings.descriptionPrompt}
                  onChange={(e) => handleSettingsChange({ descriptionPrompt: e.target.value })}
                  placeholder="输入描述生成的提示词..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  用于生成文章描述的提示词模板
                </p>
                {validation.errors.descriptionPrompt && (
                  <p className="text-xs text-red-600">{validation.errors.descriptionPrompt}</p>
                )}
              </div>

              {/* Image Prompt */}
              <div className="space-y-2">
                <Label htmlFor="image-prompt">图片生成提示词</Label>
                <Textarea
                  id="image-prompt"
                  value={settings.imagePrompt}
                  onChange={(e) => handleSettingsChange({ imagePrompt: e.target.value })}
                  placeholder="输入图片生成的提示词..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  用于生成封面图片的提示词模板
                </p>
                {validation.errors.imagePrompt && (
                  <p className="text-xs text-red-600">{validation.errors.imagePrompt}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">功能开关</CardTitle>
              <CardDescription>
                启用或禁用AI功能
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description Generation */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>智能描述生成</Label>
                  <p className="text-xs text-muted-foreground">
                    根据文章内容自动生成描述
                  </p>
                </div>
                <Switch
                  checked={settings.enableDescriptionGeneration}
                  onCheckedChange={(checked) => handleSettingsChange({ enableDescriptionGeneration: checked })}
                />
              </div>

              {/* Image Generation */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>智能封面生成</Label>
                  <p className="text-xs text-muted-foreground">
                    根据文章内容自动生成封面图
                  </p>
                </div>
                <Switch
                  checked={settings.enableImageGeneration}
                  onCheckedChange={(checked) => handleSettingsChange({ enableImageGeneration: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">性能设置</CardTitle>
              <CardDescription>
                调整AI请求的性能参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Request Timeout */}
              <div className="space-y-2">
                <Label htmlFor="timeout">请求超时时间 (毫秒)</Label>
                <Input
                  id="timeout"
                  type="number"
                  min="5000"
                  max="120000"
                  step="1000"
                  value={settings.requestTimeout}
                  onChange={(e) => handleSettingsChange({ requestTimeout: parseInt(e.target.value) || 30000 })}
                />
                <p className="text-xs text-muted-foreground">
                  AI请求的最大等待时间，范围：5-120秒
                </p>
                {validation.errors.requestTimeout && (
                  <p className="text-xs text-red-600">{validation.errors.requestTimeout}</p>
                )}
              </div>

              {/* Max Retries */}
              <div className="space-y-2">
                <Label htmlFor="retries">最大重试次数</Label>
                <Input
                  id="retries"
                  type="number"
                  min="0"
                  max="10"
                  value={settings.maxRetries}
                  onChange={(e) => handleSettingsChange({ maxRetries: parseInt(e.target.value) || 3 })}
                />
                <p className="text-xs text-muted-foreground">
                  请求失败时的最大重试次数，范围：0-10次
                </p>
                {validation.errors.maxRetries && (
                  <p className="text-xs text-red-600">{validation.errors.maxRetries}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Import/Export */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">导入/导出设置</CardTitle>
              <CardDescription>
                备份或恢复AI设置配置
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  导出设置
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowImportExport(!showImportExport)}
                  className="flex items-center gap-1"
                >
                  <Upload className="h-3 w-3" />
                  导入设置
                </Button>
              </div>

              {showImportExport && (
                <div className="space-y-2">
                  <Label htmlFor="import-export">设置JSON</Label>
                  <Textarea
                    id="import-export"
                    value={importExportText}
                    onChange={(e) => setImportExportText(e.target.value)}
                    placeholder="粘贴设置JSON..."
                    rows={6}
                    className="font-mono text-xs"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleImport}
                      disabled={!importExportText.trim()}
                    >
                      导入
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImportExportText('');
                        setShowImportExport(false);
                      }}
                    >
                      取消
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Validation Errors */}
      {!validation.isValid && Object.keys(validation.errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">配置错误：</p>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(validation.errors).map(([field, error]) => (
                  <li key={field} className="text-sm">{error}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Info */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <p className="text-sm">
            所有设置都保存在浏览器本地存储中。API Key等敏感信息不会上传到服务器。
            建议定期导出设置进行备份。
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}