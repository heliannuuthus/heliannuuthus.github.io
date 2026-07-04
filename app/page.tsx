import { cn } from "@/lib/cn";
import Magnet from "@/components/react-bits/Magnet";
import { ScrollStack, ScrollStackItem } from "@/components/react-bits/ScrollStack";
import SplitText from "@/components/react-bits/SplitText";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import { Boxes, Braces, Cpu, Server, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function Hero() {
  return (
    <section className="flex flex-col-reverse sm:flex-row items-center gap-12 sm:gap-20">
      <div className="flex-1 flex flex-col gap-5">
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
      <HeroAvatar />
    </section>
  );
}

function HeroAvatar() {
  return (
    <div className="relative h-[230px] w-[230px] shrink-0 sm:h-[250px] sm:w-[250px]">
      <div className="sunflower-aura" aria-hidden />
      <SpotlightCard className="sunflower-core rounded-full">
        <div className="relative rounded-full surface p-3">
          <div className="relative overflow-hidden rounded-full bg-white/70 p-2 ring-1 ring-black/[0.04] dark:bg-zinc-950/32 dark:ring-white/[0.08]">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.65),transparent_34%),radial-gradient(circle_at_70%_76%,rgba(16,185,129,0.14),transparent_42%)]" />
            <Image
              src="/img/heliannuuthus-256.svg"
              alt="heliannuuthus avatar"
              width={166}
              height={166}
              className="relative rounded-full"
              priority
            />
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}

const aboutItems = [
  {
    title: "Backend",
    kicker: "Production services",
    description:
      "写过长期运行的服务，也处理过接口边界、限流、可靠性和业务系统里那些不太浪漫但很关键的细节。",
    gradient: "from-emerald-500/14 via-cyan-500/8 to-transparent dark:from-emerald-400/10 dark:via-cyan-400/8 dark:to-transparent",
    icon: Server,
    tools: ["Go", "Java", "Microservices", "Reliability"]
  },
  {
    title: "Frontend",
    kicker: "Interfaces I shipped",
    description:
      "做过 React / Next.js 的页面和组件，也会把内容结构、交互节奏和视觉表达揉到一起。",
    gradient: "from-sky-500/14 via-indigo-500/8 to-transparent dark:from-sky-400/10 dark:via-indigo-400/8 dark:to-transparent",
    icon: Braces,
    tools: ["React", "Next.js", "TypeScript", "Design Systems"]
  },
  {
    title: "Security",
    kicker: "Identity and trust",
    description:
      "碰过认证授权、Token、OAuth、WebAuthn 和零信任相关设计，关注系统之间如何建立可信边界。",
    gradient: "from-rose-500/12 via-amber-500/8 to-transparent dark:from-rose-400/10 dark:via-amber-400/8 dark:to-transparent",
    icon: ShieldCheck,
    tools: ["OAuth", "WebAuthn", "JWT", "Zero Trust"]
  },
  {
    title: "Cloud Native",
    kicker: "Runtime foundations",
    description:
      "做过容器化、Kubernetes、服务网格和基础设施侧的工作，喜欢把系统运行状态变得可观察、可推理。",
    gradient: "from-orange-500/14 via-teal-500/8 to-transparent dark:from-orange-400/10 dark:via-teal-400/8 dark:to-transparent",
    icon: Boxes,
    tools: ["Kubernetes", "Containers", "Service Mesh", "IaC"]
  },
  {
    title: "Vibe Coding",
    kicker: "AI-assisted shipping",
    description:
      "现在大量使用 AI 协作写代码：描述意图、拆任务、让模型产出，再用工程判断做取舍和校准。",
    gradient: "from-yellow-400/18 via-lime-500/8 to-transparent dark:from-yellow-300/12 dark:via-lime-400/8 dark:to-transparent",
    icon: Sparkles,
    tools: ["Agents", "Prompting", "Code Review", "Workflow"]
  },
  {
    title: "AI Infra",
    kicker: "Model systems",
    description:
      "现在重点在大模型基础设施：推理服务、调度、模型编排、Agent Framework 和 LLMOps 这一层。",
    gradient: "from-fuchsia-500/12 via-violet-500/8 to-transparent dark:from-fuchsia-400/10 dark:via-violet-400/8 dark:to-transparent",
    icon: Cpu,
    tools: ["LLM Serving", "GPU Scheduling", "Agents", "LLMOps"]
  }
];

function ExperienceStack() {
  return (
    <section className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
            scroll stack
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            What I Do
          </h2>
          <p className="text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
            这些不是能力清单，是我现在或曾经实际做过的事情。
          </p>
        </div>
      </div>

      <ScrollStack>
        {aboutItems.map((card, index) => {
          const Icon = card.icon;
          return (
            <ScrollStackItem key={card.title} index={index}>
              <SpotlightCard className="rounded-[24px]">
                <article
                  className={cn(
                    "relative min-h-[230px] overflow-hidden rounded-[24px] surface p-6 transition-all duration-500 ease-[cubic-bezier(.23,1,.32,1)] sm:p-8",
                    "bg-gradient-to-br",
                    card.gradient
                  )}
                >
                  <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
                  <div className="relative flex h-full flex-col justify-between gap-8">
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex flex-col gap-3">
                        <span className="font-mono text-[11px] uppercase tracking-[0.17em] text-zinc-400 dark:text-zinc-500">
                          {card.kicker}
                        </span>
                        <h3 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
                          {card.title}
                        </h3>
                      </div>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/72 text-zinc-800 ring-1 ring-black/[0.04] dark:bg-zinc-950/36 dark:text-zinc-100 dark:ring-white/[0.08] sm:h-14 sm:w-14">
                        <Icon size={24} strokeWidth={1.8} />
                      </div>
                    </div>

                    <p className="max-w-2xl text-[15px] leading-7 text-zinc-600 dark:text-zinc-300">
                      {card.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {card.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full bg-white/62 px-3 py-1.5 font-mono text-[11px] text-zinc-500 ring-1 ring-black/[0.04] dark:bg-zinc-950/28 dark:text-zinc-400 dark:ring-white/[0.06]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </SpotlightCard>
            </ScrollStackItem>
          );
        })}
      </ScrollStack>
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
