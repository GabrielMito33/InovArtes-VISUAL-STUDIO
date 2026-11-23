"use client";

import { ImagePlus, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const ACCEPTED = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

type UploadZoneProps = {
  disabled?: boolean;
  onFileSelected: (file: File) => void;
};

export function UploadZone({ disabled, onFileSelected }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!ACCEPTED.includes(file.type)) {
        setLocalError("Formato inválido. Use PNG, JPG ou WEBP.");
        return;
      }
      setLocalError(null);
      onFileSelected(file);
    },
    [onFileSelected],
  );

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (disabled) return;
          handleFile(event.dataTransfer.files?.[0]);
        }}
        className={`rounded-2xl border border-dashed px-6 py-10 text-center transition ${
          dragging
            ? "border-accent bg-accent-soft"
            : "border-border bg-bg-elevated/50 hover:border-accent/60 hover:bg-panel"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-panel text-accent">
          {dragging ? <Upload size={24} /> : <ImagePlus size={24} />}
        </div>
        <p className="text-base font-medium text-text">Arraste e solte a imagem aqui</p>
        <p className="mt-2 text-sm text-text-muted">ou clique para selecionar · PNG, JPG, WEBP</p>
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
          className="hidden"
          disabled={disabled}
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
            // Allow selecting the same file again after a failed/cancelled attempt.
            event.target.value = "";
          }}
        />
      </div>
      {localError ? <p className="text-sm text-danger">{localError}</p> : null}
    </div>
  );
}
