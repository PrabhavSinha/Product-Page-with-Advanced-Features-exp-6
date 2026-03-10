import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';
import ProductModal from './ProductModal';
import CacheStatusBar from './CacheStatusBar';

const CATEGORIES = ['all', 'smartphones', 'laptops', 'fragrances', 'skincare', 'groceries', 'furniture'];
const LIMITS = [10, 20, 30];

/**
 * ProductContainer — smart (container) component.
 *
 * Responsibilities:
 *  - Owns UI state: selected product, active category, limit
 *  - Delegates data fetching to `useProducts` hook
 *  - Passes data down to dumb/presentational components via props
 *  - Prepared for future routing: category and limit could map to URL params
 */
export default function ProductContainer() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [category, setCategory] = useState('all');
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');

  const { products, loading, error, refetch, cacheStats } = useProducts(category, limit);

  // Client-side search filter (no extra API call)
  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-top">
          <div>
            <span className="header-label">Experiment 6</span>
            <h1 className="header-title">Product<br />Store</h1>
          </div>
          <div className="header-desc">
            <p>Smart–dumb architecture · Caching · Race condition handling · Skeleton UI</p>
          </div>
        </div>

        {/* Controls */}
        <div className="controls">
          <input
            className="search-input"
            type="text"
            placeholder="Search products or brands..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <div className="tabs">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`tab ${category === cat ? 'active' : ''}`}
                    onClick={() => { setCategory(cat); setSearch(''); }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Limit</label>
              <div className="tabs">
                {LIMITS.map(l => (
                  <button
                    key={l}
                    className={`tab ${limit === l ? 'active' : ''}`}
                    onClick={() => setLimit(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <button className="refetch-btn" onClick={refetch} disabled={loading}>
              {loading ? <span className="spinner" /> : '↺'} Refetch
            </button>
          </div>
        </div>

        <CacheStatusBar stats={cacheStats} productCount={filtered.length} />
      </header>

      {/* Main content */}
      <main className="main">
        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
            <button onClick={refetch} className="retry-btn">Retry</button>
          </div>
        )}

        <div className="grid">
          {loading
            ? Array.from({ length: limit }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.length === 0
              ? <p className="empty">No products found for "{search}"</p>
              : filtered.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={setSelectedProduct}
                  />
                ))
          }
        </div>
      </main>

      {/* Product detail modal (future: nested route /products/:id) */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
