
import { Check, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function CheckInButton({ isChecked, onClick, type = 'standard', colorTheme = 'rose' }) {
    // Logic for display state
    const isComplete = type === 'protein' ? isChecked >= 2 : isChecked;
    const isPartial = type === 'protein' && isChecked === 1;

    const baseClasses = "group relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 transform active:scale-95 shadow-lg shadow-black/40";

    // Dynamic color classes based on theme (using inline styles for specific colors might be better for gradients, but using Tailwind classes for now)
    // We'll trust the parent to pass specific color classes or we use a map.
    // Actually, let's use a simple map for now.

    const getColors = () => {
        if (isComplete) return "bg-gradient-to-br from-rose-500 to-rose-700 text-white hover:shadow-rose-900/50";
        if (isPartial) return "bg-stone-800 border-2 border-rose-500/50 text-rose-400 hover:border-rose-500";
        return "bg-stone-800 hover:bg-stone-700 text-stone-500 hover:text-rose-400";
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onClick={onClick}
                className={twMerge(baseClasses, getColors())}
            >
                <div className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                    {isComplete ? (
                        <Check size={40} strokeWidth={3} className="animate-in zoom-in spin-in-90 duration-300" />
                    ) : (
                        <ArrowRight size={40} strokeWidth={3} />
                    )}
                </div>

                {/* Glow effect */}
                {isComplete && (
                    <div className="absolute inset-0 rounded-full bg-rose-500/50 blur-xl animate-pulse" />
                )}
            </button>

            <span className="text-sm font-medium text-stone-400">
                {isComplete ? "Completed!" : isPartial ? "1/2 Done" : "Check In"}
            </span>
        </div>
    );
}
