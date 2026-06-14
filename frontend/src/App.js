import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import { SubmitButton } from "./submit";
import { ThemeToggle } from "./components/theme-toggle";
import { Github } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-5 flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted">
              VectorShift
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground">
              Frontend Technical Assessment
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Nemathullahkhan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full dark:bg-neutral-300 bg-neutral-900 text-background dark:text-background hover:opacity-80 transition-opacity"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </header>

        <PipelineToolbar />
        <main className="mt-5">
          <PipelineUI />
        </main>
        <footer className="mt-5">
          <SubmitButton />
        </footer>
      </div>
    </div>
  );
}

export default App;
