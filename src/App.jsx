import { useEffect, useRef, useState } from "react";
import { Menu, Moon, Sun, Trash2 } from "lucide-react";
import SidebarDossier from "./components/SidebarDossier";
import ChatMessage from "./components/ChatMessage";
import ThinkingTicker from "./components/ThinkingTicker";
import PromptComposer from "./components/PromptComposer";
import { askCandidate, checkHealth } from "./services/api";
import { candidate } from "./config/candidate";

const STORAGE_KEY = "interview-assistant-history";

function loadHistory() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("interview-theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [lens, setLens] = useState("Recruiter");
  const [frameQuestion, setFrameQuestion] = useState(false);
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [health, setHealth] = useState("checking");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const streamRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("interview-theme", theme);
  }, [theme]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    let active = true;
    async function healthCheck() {
      try {
        await checkHealth();
        if (active) setHealth("online");
      } catch {
        if (active) setHealth("offline");
      }
    }
    healthCheck();
    const interval = window.setInterval(healthCheck, 15000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    streamRef.current?.scrollTo({
      top: streamRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  async function sendQuestion(rawQuestion) {
    const question = rawQuestion.trim();
    if (!question || isLoading) return;

    const framedQuestion =
      frameQuestion && lens
        ? `[Interviewer perspective: ${lens}] ${question}`
        : question;

    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: question },
    ]);
    setInput("");
    setIsLoading(true);
    const started = performance.now();

    try {
      const data = await askCandidate(framedQuestion);
      const latency = (performance.now() - started) / 1000;
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer,
          latency,
        },
      ]);
      setHealth("online");
    } catch (error) {
      const offline =
        error.name === "AbortError" ||
        /failed to fetch|networkerror|cors/i.test(error.message);
      setHealth("offline");
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "error",
          content: offline
            ? "The FastAPI backend is unreachable. Confirm it is running and CORS allows this origin."
            : error.message || "The backend returned an unexpected error.",
          question,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function clearInterview() {
    if (!messages.length) return;
    if (window.confirm("Clear this interview and all saved conversation messages?")) {
      setMessages([]);
      setInput("");
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--canvas)] text-[var(--text)]">
      <div className="grid lg:grid-cols-[30%_70%]">
        <SidebarDossier
          lens={lens}
          setLens={setLens}
          health={health}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onPrompt={(prompt) => {
            setDrawerOpen(false);
            sendQuestion(prompt);
          }}
        />

        <main className="min-w-0 lg:h-[100dvh]">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--canvas)] px-4 lg:px-6">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open candidate dossier"
              className="grid size-9 place-items-center rounded-md border border-[var(--border)] lg:hidden"
            >
              <Menu size={17} />
            </button>
            <div className="hidden items-center gap-3 lg:flex">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                Interview console
              </span>
              <span className="h-4 w-px bg-[var(--border)]" />
              <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                {lens}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={clearInterview}
                  aria-label="Clear interview"
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--border)] px-3 text-xs text-[var(--muted)] transition hover:text-[var(--text)]"
                >
                  <Trash2 size={14} />
                  <span className="hidden sm:inline">Clear Interview</span>
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  setTheme((current) =>
                    current === "dark" ? "light" : "dark",
                  )
                }
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                className="grid size-9 place-items-center rounded-md border border-[var(--border)] text-[var(--muted)]"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </header>

          <div className="grid h-[calc(100dvh-4rem)] grid-rows-[1fr_auto]">
            <div
              ref={streamRef}
              className="overflow-y-auto px-4 py-6 sm:px-6 lg:px-10"
            >
              {messages.length === 0 ? (
                <section className="mx-auto flex min-h-full max-w-[900px] items-center py-8">
                  <div className="w-full">
                    <div className="border-l border-emerald-500/60 pl-5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                        Interview briefing
                      </p>
                      <h2 className="mt-3 max-w-[680px] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                        Ask about the candidate behind the resume.
                      </h2>
                      <p className="mt-4 max-w-[620px] text-sm leading-6 text-[var(--muted)]">
                        Responses are grounded strictly in Muhammad's resume.
                        If the evidence is not present, the assistant will
                        state that it does not have enough information.
                      </p>
                    </div>

                    <div className="mt-8 grid gap-2 sm:grid-cols-2">
                      {candidate.starterPrompts[lens].map((prompt, index) => (
                        <button
                          type="button"
                          key={prompt}
                          onClick={() => sendQuestion(prompt)}
                          className="group min-h-24 border-t border-[var(--border)] py-4 text-left transition hover:border-emerald-500"
                        >
                          <span className="font-mono text-[10px] text-[var(--muted)]">
                            0{index + 1}
                          </span>
                          <span className="mt-2 block max-w-[300px] text-sm leading-6 transition group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            {prompt}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              ) : (
                <div className="mx-auto max-w-[900px] space-y-7 pb-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onRetry={sendQuestion}
                    />
                  ))}
                  {isLoading && <ThinkingTicker />}
                </div>
              )}
            </div>
            <PromptComposer
              value={input}
              onChange={setInput}
              onSend={() => sendQuestion(input)}
              isLoading={isLoading}
              lens={lens}
              frameQuestion={frameQuestion}
              setFrameQuestion={setFrameQuestion}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
