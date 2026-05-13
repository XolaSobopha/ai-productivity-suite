import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AiToolForm } from "@/components/AiToolForm";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workhub AI" },
      { name: "description", content: "Turn goals into prioritized, actionable task plans." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const [deadline, setDeadline] = useState("2 weeks");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6 md:p-10">
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Describe a goal or project. AI will break it into a structured, prioritized plan."
      />
      <AiToolForm
        inputLabel="What do you want to accomplish?"
        inputPlaceholder="e.g. Launch a new pricing page with 3 plans, including copy, design, and analytics."
        outputLabel="Task plan"
        submitLabel="Generate plan"
        system="You are an expert project planner. Produce clear, realistic, prioritized task plans for busy professionals."
        buildPrompt={(input, opts) =>
          `Create a task plan for the following goal. Timeframe: ${opts.deadline}.\n\nGoal:\n"${input}"\n\nUse this markdown format:\n\n## Objective\n(1-2 sentences)\n\n## Milestones\n(3-5 milestones in order)\n\n## Task Breakdown\nFor each milestone, list tasks as checkboxes:\n- [ ] Task — Owner suggestion — Estimated effort\n\n## Risks & Dependencies\n(bulleted)\n\n## Suggested First Step\n(one concrete action to take today)`
        }
        optionState={{ deadline }}
        options={
          <div>
            <Label className="text-xs">Timeframe</Label>
            <Input
              className="mt-1"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="e.g. 2 weeks, end of Q3"
            />
          </div>
        }
      />
    </div>
  );
}
