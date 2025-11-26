import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Clock, Users, X, ShoppingBag, Wand2, Save, RotateCcw, Plus, Minus, Dice5, Coffee, Cookie } from 'lucide-react';
import { ProductCategory, Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import { editProductImage } from '../services/ai';

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
  const { products, updateProductImage } = useProducts();
  const [activeTab, setActiveTab] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modal State
  const [quantity, setQuantity] = useState(1);

  // AI Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesTab = activeTab === 'all' || product.category === activeTab;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, products]);

  const openModal = (product: Product) => {
      setSelectedProduct(product);
      setQuantity(1); // Reset quantity
      setGeneratedPreview(null);
      setIsEditing(false);
  };

  const closeModal = () => {
      setSelectedProduct(null);
      setGeneratedPreview(null);
      setIsEditing(false);
      setEditPrompt('');
  };

  const handleAiEdit = async () => {
    if (!selectedProduct || !editPrompt) return;
    setIsGenerating(true);
    
    try {
        const imageSource = generatedPreview || selectedProduct.image;
        let blob: Blob;
        
        // Handle CORS/Base64/Url
        if (imageSource.startsWith('data:')) {
             const res = await fetch(imageSource);
             blob = await res.blob();
        } else {
             // Proxy logic or fallback for external URLs if CORS fails would be needed here in production.
             // For demo, we assume the URL is fetchable or we catch error.
             const res = await fetch(imageSource);
             blob = await res.blob();
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = (reader.result as string).split(',')[1];
            const mimeType = blob.type || 'image/jpeg';
            
            const result = await editProductImage(base64, mimeType, editPrompt);
            if (result) {
                setGeneratedPreview(`data:image/png;base64,${result}`);
            }
            setIsGenerating(false);
        };
        reader.readAsDataURL(blob);

    } catch (error) {
        console.error("Error generating image:", error);
        alert("Errore durante la generazione. Potrebbe essere un problema di CORS con l'immagine originale.");
        setIsGenerating(false);
    }
  };

  const saveNewCover = () => {
      if (selectedProduct && generatedPreview) {
          updateProductImage(selectedProduct.id, generatedPreview);
          setSelectedProduct({ ...selectedProduct, image: generatedPreview });
          setIsEditing(false);
          setGeneratedPreview(null);
          setEditPrompt('');
          alert("Nuova copertina salvata nel database!");
      }
  };

  const incrementQty = () => setQuantity(q => q + 1);
  const decrementQty = () => setQuantity(q => Math.max(1, q - 1));

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
              className={`px-6 py-2 border-2 border-black font-bold uppercase transition-all shadow-neo-sm ${
                activeTab === tab
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
            onClick={() => openModal(product)}
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
                {product.tags.slice(0,3).map(tag => (
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

      {/* Product Modal - ENLARGED */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white border-4 border-black shadow-neo-lg max-w-5xl w-full relative flex flex-col md:flex-row max-h-[95vh] overflow-y-auto">
                <button 
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-10 bg-white border-2 border-black p-1 hover:bg-red-500 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Image Side - Bigger */}
                <div className="md:w-1/2 border-b-2 md:border-b-0 md:border-r-2 border-black relative bg-gray-100 min-h-[400px]">
                    {generatedPreview ? (
                        <img src={generatedPreview} className="w-full h-full object-cover" alt="Generated" />
                    ) : (
                        <ProductImageWithFallback product={selectedProduct} className="w-full h-full object-cover" />
                    )}
                    
                    {isGenerating && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-black uppercase animate-pulse">
                            Generazione Magia...
                        </div>
                    )}
                </div>

                {/* Info Side */}
                <div className="md:w-1/2 p-10 flex flex-col">
                    <h2 className="text-5xl font-black uppercase mb-2 leading-none">{selectedProduct.name}</h2>
                    <div className="flex items-center gap-4 mb-6">
                         <span className="text-3xl font-black text-neo-violet">
                            {selectedProduct.price === 0 ? 'Free to Play' : `€${selectedProduct.price.toFixed(2)}`}
                         </span>
                         <span className="px-3 py-1 bg-neo-yellow border-2 border-black text-xs font-bold uppercase shadow-neo-sm">
                             {selectedProduct.category}
                         </span>
                    </div>
                    
                    <p className="font-medium text-gray-700 mb-8 leading-relaxed text-lg border-l-4 border-gray-300 pl-4">
                        {selectedProduct.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {selectedProduct.category === ProductCategory.GAME && (
                            <>
                                <div className="border-2 border-black p-3 bg-neo-bg shadow-neo-sm">
                                    <p className="text-xs font-bold uppercase text-gray-500">Giocatori</p>
                                    <p className="font-black flex items-center gap-2 text-lg"><Users className="w-5 h-5" /> {selectedProduct.players}</p>
                                </div>
                                <div className="border-2 border-black p-3 bg-neo-bg shadow-neo-sm">
                                    <p className="text-xs font-bold uppercase text-gray-500">Durata</p>
                                    <p className="font-black flex items-center gap-2 text-lg"><Clock className="w-5 h-5" /> {selectedProduct.duration}</p>
                                </div>
                            </>
                        )}
                        <div className="border-2 border-black p-3 bg-neo-bg shadow-neo-sm">
                            <p className="text-xs font-bold uppercase text-gray-500">Valutazione</p>
                            <p className="font-black flex items-center gap-2 text-lg"><Star className="w-5 h-5 fill-neo-yellow" /> {selectedProduct.rating}/5</p>
                        </div>
                    </div>

                    {/* AI Edit Section */}
                    <div className="mb-6 border-t-2 border-black pt-4">
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-xs font-black uppercase flex items-center gap-1 text-neo-pink mb-2 hover:underline"
                        >
                            <Wand2 className="w-3 h-3" /> Personalizza Copertina
                        </button>
                        
                        {isEditing && (
                            <div className="bg-neo-bg p-3 border-2 border-black shadow-neo-sm">
                                <textarea 
                                    className="w-full border-2 border-black p-2 text-sm font-bold mb-2 resize-none"
                                    rows={2}
                                    placeholder="Es. Rendila stile cyberpunk, aggiungi un drago..."
                                    value={editPrompt}
                                    onChange={(e) => setEditPrompt(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleAiEdit}
                                        disabled={isGenerating || !editPrompt}
                                        className="flex-1 bg-neo-pink text-white border-2 border-black py-2 font-bold text-xs uppercase hover:bg-black disabled:opacity-50"
                                    >
                                        Genera
                                    </button>
                                    {generatedPreview && (
                                        <button 
                                            onClick={saveNewCover}
                                            className="flex-1 bg-neo-lime text-black border-2 border-black py-2 font-bold text-xs uppercase hover:bg-white flex items-center justify-center gap-1"
                                        >
                                            <Save className="w-3 h-3" /> Salva
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Add to Cart Section */}
                    <div className="mt-auto flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex border-2 border-black bg-white">
                                <button onClick={decrementQty} className="px-4 py-2 hover:bg-gray-200 border-r-2 border-black font-bold text-lg"><Minus className="w-4 h-4" /></button>
                                <span className="w-16 text-center py-2 font-black text-lg">{quantity}</span>
                                <button onClick={incrementQty} className="px-4 py-2 hover:bg-gray-200 border-l-2 border-black font-bold text-lg"><Plus className="w-4 h-4" /></button>
                            </div>
                            <span className="font-bold text-gray-500 uppercase text-xs">Quantità</span>
                        </div>
                        
                        <button 
                            onClick={() => {
                                addToCart(selectedProduct, quantity);
                                closeModal();
                            }}
                            className="w-full bg-neo-lime border-2 border-black py-4 font-black uppercase text-xl shadow-neo hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
                        >
                            <ShoppingBag className="w-6 h-6" /> Aggiungi al Carrello
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;