
import { clsx } from 'clsx';
import { format, subMonths, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';
import { calculateStreak, calculateMonthlyStats, calculateOverallConsistency } from '../utils/stats';
import { Flame, Calendar, Trophy, BarChart3, TrendingUp } from 'lucide-react';

export default function StatsView({ habits, logs }) {
    // Current Period
    const currentMonth = new Date();
    const monthName = format(currentMonth, 'MMMM yyyy');

    // Overall Consistency per Person
    const overallRachit = calculateOverallConsistency(habits.Rachit || [], logs.Rachit || {});
    const overallKhushi = calculateOverallConsistency(habits.Khushi || [], logs.Khushi || {});

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6 min-h-screen">

            {/* Rachit's Stats */}
            <StatColumn
                person="Rachit"
                titleGradient="from-rose-400 to-orange-300"
                habits={habits.Rachit || []}
                logs={logs.Rachit || {}}
                overall={overallRachit}
                monthName={monthName}
            />

            {/* Khushi's Stats */}
            <StatColumn
                person="Khushi"
                titleGradient="from-purple-400 to-pink-300"
                habits={habits.Khushi || []}
                logs={logs.Khushi || {}}
                overall={overallKhushi}
                monthName={monthName}
            />
        </div>
    );
}

function StatColumn({ person, titleGradient, habits, logs, overall, monthName }) {
    return (
        <div className="flex-1 bg-cozy-base/50 p-6 rounded-3xl border border-stone-800 shadow-xl overflow-y-auto">
            {/* Header */}
            <header className="mb-8 flex justify-between items-end border-b border-stone-800 pb-4">
                <div>
                    <h2 className={`text-3xl font-bold bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}>
                        {person}
                    </h2>
                    <p className="text-sm text-stone-500 mt-1 flex items-center gap-1">
                        <Calendar size={14} /> Stats for {monthName}
                    </p>
                </div>

                {/* Overall Score */}
                <div className="flex flex-col items-end">
                    <span className="text-xs text-stone-500 font-medium uppercase tracking-widest">Consistency</span>
                    <div className="text-4xl font-black text-white flex items-center gap-1">
                        {overall}%
                        <TrendingUp size={24} className={overall >= 80 ? 'text-green-400' : overall >= 50 ? 'text-yellow-400' : 'text-stone-600'} />
                    </div>
                </div>
            </header>

            {/* Habit Grid */}
            <div className="grid grid-cols-1 gap-4">
                {habits.map(habit => {
                    const hLogs = logs[habit.id] || {};
                    const streak = calculateStreak(hLogs);
                    const monthly = calculateMonthlyStats(hLogs);

                    return (
                        <div key={habit.id} className="bg-stone-900/50 p-4 rounded-2xl border border-stone-800 hover:border-stone-700 transition-colors group">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-semibold text-lg text-cozy-text group-hover:text-white transition-colors">
                                    {habit.name}
                                </h3>

                                {/* Streak Badge */}
                                <div className={clsx(
                                    "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border",
                                    streak > 0
                                        ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                                        : "bg-stone-800 border-stone-700 text-stone-500"
                                )}>
                                    <Flame size={14} className={streak > 0 ? "fill-orange-400 animate-pulse" : ""} />
                                    {streak} Day Streak
                                </div>
                            </div>

                            {/* Monthly Progress */}
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-xs text-stone-400 mb-1">
                                    <span>This Monthly Consistency</span>
                                    <span className="font-mono">{monthly.percentage}% ({monthly.checked}/{monthly.total})</span>
                                </div>

                                <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                                    <div
                                        className={clsx(
                                            "h-full rounded-full transition-all duration-1000 ease-out",
                                            habit.colorTheme === 'rose' ? 'bg-rose-500' :
                                                habit.colorTheme === 'purple' ? 'bg-purple-500' :
                                                    habit.colorTheme === 'peach' ? 'bg-orange-400' :
                                                        'bg-indigo-500'
                                        )}
                                        style={{ width: `${monthly.percentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
