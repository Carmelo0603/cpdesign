import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../config/supabase";
import { type LinkItem } from "../../types/portfolio";

// MICRO-COMPONENTE: Previene gli errori di rete bloccando spam di blob URL
const FilePreview = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(url);
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

const EditProjectPage = () => {
  const { id } = useParams<{ id: string }>();
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

  // Immagini
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [urlsToRemove, setUrlsToRemove] = useState<string[]>([]);
  const [newAssetFiles, setNewAssetFiles] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (error) {
        setError("Impossibile recuperare il progetto.");
        setIsLoading(false);
        return;
      }
      if (data) {
        setTitle(data.title);
        setTitleEn(data.title_en || "");
        setCategory(data.category);
        setCategoryEn(data.category_en || "");
        setTagsInput(data.tags.join(", "));
        setDescription(data.description || "");
        setDescriptionEn(data.description_en || "");
        setLinks(data.links || []);
        setLinksEn(data.links_en || []);
        const urls = data.image_urls && data.image_urls.length > 0 ? data.image_urls : data.image_url ? [data.image_url] : [];
        setExistingUrls(urls);
      }
      setIsLoading(false);
    };
    if (id) fetchProject();
  }, [id]);

  const addLinkField = (setter: React.Dispatch<React.SetStateAction<LinkItem[]>>, list: LinkItem[]) => setter([...list, { label: "", url: "" }]);
  const removeLinkField = (setter: React.Dispatch<React.SetStateAction<LinkItem[]>>, list: LinkItem[], idx: number) => setter(list.filter((_, i) => i !== idx));
  const handleLinkChange = (setter: React.Dispatch<React.SetStateAction<LinkItem[]>>, list: LinkItem[], idx: number, f: keyof LinkItem, v: string) => {
    const arr = [...list];
    arr[idx][f] = v;
    setter(arr);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewAssetFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const toggleMarkForRemoval = (url: string) => {
    setUrlsToRemove((prev) => prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const tagsArray = tagsInput.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    const validLinks = links.filter((l) => l.label.trim() !== "" && l.url.trim() !== "");
    const validLinksEn = linksEn.filter((l) => l.label.trim() !== "" && l.url.trim() !== "");

    try {
      if (urlsToRemove.length > 0) {
        const paths = urlsToRemove.map((u) => u.split("portfolio-assets/")[1]).filter(Boolean);
        if (paths.length > 0) {
          await supabase.storage.from("portfolio-assets").remove(paths);
        }
      }

      let newUploaded: string[] = [];
      if (newAssetFiles.length > 0) {
        newUploaded = await Promise.all(
            newAssetFiles.map(async (file) => {
              const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${file.name.split(".").pop()}`;
              const { error: uploadError } = await supabase.storage.from("portfolio-assets").upload(`covers/${fileName}`, file);
              if (uploadError) throw uploadError;
              return supabase.storage.from("portfolio-assets").getPublicUrl(`covers/${fileName}`).data.publicUrl;
            })
        );
      }

      const finalUrls = [...existingUrls.filter((u) => !urlsToRemove.includes(u)), ...newUploaded];

      const { error: updateError } = await supabase.from("projects").update({
        title,
        title_en: titleEn,
        category,
        category_en: categoryEn,
        tags: tagsArray,
        description: description.trim() === "" ? null : description,
        description_en: descriptionEn.trim() === "" ? null : descriptionEn,
        links: validLinks,
        links_en: validLinksEn,
        image_urls: finalUrls,
        image_url: finalUrls.length > 0 ? finalUrls[0] : null,
      }).eq("id", id);

      if (updateError) throw updateError;
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Impossibile aggiornare il progetto.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-12 font-black text-4xl animate-pulse uppercase">Caricamento...</div>;

  return (
      <div className="max-w-4xl mx-auto">
        <div className="border-b-8 border-dark pb-6 mb-12">
          <h1 className="font-heading font-black text-5xl uppercase">Modifica Progetto</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-light border-8 border-dark p-6 md:p-12 shadow-brutal">
          {error && <div className="bg-red-500 text-dark p-4 border-4 border-dark">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="font-black uppercase">Titolo (IT)</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="border-4 border-dark p-4 font-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-black uppercase">Title (EN)</label>
              <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="border-4 border-dark p-4 font-black" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-black uppercase">Categoria (IT)</label>
              <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="border-4 border-dark p-4 font-black" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-black uppercase">Category (EN)</label>
              <input type="text" value={categoryEn} onChange={(e) => setCategoryEn(e.target.value)} className="border-4 border-dark p-4 font-black" />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-black uppercase">Descrizione (IT)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border-4 border-dark p-4 font-black min-h-[150px]" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-black uppercase">Description (EN)</label>
              <textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} className="border-4 border-dark p-4 font-black min-h-[150px]" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-heading font-black text-xl uppercase text-dark">Tags (separati da virgola)</label>
            <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="border-4 border-dark p-4 font-heading font-black text-xl" />
          </div>

          <div className="border-t-4 border-dark pt-8">
            <div className="flex justify-between items-center mb-4">
              <label className="font-black text-2xl uppercase">Links (IT)</label>
              <button type="button" onClick={() => addLinkField(setLinks, links)} className="bg-neon px-4 py-2 border-4 border-dark font-black">+ Add IT</button>
            </div>
            {links.map((link, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input placeholder="Label" value={link.label} onChange={(e) => handleLinkChange(setLinks, links, i, "label", e.target.value)} className="border-4 border-dark p-2 w-1/3" />
                  <input placeholder="URL" value={link.url} onChange={(e) => handleLinkChange(setLinks, links, i, "url", e.target.value)} className="border-4 border-dark p-2 w-1/2" />
                  <button type="button" onClick={() => removeLinkField(setLinks, links, i)} className="bg-red-500 text-white p-2 border-4 border-dark">X</button>
                </div>
            ))}
          </div>

          <div className="border-t-4 border-dark pt-8">
            <div className="flex justify-between items-center mb-4">
              <label className="font-black text-2xl uppercase">Links (EN)</label>
              <button type="button" onClick={() => addLinkField(setLinksEn, linksEn)} className="bg-neon px-4 py-2 border-4 border-dark font-black">+ Add EN</button>
            </div>
            {linksEn.map((link, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input placeholder="Label" value={link.label} onChange={(e) => handleLinkChange(setLinksEn, linksEn, i, "label", e.target.value)} className="border-4 border-dark p-2 w-1/3" />
                  <input placeholder="URL" value={link.url} onChange={(e) => handleLinkChange(setLinksEn, linksEn, i, "url", e.target.value)} className="border-4 border-dark p-2 w-1/2" />
                  <button type="button" onClick={() => removeLinkField(setLinksEn, linksEn, i)} className="bg-red-500 text-white p-2 border-4 border-dark">X</button>
                </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t-4 border-dark pt-8">
            <label className="font-heading font-black text-2xl uppercase">Asset / Media</label>

            {existingUrls.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="font-black uppercase text-sm text-dark/50">File già caricati</span>
                  {existingUrls.map((url) => {
                    const isMarked = urlsToRemove.includes(url);
                    const isImage = /\.(jpe?g|png|gif|webp|svg|bmp|tiff?)(\?|$)/i.test(url);
                    return (
                        <div key={url} className={`flex items-center justify-between border-4 p-3 transition-colors ${isMarked ? "border-red-500 bg-red-50 opacity-60" : "border-dark"}`}>
                          <div className="flex items-center gap-3 min-w-0">
                            {isImage ? (
                                <img src={url} alt="" className="w-12 h-12 object-cover border-2 border-dark flex-shrink-0" />
                            ) : (
                                <div className="w-12 h-12 border-2 border-dark flex items-center justify-center flex-shrink-0 bg-dark/10">
                                  <span className="font-black text-xs uppercase">{url.split(".").pop()?.split("?")[0]}</span>
                                </div>
                            )}
                            <span className="font-black text-sm truncate">{decodeURIComponent(url.split("/").pop() || url)}</span>
                          </div>
                          <button type="button" onClick={() => toggleMarkForRemoval(url)} className={`px-3 py-1 border-4 border-dark font-black text-sm flex-shrink-0 ml-2 ${isMarked ? "bg-dark text-neon" : "bg-red-500 text-white"}`}>
                            {isMarked ? "Annulla" : "Rimuovi"}
                          </button>
                        </div>
                    );
                  })}
                </div>
            )}

            <label className="flex flex-col items-center justify-center gap-2 border-4 border-dashed border-dark p-8 cursor-pointer hover:bg-neon/10 transition-colors">
              <span className="font-black text-xl uppercase">+ Aggiungi file</span>
              <span className="font-black text-sm text-dark/50">Tutti i formati accettati</span>
              <input type="file" multiple onChange={handleFileChange} className="hidden" />
            </label>

            {newAssetFiles.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="font-black uppercase text-sm text-dark/50">Nuovi file da caricare</span>
                  {newAssetFiles.map((file, i) => (
                      <FilePreview
                          key={`${file.name}-${i}`}
                          file={file}
                          onRemove={() => setNewAssetFiles((prev) => prev.filter((_, idx) => idx !== i))}
                      />
                  ))}
                </div>
            )}
          </div>

          <button type="submit" disabled={isSaving} className="bg-dark text-neon p-6 font-black text-2xl uppercase border-4 border-dark w-full">
            {isSaving ? "Sincronizzazione..." : "Aggiorna Progetto →"}
          </button>
        </form>
      </div>
  );
};

export default EditProjectPage;