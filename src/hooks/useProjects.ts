import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { errorMessage, fetchProject, fetchProjects, localize } from "../lib/projects";
import type { Project } from "../types/portfolio";

type Status = "loading" | "ready" | "error";

// Small in-memory cache so navigating between pages does not refetch and flash skeletons.
let cache: Project[] | null = null;

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>(cache ?? []);
  const [status, setStatus] = useState<Status>(cache ? "ready" : "loading");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    fetchProjects()
      .then((data) => {
        if (!active) return;
        cache = data;
        setProjects(data);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(errorMessage(err));
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setStatus("loading");
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  const update = useCallback((next: Project[]) => {
    cache = next;
    setProjects(next);
  }, []);

  return { projects, setProjects: update, status, error, retry };
};

export const useLocalizedProjects = () => {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith("en") ? "en" : "it";
  const state = useProjects();
  const localized = useMemo(() => state.projects.map((p) => localize(p, lang)), [state.projects, lang]);
  return { ...state, localized };
};

export const useProject = (id: string | undefined) => {
  const cached = id ? cache?.find((p) => p.id === id) : undefined;
  const [project, setProject] = useState<Project | null>(cached ?? null);
  const [status, setStatus] = useState<Status | "missing">(cached ? "ready" : "loading");

  useEffect(() => {
    if (!id) return;
    let active = true;
    fetchProject(id)
      .then((data) => {
        if (!active) return;
        setProject(data);
        setStatus(data ? "ready" : "missing");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, [id]);

  return { project, status };
};

export const invalidateProjects = () => {
  cache = null;
};
