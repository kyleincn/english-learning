import React, { useState } from 'react';
import { Tabs, Card } from 'tdesign-react';
import { BookOpen, RefreshCw, Database } from 'lucide-react';
import { PreviewModule } from '../components/PreviewModule';
import { ReviewModule } from '../components/ReviewModule';
import { VocabularyModule } from '../components/VocabularyModule';
import { LEARNING_MODULES, AGENT_PROMPTS } from '../config';
import { PermissionMode } from '../types';

interface LearningPageProps {
  onSendMessage: (messageContent: string, newChatOptions?: {
    agentId: string;
    cwd: string;
    permissionMode: PermissionMode;
  }, onNavigate?: (path: string) => void) => Promise<void>;
  isLoading: boolean;
}

const { TabPanel } = Tabs;

export const LearningPage: React.FC<LearningPageProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<string | number>('preview');

  // 包装 sendMessage 函数，用于学习模块
  const handleSendMessage = async (message: string, systemPrompt?: string) => {
    // 创建一个临时 Agent 配置，使用自定义的系统提示词
    const agentId = systemPrompt ? 'custom-learning-agent' : 'default';
    
    await onSendMessage(message, {
      agentId,
      cwd: '/Users/kyle/WorkBuddy/automation-claw-20260327111849',
      permissionMode: 'default' as PermissionMode,
    });
  };

  return (
    <div className="learning-page h-full flex flex-col">
      {/* 顶部标签栏 */}
      <div className="px-6 pt-4 pb-2">
        <Tabs
          value={activeTab}
          onChange={(value) => setActiveTab(value)}
          size="large"
        >
          <TabPanel
            value="preview"
            label={
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{LEARNING_MODULES.preview.name}</span>
              </div>
            }
          />
          <TabPanel
            value="review"
            label={
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>{LEARNING_MODULES.review.name}</span>
              </div>
            }
          />
          <TabPanel
            value="vocabulary"
            label={
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>{LEARNING_MODULES.vocabulary.name}</span>
              </div>
            }
          />
        </Tabs>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'preview' && (
            <PreviewModule
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          )}
          {activeTab === 'review' && (
            <ReviewModule
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          )}
          {activeTab === 'vocabulary' && (
            <VocabularyModule
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
