import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { invalidateProjects } from "../../hooks/useProjects";
import {
  createProject,
  errorMessage,
  fetchProject,
  isImageUrl,
  projectImages,
  removeAssets,
  updateProject,
  uploadAssets,
} from "../../lib/projects";
import type { LinkItem, ProjectInput } from "../../types/portfolio";
import { Button } from "../../components/ui/Button";
import { ErrorNote, Field, TextArea, TextInput, inputClass } from "../../components/ui/Field";
import Icon from "../../components/ui/Icon";
import Tag from "../../components/ui/Tag";

type Asset = { key: string; kind: "existing"; url: string } | { key: string; kind: "new"; file: File };

interface FormState {
  title: string;
  title_en: string;
  category: string;
  category_en: string;
  description: string;
  description_en: string;
  tags: string;
  links: LinkItem[];
  links_en: LinkItem[];
}

const EMPTY: FormState = {
  title: "",
  title_en: "",
  category: "",
  category_en: "",
  description: "",
  description_en: "",
  tags: "",
  links: [],
  links_en: [],
};

const parseTags = (s: string) =>
  Array.from(
    new Set(
      s
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    ),
  );
const cleanLinks = (links: LinkItem[]) => links.map((l) => ({ label: l.label.trim(), url: l.url.trim() })).filter((l) => l.label && l.url);
const orNull = (s: string) => (s.trim() ? s.trim() : null);

const AssetThumb = ({ asset }: { asset: Asset }) => {
  const url = useMemo(() => (asset.kind === "new" ? (asset.file.type.startsWith("image/") ? URL.createObjectURL(asset.file) : null) : isImageUrl(asset.url) ? asset.url : null), [asset]);
  useEffect(() => () => {
    if (asset.kind === "new" && url) URL.revokeObjectURL(url);
  }, [asset, url]);
  const ext = (asset.kind === "new" ? asset.file.name : asset.url).split(".").pop()?.split("?")[0] ?? "";
  return url ? (
    <img src={url} alt="" className="size-full object-cover" />
  ) : (
    <span className="flex size-full items-center justify-center text-xs font-bold uppercase text-ink-3">{ext}</span>
  );
};

const LinksEditor = ({ label, value, onChange }: { label: string; value: LinkItem[]; onChange: (v: LinkItem[]) => void }) => (
  <fieldset className="flex flex-col gap-3">
    <legend className="mb-3 text-sm font-semibold">{label}</legend>
    {value.length === 0 && <p className="text-sm text-ink-3">Nessun link.</p>}
    {value.map((link, i) => (
      <div key={i} className="grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto]">
        <input
          aria-label="Etichetta"
          placeholder="Etichetta (es. Web app)"
          value={link.label}
          onChange={(e) => onChange(value.map((l, j) => (j === i ? { ...l, label: e.target.value } : l)))}
          className={`${inputClass} col-span-2 sm:col-span-1`}
        />
        <input
          aria-label="URL"
          type="url"
          placeholder="https://"
          value={link.url}
          onChange={(e) => onChange(value.map((l, j) => (j === i ? { ...l, url: e.target.value } : l)))}
          className={inputClass}
        />
        <button
          type="button"
          aria-label="Rimuovi link"
          onClick={() => onChange(value.filter((_, j) => j !== i))}
          className="inline-flex size-[52px] items-center justify-center border-2 border-rule text-ink-2 hover:border-danger hover:text-danger"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
    ))}
    <button type="button" onClick={() => onChange([...value, { label: "", url: "" }])} className="inline-flex items-center gap-2 self-start text-sm font-semibold hover:underline">
      <Icon name="plus" size={16} /> Aggiungi link
    </button>
  </fieldset>
);

const ProjectFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = `${isEdit ? "Modifica" : "Nuovo"} progetto — Admin CPDESIGN`;
    if (!id) return;
    let active = true;
    fetchProject(id)
      .then((p) => {
        if (!active) return;
        if (!p) {
          setError("Progetto non trovato.");
        } else {
          setForm({
            title: p.title,
            title_en: p.title_en ?? "",
            category: p.category,
            category_en: p.category_en ?? "",
            description: p.description ?? "",
            description_en: p.description_en ?? "",
            tags: (p.tags ?? []).join(", "),
            links: p.links ?? [],
            links_en: p.links_en ?? [],
          });
          setAssets(projectImages(p).map((url) => ({ key: url, kind: "existing", url })));
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(errorMessage(err));
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const set = <K extends keyof FormState>(key: K) => (value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));
  const text = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key)(e.target.value as never);

  const addFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setAssets((a) => [...a, ...files.map((file) => ({ key: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`, kind: "new" as const, file }))]);
    e.target.value = "";
  };

  const move = (index: number, to: number) =>
    setAssets((a) => {
      const next = [...a];
      const [item] = next.splice(index, 1);
      next.splice(to, 0, item);
      return next;
    });

  const removeAsset = (asset: Asset) => {
    setAssets((a) => a.filter((x) => x.key !== asset.key));
    if (asset.kind === "existing") setRemoved((r) => [...r, asset.url]);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    let uploaded: string[] = [];
    try {
      const newFiles = assets.filter((a): a is Extract<Asset, { kind: "new" }> => a.kind === "new").map((a) => a.file);
      uploaded = await uploadAssets(newFiles);
      let u = 0;
      const urls = assets.map((a) => (a.kind === "existing" ? a.url : uploaded[u++]));
      const input: ProjectInput = {
        title: form.title.trim(),
        title_en: orNull(form.title_en),
        category: form.category.trim(),
        category_en: orNull(form.category_en),
        description: orNull(form.description),
        description_en: orNull(form.description_en),
        tags: parseTags(form.tags),
        links: cleanLinks(form.links),
        links_en: cleanLinks(form.links_en),
        image_urls: urls,
        image_url: urls.find(isImageUrl) ?? urls[0] ?? null,
      };
      if (id) await updateProject(id, input);
      else await createProject(input);
      await removeAssets(removed);
      invalidateProjects();
      navigate("/admin");
    } catch (err) {
      if (uploaded.length) await removeAssets(uploaded);
      setError(`Salvataggio non riuscito: ${errorMessage(err)}`);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4" aria-busy="true">
        <div className="skeleton h-12 w-1/2" />
        <div className="skeleton h-96" />
      </div>
    );
  }

  const tags = parseTags(form.tags);

  return (
    <form onSubmit={submit} className="mx-auto flex max-w-5xl flex-col gap-14 pb-28">
      <div>
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-2 hover:text-ink">
          <Icon name="arrowLeft" size={16} /> Tutti i progetti
        </Link>
        <h1 className="mt-4 text-headline font-bold">{isEdit ? "Modifica progetto" : "Nuovo progetto"}</h1>
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}

      <section aria-labelledby="sec-text" className="border-t-4 border-ink pt-6">
        <h2 id="sec-text" className="text-title font-bold">
          Testi
        </h2>
        <p className="mt-1 text-ink-3">L'inglese è facoltativo: se manca, il sito mostra l'italiano.</p>
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          <p className="hidden text-sm font-bold text-ink-3 md:block">Italiano</p>
          <p className="hidden text-sm font-bold text-ink-3 md:block">English</p>
          <Field label="Titolo">
            <TextInput required value={form.title} onChange={text("title")} />
          </Field>
          <Field label="Title (EN)">
            <TextInput value={form.title_en} onChange={text("title_en")} />
          </Field>
          <Field label="Categoria" hint="Usata anche come filtro nell'archivio.">
            <TextInput required value={form.category} onChange={text("category")} />
          </Field>
          <Field label="Category (EN)">
            <TextInput value={form.category_en} onChange={text("category_en")} />
          </Field>
          <Field label="Descrizione">
            <TextArea rows={10} value={form.description} onChange={text("description")} />
          </Field>
          <Field label="Description (EN)">
            <TextArea rows={10} value={form.description_en} onChange={text("description_en")} />
          </Field>
        </div>
      </section>

      <section aria-labelledby="sec-tags" className="border-t-4 border-ink pt-6">
        <h2 id="sec-tags" className="text-title font-bold">
          Tag
        </h2>
        <div className="mt-6 flex flex-col gap-4">
          <Field label="Tag separati da virgola" hint="Esempio: React, TypeScript, Figma.">
            <TextInput value={form.tags} onChange={text("tags")} placeholder="Figma, React, TypeScript" />
          </Field>
          {tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label="Anteprima tag">
              {tags.map((t) => (
                <Tag key={t} label={t} />
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="sec-links" className="border-t-4 border-ink pt-6">
        <h2 id="sec-links" className="text-title font-bold">
          Link
        </h2>
        <p className="mt-1 text-ink-3">Il primo link diventa il pulsante principale nella pagina del progetto.</p>
        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2">
          <LinksEditor label="Link (IT)" value={form.links} onChange={set("links")} />
          <LinksEditor label="Links (EN)" value={form.links_en} onChange={set("links_en")} />
        </div>
      </section>

      <section aria-labelledby="sec-media" className="border-t-4 border-ink pt-6">
        <h2 id="sec-media" className="text-title font-bold">
          Immagini e file
        </h2>
        <p className="mt-1 text-ink-3">La prima immagine è la copertina. Usa le frecce per cambiare l'ordine.</p>

        {assets.length > 0 && (
          <ol className="mt-8 flex flex-col border-t border-rule">
            {assets.map((asset, i) => (
              <li key={asset.key} className="grid grid-cols-[72px_1fr_auto] items-center gap-4 border-b border-rule py-3">
                <div className="aspect-[4/3] overflow-hidden bg-paper-2">
                  <AssetThumb asset={asset} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[0.9375rem] font-medium">
                    {asset.kind === "new" ? asset.file.name : decodeURIComponent(asset.url.split("/").pop() ?? "")}
                  </p>
                  <p className="text-sm text-ink-3">
                    {i === 0 ? "Copertina" : `Posizione ${i + 1}`}
                    {asset.kind === "new" && " · da caricare"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="Sposta su" disabled={i === 0} onClick={() => move(i, i - 1)} className="inline-flex size-10 items-center justify-center hover:bg-paper-2 disabled:opacity-30">
                    <Icon name="arrowUp" size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="Sposta giù"
                    disabled={i === assets.length - 1}
                    onClick={() => move(i, i + 1)}
                    className="inline-flex size-10 rotate-180 items-center justify-center hover:bg-paper-2 disabled:opacity-30"
                  >
                    <Icon name="arrowUp" size={18} />
                  </button>
                  <button type="button" aria-label="Rimuovi" onClick={() => removeAsset(asset)} className="inline-flex size-10 items-center justify-center text-danger hover:bg-danger/10">
                    <Icon name="close" size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}

        <label className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-rule px-6 py-10 text-center transition-colors duration-150 hover:border-ink hover:bg-paper-2/60 focus-within:border-ink">
          <Icon name="plus" size={24} />
          <span className="font-semibold">Aggiungi immagini o file</span>
          <span className="text-sm text-ink-3">Immagini, PDF e altri documenti. Puoi selezionarne più di uno.</span>
          <input type="file" multiple onChange={addFiles} className="sr-only" />
        </label>
        {removed.length > 0 && <p className="mt-3 text-sm text-ink-3">{removed.length} file verranno eliminati dallo storage al salvataggio.</p>}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-4 px-4 py-3 sm:px-6">
          <Link to="/admin" className="text-sm font-semibold hover:underline">
            Annulla
          </Link>
          <Button type="submit" disabled={saving} icon={saving ? undefined : "arrowRight"}>
            {saving ? "Salvataggio…" : isEdit ? "Salva modifiche" : "Pubblica progetto"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProjectFormPage;
