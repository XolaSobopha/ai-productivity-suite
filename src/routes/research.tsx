import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AiToolForm } from "@/components/AiToolForm";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workhub AI" },
      { name: "description", content: "Get structured briefings on any workplace topic." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6 md:p-10">
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Ask a question or describe a topic. Get a clear, structured briefing."
      />
      <AiToolForm
        inputLabel="What do you want to research?"
        inputPlaceholder="e.g. Best practices for onboarding remote engineers in fast-growing startups."
        outputLabel="Research briefing"
        submitLabel="Research"
        system="You are an expert workplace researcher. Produce neutral, structured briefings with concrete details. If you are uncertain about facts (figures, dates, named studies), say so explicitly rather than guessing."
        buildPrompt={(input) =>
          `Research the following topic and produce a briefing in this markdown format:\n\n## Overview\n(3-4 sentence summary)\n\n## Key Points\n(5-7 bullet points)\n\n## Considerations & Trade-offs\n(bulleted)\n\n## Recommended Next Steps\n(bulleted, practical)\n\n## Caveats\n(things to verify, areas of uncertainty)\n\nTopic:\n"${input}"`
        }
      />
    </div>
  );
}
