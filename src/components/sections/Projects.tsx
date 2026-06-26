import { useMemo } from "react";
import { useProjects } from "../../hooks/useProjects";
import ProjectCard from "../ui/ProjectCard";
import { useTranslation } from "react-i18next";

const Projects = () => {
  const { projects, loading, error } = useProjects();
  const { t } = useTranslation();

  // Logica per estrarre un progetto casuale
  const featuredProject = useMemo(() => {
    if (projects.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * projects.length);
    return projects[randomIndex];
  }, [projects]);

  return (
    <section id="progetti" className="border-b-8 border-dark bg-light flex flex-col md:flex-row">
      {/* Colonna Titolo (Sinistra) */}
      <div className="w-full md:w-1/3 p-6 md:p-12 border-b-8 md:border-b-0 md:border-r-8 border-dark bg-neon flex flex-col justify-between">
        <h2 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter text-dark leading-none">{t("projects_title")}</h2>
        <div className="mt-8 md:mt-0">
          <span className="font-heading font-black text-3xl md:text-5xl text-dark border-4 border-dark px-4 py-2 bg-light inline-block shadow-brutal">
            [02]
          </span>
        </div>
      </div>

      {/* Colonna Card (Destra) */}
      <div className="w-full md:w-2/3 p-6 md:p-12 bg-light flex items-center justify-center">
        {loading && (
          <div className="font-heading font-black text-2xl uppercase animate-pulse border-4 border-dark p-6 text-center bg-dark text-neon w-full">
            {t("projects_sync")}
          </div>
        )}

        {error && (
          <div className="font-heading font-black text-xl text-red-600 border-4 border-red-600 p-6 uppercase bg-red-100 w-full">
            {t("projects_err")}
            {error}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="font-heading font-black text-xl uppercase border-4 border-dark p-6 text-center w-full">{t("projects_empty")}</div>
        )}

        {/* Renderizziamo il progetto in evidenza */}
        {!loading && !error && featuredProject && (
          <div className="w-full max-w-lg">
            <ProjectCard project={featuredProject} index={0} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
