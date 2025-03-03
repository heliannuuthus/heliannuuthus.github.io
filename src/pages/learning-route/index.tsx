import TimelineItem from "@site/src/components/Timeline";
import MDXRender from "@site/src/components/MDXRender";
import { Title, Text } from "@site/src/components/Typography";
import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import Layout from "@theme/Layout";
import { Checkbox } from "antd";

const title = "AI 大模型应用开发学习路线";
const suggestion = `
## 学习建议
- **时间规划**：根据基础水平，每阶段 1-3 个月，总计 6-12 个月  
- **学习方式**：理论学习占 30%，动手实践占 70%  
- **资源推荐**：GitHub 开源项目、Kaggle 竞赛平台  
`;

enum Status {
  COMPLETED = "completed",
  LEARNING = "learning",
  NOT_STARTED = "not_started",
}

interface TaskItem {
  text: string;
  completed: boolean;
  details?: string[];
}

interface Content {
  content: string;
  status: Status;
  tasks?: TaskItem[];
}

const contents: Content[] = [
  {
    status: Status.COMPLETED,
    content: `## 阶段 1：基础准备 - 新手村`,
    tasks: [
      {
        text: "掌握 Python 编程基础",
        completed: true,
        details: [
          "学习目标：熟练使用 Python 语法、列表/字典等数据结构以及面向对象编程（OOP）",
          "推荐资源：《Python 速成课程》或 Codecademy 在线 Python 课程",
          "实践任务：编写一个简单的命令行工具（如计算器）",
        ],
      },
      {
        text: "理解 API 与 Web 开发入门",
        completed: true,
        details: [
          "学习目标：掌握 HTTP 请求（GET/POST）及 Flask/FastAPI 框架基础",
          "实践任务：搭建一个返回 'Hello, AI!' 的 RESTful API",
          "推荐资源：FastAPI 官方文档或 Flask 入门教程",
        ],
      },
      {
        text: "熟悉 Linux 基本操作（可选）",
        completed: true,
        details: [
          "学习目标：学会常用命令（cd、ls、mkdir）和简单脚本编写",
          "实践任务：编写一个自动化备份文件的 Bash 脚本",
          "推荐资源：《鸟哥的 Linux 私房菜》",
        ],
      },
    ],
  },
  {
    status: Status.LEARNING,
    content: `## 阶段 2：AI 大模型基础 - 初探秘境`,
    tasks: [
      {
        text: "了解 Transformer 架构与预训练模型",
        completed: false,
        details: [
          "学习目标：理解 Transformer 的核心思想及预训练模型的工作原理",
          "推荐资源：Hugging Face 'Transformers 入门' 文档",
          "实践任务：阅读一篇 Transformer 相关的简短论文并总结要点",
        ],
      },
      {
        text: "调用并实验现有大模型",
        completed: false,
        details: [
          "学习目标：熟练使用 Hugging Face Transformers 或 OpenAI API",
          "实践任务：用 GPT 模型生成一段故事，或用 BERT 完成文本分类",
          "推荐资源：OpenAI Cookbook 或 Hugging Face 官方教程",
        ],
      },
      {
        text: "掌握 Prompt Engineering 技巧",
        completed: false,
        details: [
          "学习目标：设计高效 Prompt，提升模型输出质量（零样本、少样本）",
          "实践任务：优化一个 Prompt，让模型准确回答特定问题",
          "推荐资源：Learn Prompting 在线免费教程",
        ],
      },
    ],
  },
  {
    status: Status.NOT_STARTED,
    content: `## 阶段 3：应用开发实战 - 勇闯任务关`,
    tasks: [
      {
        text: "使用开发工具构建 AI 应用",
        completed: false,
        details: [
          "学习目标：掌握 LangChain、Gradio 或 Streamlit 的使用",
          "实践任务：开发一个支持上下文的聊天机器人或交互式 Web 界面",
          "推荐资源：LangChain 官方文档、Gradio 快速入门",
        ],
      },
      {
        text: "学习数据处理与模型微调",
        completed: false,
        details: [
          "学习目标：理解数据清洗与标注，掌握模型微调流程",
          "实践任务：用 Hugging Face Trainer API 微调一个 BERT 模型",
          "推荐资源：Hugging Face 'Fine-tuning a Pretrained Model' 教程",
        ],
      },
      {
        text: "实现外部知识整合（RAG）",
        completed: false,
        details: [
          "学习目标：结合向量数据库（如 FAISS）实现检索增强生成",
          "实践任务：基于本地 PDF 文件构建一个知识问答系统",
          "推荐资源：LangChain RAG 教程",
        ],
      },
    ],
  },
  {
    status: Status.NOT_STARTED,
    content: `## 阶段 4：部署与优化 - 通关试炼`,
    tasks: [
      {
        text: "部署 AI 应用到云端",
        completed: false,
        details: [
          "学习目标：使用 Docker 和云服务（如 AWS、Heroku）部署模型",
          "实践任务：将一个 Gradio 应用部署到 Heroku 并验证运行",
          "推荐资源：Docker 入门教程、AWS Lambda 文档",
        ],
      },
      {
        text: "优化模型性能",
        completed: false,
        details: [
          "学习目标：掌握模型量化与批处理技术，降低资源消耗",
          "实践任务：用 ONNX 将模型转换为优化格式并测试推理速度",
          "推荐资源：Hugging Face 优化指南",
        ],
      },
      {
        text: "实现应用监控与维护",
        completed: false,
        details: [
          "学习目标：学会记录日志并监控服务状态",
          "实践任务：为部署的应用添加 Prometheus 监控并查看延迟数据",
          "推荐资源：Prometheus 官方文档",
        ],
      },
    ],
  },
  {
    status: Status.NOT_STARTED,
    content: `## 阶段 5：进阶与项目实战 - 成为大师`,
    tasks: [
      {
        text: "完成综合实战项目",
        completed: false,
        details: [
          "学习目标：通过项目整合所学知识，解决实际问题",
          "实践任务：选择并完成一项：智能客服、文章摘要生成器、多模态应用",
          "推荐资源：GitHub 开源项目（如 Chatbot Arena）",
        ],
      },
      {
        text: "探索进阶技术方向",
        completed: false,
        details: [
          "学习目标：深入多模态模型、分布式推理或 AI 安全性",
          "实践任务：实现一个 CLIP 模型的图像-文本匹配功能",
          "推荐资源：Hugging Face 社区教程",
        ],
      },
      {
        text: "参与 AI 社区与竞赛",
        completed: false,
        details: [
          "学习目标：与同行交流，积累实战经验",
          "实践任务：参与 Kaggle 竞赛或在 Hugging Face 分享一个小型项目",
          "推荐资源：Kaggle 入门指南",
        ],
      },
    ],
  },
];

const App = () => {
  return (
    <Layout>
      <div style={{ position: "absolute", top: "15%", left: "30%" }}>
        <Title level={1} children={title} />
        <MDXRender content={suggestion} />
        <br />
        <TimelineItem
          items={contents.map((content) => {
            let dot = null;

            switch (content.status) {
              case Status.COMPLETED:
                dot = <CheckCircleTwoTone twoToneColor="#52c41a" />;
                break;
              case Status.LEARNING:
                dot = <ClockCircleTwoTone twoToneColor="#1890ff" />;
                break;
              default:
                dot = <CloseCircleTwoTone twoToneColor="#ff4d4f" />;
            }
            return {
              dot,
              children: (
                <div>
                  <MDXRender content={content.content} />
                  {content.tasks && (
                    <div style={{ marginLeft: 20 }}>
                      {content.tasks.map((task, index) => (
                        <div key={index} style={{ marginBottom: 16 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                            }}
                          >
                            <Checkbox
                              checked={task.completed}
                              disabled
                              style={{ marginRight: 8, marginTop: 4 }}
                            />
                            <Text strong>{task.text}</Text>
                          </div>
                          {task.details && (
                            <div style={{ marginLeft: 24, marginTop: 4 }}>
                              {task.details.map((detail, idx) => (
                                <Text
                                  key={idx}
                                  type="secondary"
                                  style={{
                                    display: "block",
                                    fontSize: "0.9em",
                                  }}
                                >
                                  • {detail}
                                </Text>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ),
            };
          })}
        />
      </div>
    </Layout>
  );
};

export default App;
