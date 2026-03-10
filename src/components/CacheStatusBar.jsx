import React from 'react';

/**
 * CacheStatusBar — presentational component.
 * Shows fetch stats from the closure-based cache.
 */
export default function CacheStatusBar({ stats, productCount }) {
  const { fetchCount, lastFetchTime, fromCache } = stats;

  return (
    <div className="cache-bar">
      <div className="cache-item">
        <span className="cache-dot" style={{ background: fromCache ? '#e8ff47' : '#ff6b6b' }} />
        <span>{fromCache ? 'Served from cache' : 'Fresh API fetch'}</span>
      </div>
      <div className="cache-item">
        <span className="cache-label">API calls made:</span>
        <strong>{fetchCount}</strong>
      </div>
      {lastFetchTime && (
        <div className="cache-item">
          <span className="cache-label">Last fetch:</span>
          <strong>{lastFetchTime}</strong>
        </div>
      )}
      <div className="cache-item">
        <span className="cache-label">Products loaded:</span>
        <strong>{productCount}</strong>
      </div>
    </div>
  );
}
