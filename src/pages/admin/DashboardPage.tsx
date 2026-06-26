import { useProjects } from "../../hooks/useProjects";
import { Link } from "react-router-dom";
import { supabase } from "../../config/supabase";

const DashboardPage = () => {
  // Ora estraiamo anche setProjects dal nostro hook
  const { projects, setProjects, loading, error } = useProjects();

  const handleDelete = async (id: string, imageUrl?: string) => {
    // Un minimo di safety net brutalista
    const isConfirmed = window.confirm("Sei sicuro di voler disintegrare questo progetto? L'azione è irreversibile.");
    if (!isConfirmed) return;

    try {
      // 1. Pulizia dello Storage (se esiste un'immagine)
      if (imageUrl) {
        // Estraiamo il percorso relativo del file dall'URL pubblico
        const path = imageUrl.split("portfolio-assets/")[1];
        if (path) {
          const { error: storageError } = await supabase.storage.from("portfolio-assets").remove([path]);

          if (storageError) console.error("Errore pulizia bucket:", storageError);
        }
      }

      // 2. Eliminazione dal Database
      const { error: dbError } = await supabase.from("projects").delete().eq("id", id);

      if (dbError) throw dbError;

      // 3. Aggiornamento UI ottimistico (rimuovo l'elemento senza ricaricare la pagina)
      setProjects(projects.filter((project) => project.id !== id));
    } catch (err: any) {
      alert(`[ERRORE CRITICO]: ${err.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-8 border-dark pb-6 mb-12 gap-6">
        <h1 className="font-heading font-black text-6xl md:text-8xl uppercase tracking-tighter text-dark leading-[0.85] m-0">
          Gestione
          <br />
          Progetti
        </h1>
        <Link
          to="/admin/progetti/nuovo"
          className="bg-dark text-neon font-heading font-black text-2xl uppercase px-8 py-4 border-4 border-dark shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all whitespace-nowrap"
        >
          + Nuovo Progetto
        </Link>
      </div>

      {loading && (
        <div className="font-heading font-black text-3xl uppercase bg-dark text-neon p-8 border-8 border-dark animate-pulse">
          Sincronizzazione dati in corso...
        </div>
      )}
      {error && <div className="font-heading font-black text-2xl uppercase bg-red-500 text-dark p-8 border-8 border-dark">[ERRORE DI LETTURA]: {error}</div>}

      {!loading && !error && (
        <div className="flex flex-col gap-4">
          {projects.length === 0 ? (
            <div className="font-heading font-black text-2xl uppercase border-8 border-dark p-12 text-center bg-light">
              Nessun progetto rilevato. Inizia ad aggiungere materiale.
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="border-4 border-dark p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-light hover:bg-dark hover:text-light transition-colors group"
              >
                <div className="flex flex-col items-start gap-2">
                  <span className="font-heading font-black text-sm bg-neon text-dark px-2 border-2 border-dark">{project.category}</span>
                  <span className="font-heading font-black text-3xl md:text-4xl uppercase leading-none">{project.title}</span>
                </div>

                <div className="flex gap-6 mt-6 md:mt-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/admin/progetti/modifica/${project.id}`} className="font-heading font-black text-xl uppercase underline hover:text-neon">
                    Modifica
                  </Link>

                  {/* Il Bottone Cablato */}
                  <button
                    onClick={() => handleDelete(project.id, project.image_url)}
                    className="font-heading font-black text-xl uppercase underline text-red-500 hover:text-red-400"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
