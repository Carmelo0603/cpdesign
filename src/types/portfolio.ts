export interface LinkItem {
  label: string;
  url: string;
}

/** Row of the Supabase `projects` table. */
export interface Project {
  id: string;
  title: string;
  title_en: string | null;
  category: string;
  category_en: string | null;
  image_url: string | null;
  image_urls: string[] | null;
  tags: string[];
  description: string | null;
  description_en: string | null;
  links: LinkItem[] | null;
  links_en: LinkItem[] | null;
  created_at: string;
}

/** Fields written by the admin form. */
export type ProjectInput = Omit<Project, "id" | "created_at">;

/** A project resolved for the current language. */
export interface LocalizedProject {
  id: string;
  title: string;
  category: string;
  description: string | null;
  links: LinkItem[];
  tags: string[];
  images: string[];
  cover: string | null;
  createdAt: string;
}
