import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  CloseCircleTwoTone
} from "@ant-design/icons";
import { Checkbox } from "antd";

import TimelineItem from "@components/Timeline";
import { Text, Title } from "@components/Typography";
import MDXRender from "@components/markdown/MDXRender";

import Layout from "@theme/Layout";

const title = "AI 大模型应用开发学习路线";
const suggestion = `
## 学习建议
- **时间规划**：根据已有基础，每阶段 1-2 个月，总计 4-6 个月  
- **学习方式**：理论学习占 40%，动手实践占 60%  
- **资源推荐**：Dify 官方文档、Hugging Face 社区、《动手学深度学习》  
`;

enum Status {
  COMPLETED = "completed",
  LEARNING = "learning",
  NOT_STARTED = "not_started"
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
          "实践任务：编写一个简单的命令行工具（如计算器）"
        ]
      },
      {
        text: "理解 API 与 Web 开发入门",
        completed: true,
        details: [
          "学习目标：掌握 HTTP 请求（GET/POST）及 Flask/FastAPI 框架基础",
          "实践任务：搭建一个返回 'Hello, AI!' 的 RESTful API",
          "推荐资源：FastAPI 官方文档或 Flask 入门教程"
        ]
      },
      {
        text: "熟悉 Linux 基本操作",
        completed: true,
        details: [
          "学习目标：学会常用命令（cd、ls、mkdir）和简单脚本编写",
          "实践任务：编写一个自动化备份文件的 Bash 脚本",
          "推荐资源：《鸟哥的 Linux 私房菜》"
        ]
      }
    ]
  },
  {
    status: Status.COMPLETED,
    content: `## 阶段 2：AI 应用开发基础 - 初探秘境`,
    tasks: [
      {
        text: "掌握 Dify 平台使用",
        completed: true,
        details: [
          "学习目标：熟练使用 Dify 构建 AI 应用",
          "实践任务：使用 Dify 构建一个简单的问答机器人",
          "推荐资源：Dify 官方文档"
        ]
      },
      {
        text: "了解 MCP Google A2A 协议",
        completed: true,
        details: [
          "学习目标：理解 A2A 协议的工作原理和应用场景",
          "实践任务：实现一个简单的 A2A 协议通信示例",
          "推荐资源：Google A2A 协议文档"
        ]
      },
      {
        text: "学习 Prompt Engineering",
        completed: true,
        details: [
          "学习目标：掌握高效 Prompt 设计技巧",
          "实践任务：优化一个 Prompt，让模型准确回答特定问题",
          "推荐资源：Learn Prompting 在线免费教程"
        ]
      }
    ]
  },
  {
    status: Status.LEARNING,
    content: `## 阶段 3：深度学习基础 - 深入理解`,
    tasks: [
      {
        text: "学习《动手学深度学习》",
        completed: false,
        details: [
          "学习目标：掌握深度学习基础理论和实践",
          "实践任务：完成书中的代码练习和项目",
          "推荐资源：《动手学深度学习》教材"
        ]
      },
      {
        text: "理解 Transformer 架构",
        completed: false,
        details: [
          "学习目标：深入理解 Transformer 的核心思想和实现细节",
          "实践任务：实现一个简单的 Transformer 模型",
          "推荐资源：Attention is All You Need 论文"
        ]
      },
      {
        text: "掌握 PyTorch 框架",
        completed: false,
        details: [
          "学习目标：熟练使用 PyTorch 进行模型开发和训练",
          "实践任务：使用 PyTorch 实现一个简单的神经网络",
          "推荐资源：PyTorch 官方文档"
        ]
      }
    ]
  },
  {
    status: Status.NOT_STARTED,
    content: `## 阶段 4：大模型应用开发 - 实战进阶`,
    tasks: [
      {
        text: "学习 LangChain 框架",
        completed: false,
        details: [
          "学习目标：掌握 LangChain 的核心概念和使用方法",
          "实践任务：使用 LangChain 构建一个智能助手",
          "推荐资源：LangChain 官方文档"
        ]
      },
      {
        text: "实现 RAG 系统",
        completed: false,
        details: [
          "学习目标：掌握检索增强生成技术",
          "实践任务：构建一个基于本地文档的问答系统",
          "推荐资源：LangChain RAG 教程"
        ]
      },
      {
        text: "学习模型微调技术",
        completed: false,
        details: [
          "学习目标：掌握大模型微调的基本方法",
          "实践任务：使用 LoRA 对开源大模型进行微调",
          "推荐资源：Hugging Face 微调教程"
        ]
      }
    ]
  },
  {
    status: Status.NOT_STARTED,
    content: `## 阶段 5：项目实战与优化 - 成为专家`,
    tasks: [
      {
        text: "完成综合实战项目",
        completed: false,
        details: [
          "学习目标：整合所学知识，解决实际问题",
          "实践任务：开发一个完整的 AI 应用，如智能客服系统",
          "推荐资源：GitHub 开源项目"
        ]
      },
      {
        text: "学习模型部署与优化",
        completed: false,
        details: [
          "学习目标：掌握模型部署和性能优化技术",
          "实践任务：将模型部署到生产环境并优化性能",
          "推荐资源：Docker 和 Kubernetes 文档"
        ]
      },
      {
        text: "参与开源社区",
        completed: false,
        details: [
          "学习目标：与社区交流，提升实战能力",
          "实践任务：参与开源项目或分享自己的项目",
          "推荐资源：GitHub 和 Hugging Face 社区"
        ]
      }
    ]
  }
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
                              alignItems: "flex-start"
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
                                    fontSize: "0.9em"
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
              )
            };
          })}
        />
      </div>
    </Layout>
  );
};

export default App;
