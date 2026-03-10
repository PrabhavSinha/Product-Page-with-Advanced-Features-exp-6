import React from 'react';

/**
 * ProductModal — presentational component for product detail view.
 * Receives `product` prop and `onClose` callback.
 * This slot is prepared for future nested routing (e.g. /products/:id).
 */
export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  const {
    title, description, price, brand, category,
    images, rating, stock, discountPercentage, tags
  } = product;

  const discountedPrice = price - (price * discountPercentage) / 100;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-inner">
          <div className="modal-gallery">
            <img src={images?.[0] || product.thumbnail} alt={title} />
          </div>

          <div className="modal-details">
            <span className="modal-category">{category}</span>
            {brand && <p className="modal-brand">{brand}</p>}
            <h2 className="modal-title">{title}</h2>
            <p className="modal-desc">{description}</p>

            {tags?.length > 0 && (
              <div className="modal-tags">
                {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
              </div>
            )}

            <div className="modal-price-block">
              <span className="modal-price">${discountedPrice.toFixed(2)}</span>
              {discountPercentage > 0 && (
                <>
                  <span className="modal-price-orig">${price.toFixed(2)}</span>
                  <span className="modal-discount">−{Math.round(discountPercentage)}% OFF</span>
                </>
              )}
            </div>

            <div className="modal-stats">
              <div className="stat">
                <span className="stat-label">Rating</span>
                <span className="stat-val">{rating} / 5</span>
              </div>
              <div className="stat">
                <span className="stat-label">Stock</span>
                <span className="stat-val">{stock} units</span>
              </div>
            </div>

            <p className="modal-route-hint">
              🔗 Future route: <code>/products/{product.id}</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
