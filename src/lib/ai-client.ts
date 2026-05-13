export async function generateAi(args: { system?: string; prompt: string }): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) msg = data.error;
    } catch {
      /* noop */
    }
    if (res.status === 429) msg = "Rate limit reached. Please wait a moment and try again.";
    if (res.status === 402) msg = "AI credits exhausted. Add credits in Workspace → Usage.";
    throw new Error(msg);
  }
  const data = (await res.json()) as { text: string };
  return data.text;
}
