import React, { useState, useRef } from 'react';
import { Button, Input, Card, MessagePlugin } from 'tdesign-react';
import { BookOpen, Lightbulb, Send, Upload as UploadIcon, FileText, Image as ImageIcon, X } from 'lucide-react';

interface PreviewModuleProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

const PRESET_TOPICS = [
  { title: 'Productive meetings', level: 'Intermediate', category: '商务' },
  { title: 'Choosing a hotel', level: 'Upper Intermediate', category: '旅行' },
  { title: 'The Intermediate Plateau', level: 'Intermediate', category: '学习' },
];

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// 获取文件图标
const getFileIcon = (file: File) => {
  if (file.type.startsWith('image/')) {
    return <ImageIcon className="w-5 h-5 text-purple-500" />;
  }
  return <FileText className="w-5 h-5 text-blue-500" />;
};

export const PreviewModule: React.FC<PreviewModuleProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTopicSelect = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setCustomTopic('');
  };

  const handleCustomTopicChange = (value: string) => {
    setCustomTopic(value);
    setTopic('');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => {
      const isValid = file.type === 'application/pdf' || 
                      file.type.startsWith('image/') ||
                      file.type === 'text/plain';
      if (!isValid) {
        MessagePlugin.warning(`${file.name} 不是支持的文件类型`);
      }
      return isValid;
    });

    setUploadedFiles([...uploadedFiles, ...validFiles]);
    
    if (validFiles.length > 0) {
      MessagePlugin.success(`成功上传 ${validFiles.length} 个文件`);
    }

    // 清空 input 以便可以重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.name !== fileName));
  };

  const handleGenerate = async () => {
    const finalTopic = topic || customTopic;
    if (!finalTopic.trim() && uploadedFiles.length === 0) {
      MessagePlugin.warning('请输入课程主题或上传预习材料');
      return;
    }

    let message = '';
    
    if (uploadedFiles.length > 0) {
      message = `【预习模式】我上传了 ${uploadedFiles.length} 个预习材料文件，请帮我进行课前预习。

课程主题：${finalTopic || '根据材料内容分析'}

上传的文件：
${uploadedFiles.map(file => `- ${file.name} (${formatFileSize(file.size)})`).join('\n')}

请根据材料内容：
1. 生成一篇约 200 字的主题文章（Upper Intermediate 水平）
2. 提炼 20 个核心例句及中文翻译和用法说明
3. 解释材料中的重点词汇和表达

文章要地道实用，例句要涵盖不同句型和场景。`;
    } else {
      message = `【预习模式】请帮我预习 EF 课程主题："${finalTopic}"

请按照以下格式，生成：
1. 一篇约 200 字的主题文章（Upper Intermediate 水平）
2. 20 个核心例句及中文翻译和用法说明

文章要地道实用，例句要涵盖不同句型和场景。`;
    }

    await onSendMessage(message);
    
    // 清空上传的文件
    setUploadedFiles([]);
  };

  return (
    <div className="preview-module space-y-6">
      {/* 头部说明 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">课前预习</h3>
            <p className="text-gray-600">
              输入你的 EF 课程主题或上传官方预习材料，AI 助手会为你生成主题文章和核心例句，
              帮助你提前熟悉课程内容。
            </p>
          </div>
        </div>
      </Card>

      {/* 预设课程主题 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">快速选择近期课程</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_TOPICS.map((item) => (
            <button
              key={item.title}
              onClick={() => handleTopicSelect(item.title)}
              className={`p-4 rounded-lg border text-left transition-all ${
                topic === item.title
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-800">{item.title}</div>
              <div className="text-xs text-gray-500 mt-1">
                {item.category} · {item.level}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 自定义主题输入 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">或输入其他课程主题</h4>
        <div className="flex gap-3">
          <Input
            value={customTopic}
            onChange={handleCustomTopicChange}
            placeholder="例如：Business Negotiations, Travel Planning..."
            className="flex-1"
            size="large"
          />
        </div>
      </div>

      {/* 文件上传区域 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">上传预习材料（可选）</h4>
        <div className="space-y-3">
          {/* 上传按钮 */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">点击上传 PDF、图片或文本文件</p>
            <p className="text-xs text-gray-400 mt-1">支持 .pdf, .jpg, .png, .txt</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,image/*,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* 已上传文件列表 */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(file.name)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 生成按钮 */}
      <Button
        theme="primary"
        size="large"
        block
        onClick={handleGenerate}
        loading={isLoading}
        icon={<Send className="w-4 h-4" />}
        className="bg-gradient-to-r from-blue-500 to-indigo-500"
      >
        {isLoading ? '生成中...' : uploadedFiles.length > 0 ? '根据材料生成预习内容' : '生成预习内容'}
      </Button>

      {/* 使用提示 */}
      <Card className="bg-amber-50 border-amber-100">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">使用建议：</p>
            <ul className="space-y-1 text-gray-600">
              <li>• 提前 1-2 天进行预习，有充足时间消化内容</li>
              <li>• 可以上传 EF 官方 PDF 预习材料，AI 会基于材料内容生成</li>
              <li>• 也可以只输入课程主题，AI 会根据主题自动生成</li>
              <li>• 仔细阅读生成的文章，标记不熟悉的词汇</li>
              <li>• 熟读 20 个核心例句，尝试在课堂中使用</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PreviewModule;
