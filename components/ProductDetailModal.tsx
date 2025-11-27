import React, { useState } from 'react';
import { X, ShoppingBag, Wand2, Save, Plus, Minus, Star, Users, Clock, Coffee, Cookie, Dice5 } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import { editProductImage } from '../services/ai';

interface ProductDetailModalProps {
    product: Product;
    onClose: () => void;
}

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

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
    const { addToCart } = useCart();
    const { updateProductImage } = useProducts();
    const [quantity, setQuantity] = useState(1);

    // AI Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editPrompt, setEditPrompt] = useState('');
    const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(product);

    const handleAiEdit = async () => {
        if (!currentProduct || !editPrompt) return;
        setIsGenerating(true);

        try {
            const imageSource = generatedPreview || currentProduct.image;
            let blob: Blob;

            if (imageSource.startsWith('data:')) {
                const res = await fetch(imageSource);
                blob = await res.blob();
            } else {
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
            alert("Errore durante la generazione.");
            setIsGenerating(false);
        }
    };

    const saveNewCover = () => {
        if (currentProduct && generatedPreview) {
            updateProductImage(currentProduct.id, generatedPreview);
            setCurrentProduct({ ...currentProduct, image: generatedPreview });
            setIsEditing(false);
            setGeneratedPreview(null);
            setEditPrompt('');
            alert("Nuova copertina salvata nel database!");
        }
    };

    const incrementQty = () => setQuantity(q => q + 1);
    const decrementQty = () => setQuantity(q => Math.max(1, q - 1));

    return (
        <div className="fixed inset-0 z-50 md:flex md:items-center md:justify-center md:p-4 bg-white md:bg-black/50 md:backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full h-full md:h-auto md:border-4 border-black md:shadow-neo-lg max-w-5xl md:w-full relative flex flex-col md:flex-row md:max-h-[95vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white border-2 border-black p-1 hover:bg-red-500 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Image Side */}
                <div className="md:w-1/2 border-b-2 md:border-b-0 md:border-r-2 border-black relative bg-gray-100 min-h-[400px]">
                    {generatedPreview ? (
                        <img src={generatedPreview} className="w-full h-full object-cover" alt="Generated" />
                    ) : (
                        <ProductImageWithFallback product={currentProduct} className="w-full h-full object-cover" />
                    )}

                    {isGenerating && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-black uppercase animate-pulse">
                            Generazione Magia...
                        </div>
                    )}
                </div>

                {/* Info Side */}
                <div className="md:w-1/2 p-10 flex flex-col">
                    <h2 className="text-5xl font-black uppercase mb-2 leading-none">{currentProduct.name}</h2>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-black text-neo-violet">
                            {currentProduct.price === 0 ? 'Free to Play' : `€${currentProduct.price.toFixed(2)}`}
                        </span>
                        <span className="px-3 py-1 bg-neo-yellow border-2 border-black text-xs font-bold uppercase shadow-neo-sm">
                            {currentProduct.category}
                        </span>
                    </div>

                    <p className="font-medium text-gray-700 mb-8 leading-relaxed text-lg border-l-4 border-gray-300 pl-4">
                        {currentProduct.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {currentProduct.category === ProductCategory.GAME && (
                            <>
                                <div className="border-2 border-black p-3 bg-neo-bg shadow-neo-sm">
                                    <p className="text-xs font-bold uppercase text-gray-500">Giocatori</p>
                                    <p className="font-black flex items-center gap-2 text-lg"><Users className="w-5 h-5" /> {currentProduct.players}</p>
                                </div>
                                <div className="border-2 border-black p-3 bg-neo-bg shadow-neo-sm">
                                    <p className="text-xs font-bold uppercase text-gray-500">Durata</p>
                                    <p className="font-black flex items-center gap-2 text-lg"><Clock className="w-5 h-5" /> {currentProduct.duration}</p>
                                </div>
                            </>
                        )}
                        <div className="border-2 border-black p-3 bg-neo-bg shadow-neo-sm">
                            <p className="text-xs font-bold uppercase text-gray-500">Valutazione</p>
                            <p className="font-black flex items-center gap-2 text-lg"><Star className="w-5 h-5 fill-neo-yellow" /> {currentProduct.rating}/5</p>
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
                                addToCart(currentProduct, quantity);
                                onClose();
                            }}
                            className="w-full bg-neo-lime border-2 border-black py-4 font-black uppercase text-xl shadow-neo hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
                        >
                            <ShoppingBag className="w-6 h-6" /> Aggiungi al Carrello
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
