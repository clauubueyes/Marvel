import Image from "next/image";
import Link from "next/link";
import styles from "../Search.module.css";
import type { SearchResult } from "@/types/search";

export function SearchResultCard({ result }: { result: SearchResult }) {
  return (
    <Link
      href={result.href}
      className={`${styles["search-result-card"]} search-result-${result.type.toLocaleLowerCase("es")}`}
    >
      <div>
        <Image
          src={result.image}
          alt=""
          fill
          sizes="(max-width: 560px) 90vw, (max-width: 1000px) 44vw, 29vw"
        />
      </div>
      <article>
        <span>{result.type}</span>
        <small>{result.subtitle}</small>
        <h2>{result.title}</h2>
        <p>{result.description}</p>
        <b>ABRIR EXPEDIENTE ↗</b>
      </article>
    </Link>
  );
}
