import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../api/products';
import ProductGrid from '../components/product/ProductGrid';
import SearchBar from '../components/ui/SearchBar';
import FilterSidebar from '../components/ui/FilterSidebar';

function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (category) params.category = category;
    if (search) params.search = search;
    if (sort) params.sort = sort;

    getProducts(params)
      .then((res) => {
        setProducts(res.data.products);
        setTotalPages(res.data.pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, search, sort, page]);

  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <img src="/banner.png" alt="Sakura Carts Banner" className="w-full h-65 object-cover rounded-2xl mb-8"/>
      <h1 className="text-3xl font-serif font-bold text-dark mb-8">Shop</h1>

      {/* Search bar - visible first on mobile, hidden on desktop */}
      <div className="mb-4 md:hidden">
        <SearchBar
          value={search}
          onChange={(s) => updateParams('search', s)}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <FilterSidebar
            selectedCategory={category}
            onCategoryChange={(cat) => updateParams('category', cat)}
            sort={sort}
            onSortChange={(s) => updateParams('sort', s)}
          />
        </aside>

        {/* Main */}
        <div className="flex-1">
          <div className="mb-6 hidden md:block">
            <SearchBar
              value={search}
              onChange={(s) => updateParams('search', s)}
            />
          </div>

          <ProductGrid products={products} loading={loading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
