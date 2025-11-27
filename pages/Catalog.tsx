import React, { useState, useMemo } from 'react';
import { Search, Star, ShoppingBag, Dice5, Coffee, Cookie } from 'lucide-react';
import { ProductCategory, Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import ProductDetailModal from '../components/ProductDetailModal';

const ProductImageWithFallback = ({ product, className }: { product: Product, className: string }) => {
  const [error, setError] = useState(false);

  if (error || !product.image) {
    return (
      <div className={`${className} bg-gray-200 flex flex-col items-center justify-center border-b-2 border-black`}>
        <div className="bg-white p-4 border-2 border-black rounded-full mb-2 shadow-neo-sm">
          {product.category === ProductCategory.GAME && <Dice5 className="w-8 h-8 text-gray-400" />}
          {product.category === ProductCategory.DRINK && <Coffee className="w-8 h-8 text-gray-400" />}
          {product.category === ProductCategory.SNACK && <Cookie className="w-8 h-8 text-gray-400" />}
        </div>
        <span className="font-black uppercase text-gray-400 text-xs">{product.category}</span>
      </div>
    );
  }

  return (
    <img
      src={product.image}
      alt={product.name}
      onError={() => setError(true)}
      className={className}
    />
  );
};

const Catalog: React.FC = () => {
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesTab = activeTab === 'all' || product.category === activeTab;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32"> {/* Extra padding for cart bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 border-b-2 border-black pb-8">
        <div>
          <h1 className="text-5xl font-black text-black mb-2">CATALOGO</h1>
          <p className="text-lg font-bold bg-neo-cyan inline-block px-2 border-2 border-black">
            LOOT, POZIONI E ARTEFATTI
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', ProductCategory.GAME, ProductCategory.DRINK, ProductCategory.SNACK] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 border-2 border-black font-bold uppercase transition-all shadow-neo-sm ${activeTab === tab
                  ? 'bg-neo-violet text-white -translate-y-1 shadow-neo'
                  : 'bg-white text-black hover:bg-neo-lime'
                }`}
            >
              {tab === 'all' ? 'TUTTI' : tab + 'S'}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-12">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-black" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 border-2 border-black text-lg font-bold placeholder-gray-500 focus:outline-none focus:ring-0 focus:bg-neo-yellow focus:shadow-neo transition-all bg-white"
          placeholder="CERCA NEGLI ARCHIVI..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white border-2 border-black shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="relative aspect-square border-b-2 border-black overflow-hidden bg-gray-100">
              <ProductImageWithFallback
                product={product}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <div className="absolute top-2 right-2 bg-neo-yellow border-2 border-black px-2 py-1 flex items-center gap-1 text-sm font-black shadow-neo-sm">
                <Star className="w-4 h-4 fill-black" /> {product.rating}
              </div>
            </div>

            <div className="p-5 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-black uppercase leading-tight">{product.name}</h3>
                <span className="bg-neo-pink text-white border-2 border-black px-2 py-0.5 text-sm font-bold shadow-neo-sm -rotate-2">
                  {product.price === 0 ? 'FREE' : `€${product.price.toFixed(2)}`}
                </span>
              </div>

              <p className="text-gray-700 font-medium text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {product.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] uppercase font-black px-2 py-1 bg-black text-white">
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                className="mt-4 w-full bg-white border-2 border-black py-2 font-bold uppercase hover:bg-neo-lime transition-colors flex justify-center items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Aggiungi
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Catalog;