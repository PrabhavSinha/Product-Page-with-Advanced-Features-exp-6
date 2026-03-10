import React from 'react';
import ProductContainer from './components/ProductContainer';
import './App.css';

/**
 * App — root component.
 * In a future routing setup this would host <BrowserRouter> and <Routes>.
 * For now it simply renders the smart container.
 *
 * Prepared routing structure (commented):
 *   /               → ProductContainer (listing)
 *   /products/:id   → ProductDetail (detail, currently a modal)
 *   /category/:name → filtered ProductContainer
 */
export default function App() {
  return (
    <div className="app">
      <ProductContainer />
    </div>
  );
}
