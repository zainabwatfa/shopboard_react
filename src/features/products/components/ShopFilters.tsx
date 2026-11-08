import type { Ref } from "react";
import { parseCategory, parseSortKey } from "../products.logic.ts";
import type { Filters } from "../products.types.ts";
import { SearchField } from "../../../shared/components/SearchField.tsx";
import { SelectField } from "../../../shared/components/SelectField.tsx";
import type { SelectOption } from "../../../shared/components/SelectField.tsx";

export interface ShopFiltersProps {
  filters: Filters;
  // Gets a function from the current filters to the new ones, so a quick
  // series of changes always builds on the latest filters
  onChange: (update: (current: Filters) => Filters) => void;
  // True while there is nothing to search (the products failed to load)
  disabled: boolean;
  searchRef: Ref<HTMLInputElement>;
}

const categoryOptions: readonly SelectOption[] = [
  { value: "all", label: "All categories" },
  { value: "Bags", label: "Bags" },
  { value: "Shoes", label: "Shoes" },
  { value: "Accessories", label: "Accessories" },
];

const sortOptions: readonly SelectOption[] = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A to Z" },
];

// The shop's search box, category filter and sort. The selects give plain
// text, so parseCategory / parseSortKey (products.logic.ts) check it.
export function ShopFilters({
  filters,
  onChange,
  disabled,
  searchRef,
}: ShopFiltersProps) {
  return (
    <div className="filters" role="search">
      <SearchField
        ref={searchRef}
        id="search"
        label="Search"
        placeholder="Try “leather” or “bag”"
        value={filters.query}
        disabled={disabled}
        onChange={(query) => onChange((current) => ({ ...current, query }))}
      />
      <SelectField
        id="category-filter"
        label="Category"
        options={categoryOptions}
        value={filters.category}
        disabled={disabled}
        onChange={(value) =>
          onChange((current) => ({
            ...current,
            category: parseCategory(value),
          }))
        }
      />
      <SelectField
        id="sort"
        label="Sort by"
        options={sortOptions}
        value={filters.sortKey}
        disabled={disabled}
        onChange={(value) =>
          onChange((current) => ({ ...current, sortKey: parseSortKey(value) }))
        }
      />
    </div>
  );
}
