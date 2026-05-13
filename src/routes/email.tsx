import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AiToolForm } from "@/components/AiToolForm";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workhub AI" },
      { name: "description", content: "Draft professional emails in any tone with AI." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6 md:p-10">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe what you need to say. AI will draft a polished email."
      />
      <AiToolForm
        inputLabel="What's the email about?"
        inputPlaceholder="e.g. Reply to Sarah declining the Friday meeting and proposing Monday at 10am instead."
        outputLabel="Generated email"
        submitLabel="Draft email"
        system="You are an expert email writer. Write clear, well-structured business emails. Output only the email (subject + body), no preamble."
        buildPrompt={(input, opts) =>
          `Write an email based on this request:\n\n"${input}"\n\nTone: ${opts.tone}\nLength: ${opts.length}\n\nFormat:\nSubject: <subject>\n\n<body>`
        }
        optionState={{ tone, length }}
        options={
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Professional", "Friendly", "Formal", "Concise", "Persuasive", "Apologetic"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Short", "Medium", "Detailed"].map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        }
      />
    </div>
  );
}
