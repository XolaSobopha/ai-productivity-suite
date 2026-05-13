import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageSquare } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { ResponsibleAi } from "@/components/ResponsibleAi";
import { getThread, useThreads } from "@/lib/threads";
import { toast } from "sonner";

export const Route = createFileRoute("/chat/$threadId")({
  component: ChatThread,
});

const SUGGESTIONS = [
  "Draft a Slack update for our team's weekly progress",
  "Help me prep questions for a 1:1 with my manager",
  "Suggest a 30-60-90 day plan for a new PM hire",
  "Rewrite this paragraph to sound more confident",
];

function ChatThread() {
  const { threadId } = Route.useParams();
  const { saveThread } = useThreads();
  const [initial, setInitial] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    const t = getThread(threadId);
    setInitial(t?.messages ?? []);
  }, [threadId]);

  if (initial === null) {
    return <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }
  return <ChatInner key={threadId} threadId={threadId} initialMessages={initial} saveThread={saveThread} />;
}

function ChatInner({
  threadId,
  initialMessages,
  saveThread,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  saveThread: (id: string, m: UIMessage[]) => void;
}) {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onError: (e) => toast.error(e.message || "Chat error"),
  });

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState("");

  // Persist on changes
  useEffect(() => {
    if (status === "ready" && messages.length > 0) {
      saveThread(threadId, messages);
    }
  }, [messages, status, threadId, saveThread]);

  // Focus textarea on mount, after sending, and when streaming ends
  useEffect(() => {
    if (status === "ready") textareaRef.current?.focus();
  }, [status, threadId]);

  const isLoading = status === "submitted" || status === "streaming";

  const send = (value: string) => {
    const v = value.trim();
    if (!v || isLoading) return;
    setText("");
    void sendMessage({ text: v });
  };

  return (
    <div className="flex h-full flex-col">
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={<MessageSquare className="h-8 w-8" />}
              title="Start a conversation"
              description="Ask anything about your work — drafting, planning, brainstorming, summarizing."
            >
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border bg-card px-3 py-2 text-left text-sm text-foreground transition hover:border-primary/40 hover:shadow-card"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => {
                const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
                if (m.role === "assistant") {
                  return (
                    <Message key={m.id} from={m.role}>
                      <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary prose-code:text-foreground">
                        <ReactMarkdown>{text}</ReactMarkdown>
                      </div>
                    </Message>
                  );
                }
                return (
                  <Message key={m.id} from={m.role}>
                    <MessageContent className="bg-primary text-primary-foreground">
                      {text}
                    </MessageContent>
                  </Message>
                );
              })}
              {status === "submitted" && (
                <Message from="assistant">
                  <Shimmer>Thinking...</Shimmer>
                </Message>
              )}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t bg-background/60 backdrop-blur-md">
        <div className="mx-auto w-full max-w-3xl space-y-2 px-4 py-4">
          <PromptInput
            onSubmit={(msg) => {
              send(msg.text ?? "");
            }}
          >
            <PromptInputTextarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Message Workhub AI…"
              autoFocus
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={isLoading && status !== "streaming"} />
            </PromptInputFooter>
          </PromptInput>
          <ResponsibleAi />
        </div>
      </div>
    </div>
  );
}
