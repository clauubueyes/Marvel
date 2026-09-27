"use client";

import { CalendarExportActions } from "@/features/titles/planner/components/CalendarExportActions";
import type { TitleDetails, TitleDossier } from "@/types/title";

/**
 * `TitleHero` es un componente de servidor, asi que la exportacion a calendario entra
 * como isla cliente con un unico dato: el titulo que ya recibe la ficha.
 */
export function TitleCalendarExport({
  title,
  details,
}: {
  title: TitleDossier;
  details?: TitleDetails;
}) {
  return (
    <CalendarExportActions
      titles={[
        {
          id: title.slug,
          title: title.title,
          url: `/titulos/${title.slug}`,
          runtime: details?.runtime,
          type: title.type,
        },
      ]}
    />
  );
}
