import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Copy, Mail, TriangleAlert } from "lucide-react";
import { candidate } from "../config/candidate";

export default function ChatMessage({ message, onRetry }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  async function copyReply() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  if (message.role === "error") {
    return (
      <article className="max-w-[760px] rounded-md border border-amber-500/25 bg-amber-500/[0.06] p-4">
        <div className="flex items-start gap-3">
          <TriangleAlert size={17} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">Connection interrupted</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{message.content}</p>
            {message.question && (
              <button
                type="button"
                onClick={() => onRetry(message.question)}
                className="mt-3 h-9 rounded-md border border-amber-500/30 px-3 text-xs font-semibold text-amber-700 transition active:scale-[0.98] dark:text-amber-300"
              >
                Retry question
              </button>
            )}
          </div>
        </div>
      </article>
    );
  }

  const outsideScope =
    !isUser &&
    message.content.toLowerCase().includes("i don't have enough information");

  return (
    <article
      className={[
        "max-w-[760px]",
        isUser ? "ml-auto w-fit max-w-[82%]" : "w-full",
      ].join(" ")}
    >
      {isUser ? (
        <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-6">
          {message.content}
        </div>
      ) : outsideScope ? (
        <div className="rounded-md border border-amber-500/25 bg-amber-500/[0.06] p-4">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <TriangleAlert size={15} />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
              Outside Resume Scope
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            I don't have enough information in Muhammad's resume to answer this reliably.
          </p>
          <a
            href={`mailto:${candidate.email}?subject=Question%20for%20Muhammad%20Sultan%20Khalid`}
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-md border border-amber-500/30 px-3 text-xs font-semibold text-amber-700 transition active:scale-[0.98] dark:text-amber-300"
          >
            <Mail size={14} />
            Email Candidate Directly
          </a>
        </div>
      ) : (
        <div className="border-l border-[var(--border)] pl-4">
          <div className="markdown text-[15px] leading-7 text-[var(--text)]">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      )}

      {!isUser && (
        <div className="mt-3 flex items-center gap-3 pl-4">
          {typeof message.latency === "number" && (
            <span className="font-mono text-[10px] text-[var(--muted)]">
              {message.latency.toFixed(1)}s
            </span>
          )}
          <button
            type="button"
            onClick={copyReply}
            aria-label={copied ? "Answer copied" : "Copy answer"}
            className="grid size-8 place-items-center rounded-md border border-transparent text-[var(--muted)] transition hover:border-[var(--border)] hover:text-[var(--text)]"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </article>
  );
}
