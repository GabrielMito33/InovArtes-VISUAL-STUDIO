"use client";

import { Download } from "lucide-react";

type BeforeAfterProps = {
  beforeUrl: string;
  afterUrl: string;
  downloadName?: string;
};

export function BeforeAfter({ beforeUrl, afterUrl, downloadName = "resultado.png" }: BeforeAfterProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <figure className="overflow-hidden rounded-2xl border border-border-soft bg-bg-elevated">
          <figcaption className="border-b border-border-soft px-4 py-2 text-xs uppercase tracking-wide text-text-muted">
            Original
          </figcaption>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={beforeUrl} alt="Imagem original" className="max-h-[420px] w-full object-contain bg-[#0f1115]" />
        </figure>
        <figure className="overflow-hidden rounded-2xl border border-accent/30 bg-bg-elevated">
          <figcaption className="border-b border-border-soft px-4 py-2 text-xs uppercase tracking-wide text-accent">
            Resultado
          </figcaption>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={afterUrl} alt="Imagem processada" className="max-h-[420px] w-full object-contain bg-[#0f1115]" />
        </figure>
      </div>
      <a
        href={afterUrl}
        download={downloadName}
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-accent-hover"
      >
        <Download size={16} />
        Baixar imagem final
      </a>
    </div>
  );
}
