import React from 'react';

/**
 * ProductCard — pure presentational (dumb) component.
 * Receives all data via props. Has no internal state or side effects.
 */
export default function ProductCard({ product, onClick }) {
  const { title, price, brand, category, thumbnail, rating, stock, discountPercentage } = product;

  const discountedPrice = price - (price * discountPercentage) / 100;
  const stars = Math.round(rating);

  return (
    <article className="product-card" onClick={() => onClick?.(product)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(product)}>

      <div className="card-image-wrap">
        <img src={thumbnail} alt={title} loading="lazy" />
        {discountPercentage > 0 && (
          <span className="badge-discount">−{Math.round(discountPercentage)}%</span>
        )}
        <span className="badge-category">{category}</span>
      </div>

      <div className="card-body">
        {brand && <p className="card-brand">{brand}</p>}
        <h3 className="card-title">{title}</h3>

        <div className="card-meta">
          <div className="card-rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < stars ? 'star filled' : 'star'}>★</span>
            ))}
            <span className="rating-value">{rating?.toFixed(1)}</span>
          </div>
          <span className={`stock-badge ${stock < 10 ? 'low' : ''}`}>
            {stock < 10 ? `Only ${stock} left` : `In stock`}
          </span>
        </div>

        <div className="card-price-row">
          <span className="price-current">${discountedPrice.toFixed(2)}</span>
          {discountPercentage > 0 && (
            <span className="price-original">${price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
