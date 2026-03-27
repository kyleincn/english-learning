# EF English Learning Assistant

基于 CodeBuddy Agent SDK 构建的 EF 英语课程学习助手，帮助你进行课前预习、课后复习和词汇管理。

![EF English Learning](https://img.shields.io/badge/EF-English%20Learning-blue)
![CodeBuddy SDK](https://img.shields.io/badge/CodeBuddy-SDK-green)

## ✨ 功能特性

### 📚 课前预习
- 根据课程主题生成 200 字英文文章
- 自动提炼 20 个核心例句
- 提供中文翻译和用法说明
- 快速选择近期课程主题

### 🔄 课后复习
- 句子改写：提供 2-3 种不同表达方式
- 同义词替换建议
- 对话模式：整体回顾课堂内容
- 解释不同表达的语气和使用场景

### 🗄️ 知识库
- 按周组织学习词汇
- 打乱重组练习
- 随机挑战模式
- 本地存储，数据持久化

### 💬 自由对话
- 支持多轮对话
- 流式响应显示
- 会话历史管理

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，添加你的 CodeBuddy API Key
CODEBUDDY_API_KEY=your_api_key_here
```

获取 API Key：[CodeBuddy 官网](https://www.codebuddy.cn)

### 3. 启动应用

```bash
npm run dev
```

应用将启动：
- 前端：http://localhost:5173
- 后端：http://localhost:3001

## 📖 使用指南

### 课前预习流程

1. 点击侧边栏「学习中心」
2. 选择「课前预习」标签
3. 选择或输入你的 EF 课程主题
4. 点击「生成预习内容」
5. 阅读生成的文章和 20 个核心例句
6. 将喜欢的表达添加到知识库

### 课后复习流程

1. 选择「课后复习」标签
2. 输入课堂上学到的句子
3. 点击「获取改写建议」
4. 学习不同的表达方式
5. 将新学到的同义词添加到知识库

### 知识库管理

1. 选择「知识库」标签
2. 点击「添加词汇」记录新单词
3. 按周查看已学词汇
4. 点击「重组练习」进行复习
5. 使用「随机挑战」混合多周词汇

详细学习计划请查看 [LEARNING_PLAN.md](./LEARNING_PLAN.md)

## 🏗️ 项目结构

```
ef-english-learning/
├── server/                    # 后端服务
│   ├── index.ts              # Express 服务器
│   └── db.ts                 # SQLite 数据库操作
├── src/                      # 前端源码
│   ├── components/           # React 组件
│   │   ├── PreviewModule.tsx    # 预习模块
│   │   ├── ReviewModule.tsx     # 复习模块
│   │   ├── VocabularyModule.tsx # 知识库模块
│   │   ├── Sidebar.tsx          # 侧边栏
│   │   └── ...
│   ├── pages/                # 页面组件
│   │   ├── ChatPage.tsx         # 对话页面
│   │   └── LearningPage.tsx     # 学习中心页面
│   ├── hooks/                # 自定义 Hooks
│   ├── config.ts             # 应用配置和 Agent 提示词
│   ├── types.ts              # 类型定义
│   └── App.tsx               # 应用入口
├── data/                     # 数据存储
│   └── chat.db               # SQLite 数据库
├── LEARNING_PLAN.md          # 学习计划文档
├── README.md                 # 项目说明
└── package.json
```

## 🛠️ 技术栈

- **后端**: Node.js + Express + TypeScript
- **前端**: React 18 + TypeScript + Vite
- **UI 组件**: TDesign React
- **样式**: Tailwind CSS
- **AI**: CodeBuddy Agent SDK
- **数据库**: SQLite (better-sqlite3)
- **图标**: Lucide React

## 🔧 自定义配置

### 修改 Agent 提示词

编辑 `src/config.ts` 中的 `AGENT_PROMPTS`：

```typescript
export const AGENT_PROMPTS = {
  preview: `你的自定义预习提示词...`,
  review: `你的自定义复习提示词...`,
  vocabulary: `你的自定义知识库提示词...`,
};
```

### 添加预设课程主题

编辑 `src/components/PreviewModule.tsx` 中的 `PRESET_TOPICS`：

```typescript
const PRESET_TOPICS = [
  { title: '你的课程主题', level: 'Intermediate', category: '分类' },
  // ...
];
```

## 📝 开发命令

```bash
# 开发模式（同时启动前后端）
npm run dev

# 单独启动后端
npm run dev:server

# 单独启动前端
npm run dev:client

# 构建生产版本
npm run build

# 运行生产版本
npm start
```

## 🎯 学习建议

1. **坚持预习**：每次 EF 课前 1-2 天进行预习
2. **及时复习**：课后当天或次日完成复习
3. **积累词汇**：将学到的表达添加到知识库
4. **周期性复习**：每周进行重组练习，每月进行随机挑战
5. **主动使用**：在课堂和生活中大胆使用新学的表达

详细学习计划请查看 [LEARNING_PLAN.md](./LEARNING_PLAN.md)

## 📸 界面预览

### 学习中心
- 课前预习：选择主题，生成预习内容
- 课后复习：句子改写，同义词替换
- 知识库：词汇管理，重组练习

### 自由对话
- 支持多轮对话
- 流式响应显示
- 会话历史管理

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT

---

祝你学习愉快！🎓
