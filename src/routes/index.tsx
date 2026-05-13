import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Mail, FileText, ListChecks, Search, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { ResponsibleAi } from "@/components/ResponsibleAi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workhub AI" },
      { name: "description", content: "Your AI-powered workplace productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    description: "Draft professional emails in any tone, in seconds.",
    icon: Mail,
    href: "/email",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn raw transcripts into clear summaries and action items.",
    icon: FileText,
    href: "/summarizer",
  },
  {
    title: "AI Task Planner",
    description: "Break goals into structured, prioritized task lists.",
    icon: ListChecks,
    href: "/planner",
  },
  {
    title: "AI Research Assistant",
    description: "Get fast briefings on any topic, with key points and sources.",
    icon: Search,
    href: "/research",
  },
  {
    title: "AI Chatbot",
    description: "Ask anything — your conversational workplace copilot.",
    icon: MessageSquare,
    href: "/chat",
  },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-6 md:p-10">
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-primary p-8 text-primary-foreground shadow-elegant md:p-12">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_top_right,white,transparent_60%)]" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered workplace assistant
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Do your best work, faster.
          </h1>
          <p className="mt-3 text-base text-primary-foreground/80 md:text-lg">
            Five AI tools to draft, summarize, plan, research and chat — designed for modern teams.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Tools</h2>
            <p className="text-sm text-muted-foreground">Pick a workflow to get started.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.href} to={t.href} className="group">
              <Card className="h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-elegant">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{t.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <ResponsibleAi />
    </div>
  );
}
