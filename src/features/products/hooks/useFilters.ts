import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { parseFilterQuery, toFilterQuery } from "../products.logic.ts";
import type { Filters } from "../products.types.ts";
import { getQueryString, replaceQueryString } from "../../../lib/page.ts";

// The shop's search, category and sort. They live in the address bar too
// (index.html?q=tote&category=Bags&sort=price-asc), so a link, a bookmark or a
// reload shows the same list.
export function useFilters(): [Filters, Dispatch<SetStateAction<Filters>>] {
  // The address is text anyone can edit: parseFilterQuery checks it, and an
  // unknown value gives the default. Read once, when the page opens.
  const [filters, setFilters] = useState<Filters>(() =>
    parseFilterQuery(getQueryString()),
  );

  // Keeps the address bar in step with the filters, without a reload and
  // without adding Back steps (replaceQueryString uses history.replaceState)
  useEffect(() => {
    replaceQueryString(toFilterQuery(filters));
  }, [filters]);

  return [filters, setFilters];
}
