import {
  BriefcaseBusiness,
  ChevronRight,
  Download,
  Globe2,
  Network,
  Mail,
  Users,
  Code2,
  Rocket,
  X,
} from "lucide-react";
import { candidate } from "../config/candidate";

const lensOptions = [
  { name: "Recruiter", icon: Users },
  { name: "Tech Lead", icon: Code2 },
  { name: "Founder / Client", icon: Rocket },
];

export default function SidebarDossier({
  lens,
  setLens,
  health,
  open,
  onClose,
  onPrompt,
}) {
  const prompts = candidate.starterPrompts[lens];

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close candidate dossier"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside
        aria-label="Candidate dossier"
        className={[
          "fixed inset-y-0 left-0 z-50 w-[min(88vw,360px)] overflow-y-auto border-r border-[var(--border)] bg-[var(--sidebar)] px-5 py-5 transition-transform duration-300 lg:sticky lg:top-0 lg:h-[100dvh] lg:w-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between lg:hidden">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Candidate dossier
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dossier"
            className="grid size-9 place-items-center rounded-md border border-[var(--border)]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mt-6 border-b border-[var(--border)] pb-5 lg:mt-0">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="grid size-11 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface)]">
              <span className="text-sm font-semibold">
                {candidate.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>
            <div
              className={[
                "flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[10px]",
                health === "online"
                  ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "border-amber-500/30 text-amber-700 dark:text-amber-300",
              ].join(" ")}
              aria-live="polite"
            >
              <span
                className={[
                  "size-1.5 rounded-full",
                  health === "online"
                    ? "bg-emerald-500"
                    : "bg-amber-500",
                ].join(" ")}
              />
              {health === "online" ? "Backend online" : "Offline / waking"}
            </div>
          </div>

          <h1 className="text-xl font-semibold leading-tight tracking-tight">
            {candidate.name}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{candidate.title}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted)]">
            <BriefcaseBusiness size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>{candidate.availability}</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href={candidate.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--text)] px-3 text-xs font-semibold text-[var(--canvas)] transition active:scale-[0.98]"
            >
              <Download size={14} />
              Resume PDF
            </a>
            <a
              href={`mailto:${candidate.email}`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--border)] px-3 text-xs font-semibold transition active:scale-[0.98]"
            >
              <Mail size={14} />
              Email
            </a>
          </div>

          <div className="mt-3 flex gap-2">
            <a
              href={candidate.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="grid size-9 place-items-center rounded-md border border-[var(--border)] text-[var(--muted)] transition hover:text-[var(--text)]"
            >
              <Globe2 size={16} />
            </a>
            <a
              href={candidate.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="grid size-9 place-items-center rounded-md border border-[var(--border)] text-[var(--muted)] transition hover:text-[var(--text)]"
            >
              <Network size={16} />
            </a>
          </div>
        </div>

        <section className="border-b border-[var(--border)] py-5" aria-labelledby="lens-heading">
          <h2 id="lens-heading" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Interviewer lens
          </h2>
          <div className="mt-3 space-y-1">
            {lensOptions.map((option) => {
              const Icon = option.icon;
              const active = lens === option.name;
              return (
                <button
                  type="button"
                  key={option.name}
                  onClick={() => setLens(option.name)}
                  aria-pressed={active}
                  className={[
                    "flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition active:scale-[0.99]",
                    active
                      ? "border-emerald-500/40 bg-emerald-500/[0.08] text-[var(--text)]"
                      : "border-transparent text-[var(--muted)] hover:border-[var(--border)] hover:text-[var(--text)]",
                  ].join(" ")}
                >
                  <Icon size={15} />
                  <span className="flex-1">{option.name}</span>
                  {active && <ChevronRight size={14} className="text-emerald-500" />}
                </button>
              );
            })}
          </div>
        </section>

        <section className="py-5" aria-labelledby="starter-heading">
          <h2 id="starter-heading" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Suggested
          </h2>
          <div className="mt-3 space-y-2">
            {prompts.map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => onPrompt(prompt)}
                className="w-full border-l border-[var(--border)] px-3 py-2 text-left text-xs leading-5 text-[var(--muted)] transition hover:border-emerald-500 hover:text-[var(--text)]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </section>
      </aside>
    </>
  );
}
