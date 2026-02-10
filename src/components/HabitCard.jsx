
import { format } from 'date-fns';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function HabitCard({ habit, data = {}, onClick }) {
    // Determine today's status
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayValue = data[todayStr];

    // Check if habit is completed for today
    const isCompleted = habit.type === 'protein' ? (todayValue >= 2) : !!todayValue;
    const isPartial = habit.type === 'protein' && todayValue === 1;

    // Theme colors mapping for the card
    const themes = {
        rose: "border-l-rose-500 hover:bg-rose-900/20",
        purple: "border-l-purple-500 hover:bg-purple-900/20",
        peach: "border-l-orange-400 hover:bg-orange-900/20",
        indigo: "border-l-indigo-500 hover:bg-indigo-900/20",
    };

    const themeClass = themes[habit.colorTheme] || themes.rose;

    return (
        <button
            type="button"
            onClick={onClick}
            className={twMerge(
                "w-full text-left p-4 rounded-xl bg-cozy-base border border-stone-800 shadow-md transition-all duration-200 group relative overflow-hidden",
                "border-l-4",
                themeClass
            )}
        >
            <div className="flex justify-between items-center relative z-10">
                <span className="font-semibold text-lg text-cozy-text group-hover:text-white transition-colors">
                    {habit.name}
                </span>

                {/* Status Indicator */}
                <div className={clsx(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    isCompleted ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" :
                        isPartial ? "bg-yellow-400 animate-pulse" : "bg-stone-700"
                )} />
            </div>

            {/* Subtle background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]" />
        </button>
    );
}
