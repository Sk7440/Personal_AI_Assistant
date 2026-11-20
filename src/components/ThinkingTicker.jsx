import { useEffect, useState } from "react";

const stages = [
  { at: 0, text: "Scanning resume dossier..." },
  { at: 1800, text: "Cross-referencing skills & experience..." },
  { at: 3800, text: "Composing grounded response..." },
];

export default function ThinkingTicker() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const started = performance.now();
    const interval = window.setInterval(() => {
      setElapsed((performance.now() - started) / 1000);
    }, 100);
    return () => window.clearInterval(interval);
  }, []);

  const activeStage =
    [...stages].reverse().find((stage) => elapsed >= stage.at / 1000) ??
    stages[0];

  return (
    <div
      className="flex max-w-[760px] items-center gap-3 border-l border-emerald-500/60 pl-4 py-2"
      role="status"
      aria-live="polite"
    >
      <div className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="size-1 animate-pulse rounded-full bg-emerald-500"
            style={{ animationDelay: `${index * 150}ms` }}
          />
        ))}
      </div>
      <span className="text-sm text-[var(--muted)]">{activeStage.text}</span>
      <span className="ml-auto font-mono text-[10px] text-[var(--muted)]">
        {elapsed.toFixed(1)}s
      </span>
    </div>
  );
}
