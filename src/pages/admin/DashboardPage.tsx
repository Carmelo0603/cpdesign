import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { deleteProject, errorMessage, fetchProjects, localize, optimizeProjectImages } from "../../lib/projects";
import type { Project } from "../../types/portfolio";
import { Button, ButtonLink } from "../../components/ui/Button";
import { ErrorNote } from "../../components/ui/Field";
import Icon from "../../components/ui/Icon";
import Img from "../../components/ui/Img";

const dateFmt = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "short", year: "numeric" });

const DashboardPage = () => {
  const { projects, setProjects, status, error, retry } = useProjects();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [optimizing, setOptimizing] = useState<string | null>(null);

  const optimizeAll = async () => {
    if (!window.confirm("Convertire in WebP (max 2400px) tutte le immagini PNG/JPG dei progetti? Gli originali verranno sostituiti.")) return;
    setActionError(null);
    let saved = 0;
    try {
      for (const [i, project] of projects.entries()) {
        setOptimizing(`Ottimizzo ${i + 1} di ${projects.length}: ${project.title}`);
        saved += await optimizeProjectImages(project);
      }
      setProjects(await fetchProjects());
      setOptimizing(`Fatto: risparmiati ${(saved / 1024 / 1024).toFixed(1)} MB.`);
    } catch (err) {
      setOptimizing(null);
      setActionError(`Ottimizzazione interrotta: ${errorMessage(err)}`);
    }
  };

  useEffect(() => {
    document.title = "Progetti — Admin CPDESIGN";
  }, []);

  const remove = async (project: Project) => {
    if (!window.confirm(`Eliminare "${project.title}"? Verranno cancellati anche tutti i file caricati. L'operazione non si può annullare.`)) return;
    setBusyId(project.id);
    setActionError(null);
    try {
      await deleteProject(project);
      setProjects(projects.filter((p) => p.id !== project.id));
    } catch (err) {
      setActionError(`Eliminazione non riuscita: ${errorMessage(err)}`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-headline font-bold">Progetti</h1>
          {status === "ready" && <p className="mt-2 text-ink-2 tabular-nums">{projects.length} pubblicati, dal più recente</p>}
        </div>
        <ButtonLink to="/admin/progetti/nuovo" icon="plus">
          Nuovo progetto
        </ButtonLink>
      </div>

      {actionError && <ErrorNote>{actionError}</ErrorNote>}
      {status === "ready" && projects.length > 0 && (
        <div className="flex flex-col gap-3 bg-paper-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.9375rem] text-ink-2" role="status">
            {optimizing ?? "Immagini pesanti rallentano il sito. I nuovi caricamenti sono già ottimizzati; per quelli vecchi usa questo pulsante una volta."}
          </p>
          <Button variant="outline" onClick={optimizeAll} disabled={Boolean(optimizing) && !optimizing?.startsWith("Fatto")}>
            Ottimizza immagini
          </Button>
        </div>
      )}
      {status === "error" && (
        <div className="flex flex-col items-start gap-4">
          <ErrorNote>Impossibile leggere i progetti: {error}</ErrorNote>
          <Button variant="outline" onClick={retry}>
            Riprova
          </Button>
        </div>
      )}

      {status === "loading" && (
        <div className="flex flex-col gap-2" aria-busy="true">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="skeleton h-20" />
          ))}
        </div>
      )}

      {status === "ready" && projects.length === 0 && (
        <div className="flex flex-col items-start gap-4 border-t-4 border-ink py-10">
          <p className="text-lg text-ink-2">Ancora nessun progetto. Il primo comparirà subito in home come “Ultimo progetto”.</p>
          <ButtonLink to="/admin/progetti/nuovo" variant="outline" icon="plus">
            Crea il primo progetto
          </ButtonLink>
        </div>
      )}

      {status === "ready" && projects.length > 0 && (
        <ul className="border-t-4 border-ink">
          {projects.map((project) => {
            const p = localize(project, "it");
            const busy = busyId === project.id;
            return (
              <li key={project.id} className={`grid grid-cols-[64px_1fr] items-center gap-4 border-b border-rule py-4 sm:grid-cols-[80px_1fr_auto] sm:gap-6 ${busy ? "opacity-50" : ""}`}>
                <div className="aspect-[4/3] overflow-hidden bg-paper-2">
                  {p.cover && <Img src={p.cover} sizes="80px" alt="" loading="lazy" className="size-full object-cover" />}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold">{p.title}</p>
                  <p className="truncate text-sm text-ink-3">
                    {p.category} · {dateFmt.format(new Date(p.createdAt))}
                    {!project.title_en && <span className="ml-2 text-danger">manca la traduzione EN</span>}
                  </p>
                </div>
                <div className="col-span-2 flex items-center gap-5 text-sm font-semibold sm:col-span-1">
                  <Link to={`/admin/progetti/modifica/${project.id}`} className="underline-offset-4 hover:underline">
                    Modifica
                  </Link>
                  <a href={`/progetti/${project.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
                    Apri <Icon name="arrowUpRight" size={14} />
                  </a>
                  <button type="button" disabled={busy} onClick={() => remove(project)} className="text-danger underline-offset-4 hover:underline disabled:opacity-50">
                    {busy ? "Elimino…" : "Elimina"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DashboardPage;
