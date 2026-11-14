import { supabase } from "../config/supabase";
import { SITE } from "../config/site";
import type { Language } from "../config/i18n";
import type { LocalizedProject, Project, ProjectInput } from "../types/portfolio";

const TABLE = "projects";

export const errorMessage = (err: unknown, fallback = "Unexpected error") =>
  err instanceof Error ? err.message : typeof err === "object" && err && "message" in err ? String(err.message) : fallback;

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from(TABLE).select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function fetchProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Project | null;
}

export async function createProject(input: ProjectInput) {
  const { error } = await supabase.from(TABLE).insert([input]);
  if (error) throw error;
}

export async function updateProject(id: string, input: ProjectInput) {
  const { error } = await supabase.from(TABLE).update(input).eq("id", id);
  if (error) throw error;
}

/** Every asset URL attached to a project, cover included, without duplicates. */
export const projectImages = (p: Pick<Project, "image_url" | "image_urls">): string[] => {
  const list = p.image_urls && p.image_urls.length > 0 ? p.image_urls : p.image_url ? [p.image_url] : [];
  return Array.from(new Set(list));
};

const storagePath = (url: string) => url.split(`${SITE.storageBucket}/`)[1] ?? null;

export async function removeAssets(urls: string[]) {
  const paths = urls.map(storagePath).filter((p): p is string => Boolean(p));
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(SITE.storageBucket).remove(paths);
  if (error) console.error("Storage cleanup failed:", error);
}

const MAX_EDGE = 2400;

/** Downscale large photos and re-encode them as WebP before upload. Other files pass through. */
async function optimizeImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" });
  } catch {
    return file;
  }
}

export async function uploadAssets(files: File[]): Promise<string[]> {
  return Promise.all(
    files.map(async (original) => {
      const file = await optimizeImage(original);
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
      const path = `covers/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error } = await supabase.storage.from(SITE.storageBucket).upload(path, file);
      if (error) throw error;
      return supabase.storage.from(SITE.storageBucket).getPublicUrl(path).data.publicUrl;
    }),
  );
}

export async function deleteProject(project: Project) {
  const { error } = await supabase.from(TABLE).delete().eq("id", project.id);
  if (error) throw error;
  await removeAssets(projectImages(project));
}

const IMAGE_RE = /\.(avif|jpe?g|png|gif|webp|svg|bmp)(\?|$)/i;
export const isImageUrl = (url: string) => IMAGE_RE.test(url);

export function localize(p: Project, lang: Language): LocalizedProject {
  const en = lang === "en";
  const images = projectImages(p);
  const links = en && p.links_en && p.links_en.length > 0 ? p.links_en : (p.links ?? []);
  return {
    id: p.id,
    title: (en && p.title_en) || p.title,
    category: (en && p.category_en) || p.category,
    description: (en && p.description_en) || p.description,
    links,
    tags: p.tags ?? [],
    images,
    cover: images.find(isImageUrl) ?? null,
    createdAt: p.created_at,
  };
}

/** view-transition-name shared by a project panel image and the detail page hero. */
export const vtName = (id: string) => `p-${id}`;

/**
 * One-off maintenance: re-encode a project's oversized photos as WebP, swap the URLs
 * in the row, then delete the originals. GIF and SVG are left untouched.
 * Returns the number of bytes saved.
 */
export async function optimizeProjectImages(project: Project): Promise<number> {
  const urls = projectImages(project);
  let saved = 0;
  const replaced: string[] = [];
  const next = await Promise.all(
    urls.map(async (url) => {
      if (!/\.(png|jpe?g)(\?|$)/i.test(url)) return url;
      const res = await fetch(url);
      if (!res.ok) return url;
      const blob = await res.blob();
      const name = decodeURIComponent(url.split("/").pop() ?? "image.png");
      const optimized = await optimizeImage(new File([blob], name, { type: blob.type || "image/png" }));
      if (optimized.size >= blob.size * 0.9) return url;
      const [uploaded] = await uploadAssets([optimized]);
      saved += blob.size - optimized.size;
      replaced.push(url);
      return uploaded;
    }),
  );
  if (replaced.length === 0) return 0;
  await updateProject(project.id, {
    title: project.title,
    title_en: project.title_en,
    category: project.category,
    category_en: project.category_en,
    description: project.description,
    description_en: project.description_en,
    tags: project.tags,
    links: project.links,
    links_en: project.links_en,
    image_urls: next,
    image_url: next.find(isImageUrl) ?? next[0] ?? null,
  });
  await removeAssets(replaced);
  return saved;
}
