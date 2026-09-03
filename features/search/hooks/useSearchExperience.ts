"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchContent, searchIndex } from "@/services/searchService";
import type { SearchResult } from "@/types/search";
import { trackSearch } from "@/services/analytics";

export type SearchFilter = "TODO" | SearchResult["type"];

export function useSearchExperience(initialQuery: string) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<SearchFilter>("TODO");
  const deferredQuery = useDeferredValue(query);
  const allResults = searchContent(deferredQuery, filter);
  const results = deferredQuery.trim() ? allResults : allResults.slice(0, 12);
  const lastTrackedSearch = useRef("");
  const counts = {
    PERSONAJE: searchIndex.filter(({ type }) => type === "PERSONAJE").length,
    TÍTULO: searchIndex.filter(({ type }) => type === "TÍTULO").length,
    EVENTO: searchIndex.filter(({ type }) => type === "EVENTO").length,
    UNIVERSO: searchIndex.filter(({ type }) => type === "UNIVERSO").length,
    EQUIPO: searchIndex.filter(({ type }) => type === "EQUIPO").length,
  };

  useEffect(() => {
    const term = deferredQuery.trim();
    if (term.length < 2 || term === lastTrackedSearch.current) return;
    const timeout = window.setTimeout(() => {
      trackSearch(term, allResults.length);
      lastTrackedSearch.current = term;
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [allResults.length, deferredQuery]);

  function updateQuery(value: string) {
    setQuery(value);
    const params = new URLSearchParams();
    if (value.trim()) params.set("q", value.trim());
    router.replace(params.size ? `/buscar?${params}` : "/buscar", { scroll: false });
  }

  return { allResults, counts, deferredQuery, filter, query, results, setFilter, updateQuery };
}
