import React, { useState, useEffect } from 'react';
import { Button, Input, Card, Tag, Dialog, MessagePlugin, Textarea } from 'tdesign-react';
import { Database, Plus, Shuffle, BookOpen, Calendar, Trash2 } from 'lucide-react';


interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  week: string;
  addedAt: string;
}

interface VocabularyModuleProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export const VocabularyModule: React.FC<VocabularyModuleProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);

  // 从 localStorage 加载词汇
  useEffect(() => {
    const saved = localStorage.getItem('ef-vocabulary');
    if (saved) {
      try {
        setVocabulary(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load vocabulary:', e);
      }
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem('ef-vocabulary', JSON.stringify(vocabulary));
  }, [vocabulary]);

  function getCurrentWeek(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return `${year}-W${Math.ceil(day / 7)}`;
  }

  const handleAddWord = () => {
    if (!newWord.trim() || !newMeaning.trim()) {
      MessagePlugin.warning('请输入单词和释义');
      return;
    }

    const item: VocabularyItem = {
      id: Date.now().toString(),
      word: newWord.trim(),
      meaning: newMeaning.trim(),
      week: selectedWeek,
      addedAt: new Date().toISOString(),
    };

    setVocabulary([...vocabulary, item]);
    setNewWord('');
    setNewMeaning('');
    setIsAddDialogVisible(false);
    MessagePlugin.success('添加成功');
  };

  const handleDeleteWord = (id: string) => {
    setVocabulary(vocabulary.filter(item => item.id !== id));
    MessagePlugin.success('已删除');
  };

  const getWeeks = () => {
    const weeks = new Set(vocabulary.map(item => item.week));
    return Array.from(weeks).sort().reverse();
  };

  const getWordsByWeek = (week: string) => {
    return vocabulary.filter(item => item.week === week);
  };

  const handleShufflePractice = async (week: string) => {
    const words = getWordsByWeek(week);
    if (words.length === 0) {
      MessagePlugin.warning('该周没有词汇');
      return;
    }

    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const wordList = shuffled.map(w => w.word).join(', ');

    const message = `【知识库模式】请帮我复习 ${week} 的词汇。\n\n本周词汇：${wordList}\n\n请为我生成：\n1. 造句练习建议\n2. 短文写作挑战\n3. 对话练习场景\n4. 随机组合挑战`;
    await onSendMessage(message);
    setPracticeMode(true);
  };

  const handleRandomChallenge = async () => {
    if (vocabulary.length < 5) {
      MessagePlugin.warning('词汇库中至少需要 5 个单词才能进行随机挑战');
      return;
    }

    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);
    const wordList = selected.map(w => w.word).join(', ');

    const message = `【知识库模式】请帮我进行随机词汇挑战。\n\n随机选取的词汇：${wordList}\n\n请用这些词汇设计一个写作挑战，包括：\n1. 写作主题建议\n2. 必须使用的词汇列表\n3. 可选的加分词汇\n4. 写作要求和评分标准`;
    await onSendMessage(message);
  };

  return (
    <div className="vocabulary-module space-y-6">
      {/* 头部说明 */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Database className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">知识库</h3>
            <p className="text-gray-600">
              管理你学过的单词和短语，按周组织，定期打乱顺序进行重组练习，
              在不同场景中重复使用，提高词汇熟练度。
            </p>
            <div className="mt-3 flex gap-2">
              <Tag theme="primary" variant="light">
                总词汇：{vocabulary.length}
              </Tag>
              <Tag theme="success" variant="light">
                周数：{getWeeks().length}
              </Tag>
            </div>
          </div>
        </div>
      </Card>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <Button
          theme="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddDialogVisible(true)}
        >
          添加词汇
        </Button>
        <Button
          theme="success"
          icon={<Shuffle className="w-4 h-4" />}
          onClick={handleRandomChallenge}
          disabled={vocabulary.length < 5}
        >
          随机挑战
        </Button>
      </div>

      {/* 按周显示词汇 */}
      <div className="space-y-4">
        {getWeeks().map(week => {
          const words = getWordsByWeek(week);
          return (
            <Card key={week} className="border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-800">{week}</span>
                  <Tag size="small" theme="default">{words.length} 词</Tag>
                </div>
                <Button
                  size="small"
                  theme="primary"
                  variant="outline"
                  icon={<BookOpen className="w-3 h-3" />}
                  onClick={() => handleShufflePractice(week)}
                >
                  重组练习
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {words.map(item => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-800">{item.word}</span>
                    <span className="text-sm text-gray-500">{item.meaning}</span>
                    <button
                      onClick={() => handleDeleteWord(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        {vocabulary.length === 0 && (
          <Card className="text-center py-12 text-gray-500">
            <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>知识库为空，点击"添加词汇"开始学习记录</p>
          </Card>
        )}
      </div>

      {/* 添加词汇对话框 */}
      <Dialog
        header="添加新词汇"
        visible={isAddDialogVisible}
        onClose={() => setIsAddDialogVisible(false)}
        onConfirm={handleAddWord}
        confirmBtn="添加"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">单词/短语</label>
            <Input
              value={newWord}
              onChange={setNewWord}
              placeholder="例如：productive meeting"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">中文释义</label>
            <Input
              value={newMeaning}
              onChange={setNewMeaning}
              placeholder="例如：高效的会议"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">所属周</label>
            <Input
              value={selectedWeek}
              onChange={setSelectedWeek}
              placeholder="例如：2024-W12"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default VocabularyModule;
