
import { X } from 'lucide-react';
import { useEffect } from 'react';
import clsx from 'clsx';

export default function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="fixed inset-0"
                onClick={onClose}
                aria-hidden="true"
            />
            <div className="relative w-full max-w-lg bg-cozy-base border border-stone-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-stone-800/50 bg-stone-900/30">
                    <h2 className="text-xl font-bold text-cozy-text">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-stone-800 transition-colors text-stone-400 hover:text-cozy-text"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
