import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";

export default function PromptComposer({
  value,
  onChange,
  onSend,
  isLoading,
  lens,
  frameQuestion,
  setFrameQuestion,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
  }, [value]);

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (value.trim() && !isLoading) onSend();
    }
  }

  return (
    <div className="border-t border-[var(--border)] bg-[var(--canvas)] px-4 pb-4 pt-3 sm:px-6">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-2 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--muted)]">
            <input
              type="checkbox"
              checked={frameQuestion}
              onChange={(event) => setFrameQuestion(event.target.checked)}
              className="size-3.5 accent-emerald-600"
            />
            Frame question for {lens}
          </label>
          <span className="hidden font-mono text-[10px] text-[var(--muted)] sm:block">
            ENTER SEND / SHIFT ENTER NEW LINE
          </span>
        </div>
        <div className="flex items-end gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 focus-within:border-emerald-500/60">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Question for candidate"
            placeholder="Ask about experience, architecture, or delivery..."
            className="max-h-36 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 outline-none placeholder:text-[var(--muted)]"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!value.trim() || isLoading}
            aria-label="Send question"
            className="grid size-10 shrink-0 place-items-center rounded-md bg-emerald-600 text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-[var(--border)] disabled:text-[var(--muted)] active:scale-[0.96]"
          >
            <ArrowUp size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
