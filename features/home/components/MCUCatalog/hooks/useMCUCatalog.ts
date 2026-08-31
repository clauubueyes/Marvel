"use client";

import { useMemo, useState } from "react";
import { HOME_CATALOG_PAGE_SIZE } from "@/constants/homeCatalog";
import { mcuCatalog } from "@/data/mcuCatalog";
import type { MCUContinuity, MCUType } from "@/types/title";

export type MCUCatalogFilter = "TODO" | MCUType | MCUContinuity;

export function useMCUCatalog() {
  const [filter, setFilter] = useState<MCUCatalogFilter>("TODO");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(HOME_CATALOG_PAGE_SIZE);
  const visibleEntries = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    return mcuCatalog.filter((entry) => (filter === "TODO" || entry.type === filter || entry.continuity === filter) && (!normalized || `${entry.title} ${entry.period} ${entry.event}`.toLocaleLowerCase("es").includes(normalized)));
  }, [filter, query]);

  function changeFilter(next: MCUCatalogFilter) {
    setFilter(next);
    setVisibleCount(HOME_CATALOG_PAGE_SIZE);
  }

  function changeQuery(next: string) {
    setQuery(next);
    setVisibleCount(HOME_CATALOG_PAGE_SIZE);
  }

  return { changeFilter, changeQuery, displayedEntries: visibleEntries.slice(0, visibleCount), filter, loadMore: () => setVisibleCount((count) => count + HOME_CATALOG_PAGE_SIZE), query, visibleEntries };
}
