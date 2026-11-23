"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Aperture } from "lucide-react";
import { useState } from "react";
import { NAV_ITEMS } from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-panel text-text md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={18} />
      </button>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-border-soft bg-bg-elevated/95 backdrop-blur-md transition-transform duration-300 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Aperture size={20} />
            </div>
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-text">
                AI Visual Studio
              </p>
              <p className="text-xs text-text-muted">Comunicação visual</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-text-muted">
            Módulos
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.href ? pathname === item.href : false;

              if (!item.available) {
                return (
                  <li key={item.id}>
                    <div
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted/70"
                      title={item.description}
                    >
                      <Icon size={17} className="shrink-0 opacity-60" />
                      <span className="flex-1 truncate">{item.label}</span>
                      <span className="rounded-md border border-border-soft px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-text-muted">
                        Em breve
                      </span>
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <Link
                    href={item.href!}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-accent-soft text-accent"
                        : "text-text-muted hover:bg-panel hover:text-text"
                    }`}
                  >
                    <Icon size={17} className="shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border-soft px-5 py-4">
          <p className="text-xs text-text-muted">Uso interno · v0.1</p>
        </div>
      </aside>
    </>
  );
}
