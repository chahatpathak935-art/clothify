import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const CATEGORIES = ["outerwear", "tops", "bottoms", "dresses", "footwear", "accessories"];
const SIZES = ["XS", "S", "M", "L", "XL"];
const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get("category") || "";
  const gender = searchParams.get("gender") || "";
  const size = searchParams.get("size") || "";
  const sort = searchParams.get("sort") || "newest";
  const keyword = searchParams.get("keyword") || "";
  const page = Number(searchParams.get("page") || 1);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", {
        params: { category, gender, size, sort, keyword, page, limit: 12 },
      });
      setProducts(data.products);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, gender, size, sort, keyword, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl mb-2">
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products"}
          </h1>
          <p className="text-sm text-mute">{loading ? "Loading..." : `${products.length} shown`}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="text-sm border border-line px-4 py-2 md:hidden"
          >
            Filters
          </button>
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="text-sm border border-line px-3 py-2 bg-paper"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-10">
        {/* Filters sidebar */}
        <aside className={`${filtersOpen ? "block" : "hidden"} md:block space-y-8`}>
          <div>
            <p className="text-xs tracking-wide text-mute mb-3">Category</p>
            <div className="space-y-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => updateParam("category", category === c ? "" : c)}
                  className={`block text-sm capitalize ${
                    category === c ? "text-ink font-medium" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-wide text-mute mb-3">Gender</p>
            <div className="space-y-2">
              {["men", "women", "unisex"].map((g) => (
                <button
                  key={g}
                  onClick={() => updateParam("gender", gender === g ? "" : g)}
                  className={`block text-sm capitalize ${
                    gender === g ? "text-ink font-medium" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-wide text-mute mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => updateParam("size", size === s ? "" : s)}
                  className={`w-9 h-9 text-xs border ${
                    size === s ? "border-ink bg-ink text-paper" : "border-line text-ink/70"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {(category || gender || size || keyword) && (
            <button
              onClick={() => setSearchParams({})}
              className="text-xs underline underline-offset-4 text-mute"
            >
              Clear all filters
            </button>
          )}
        </aside>

        {/* Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-stone" />
                  <div className="h-3 bg-stone mt-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-2xl mb-2">No products found</p>
              <p className="text-sm text-mute">Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-14">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateParam("page", String(i + 1))}
                      className={`w-9 h-9 text-sm border ${
                        page === i + 1 ? "border-ink bg-ink text-paper" : "border-line"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
