import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, ChevronUp, ChevronDown, X, ArrowRight, Package, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartBar: React.FC = () => {
  const { items, removeFromCart, total, clearCart } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black shadow-[0_-4px_0_0_rgba(0,0,0,1)] z-50 transition-all duration-300 ${isExpanded ? 'h-96' : 'h-20'}`}>
      {/* Toggle Handle */}
      <div 
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-1 font-bold uppercase cursor-pointer flex items-center gap-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        <span>Il Tuo Bottino ({items.length})</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-full flex flex-col">
        {/* Bar Header (Always Visible) */}
        <div className="h-20 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-4">
             <div className="bg-neo-lime p-2 border-2 border-black animate-bounce">
                <ShoppingCart className="w-6 h-6" />
             </div>
             <div>
                 <p className="font-bold uppercase text-xs text-gray-500">Valore Totale</p>
                 <p className="text-2xl font-black">${total.toFixed(2)}</p>
             </div>
             {/* Mini Preview when collapsed */}
             {!isExpanded && (
                <div className="hidden md:flex items-center gap-2 ml-4 border-l-2 border-gray-200 pl-4 opacity-70">
                    <span className="text-xs font-bold uppercase">Contiene:</span>
                    {items.slice(0, 3).map(i => (
                        <span key={i.cartId} className="text-xs bg-gray-100 px-1 border border-black truncate max-w-[100px]">{i.name}</span>
                    ))}
                    {items.length > 3 && <span className="text-xs font-bold">+{items.length - 3}</span>}
                </div>
             )}
          </div>
          
          <div className="flex gap-2">
            {isExpanded && (
                <button 
                    onClick={() => {
                        if(confirm('Vuoi davvero svuotare il carrello?')) clearCart();
                    }}
                    className="bg-red-500 text-white border-2 border-black px-4 py-3 font-bold uppercase hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Svuota</span>
                </button>
            )}
            <button 
                onClick={() => navigate('/booking')}
                className="bg-neo-violet text-white border-2 border-black px-6 py-3 font-bold uppercase shadow-neo hover:bg-black transition-colors flex items-center gap-2"
            >
                Prenota Ora <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
            <div className="flex-1 overflow-y-auto p-4 bg-neo-bg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <div key={item.cartId} className="flex items-start gap-4 bg-white p-3 border-2 border-black shadow-neo-sm hover:translate-x-1 transition-transform">
                            <div className="w-16 h-16 border-2 border-black flex-shrink-0 relative">
                                <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                <div className="absolute -top-2 -left-2 bg-neo-yellow px-1 border border-black text-xs font-black">x{item.quantity}</div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold uppercase text-sm truncate">{item.name}</h4>
                                <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                                <p className="text-sm font-black mt-1 text-neo-violet">${item.price.toFixed(2)}</p>
                            </div>
                            <button 
                                onClick={() => removeFromCart(item.cartId)}
                                className="p-1 hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-black transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
                {items.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 flex items-center gap-2 text-sm text-blue-800 font-bold">
                        <Package className="w-4 h-4" />
                        Questi oggetti verranno preparati e serviti al tuo tavolo all'orario della prenotazione.
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default CartBar;