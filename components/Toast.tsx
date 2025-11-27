import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000); // Auto close after 4 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-neo-lime/90 border-neo-lime text-black';
            case 'error':
                return 'bg-red-100/90 border-red-500 text-red-800';
            case 'info':
                return 'bg-neo-cyan/90 border-neo-cyan text-black';
            default:
                return 'bg-white border-black text-black';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'error':
                return <AlertCircle className="w-5 h-5" />;
            case 'info':
                return <Info className="w-5 h-5" />;
        }
    };

    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 shadow-neo-lg backdrop-blur-md animate-in slide-in-from-top-2 duration-300 ${getStyles()}`}>
            {getIcon()}
            <span className="font-bold text-sm">{message}</span>
            <button onClick={onClose} className="ml-2 hover:bg-black/10 p-1 rounded-full transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
