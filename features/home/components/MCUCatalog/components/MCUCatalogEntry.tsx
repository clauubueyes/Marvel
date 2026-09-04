import Image from "next/image";
import Link from "next/link";
import { HOME_CATALOG_IMAGES } from "@/constants/homeCatalog";
import { mcuCatalog } from "@/data/mcuCatalog";
import { getTitleDetails } from "@/data/titles";
import type { MCUEntry } from "@/types/title";
import { getTitleImage } from "@/utils/titleImages";

const catalogTitlesBySlug = new Map(
  mcuCatalog.map((item) => [item.slug, item.title]),
);

function CatalogConnections({
  label,
  slugs,
}: {
  label: string;
  slugs: string[];
}) {
  if (!slugs.length) return null;

  return (
    <div className="catalog-connections">
      <span>{label}</span>
      <ul>
        {slugs.slice(0, 3).map((slug) => (
          <li key={slug}>
            <Link href={`/titulos/${slug}`}>
              {catalogTitlesBySlug.get(slug) ?? slug.replaceAll("-", " ")}{" "}
              <b>↗</b>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MCUCatalogEntry({ entry }: { entry: MCUEntry }) {
  const details = getTitleDetails(entry.slug);

  return (
    <details className="catalog-entry watch-entry" data-reveal>
      <summary>
        <span className="watch-order">
          {String(entry.order).padStart(2, "0")}
        </span>
        <div
          className={`catalog-art catalog-art-${entry.continuity.toLowerCase().replaceAll(" ", "-")} has-image`}
          aria-hidden="true"
        >
          <Image
            src={HOME_CATALOG_IMAGES[entry.title] ?? getTitleImage(entry.slug)}
            alt=""
            fill
            sizes="(max-width: 560px) 80vw, 245px"
            onError={(event) => {
              event.currentTarget.hidden = true;
              event.currentTarget.parentElement?.classList.remove("has-image");
            }}
          />
          <b>
            {entry.title
              .split(" ")
              .slice(0, 2)
              .map((word) => word[0])
              .join("")}
          </b>
          <small>{entry.phase}</small>
          <span>
            MARVEL STUDIOS · ARCHIVO {String(entry.order).padStart(2, "0")}
          </span>
        </div>
        <div className="watch-main">
          <small>
            {entry.period} · {entry.type}
          </small>
          <h3>{entry.title}</h3>
          <p>{entry.event}</p>
          <b>{entry.continuity}</b>
        </div>
        <span className="expand-label">
          <i>+</i> VER SUCESO
        </span>
      </summary>
      <div className="event-dossier catalog-event">
        <div className="catalog-event-overview">
          <span>DE QUÉ VA · SIN SPOILERS</span>
          <p>{details?.spoilerFreeSynopsis ?? entry.event}</p>
          <Link className="dossier-link" href={`/titulos/${entry.slug}`}>
            ABRIR EXPEDIENTE COMPLETO ↗
          </Link>
        </div>
        <div className="catalog-event-facts">
          <span>DATOS DE VISIONADO</span>
          <dl>
            <div>
              <dt>DURACIÓN</dt>
              <dd>{details?.runtime ?? entry.type}</dd>
            </div>
            <div>
              <dt>CLASIFICACIÓN</dt>
              <dd>{details?.certification ?? "SIN CLASIFICAR"}</dd>
            </div>
            <div>
              <dt>DÓNDE VER</dt>
              <dd>{details?.availability ?? "CONSULTAR EXPEDIENTE"}</dd>
            </div>
            <div>
              <dt>CRONOLOGÍA</dt>
              <dd>{entry.period}</dd>
            </div>
          </dl>
        </div>
        <div className="catalog-event-links">
          <span>CONEXIONES MCU</span>
          {details &&
          (details.watchBefore.length || details.watchAfter.length) ? (
            <>
              <CatalogConnections
                label="VER ANTES"
                slugs={details.watchBefore}
              />
              <CatalogConnections
                label="CONTINUAR CON"
                slugs={details.watchAfter}
              />
            </>
          ) : (
            <p className="catalog-connections-empty">
              Esta historia puede verse de forma independiente dentro de{" "}
              {entry.continuity.toLowerCase()}.
            </p>
          )}
        </div>
      </div>
    </details>
  );
}
