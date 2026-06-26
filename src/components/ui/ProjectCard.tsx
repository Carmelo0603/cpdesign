import { type Project } from "../../types/portfolio";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const { t, i18n } = useTranslation();
  const formattedIndex = String(index + 1).padStart(2, "0");

  const currentLang = i18n.language || "it";
  const isEn = currentLang.startsWith("en");

  // SWITCH DINAMICO DEI DATI
  const displayTitle = isEn && project.title_en ? project.title_en : project.title;
  const displayCategory = isEn && project.category_en ? project.category_en : project.category;

  return (
    <article className="border-8 border-dark flex flex-col bg-light relative group shadow-brutal hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-200">
      <div className="absolute top-0 left-0 bg-neon text-dark font-heading font-black text-2xl px-4 py-2 border-r-8 border-b-8 border-dark z-10">
        {formattedIndex}
      </div>

      <div className="h-64 md:h-80 border-b-8 border-dark bg-dark overflow-hidden relative">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={displayTitle}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-dark text-neon font-heading font-black text-6xl opacity-50">
            {displayTitle.substring(0, 2)}
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-grow">
        <h2 className="font-heading font-black text-2xl md:text-3xl uppercase text-dark mb-2 leading-tight">{displayCategory}</h2>
        <h3 className="font-body font-bold text-lg md:text-xl uppercase text-dark mb-6 leading-snug">{displayTitle}</h3>

        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
          {project.tags.map((tag, i) => (
            <span key={i} className="border-4 border-dark px-3 py-1 text-sm font-heading font-black uppercase bg-light text-dark">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t-8 border-dark -mx-6 md:-mx-8 -mb-6 md:-mb-8">
          <Link
            to={`/progetti/${project.id}`}
            className="flex justify-between items-center bg-light text-dark font-heading font-black text-xl uppercase px-6 md:px-8 py-4 hover:bg-dark hover:text-neon transition-colors w-full"
          >
            <span>{index === 0 ? t("card_view") : t("card_details")}</span>
            <span className="text-4xl leading-none">&rarr;</span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
