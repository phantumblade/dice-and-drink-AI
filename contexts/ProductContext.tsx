import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import api from '../services/api';

interface ProductContextType {
  products: Product[];
  updateProductImage: (productId: string, newImageUrl: string) => void;
  getProduct: (productId: string) => Product | undefined;
  resetProducts: () => void;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("API returned non-array for products:", response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProductImage = (productId: string, newImageUrl: string) => {
    // TODO: Implement API update if needed
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, image: newImageUrl } : p
    ));
  };

  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const resetProducts = () => {
    fetchProducts();
  };

  return (
    <ProductContext.Provider value={{ products, updateProductImage, getProduct, resetProducts, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};