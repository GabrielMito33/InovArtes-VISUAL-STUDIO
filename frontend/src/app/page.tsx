import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Sparkles } from "lucide-react";
import { NAV_ITEMS } from "@/lib/navigation";

export default function DashboardPage() {
  const available = NAV_ITEMS.filter((item) => item.available);
  const upcoming = NAV_ITEMS.filter((item) => !item.available);

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-fade-up">
      <section className="overflow-hidden rounded-3xl border border-border-soft bg-panel/70 shadow-[var(--shadow)]">
        <div className="relative grid gap-8 px-6 py-8 md:grid-cols-[1.4fr_0.8fr] md:px-10 md:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.16),transparent_40%)]" />
          <div className="relative space-y-5">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">AI Visual Studio</p>
            <h1 className="max-w-2xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight text-text md:text-5xl">
              Studio interno para produção visual com IA
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
              Ambiente profissional para empresas de comunicação visual. Nesta entrega, o módulo
              Melhorar imagens já está disponível para redesenho com IA e preparação de upscale.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/melhorar-imagens"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-black transition hover:bg-accent-hover"
              >
                Abrir Melhorar imagens
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative grid gap-3 self-end">
            <div className="rounded-2xl border border-border bg-bg-elevated/80 p-4">
              <div className="mb-2 flex items-center gap-2 text-accent">
                <CheckCircle2 size={16} />
                <span className="text-xs font-semibold uppercase tracking-wide">Disponível</span>
              </div>
              <p className="text-sm text-text-muted">{available.length} módulos ativos nesta versão</p>
            </div>
            <div className="rounded-2xl border border-border bg-bg-elevated/80 p-4">
              <div className="mb-2 flex items-center gap-2 text-text-muted">
                <Clock3 size={16} />
                <span className="text-xs font-semibold uppercase tracking-wide">Roadmap</span>
              </div>
              <p className="text-sm text-text-muted">{upcoming.length} funcionalidades futuras no menu</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-border-soft bg-panel/60 p-6">
          <div className="mb-4 flex items-center gap-2 text-accent">
            <Sparkles size={18} />
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">Em operação</h2>
          </div>
          <ul className="space-y-3">
            {available.map((item) => (
              <li key={item.id} className="rounded-xl border border-border-soft bg-bg-elevated/50 px-4 py-3">
                <p className="font-medium text-text">{item.label}</p>
                <p className="mt-1 text-sm text-text-muted">{item.description}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-border-soft bg-panel/60 p-6">
          <div className="mb-4 flex items-center gap-2 text-text-muted">
            <Clock3 size={18} />
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">Em breve</h2>
          </div>
          <ul className="space-y-2">
            {upcoming.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border-soft/80 px-4 py-3 text-sm"
              >
                <span className="text-text-muted">{item.label}</span>
                <span className="rounded-md border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-text-muted">
                  Futuro
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
