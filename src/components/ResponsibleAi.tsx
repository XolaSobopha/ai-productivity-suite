import { ShieldAlert } from "lucide-react";

export function ResponsibleAi({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-lg border bg-muted/40 px-4 py-3 text-xs text-muted-foreground ${className}`}
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p>
        <span className="font-medium text-foreground">Responsible AI:</span> Generated content can
        be inaccurate, biased, or out of date. Review before sending, sharing, or acting on it.
        Avoid sharing confidential or personal data.
      </p>
    </div>
  );
}
