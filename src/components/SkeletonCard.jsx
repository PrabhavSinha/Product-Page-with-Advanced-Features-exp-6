import React from 'react';

/**
 * SkeletonCard — dumb component that mimics ProductCard layout
 * while data is loading. Pure CSS shimmer animation.
 */
export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img shimmer" />
      <div className="skeleton-body">
        <div className="skeleton-line short shimmer" />
        <div className="skeleton-line shimmer" />
        <div className="skeleton-line medium shimmer" />
        <div className="skeleton-line short shimmer" style={{ marginTop: '12px' }} />
      </div>
    </div>
  );
}
