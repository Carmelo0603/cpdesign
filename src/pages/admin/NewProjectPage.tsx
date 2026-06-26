import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { type LinkItem } from "../../types/portfolio";

// MICRO-COMPONENTE: Genera l'anteprima una volta sola e pulisce la memoria
const FilePreview = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Garbage collection nativa: previene i memory leak e gli errori ORB
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  return (
      <div className="flex items-center justify-between border-4 border-dark p-3">
        <div className="flex items-center gap-3 min-w-0">
          {previewUrl ? (
              <img src={previewUrl} alt={file.name} className="w-12 h-12 object-cover border-2 border-dark flex-shrink-0" />
          ) : (
              <div className="w-12 h-12 border-2 border-dark flex items-center justify-center flex-shrink-0 bg-dark/10">
                <span className="font-black text-xs uppercase">{file.name.split(".").pop()}</span>
              </div>
          )}
          <span className="font-black text-sm truncate">{file.name}</span>
        </div>
        <button
            type="button"
            onClick={onRemove}
            className="bg-red-500 text-white px-3 py-1 border-4 border-dark font-black text-sm flex-shrink-0 ml-2"
        >
          Rimuovi
        </button>
      </div>
  );
};

const NewProjectPage = () => {
  const navigate = useNavigate();

  // Stati IT
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);

  // Stati EN
  const [titleEn, setTitleEn] = useState("");
  const [categoryEn, setCategoryEn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [linksEn, setLinksEn] = useState<LinkItem[]>([]);

  const [assetFiles, setAssetFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAssetFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const addLinkField = (setter: React.Dispatch<React.SetStateAction<LinkItem[]>>, current: LinkItem[]) => setter([...current, { label: "", url: "" }]);
  const removeLinkField = (setter: React.Dispatch<React.SetStateAction<LinkItem[]>>, current: LinkItem[], idx: number) => setter(current.filter((_, i) => i !== idx));
  const handleLinkChange = (setter: React.Dispatch<React.SetStateAction<LinkItem[]>>, current: LinkItem[], idx: number, f: keyof LinkItem, v: string) => {
    const arr = [...current];
    arr[idx][f] = v;
    setter(arr);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const tagsArray = tagsInput.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    const validLinks = links.filter((l) => l.label.trim() !== "" && l.url.trim() !== "");
    const validLinksEn = linksEn.filter((l) => l.label.trim() !== "" && l.url.trim() !== "");

    try {
      let uploadedUrls: string[] = [];
      if (assetFiles.length > 0) {
        uploadedUrls = await Promise.all(
            assetFiles.map(async (file) => {
              const fileExt = file.name.split(".").pop();
              const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
              const filePath = `covers/${fileName}`;
              const { error: uploadError } = await supabase.storage.from("portfolio-assets").upload(filePath, file);
              if (uploadError) throw new Error(`Errore caricamento ${file.name}`);
              const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(filePath);
              return data.publicUrl;
            }),
        );
      }

      const { error: insertError } = await supabase.from("projects").insert([
        {
          title,
          title_en: titleEn,
          category,
          category_en: categoryEn,
          description,
          description_en: descriptionEn,
          links: validLinks,
          links_en: validLinksEn,
          tags: tagsArray,
          image_url: uploadedUrls[0] || null,
          image_urls: uploadedUrls,
        },
      ]);

      if (insertError) throw insertError;
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Errore salvataggio.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end border-b-8 border-dark pb-6 mb-12">
          <h1 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter text-dark m-0">Nuovo Progetto</h1>
          <Link to="/admin" className="font-heading font-black text-2xl uppercase underline">&larr; Annulla</Link>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-light border-8 border-dark p-6 md:p-12 shadow-brutal">
          {error && <div className="bg-red-500 text-dark font-heading font-black text-xl uppercase p-4 border-4 border-dark">[ERRORE] {error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-heading font-black text-xl uppercase text-dark">Titolo (IT)</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="border-4 border-dark p-4 font-heading font-black text-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-heading font-black text-xl uppercase text-dark">Title (EN)</label>
              <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="border-4 border-dark p-4 font-heading font-black text-xl" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-heading font-black text-xl uppercase text-dark">Categoria (IT)</label>
              <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="border-4 border-dark p-4 font-heading font-black text-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-heading font-black text-xl uppercase text-dark">Category (EN)</label>
              <input type="text" value={categoryEn} onChange={(e) => setCategoryEn(e.target.value)} className="border-4 border-dark p-4 font-heading font-black text-xl" />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-heading font-black text-xl uppercase text-dark">Descrizione (IT)</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="border-4 border-dark p-4 font-heading font-black text-xl min-h-[150px]"></textarea>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-heading font-black text-xl uppercase text-dark">Description (EN)</label>
              <textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} className="border-4 border-dark p-4 font-heading font-black text-xl min-h-[150px]"></textarea>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-heading font-black text-xl uppercase text-dark">Tags (separati da virgola)</label>
            <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="border-4 border-dark p-4 font-heading font-black text-xl" />
          </div>

          <div className="flex flex-col gap-4 border-t-4 border-dark pt-8">
            <div className="flex justify-between items-center">
              <label className="font-heading font-black text-2xl uppercase">Collegamenti (IT)</label>
              <button type="button" onClick={() => addLinkField(setLinks, links)} className="bg-neon text-dark font-black px-4 py-2 border-4 border-dark">+ Aggiungi</button>
            </div>
            {links.map((link, i) => (
                <div key={i} className="flex gap-4">
                  <input placeholder="Label" value={link.label} onChange={(e) => handleLinkChange(setLinks, links, i, "label", e.target.value)} className="border-4 border-dark p-2 w-1/3" />
                  <input placeholder="URL" value={link.url} onChange={(e) => handleLinkChange(setLinks, links, i, "url", e.target.value)} className="border-4 border-dark p-2 w-1/2" />
                  <button type="button" onClick={() => removeLinkField(setLinks, links, i)} className="bg-red-500 text-white px-2 border-4 border-dark">X</button>
                </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t-4 border-dark pt-8">
            <div className="flex justify-between items-center">
              <label className="font-heading font-black text-2xl uppercase">Links (EN)</label>
              <button type="button" onClick={() => addLinkField(setLinksEn, linksEn)} className="bg-neon text-dark font-black px-4 py-2 border-4 border-dark">+ Add</button>
            </div>
            {linksEn.map((link, i) => (
                <div key={i} className="flex gap-4">
                  <input placeholder="Label" value={link.label} onChange={(e) => handleLinkChange(setLinksEn, linksEn, i, "label", e.target.value)} className="border-4 border-dark p-2 w-1/3" />
                  <input placeholder="URL" value={link.url} onChange={(e) => handleLinkChange(setLinksEn, linksEn, i, "url", e.target.value)} className="border-4 border-dark p-2 w-1/2" />
                  <button type="button" onClick={() => removeLinkField(setLinksEn, linksEn, i)} className="bg-red-500 text-white px-2 border-4 border-dark">X</button>
                </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t-4 border-dark pt-8">
            <label className="font-heading font-black text-2xl uppercase">Asset Visivi</label>
            <label className="flex flex-col items-center justify-center gap-2 border-4 border-dashed border-dark p-8 cursor-pointer hover:bg-neon/10 transition-colors">
              <span className="font-black text-xl uppercase">+ Aggiungi file</span>
              <span className="font-black text-sm text-dark/50">Tutti i formati accettati</span>
              <input type="file" multiple onChange={handleFileChange} className="hidden" />
            </label>

            {assetFiles.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="font-black uppercase text-sm text-dark/50">Nuovi file da caricare</span>
                  {assetFiles.map((file, i) => (
                      <FilePreview
                          key={`${file.name}-${i}`}
                          file={file}
                          onRemove={() => setAssetFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      />
                  ))}
                </div>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="bg-dark text-neon p-6 font-black text-2xl uppercase border-4 border-dark">
            {isLoading ? "Salvando..." : "Salva Progetto →"}
          </button>
        </form>
      </div>
  );
};

export default NewProjectPage;