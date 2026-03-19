import React, { useMemo, useState } from 'react';
import { Search, Star, ShoppingBag, Dice5, Coffee, Cookie, Package, Sparkles, ScrollText } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import ProductDetailModal from '../components/ProductDetailModal';

const ProductImageWithFallback = ({ product, className }: { product: Product; className: string }) => {
  const [error, setError] = useState(false);

  if (error || !product.image) {
    return (
      <div className={`${className} flex flex-col items-center justify-center bg-gray-200`}>
        <div className="mb-2 border-2 border-black bg-white p-3 shadow-neo-sm">
          {product.category === ProductCategory.GAME && <Dice5 className="h-8 w-8 text-gray-400" />}
          {product.category === ProductCategory.DRINK && <Coffee className="h-8 w-8 text-gray-400" />}
          {product.category === ProductCategory.SNACK && <Cookie className="h-8 w-8 text-gray-400" />}
        </div>
        <span className="text-[10px] font-black uppercase text-gray-400">{product.category}</span>
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

const categoryMeta: Record<ProductCategory | 'all', { label: string; accent: string }> = {
  all: { label: 'Tutti', accent: 'bg-neo-violet text-white' },
  [ProductCategory.GAME]: { label: 'Games', accent: 'bg-neo-pink text-white' },
  [ProductCategory.DRINK]: { label: 'Drinks', accent: 'bg-neo-cyan text-black' },
  [ProductCategory.SNACK]: { label: 'Snacks', accent: 'bg-neo-yellow text-black' }
};

const Catalog: React.FC = () => {
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesTab = activeTab === 'all' || product.category === activeTab;
      const query = searchQuery.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(query) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query));
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, products]);

  const visibleCategoryCount = useMemo(() => {
    return {
      games: products.filter((product) => product.category === ProductCategory.GAME).length,
      drinks: products.filter((product) => product.category === ProductCategory.DRINK).length,
      snacks: products.filter((product) => product.category === ProductCategory.SNACK).length
    };
  }, [products]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-32 sm:px-6 lg:px-8 lg:py-12 lg:pb-32">
      <section className="relative overflow-hidden border-4 border-black bg-white shadow-neo">
        <div className="absolute right-0 top-0 h-28 w-28 translate-x-8 -translate-y-8 rotate-12 border-[12px] border-neo-pink/30 bg-neo-pink/10" />
        <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 border-[10px] border-neo-cyan/30 bg-neo-cyan/10" />

        <div className="relative grid gap-6 px-5 py-6 md:grid-cols-[1.2fr_0.8fr] md:px-8 md:py-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 border-2 border-black bg-neo-yellow px-3 py-1 text-xs font-black uppercase tracking-[0.2em] shadow-neo-sm">
              <ScrollText className="h-4 w-4" />
              Archivio del Bancone
            </div>

            <h1 className="text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-5xl md:text-6xl">
              Catalogo
            </h1>

            <div className="mt-4 inline-flex border-2 border-black bg-neo-cyan px-3 py-2 text-base font-black uppercase shadow-neo-sm sm:text-lg">
              Loot, Pozioni e Artefatti
            </div>

            <p className="mt-5 max-w-3xl text-sm font-medium leading-relaxed text-gray-700 sm:text-base">
              Sfoglia l&apos;archivio come una bacheca di bottino: giochi da tavolo, drink e snack. Filtra per categoria, cerca per nome o tag e apri la scheda per vedere tutti i dettagli prima di aggiungere qualcosa al tuo ordine.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
            <div className="border-2 border-black bg-neo-pink p-4 text-white shadow-neo-sm">
              <div className="mb-2 flex items-center justify-between">
                <Dice5 className="h-5 w-5" />
                <span className="text-3xl font-black leading-none">{visibleCategoryCount.games}</span>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.18em]">Games</p>
            </div>

            <div className="border-2 border-black bg-neo-cyan p-4 text-black shadow-neo-sm">
              <div className="mb-2 flex items-center justify-between">
                <Coffee className="h-5 w-5" />
                <span className="text-3xl font-black leading-none">{visibleCategoryCount.drinks}</span>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.18em]">Drinks</p>
            </div>

            <div className="border-2 border-black bg-neo-yellow p-4 text-black shadow-neo-sm">
              <div className="mb-2 flex items-center justify-between">
                <Cookie className="h-5 w-5" />
                <span className="text-3xl font-black leading-none">{visibleCategoryCount.snacks}</span>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.18em]">Snacks</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 border-4 border-black bg-white shadow-neo">
        <div className="border-b-2 border-black px-4 py-4 md:px-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Navigazione catalogo</p>
              <h2 className="mt-1 text-2xl font-black uppercase sm:text-3xl">Scegli corsia e setaccia l&apos;archivio</h2>
            </div>
            <div className="inline-flex items-center gap-2 self-start border-2 border-black bg-zinc-100 px-3 py-2 text-xs font-black uppercase">
              <Package className="h-4 w-4" />
              {filteredProducts.length} elementi visibili
            </div>
          </div>

          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max gap-2">
              {(['all', ProductCategory.GAME, ProductCategory.DRINK, ProductCategory.SNACK] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 border-2 border-black font-black uppercase whitespace-nowrap transition-all shadow-neo-sm ${
                    activeTab === tab
                      ? `${categoryMeta[tab].accent} -translate-y-1 shadow-neo`
                      : 'bg-white text-black hover:bg-neo-lime'
                  }`}
                >
                  {categoryMeta[tab].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-4 md:px-6 md:py-5">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-black" />
            </div>
            <input
              type="text"
              className="block w-full border-2 border-black bg-white py-4 pl-12 pr-4 text-base font-bold placeholder-gray-500 transition-all focus:bg-neo-yellow focus:outline-none focus:ring-0"
              placeholder="Cerca per nome, atmosfera o tag..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>
      </section>

      {filteredProducts.length === 0 ? (
        <div className="mt-8 border-4 border-black bg-white p-10 text-center shadow-neo">
          <h2 className="text-3xl font-black uppercase">Nessun reperto trovato</h2>
          <p className="mx-auto mt-3 max-w-2xl font-medium text-gray-600">
            Prova a cambiare categoria o a cercare con un termine diverso. Il catalogo filtra nome e tag.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group flex cursor-pointer overflow-hidden border-4 border-black bg-white shadow-neo transition-all duration-200 hover:-translate-y-1 hover:shadow-neo-lg"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative h-auto w-28 shrink-0 border-r-2 border-black bg-gray-100 sm:w-32">
                <ProductImageWithFallback
                  product={product}
                  className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute right-2 top-2 flex items-center gap-1 border-2 border-black bg-neo-yellow px-2 py-1 text-xs font-black shadow-neo-sm">
                  <Star className="h-3.5 w-3.5 fill-black" />
                  {product.rating}
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-2 inline-flex border border-black bg-zinc-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em]">
                      {categoryMeta[product.category].label}
                    </div>
                    <h3 className="text-lg font-black uppercase leading-tight sm:text-xl">{product.name}</h3>
                  </div>
                  <span className="shrink-0 border-2 border-black bg-neo-pink px-2 py-1 text-sm font-bold text-white shadow-neo-sm">
                    {product.price === 0 ? 'FREE' : `€${product.price.toFixed(2)}`}
                  </span>
                </div>

                <p className="mb-4 line-clamp-2 text-sm font-medium text-gray-700">{product.description}</p>

                <div className="mt-auto">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {product.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-black px-2 py-1 text-[10px] font-black uppercase text-white">
                        {tag}
                      </span>
                    ))}
                    {product.tags.length === 0 && (
                      <span className="border border-black bg-zinc-100 px-2 py-1 text-[10px] font-black uppercase text-gray-500">
                        Nessun tag
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="flex-1 border-2 border-black bg-white px-3 py-2 font-black uppercase transition-colors hover:bg-zinc-100"
                    >
                      Apri scheda
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        addToCart(product, 1);
                      }}
                      className="flex-1 border-2 border-black bg-neo-lime px-3 py-2 font-black uppercase transition-colors hover:bg-neo-yellow flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Aggiungi
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

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
