export type HealthResponse = {
  status: string;
  openai_configured: boolean;
  realesrgan_configured: boolean;
  max_upload_mb: number;
  openai_image_model: string;
};

export type UploadResponse = {
  file_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  url: string;
};

export type ProcessResponse = {
  file_id: string;
  original_file_id: string;
  mode: string;
  url: string;
  width: number | null;
  height: number | null;
  message: string | null;
};

async function readError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data?.detail === "string") return data.detail;
    if (Array.isArray(data?.detail)) {
      return data.detail.map((item: { msg?: string }) => item.msg || "Erro").join(" ");
    }
    return data?.message || `Erro ${response.status}`;
  } catch {
    return `Erro ${response.status}`;
  }
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch("/api/health", { cache: "no-store" });
  if (!response.ok) throw new Error(await readError(response));
  return response.json();
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/images/upload", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json();
}

export async function enhanceImage(fileId: string, prompt: string): Promise<ProcessResponse> {
  const response = await fetch("/api/images/enhance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId, prompt }),
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json();
}

export async function upscaleImage(fileId: string, scale: 2 | 4): Promise<ProcessResponse> {
  const response = await fetch("/api/images/upscale", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId, scale }),
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json();
}
