import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ui/ProjectCard";
import { useTranslation } from "react-i18next";

const ProjectsPage = () => {
  const { projects, loading, error } = useProjects();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-light flex flex-col w-full">
      <div className="border-b-8 border-dark p-6 md:px-12 md:py-16 bg-neon flex flex-col md:flex-row md:items-end justify-between gap-6">
        <h1 className="font-heading font-black text-6xl md:text-8xl lg:text-[9rem] uppercase tracking-tighter text-dark leading-[0.8] m-0">
          {t("projects_archive_1")}
          <br />
          {t("projects_archive_2")}
        </h1>
        <span className="font-heading font-black text-3xl md:text-5xl text-dark border-4 border-dark px-4 py-2 bg-light shadow-brutal inline-block">
          {t("projects_all")}
        </span>
      </div>

      {/* Griglia Completa */}
      <div className="p-6 md:p-12 flex-grow">
        {loading && (
          <div className="font-heading font-black text-4xl uppercase animate-pulse border-8 border-dark p-8 text-center bg-dark text-neon">
            Estrazione dati dal server...
          </div>
        )}

        {error && <div className="font-heading font-black text-3xl text-red-600 border-8 border-red-600 p-8 uppercase bg-red-100">Errore: {error}</div>}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
