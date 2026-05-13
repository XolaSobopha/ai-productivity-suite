import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { generateAi } from "@/lib/ai-client";
import { ResponsibleAi } from "./ResponsibleAi";

export type AiToolFormProps = {
  inputLabel: string;
  inputPlaceholder: string;
  outputLabel: string;
  buildPrompt: (input: string, options: Record<string, string>) => string;
  system: string;
  submitLabel?: string;
  options?: ReactNode;
  optionState?: Record<string, string>;
  minHeight?: string;
};

export function AiToolForm({
  inputLabel,
  inputPlaceholder,
  outputLabel,
  buildPrompt,
  system,
  submitLabel = "Generate",
  options,
  optionState = {},
  minHeight = "min-h-[180px]",
}: AiToolFormProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!input.trim()) {
      toast.error("Please enter some details first.");
      return;
    }
    setLoading(true);
    try {
      const text = await generateAi({ system, prompt: buildPrompt(input, optionState) });
      setOutput(text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="flex flex-col gap-4 p-6 shadow-card">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{inputLabel}</h2>
          <p className="text-xs text-muted-foreground">Be specific for the best results.</p>
        </div>
        {options}
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={inputPlaceholder}
          className={`${minHeight} resize-none`}
        />
        <Button
          onClick={run}
          disabled={loading}
          className="bg-gradient-primary text-primary-foreground hover:opacity-90"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> {submitLabel}
            </>
          )}
        </Button>
      </Card>

      <Card className="flex flex-col gap-4 p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">{outputLabel}</h2>
            <p className="text-xs text-muted-foreground">Editable — refine before using.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={copy} disabled={!output}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={run} disabled={loading || !input.trim()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Textarea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          placeholder="AI output will appear here…"
          className={`${minHeight} flex-1 resize-none font-mono text-sm`}
        />
        <ResponsibleAi />
      </Card>
    </div>
  );
}
