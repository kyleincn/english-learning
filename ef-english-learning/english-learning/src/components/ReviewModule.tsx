import React, { useState } from 'react';
import { Button, Textarea, Card, MessagePlugin } from 'tdesign-react';
import { RefreshCw, Sparkles, MessageSquare } from 'lucide-react';


interface ReviewModuleProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

const EXAMPLE_SENTENCES = [
  "I think we should have a meeting to discuss this issue.",
  "The hotel was nice but a bit expensive for my budget.",
  "Can you help me with this task?",
];

export const ReviewModule: React.FC<ReviewModuleProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [sentence, setSentence] = useState('');

  const handleExampleClick = (example: string) => {
    setSentence(example);
  };

  const handleSubmit = async () => {
    if (!sentence.trim()) {
      MessagePlugin.warning('请输入需要改写的句子');
      return;
    }

    const message = `【复习模式】请帮我改写以下句子，提供多种表达方式：\n\n原句："${sentence}"\n\n请提供：\n1. 2-3 种不同的改写版本\n2. 标注同义词替换和语法变化\n3. 解释不同表达的语气和使用场景\n4. 提供相关的词汇扩展`;
    await onSendMessage(message);
  };

  const handleVoiceReview = async () => {
    const message = `【复习模式】我刚刚上完 EF 课程，想进行课后复习。

请帮我：
1. 询问我今天课程的主题和内容
2. 根据我描述的内容，帮我改写句子、扩展词汇
3. 提供同义词替换建议
4. 解释不同表达的语气和使用场景

请开始问我今天的课程内容。`;
    await onSendMessage(message);
  };

  return (
    <div className="review-module space-y-6">
      {/* 头部说明 */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <RefreshCw className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">课后复习</h3>
            <p className="text-gray-600">
              输入你在课堂上学到的句子或自己造的句子，AI 助手会为你提供多种改写版本，
              帮助你学习同义词替换和不同的表达方式。
            </p>
          </div>
        </div>
      </Card>

      {/* 两种复习模式 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-green-200 bg-white rounded-lg p-4 shadow-sm"
          onClick={() => document.getElementById('sentence-input')?.focus()}
        >
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-green-500" />
            <h4 className="font-medium text-gray-800">句子改写</h4>
          </div>
          <p className="text-sm text-gray-600">
            输入单个句子，获取多种改写版本和同义词替换建议
          </p>
        </div>

        <div
          className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-green-200 bg-white rounded-lg p-4 shadow-sm"
          onClick={handleVoiceReview}
        >
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-5 h-5 text-green-500" />
            <h4 className="font-medium text-gray-800">对话复习</h4>
          </div>
          <p className="text-sm text-gray-600">
            与 AI 对话，描述课堂内容，获取个性化的改写和扩展建议
          </p>
        </div>
      </div>

      {/* 句子输入区 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          输入句子进行改写
        </label>
        <Textarea
          id="sentence-input"
          value={sentence}
          onChange={(value) => setSentence(value)}
          placeholder="输入你在课堂上学到的句子，或你自己造的句子..."
          rows={4}
          className="w-full"
        />
      </div>

      {/* 示例句子 */}
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2">
          点击使用示例句子：
        </label>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_SENTENCES.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* 提交按钮 */}
      <Button
        theme="success"
        size="large"
        block
        onClick={handleSubmit}
        loading={isLoading}
        icon={<RefreshCw className="w-4 h-4" />}
        className="bg-gradient-to-r from-green-500 to-emerald-500"
      >
        {isLoading ? '改写中...' : '获取改写建议'}
      </Button>

      {/* 使用提示 */}
      <Card className="bg-gray-50 border-gray-200">
        <div className="text-sm text-gray-700">
          <p className="font-medium mb-2">💡 复习小贴士：</p>
          <ul className="space-y-1 text-gray-600">
            <li>• 尽量回忆课堂上老师使用的表达方式</li>
            <li>• 尝试用不同的词汇表达同一个意思</li>
            <li>• 注意不同表达的语气和适用场合</li>
            <li>• 将喜欢的表达记录下来，加入知识库</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default ReviewModule;
