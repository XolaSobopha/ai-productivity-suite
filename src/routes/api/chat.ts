import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "@/lib/ai-gateway";

const SYSTEM = `You are an AI Workplace Productivity Assistant. You help professionals draft emails, summarize meetings, plan tasks, research topics, and answer workplace questions.

Be concise, clear, and professional. Format with markdown when helpful (lists, headings, bold). When the user asks for something subjective or potentially sensitive (HR, legal, medical, financial), recommend they verify with a qualified human.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) return new Response("messages required", { status: 400 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const result = streamText({
            model: gateway(DEFAULT_MODEL),
            system: SYSTEM,
            messages: await convertToModelMessages(messages),
          });
          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (err) {
          console.error("chat error", err);
          return new Response("AI error", { status: 500 });
        }
      },
    },
  },
});
