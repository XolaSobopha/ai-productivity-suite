import { useEffect, useState, useCallback } from "react";
import type { UIMessage } from "ai";

export type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const KEY = "workhub-chat-threads-v1";

const isBrowser = () => typeof window !== "undefined";

function readAll(): Thread[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Thread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(threads: Thread[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(threads));
}

export function newThreadId() {
  return (
    "t_" +
    (isBrowser() && "crypto" in window && "randomUUID" in window.crypto
      ? window.crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10))
  );
}

export function ensureInitialThread(): Thread {
  const all = readAll();
  if (all.length > 0) return all[0];
  const t: Thread = { id: newThreadId(), title: "New chat", updatedAt: Date.now(), messages: [] };
  writeAll([t]);
  return t;
}

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    setThreads(readAll());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setThreads(readAll());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const createThread = useCallback((): Thread => {
    const t: Thread = { id: newThreadId(), title: "New chat", updatedAt: Date.now(), messages: [] };
    setThreads((prev) => {
      const next = [t, ...prev];
      writeAll(next);
      return next;
    });
    return t;
  }, []);

  const deleteThread = useCallback((id: string) => {
    setThreads((prev) => {
      const next = prev.filter((t) => t.id !== id);
      writeAll(next);
      return next;
    });
  }, []);

  const saveThread = useCallback(
    (id: string, messages: UIMessage[]) => {
      setThreads((prev) => {
        const idx = prev.findIndex((t) => t.id === id);
        let next: Thread[];
        if (idx === -1) {
          next = [
            { id, title: deriveTitle(messages), updatedAt: Date.now(), messages },
            ...prev,
          ];
        } else {
          const updated = {
            ...prev[idx],
            title: prev[idx].title === "New chat" ? deriveTitle(messages) : prev[idx].title,
            updatedAt: Date.now(),
            messages,
          };
          next = [updated, ...prev.filter((t) => t.id !== id)];
        }
        writeAll(next);
        return next;
      });
    },
    [],
  );

  return { threads, createThread, deleteThread, saveThread };
}

export function getThread(id: string): Thread | undefined {
  return readAll().find((t) => t.id === id);
}

function deriveTitle(messages: UIMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New chat";
  const text = first.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim();
  return text.slice(0, 48) || "New chat";
}
