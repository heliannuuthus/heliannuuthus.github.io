import Lanyard from "@/components/Lanyard";
import Magnet from "@/components/Magnet";
import SplitText from "@/components/SplitText";
import SpotlightCard from "@/components/SpotlightCard";
import TiltedCard from "@/components/TiltedCard";
import Link from "next/link";

function Hero() {
  return (
    <section className="relative isolate flex min-h-[420px] flex-col justify-center overflow-visible sm:min-h-[440px]">
      <div className="relative z-10 flex max-w-[560px] flex-col gap-5">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
          <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
            <SplitText text="heliannuuthus" delayStep={22} />
          </span>
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
          AI Infra Engineer & Vibe Coder. Building the infrastructure behind
          large models — from inference serving to agent orchestration — and
          shipping code by vibing with AI.
        </p>
        <div className="flex gap-3 mt-3">
          <Magnet>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center h-11 px-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium tracking-wide transition-all duration-300 hover:opacity-85 hover:scale-[1.02] active:scale-[0.98]"
            >
              Read Blog
            </Link>
          </Magnet>
          <Magnet strength={0.22}>
            <Link
              href="/essay"
              className="inline-flex items-center justify-center h-11 px-7 rounded-full text-sm font-medium tracking-wide text-zinc-600 dark:text-zinc-300 transition-all duration-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-[0.98]"
            >
              Essays
            </Link>
          </Magnet>
        </div>
      </div>
      <Lanyard
        className="hero-lanyard"
        position={[0, 0, 12]}
        gravity={[0, -32, 0]}
        fov={15}
        frontImage="/img/heliannuuthus-256.svg"
        backImage="/img/heliannuuthus-256.svg"
        imageFit="contain"
        lanyardWidth={0.86}
      />
    </section>
  );
}

const aboutItems = [
  {
    title: "Backend",
    kicker: "Production services",
    description:
      "写过长期运行的服务，也处理过接口边界、限流、可靠性和业务系统里那些不太浪漫但很关键的细节。",
    tools: ["Go", "Java", "Microservices", "Reliability"]
  },
  {
    title: "Frontend",
    kicker: "Interfaces I shipped",
    description:
      "做过 React / Next.js 的页面和组件，也会把内容结构、交互节奏和视觉表达揉到一起。",
    tools: ["React", "Next.js", "TypeScript", "Design Systems"]
  },
  {
    title: "Security",
    kicker: "Identity and trust",
    description:
      "碰过认证授权、Token、OAuth、WebAuthn 和零信任相关设计，关注系统之间如何建立可信边界。",
    tools: ["OAuth", "WebAuthn", "JWT", "Zero Trust"]
  },
  {
    title: "Cloud Native",
    kicker: "Runtime foundations",
    description:
      "做过容器化、Kubernetes、服务网格和基础设施侧的工作，喜欢把系统运行状态变得可观察、可推理。",
    tools: ["Kubernetes", "Containers", "Service Mesh", "IaC"]
  },
  {
    title: "Vibe Coding",
    kicker: "AI-assisted shipping",
    description:
      "现在大量使用 AI 协作写代码：描述意图、拆任务、让模型产出，再用工程判断做取舍和校准。",
    tools: ["Agents", "Prompting", "Code Review", "Workflow"]
  },
  {
    title: "AI Infra",
    kicker: "Model systems",
    description:
      "现在重点在大模型基础设施：推理服务、调度、模型编排、Agent Framework 和 LLMOps 这一层。",
    tools: ["LLM Serving", "GPU Scheduling", "Agents", "LLMOps"]
  }
];

function ExperienceStack() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex max-w-xl flex-col gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
          field notes
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          What I Do
        </h2>
        <p className="text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
          这些不是能力清单，是我现在或曾经实际做过的事情。
        </p>
      </div>

      <div className="what-i-do-grid">
        {aboutItems.map((card, index) => {
          return (
            <TiltedCard
              key={card.title}
              containerClassName="what-i-do-tile"
              rotateAmplitude={4}
              scaleOnHover={1.01}
            >
              <SpotlightCard className="h-full rounded-[18px]" disabled>
                <article
                  className="what-i-do-card relative flex h-full overflow-hidden rounded-[18px] surface p-5 transition-all duration-300 ease-[cubic-bezier(.23,1,.32,1)]"
                >
                  <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-zinc-300/70 to-transparent dark:via-white/14" />
                  <div className="relative flex h-full flex-col justify-between gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 flex-col gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-[0.17em] text-zinc-400 dark:text-zinc-500">
                          {card.kicker}
                        </span>
                        <h3 className="text-[23px] font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                          {card.title}
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-zinc-300 dark:text-zinc-700">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <p className="text-[13px] leading-6 text-zinc-600 dark:text-zinc-300">
                      {card.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {card.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full bg-zinc-100/72 px-2.5 py-1 font-mono text-[10px] text-zinc-500 ring-1 ring-black/[0.035] dark:bg-white/[0.045] dark:text-zinc-500 dark:ring-white/[0.06]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </SpotlightCard>
            </TiltedCard>
          );
        })}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col gap-24 py-10">
      <Hero />
      <ExperienceStack />
    </div>
  );
}
