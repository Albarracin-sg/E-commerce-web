import type { Category, ProductFilters } from "../../types/catalog";

interface Props {
  categories: Category[];
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
}

export default function CatalogFilters({ categories, filters, onFilterChange }: Props) {
  return (
    <aside className="space-y-5 rounded-xl border bg-white p-4">
      <div>
        <h3 className="mb-2 text-sm font-bold uppercase text-slate-700">Categorías</h3>
        <div className="space-y-1">
          <button
            className={`w-full rounded-md px-3 py-2 text-left text-sm ${
              !filters.categoryId ? "bg-rose-100 text-rose-700" : "hover:bg-slate-100"
            }`}
            onClick={() => onFilterChange({ categoryId: undefined })}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                filters.categoryId === c.id ? "bg-rose-100 text-rose-700" : "hover:bg-slate-100"
              }`}
              onClick={() => onFilterChange({ categoryId: c.id })}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-bold uppercase text-slate-700">Búsqueda</h3>
        <label htmlFor="catalog-filter-search" className="sr-only">
          Buscar productos por nombre o descripción
        </label>
        <input
          id="catalog-filter-search"
          type="search"
          value={filters.search ?? ""}
          onChange={(e) => onFilterChange({ search: e.target.value || undefined })}
          placeholder="Nombre o descripción"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={filters.featured === true}
          onChange={(e) => onFilterChange({ featured: e.target.checked ? true : undefined })}
        />
        Solo destacados
      </label>
    </aside>
  );
}
