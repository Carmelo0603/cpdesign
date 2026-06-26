import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../config/supabase";
import { type Project } from "../types/portfolio";
import { useTranslation } from "react-i18next";

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  // FIX: applichiamo il fallback anche qui per sicurezza
  const currentLang = i18n.language || "it";
  const isEn = currentLang.startsWith("en");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const fetchSingleProject = async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();

      if (data) setProject(data);
      if (error) console.error(error);
      setLoading(false);
    };

    if (id) fetchSingleProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-heading font-black text-4xl uppercase animate-pulse">
        Estrazione logica di progetto...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-heading font-black text-6xl text-red-500 mb-8 uppercase">Progetto non trovato</h1>
        <Link to="/progetti" className="font-heading font-black text-2xl uppercase border-4 border-dark p-4 hover:bg-neon hover:shadow-brutal transition-all">
          &larr; Torna all'archivio
        </Link>
      </div>
    );
  }

  // --- LOGICA DI TRADUZIONE DINAMICA ---
  // Se siamo in EN e il campo EN esiste, usalo. Altrimenti usa l'IT.
  const displayTitle = isEn && project.title_en ? project.title_en : project.title;
  const displayCategory = isEn && project.category_en ? project.category_en : project.category;
  const displayDescription =
    isEn && project.description_en ? project.description_en : project.description || "Nessuna descrizione strutturale fornita per questo progetto.";
  const displayLinks = isEn && project.links_en && project.links_en.length > 0 ? project.links_en : project.links || [];

  const images = project.image_urls && project.image_urls.length > 0 ? project.image_urls : project.image_url ? [project.image_url] : [];

  const nextImage = () => {
    setIsImageLoading(true);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setIsImageLoading(true);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-light flex flex-col w-full">
      <div className="border-b-8 border-dark p-6 md:px-12 md:py-16 bg-neon flex flex-col items-start gap-4">
        <span className="font-heading font-black text-2xl md:text-3xl text-light bg-dark px-4 py-1 border-4 border-dark uppercase shadow-brutal">
          {displayCategory}
        </span>
        <h1 className="font-heading font-black text-5xl md:text-8xl uppercase tracking-tighter text-dark leading-[0.85] m-0">{displayTitle}</h1>
      </div>

      <div className="flex flex-col lg:flex-row w-full flex-grow">
        <div className="w-full lg:w-2/3 border-b-8 lg:border-b-0 lg:border-r-8 border-dark bg-dark flex flex-col relative min-h-[50vh]">
          {images.length > 0 ? (
            <>
              <div className="flex-grow relative overflow-hidden flex items-center justify-center bg-dark">
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-dark">
                    <span className="font-heading font-black text-3xl md:text-5xl text-neon uppercase animate-pulse border-4 border-neon p-4">
                      [ LETTURA ASSET ]
                    </span>
                  </div>
                )}

                <img
                  src={images[currentImageIndex]}
                  alt={`${displayTitle} - Asset ${currentImageIndex + 1}`}
                  onLoad={() => setIsImageLoading(false)}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${isImageLoading ? "opacity-0" : "opacity-100"}`}
                />

                {images.length > 1 && !isImageLoading && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute top-0 left-0 w-1/2 h-full z-20 cursor-w-resize bg-transparent focus:outline-none active:bg-light/5 transition-colors"
                      title="Immagine precedente"
                      aria-label="Immagine precedente"
                    />
                    <button
                      onClick={nextImage}
                      className="absolute top-0 right-0 w-1/2 h-full z-20 cursor-e-resize bg-transparent focus:outline-none active:bg-light/5 transition-colors"
                      title="Immagine successiva"
                      aria-label="Immagine successiva"
                    />
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex justify-between items-center bg-light border-t-8 border-dark p-4 md:p-6 font-heading font-black text-xl md:text-2xl uppercase">
                  <button
                    onClick={prevImage}
                    className="hover:text-neon hover:bg-dark hover:translate-x-[-4px] px-6 py-2 border-4 border-dark transition-all shadow-brutal hover:shadow-none"
                  >
                    &larr; Prev
                  </button>
                  <span className="bg-dark text-neon px-6 py-2 border-4 border-dark">
                    [ {currentImageIndex + 1} / {images.length} ]
                  </span>
                  <button
                    onClick={nextImage}
                    className="hover:text-neon hover:bg-dark hover:translate-x-[4px] px-6 py-2 border-4 border-dark transition-all shadow-brutal hover:shadow-none"
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neon opacity-20 flex-grow">
              <span className="font-heading font-black text-6xl uppercase text-center px-4">
                Nessun asset
                <br />
                visivo allegato
              </span>
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/3 p-6 md:p-12 flex flex-col bg-light">
          <Link to="/progetti" className="font-heading font-black text-xl uppercase text-dark mb-12 hover:text-neon underline">
            &larr; {isEn ? "Projects Archive" : "Archivio Progetti"}
          </Link>

          <h3 className="font-heading font-black text-3xl uppercase text-dark mb-6 border-b-4 border-dark pb-2">
            {isEn ? "Brief & Solution" : "Brief & Soluzione"}
          </h3>

          <div className="font-body text-xl font-bold  leading-tight text-justify whitespace-pre-wrap mb-12 flex-grow">{displayDescription}</div>

          <div className="mt-auto">
            <h3 className="font-heading font-black text-2xl uppercase text-dark mb-4">Stack & Tags</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag, index) => (
                <span key={index} className="border-4 border-dark px-3 py-1 font-heading font-black uppercase text-sm bg-neon text-dark">
                  {tag}
                </span>
              ))}
            </div>

            {displayLinks.length > 0 && (
              <div className="flex flex-col gap-4">
                {displayLinks.map((linkItem, index) => (
                  <a
                    key={index}
                    href={linkItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`block w-full text-center font-heading font-black text-2xl uppercase p-6 border-4 border-dark shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all ${
                      index === 0 ? "bg-dark text-neon" : "bg-light text-dark hover:bg-dark hover:text-light"
                    }`}
                  >
                    {linkItem.label} &rarr;
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
