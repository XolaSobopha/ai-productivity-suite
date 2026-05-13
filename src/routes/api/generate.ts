import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { generateText } from "ai";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "@/lib/ai-gateway";

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { system, prompt } = (await request.json()) as {
          system?: string;
          prompt?: string;
        };
        if (!prompt || typeof prompt !== "string") {
          return new Response(JSON.stringify({ error: "prompt required" }), { status: 400 });
        }
        if (prompt.length > 12000) {
          return new Response(JSON.stringify({ error: "prompt too long" }), { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), { status: 500 });
        }

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const { text } = await generateText({
            model: gateway(DEFAULT_MODEL),
            system: system ?? "You are a helpful AI workplace assistant.",
            prompt,
          });
          return Response.json({ text });
        } catch (err) {
          console.error("generate error", err);
          const msg = err instanceof Error ? err.message : "AI error";
          const status = /429/.test(msg) ? 429 : /402/.test(msg) ? 402 : 500;
          return new Response(JSON.stringify({ error: msg }), { status });
        }
      },
    },
  },
});
