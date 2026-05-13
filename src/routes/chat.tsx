import { createFileRoute, Outlet, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Plus, Trash2, MessageSquare } from "lucide-react";
import { useThreads, ensureInitialThread } from "@/lib/threads";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Workhub AI" },
      { name: "description", content: "Chat with your AI workplace assistant." },
    ],
  }),
  component: ChatLayout,
});

function ChatLayout() {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { threadId?: string };
  const { threads, createThread, deleteThread } = useThreads();

  useEffect(() => {
    if (!params.threadId) {
      const t = ensureInitialThread();
      navigate({ to: "/chat/$threadId", params: { threadId: t.id }, replace: true });
    }
  }, [params.threadId, navigate]);

  const onNew = () => {
    const t = createThread();
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  };

  const onDelete = (id: string) => {
    deleteThread(id);
    if (params.threadId === id) {
      const remaining = threads.filter((t) => t.id !== id);
      if (remaining.length > 0) {
        navigate({ to: "/chat/$threadId", params: { threadId: remaining[0].id }, replace: true });
      } else {
        const t = { id: "init", title: "" };
        // create new
        const fresh = createThread();
        navigate({ to: "/chat/$threadId", params: { threadId: fresh.id }, replace: true });
        void t;
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-card/40 md:flex">
        <div className="p-3">
          <Button
            onClick={onNew}
            className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          <p className="px-2 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Recent
          </p>
          <ul className="space-y-1">
            {threads.length === 0 && (
              <li className="px-2 py-3 text-xs text-muted-foreground">No chats yet</li>
            )}
            {threads.map((t) => {
              const active = t.id === params.threadId;
              return (
                <li
                  key={t.id}
                  className={cn(
                    "group flex items-center gap-1 rounded-md text-sm",
                    active ? "bg-accent text-accent-foreground" : "hover:bg-accent/60",
                  )}
                >
                  <Link
                    to="/chat/$threadId"
                    params={{ threadId: t.id }}
                    className="flex flex-1 items-center gap-2 truncate px-2 py-2"
                  >
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{t.title || "New chat"}</span>
                  </Link>
                  <button
                    onClick={() => onDelete(t.id)}
                    aria-label="Delete chat"
                    className="mr-1 rounded p-1 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
