import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CatalogFilters from "../components/catalog/CatalogFilters";
import ProductGrid from "../components/catalog/ProductGrid";
import { useCategories, useProducts } from "../hooks/useCatalog";
import MainStoreLayout from "../layouts/MainStoreLayout";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("default");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const initialCategoryId = searchParams.get("categoryId");
  const initialSearch = searchParams.get("search");
  const initialFeatured = searchParams.get("featured");

  const { products, loading, error, filters, updateFilters, setPage } = useProducts({
    categoryId: initialCategoryId ? Number(initialCategoryId) : undefined,
    search: initialSearch ?? undefined,
    featured: initialFeatured === "true" ? true : undefined,
    page: 1,
    limit: 12,
  });

  const { categories } = useCategories();

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.categoryId) params.set("categoryId", String(filters.categoryId));
    if (filters.search) params.set("search", filters.search);
    if (filters.featured) params.set("featured", "true");
    setSearchParams(params);
  }, [filters.categoryId, filters.featured, filters.search, setSearchParams]);

  const sortedProducts = useMemo(() => {
    if (!products) return [];
    const data = [...products.data];
    if (sort === "price_asc") return data.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") return data.sort((a, b) => b.price - a.price);
    if (sort === "newest") {
      return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return data;
  }, [products, sort]);

  return (
    <MainStoreLayout>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-lg font-bold text-slate-600 hover:bg-slate-50"
              title={filtersOpen ? "Ocultar filtros" : "Mostrar filtros"}
              aria-label={filtersOpen ? "Ocultar filtros" : "Mostrar filtros"}
            >
              ☰
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Catálogo</h1>
              {filters.search && (
                <p className="text-sm text-slate-500">Resultados para: <b>{filters.search}</b></p>
              )}
            </div>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="default">Relevancia</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
            <option value="newest">Más recientes</option>
          </select>
        </div>

        <div className={`grid gap-5 ${filtersOpen ? "lg:grid-cols-[270px_minmax(0,1fr)]" : "grid-cols-1"}`}>
          {filtersOpen && (
            <CatalogFilters
              categories={categories}
              filters={filters}
              onFilterChange={updateFilters}
            />
          )}

          <div className="space-y-4">
            {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <ProductGrid
              products={sortedProducts}
              loading={loading}
              emptyMessage={
                filters.search
                  ? `No se encontraron productos para "${filters.search}".`
                  : "No hay productos para el filtro seleccionado."
              }
            />

            {products && products.totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  disabled={products.page === 1}
                  onClick={() => setPage(products.page - 1)}
                  className="rounded border px-3 py-2 text-sm disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-sm text-slate-700">
                  Página {products.page} de {products.totalPages}
                </span>
                <button
                  disabled={products.page === products.totalPages}
                  onClick={() => setPage(products.page + 1)}
                  className="rounded border px-3 py-2 text-sm disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainStoreLayout>
  );
}
