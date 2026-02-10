
import { useMemo } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    isSameMonth,
    addMonths,
    subMonths
} from 'date-fns';
import { twMerge } from 'tailwind-merge';

export default function Heatmap({ data = {}, colorTheme = 'rose', label }) {
    const today = new Date();
    const currentMonthStart = startOfMonth(today);

    // Generate dates for the specific month view
    const calendarDays = useMemo(() => {
        const startDate = startOfWeek(currentMonthStart);
        const endDate = endOfWeek(endOfMonth(currentMonthStart));

        return eachDayOfInterval({
            start: startDate,
            end: endDate,
        });
    }, [currentMonthStart]);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Theme Config (Tailwind classes)
    const themes = {
        rose: {
            active: "bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-900/50 text-white border-transparent",
            partial: "bg-rose-900/20 border-rose-500/30 text-rose-300",
            today: "ring-2 ring-rose-500 ring-offset-2 ring-offset-cozy-base",
        },
        purple: {
            active: "bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-900/50 text-white border-transparent",
            partial: "bg-purple-900/20 border-purple-500/30 text-purple-300",
            today: "ring-2 ring-purple-500 ring-offset-2 ring-offset-cozy-base",
        },
        peach: {
            active: "bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg shadow-orange-900/50 text-white border-transparent",
            partial: "bg-orange-900/20 border-orange-500/30 text-orange-300",
            today: "ring-2 ring-orange-400 ring-offset-2 ring-offset-cozy-base",
        },
        indigo: {
            active: "bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-900/50 text-white border-transparent",
            partial: "bg-indigo-900/20 border-indigo-500/30 text-indigo-300",
            today: "ring-2 ring-indigo-500 ring-offset-2 ring-offset-cozy-base",
        }
    };

    const currentTheme = themes[colorTheme] || themes.rose;

    // Helper to determine styling for each day cell
    const getDayClass = (day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const value = data[dateStr]; // undefined, true, 1, 2

        const isToday = isSameDay(day, today);
        const inMonth = isSameMonth(day, currentMonthStart);

        let classes = "h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-300 border border-stone-800/50 ";

        // Base state
        if (!inMonth) {
            return twMerge(classes, "opacity-20 text-stone-600 border-transparent");
        }

        // Active/Checked State
        if (value === true || value >= 2) {
            return twMerge(classes, currentTheme.active, isToday ? currentTheme.today : "");
        }

        // Partial State (1/2 Check-ins)
        if (value === 1) {
            return twMerge(classes, currentTheme.partial, isToday ? currentTheme.today : "");
        }

        // Empty State (but current month)
        return twMerge(classes, "bg-stone-800/40 text-stone-500 hover:bg-stone-800", isToday ? currentTheme.today : "");
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Header */}
            <h3 className="text-lg font-bold text-cozy-text mb-4 tracking-wide">
                {format(currentMonthStart, 'MMMM yyyy')}
            </h3>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3 p-4 bg-black/20 rounded-2xl border border-stone-800/50 backdrop-blur-sm">
                {/* Weekday Labels */}
                {weekDays.map(day => (
                    <div key={day} className="text-center text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                        {day}
                    </div>
                ))}

                {/* Days */}
                {calendarDays.map((day) => (
                    <div
                        key={day.toString()}
                        className={getDayClass(day)}
                        title={format(day, 'PPP')}
                    >
                        {format(day, 'd')}
                    </div>
                ))}
            </div>
        </div>
    );
}
