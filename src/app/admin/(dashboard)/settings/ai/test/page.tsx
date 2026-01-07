'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Download,
  AlertTriangle,
  Info
} from 'lucide-react';
import { aiIntegrationTester } from '@/lib/ai-integration-tester';

interface TestResult {
  success: boolean;
  message: string;
  duration?: number;
  details?: any;
}

interface TestSuiteResult {
  suite: string;
  test: string;
  result: TestResult;
}

export default function AITestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    totalTests: number;
    passed: number;
    failed: number;
    results: TestSuiteResult[];
  } | null>(null);
  const [currentTest, setCurrentTest] = useState<string>('');

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);
    setCurrentTest('初始化测试...');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 95));
      }, 100);

      const testResults = await aiIntegrationTester.runAllTests();
      
      clearInterval(progressInterval);
      setProgress(100);
      setCurrentTest('测试完成');
      setResults(testResults);
    } catch (error) {
      console.error('Test execution failed:', error);
      setCurrentTest('测试失败');
    } finally {
      setIsRunning(false);
    }
  };

  const exportResults = () => {
    if (!results) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: results.totalTests,
        passed: results.passed,
        failed: results.failed,
        successRate: ((results.passed / results.totalTests) * 100).toFixed(1) + '%'
      },
      results: results.results
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-test-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"} className="text-xs">
        {success ? "通过" : "失败"}
      </Badge>
    );
  };

  const groupedResults = results?.results.reduce((acc, result) => {
    if (!acc[result.suite]) {
      acc[result.suite] = [];
    }
    acc[result.suite].push(result);
    return acc;
  }, {} as Record<string, TestSuiteResult[]>) || {};

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI 功能集成测试</h1>
            <p className="text-muted-foreground">
              全面测试AI增强文章编辑功能的各个组件和集成点
            </p>
          </div>
          <div className="flex items-center gap-2">
            {results && (
              <Button
                variant="outline"
                onClick={exportResults}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                导出结果
              </Button>
            )}
            <Button
              onClick={runTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  运行中...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  运行测试
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Test Progress */}
        {isRunning && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">测试进度</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {currentTest}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results Summary */}
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">总测试数</p>
                    <p className="text-2xl font-bold">{results.totalTests}</p>
                  </div>
                  <Info className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">通过</p>
                    <p className="text-2xl font-bold text-green-600">{results.passed}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">失败</p>
                    <p className="text-2xl font-bold text-red-600">{results.failed}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">成功率</p>
                    <p className="text-2xl font-bold">
                      {((results.passed / results.totalTests) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className={`h-8 w-8 ${results.failed === 0 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {results.failed === 0 ? <CheckCircle className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Results */}
        {results && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">详细测试结果</h2>
            
            {Object.entries(groupedResults).map(([suiteName, suiteResults]) => (
              <Card key={suiteName}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{suiteName}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {suiteResults.filter(r => r.result.success).length}/{suiteResults.length}
                      </Badge>
                      {suiteResults.every(r => r.result.success) ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suiteResults.map((testResult, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md border ${
                          testResult.result.success 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getStatusIcon(testResult.result.success)}
                              <span className="font-medium text-sm">{testResult.test}</span>
                              {getStatusBadge(testResult.result.success)}
                            </div>
                            <p className={`text-sm ${
                              testResult.result.success ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {testResult.result.message}
                            </p>
                            {testResult.result.duration && (
                              <p className="text-xs text-muted-foreground mt-1">
                                耗时: {testResult.result.duration}ms
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Test Details */}
                        {testResult.result.details && (
                          <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                              查看详情
                            </summary>
                            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                              {JSON.stringify(testResult.result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Instructions */}
        {!results && !isRunning && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">测试说明：</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>测试将验证AI描述生成、图片生成、缓存系统、进度跟踪等功能</li>
                  <li>测试包括正常流程、错误处理、边界条件等场景</li>
                  <li>某些测试可能需要有效的API密钥才能完全通过</li>
                  <li>测试结果可以导出为JSON文件用于分析和记录</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}