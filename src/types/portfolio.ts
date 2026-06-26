export interface LinkItem {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  title_en?: string;
  category: string;
  category_en?: string;
  image_url?: string;
  image_urls?: string[];
  tags: string[];
  description?: string;
  description_en?: string;
  links?: LinkItem[];
  links_en?: LinkItem[];
  created_at?: string;
}
