import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AiToolForm } from "@/components/AiToolForm";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workhub AI" },
      { name: "description", content: "Turn meeting transcripts into concise summaries and action items." },
    ],
  }),
  component: SummarizerPage,
});

function SummarizerPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6 md:p-10">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Paste a transcript or rough notes. Get a clean summary, decisions, and action items."
      />
      <AiToolForm
        inputLabel="Meeting transcript or notes"
        inputPlaceholder="Paste the full meeting transcript, Zoom captions, or your raw notes here…"
        outputLabel="Structured summary"
        submitLabel="Summarize meeting"
        minHeight="min-h-[280px]"
        system="You are an expert meeting summarizer. Produce structured, concise summaries that capture key points without losing nuance."
        buildPrompt={(input) =>
          `Summarize this meeting using the following markdown structure:\n\n## Summary\n(3-4 sentence overview)\n\n## Key Discussion Points\n(bulleted)\n\n## Decisions Made\n(bulleted)\n\n## Action Items\n(- [ ] Owner — Task — Due date if mentioned)\n\n## Open Questions\n(bulleted)\n\nMeeting content:\n"""\n${input}\n"""`
        }
      />
    </div>
  );
}
