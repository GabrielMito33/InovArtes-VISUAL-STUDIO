"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, LoaderCircle, Sparkles, ZoomIn } from "lucide-react";
import {
  enhanceImage,
  getHealth,
  type HealthResponse,
  type ProcessResponse,
  type UploadResponse,
  uploadImage,
  upscaleImage,
} from "@/lib/api";
import { BeforeAfter } from "@/components/images/BeforeAfter";
import { UploadZone } from "@/components/images/UploadZone";

type Mode = "enhance" | "upscale";

export function EnhanceWorkspace() {
  const [mode, setMode] = useState<Mode>("enhance");
  const [scale, setScale] = useState<2 | 4>(2);
  const [prompt, setPrompt] = useState(
    "Melhore nitidez, contraste e qualidade geral mantendo textos, logotipos, cores e composição.",
  );
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [upload, setUpload] = useState<UploadResponse | null>(null);
  const [result, setResult] = useState<ProcessResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const beforeUrl = useMemo(() => {
    if (upload?.url) return upload.url;
    return localPreview;
  }, [localPreview, upload]);

  async function handleFileSelected(file: File) {
    setError(null);
    setResult(null);
    setUpload(null);
    if (localPreview) URL.revokeObjectURL(localPreview);
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setUploading(true);
    try {
      const uploaded = await uploadImage(file);
      setUpload(uploaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleProcess() {
    if (!upload) {
      setError("Envie uma imagem antes de processar.");
      return;
    }
    if (mode === "enhance" && !prompt.trim()) {
      setError("Descreva o que deseja melhorar.");
      return;
    }

    setProcessing(true);
    setError(null);
    setResult(null);
    try {
      const processed =
        mode === "enhance"
          ? await enhanceImage(upload.file_id, prompt.trim())
          : await upscaleImage(upload.file_id, scale);
      setResult(processed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no processamento.");
    } finally {
      setProcessing(false);
    }
  }

  const canProcess = Boolean(upload) && !uploading && !processing;

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">Módulo ativo</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
          Melhorar imagens
        </h1>
        <p className="max-w-2xl text-text-muted">
          Envie uma imagem, escolha o processamento e compare o resultado. O redesenho usa a API
          OpenAI; o aumento de resolução depende do Real-ESRGAN configurado no backend.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setMode("enhance")}
          className={`rounded-2xl border px-4 py-4 text-left transition ${
            mode === "enhance"
              ? "border-accent bg-accent-soft"
              : "border-border-soft bg-panel/50 hover:border-border"
          }`}
        >
          <div className="mb-2 flex items-center gap-2 text-accent">
            <Sparkles size={18} />
            <span className="font-semibold text-text">Redesenhar com IA</span>
          </div>
          <p className="text-sm text-text-muted">
            Reconstrução e edição com GPT Image 2.6 Sunburst, preservando identidade visual.
          </p>
        </button>
        <button
          type="button"
          onClick={() => setMode("upscale")}
          className={`rounded-2xl border px-4 py-4 text-left transition ${
            mode === "upscale"
              ? "border-accent bg-accent-soft"
              : "border-border-soft bg-panel/50 hover:border-border"
          }`}
        >
          <div className="mb-2 flex items-center gap-2 text-accent">
            <ZoomIn size={18} />
            <span className="font-semibold text-text">Aumentar resolução</span>
          </div>
          <p className="text-sm text-text-muted">
            Integração Real-ESRGAN (2x / 4x). Sem simulação se o serviço não estiver instalado.
          </p>
        </button>
      </div>

      {health ? (
        <div className="flex flex-wrap gap-2 text-xs">
          <span
            className={`rounded-lg border px-2.5 py-1 ${
              health.openai_configured
                ? "border-success/30 text-success"
                : "border-border text-text-muted"
            }`}
          >
            OpenAI {health.openai_configured ? "configurada" : "não configurada"}
          </span>
          <span
            className={`rounded-lg border px-2.5 py-1 ${
              health.realesrgan_configured
                ? "border-success/30 text-success"
                : "border-border text-text-muted"
            }`}
          >
            Real-ESRGAN {health.realesrgan_configured ? "pronto" : "aguardando configuração"}
          </span>
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5 rounded-3xl border border-border-soft bg-panel/60 p-5 md:p-6">
          <UploadZone disabled={uploading || processing} onFileSelected={handleFileSelected} />

          {beforeUrl ? (
            <div className="overflow-hidden rounded-2xl border border-border-soft bg-bg-elevated">
              <div className="border-b border-border-soft px-4 py-2 text-xs uppercase tracking-wide text-text-muted">
                Pré-visualização
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={beforeUrl} alt="Pré-visualização" className="max-h-72 w-full object-contain" />
              {upload ? (
                <p className="border-t border-border-soft px-4 py-2 text-xs text-text-muted">
                  {upload.filename}
                  {upload.width && upload.height ? ` · ${upload.width}×${upload.height}` : ""}
                </p>
              ) : null}
            </div>
          ) : null}

          {mode === "enhance" ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-text">O que deseja melhorar?</span>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={5}
                className="w-full resize-y rounded-2xl border border-border bg-bg-elevated px-4 py-3 text-sm text-text outline-none transition focus:border-accent"
                placeholder="Ex.: Aumentar nitidez do logotipo e limpar o fundo sem alterar as cores."
                disabled={processing}
              />
            </label>
          ) : (
            <div className="space-y-2">
              <span className="text-sm font-medium text-text">Escala de ampliação</span>
              <div className="flex gap-2">
                {([2, 4] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setScale(value)}
                    className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                      scale === value
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-border text-text-muted hover:text-text"
                    }`}
                    disabled={processing}
                  >
                    {value}x
                  </button>
                ))}
              </div>
              {!health?.realesrgan_configured ? (
                <p className="text-sm text-text-muted">
                  Este modo só processa quando o Real-ESRGAN estiver configurado no backend.
                </p>
              ) : null}
            </div>
          )}

          <button
            type="button"
            onClick={handleProcess}
            disabled={!canProcess}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-black transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Processando...
              </>
            ) : (
              <>
                {mode === "enhance" ? <Sparkles size={16} /> : <ZoomIn size={16} />}
                Iniciar processamento
              </>
            )}
          </button>

          {(uploading || processing) && (
            <div className="space-y-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-border-soft">
                <div className="loading-bar h-full w-full" />
              </div>
              <p className="animate-pulse-soft text-sm text-text-muted">
                {uploading ? "Enviando imagem..." : "Aguardando resposta do processamento..."}
              </p>
            </div>
          )}

          {error ? (
            <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-border-soft bg-panel/60 p-5 md:p-6">
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-semibold">
            Comparação
          </h2>
          {result && beforeUrl ? (
            <div className="space-y-3">
              {result.message ? <p className="text-sm text-text-muted">{result.message}</p> : null}
              <BeforeAfter
                beforeUrl={beforeUrl}
                afterUrl={result.url}
                downloadName={`ai-visual-studio-${result.file_id}.png`}
              />
            </div>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-border bg-bg-elevated/40 px-6 text-center text-sm text-text-muted">
              O resultado antes/depois aparecerá aqui após o processamento.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
