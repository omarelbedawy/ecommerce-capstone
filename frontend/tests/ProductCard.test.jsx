import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ProductCard from '../src/components/ProductCard';

const mockProduct = {
  id: 1,
  name: 'Test Headphones',
  price: 49.99,
  stock: 3,
  category: { name: 'Electronics' },
};

describe('ProductCard', () => {
  it('shows the product name and price', () => {
    render(
      <BrowserRouter>
        <ProductCard product={mockProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Headphones')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  it('shows an out of stock badge when stock is 0', () => {
    render(
      <BrowserRouter>
        <ProductCard product={{ ...mockProduct, stock: 0 }} />
      </BrowserRouter>
    );

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });
});
