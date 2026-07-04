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
          写后端、云原生和 AI Infra，也折腾前端和个人站点。最近更多时间在推理服务、
          Agent 工作流、LLMOps，以及用 AI 协作把想法落到代码里。
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
        position={[0, 0, 14]}
        anchorPosition={[1.08, 3.15, 0]}
        gravity={[0, -32, 0]}
        fov={18}
        frontImage={null}
        backImage="/img/heliannuuthus-transparent.png"
        frontTitle="heliannuuthus"
        frontSubtitle="AI Infra Engineer"
        frontMeta="Vibe Coder / LLMOps"
        imageFit="contain"
        lanyardWidth={0.62}
        cardScale={2.12}
        ropeLength={0.58}
      />
    </section>
  );
}

const aboutItems = [
  {
    title: "Backend",
    kicker: "Service Engineering",
    description:
      "Production services in Go and Java, with a focus on API boundaries, data flow, rate limiting, reliability, and systems that remain maintainable after launch.",
    tools: ["Go", "Java", "API", "Reliability"]
  },
  {
    title: "Frontend",
    kicker: "Product Interfaces",
    description:
      "React and Next.js interfaces for blogs, dashboards, and content systems, shaped around information hierarchy, interaction feedback, responsive layouts, and dark mode.",
    tools: ["React", "Next.js", "TypeScript", "UI"]
  },
  {
    title: "Security",
    kicker: "Identity & Access",
    description:
      "Authentication and authorization work across tokens, OAuth, WebAuthn, and access-control boundaries, keeping trust decisions explicit and auditable.",
    tools: ["OAuth", "WebAuthn", "JWT", "Access Control"]
  },
  {
    title: "Cloud Native",
    kicker: "Runtime Platforms",
    description:
      "Containerized workloads, Kubernetes, gateways, service discovery, observability, and deployment paths designed for operable production systems.",
    tools: ["Kubernetes", "Containers", "Gateway", "Observability"]
  },
  {
    title: "AI Coding",
    kicker: "AI-Assisted Delivery",
    description:
      "AI-assisted development workflows for drafting, refactoring, testing, and review, with engineering judgment applied to scope, correctness, and final quality.",
    tools: ["Agents", "Prompting", "Code Review", "Workflow"]
  },
  {
    title: "AI Infra",
    kicker: "Model Infrastructure",
    description:
      "Inference services, model integration, agent workflows, scheduling, and LLMOps, turning model capabilities into dependable engineering systems.",
    tools: ["LLM Serving", "Scheduling", "Agents", "LLMOps"]
  }
];

function ExperienceStack() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex max-w-xl flex-col gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
          work notes
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          What I Do
        </h2>
        <p className="text-[13px] leading-6 text-zinc-500 dark:text-zinc-400">
          A focused map of the systems, interfaces, and infrastructure work I have built or continue to explore.
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
