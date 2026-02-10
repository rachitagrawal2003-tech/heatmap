
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDate } from 'date-fns';

/**
 * Calculates current streak for a habit
 * Streak counts backwards from Today (if completed) or Yesterday.
 */
export function calculateStreak(habitLogs) {
    if (!habitLogs) return 0;

    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    let currentCheck = today;
    let streak = 0;

    // Check if today is done. If not, start checking from yesterday to not break streak just because today isn't over.
    // However, if today IS done, include it.
    if (!habitLogs[todayStr]) {
        currentCheck = subDays(today, 1);
    }

    while (true) {
        const dateStr = format(currentCheck, 'yyyy-MM-dd');
        // Check log existence (and value > 0/true)
        if (habitLogs[dateStr]) {
            streak++;
            currentCheck = subDays(currentCheck, 1);
        } else {
            break;
        }
    }

    return streak;
}

/**
 * Calculates monthly consistency percentage for a given month (default current)
 * Returns { percentage: number (0-100), total: number, checked: number }
 */
export function calculateMonthlyStats(habitLogs, targetDate = new Date()) {
    const start = startOfMonth(targetDate);
    // Always use the full month as the denominator
    const end = endOfMonth(targetDate);

    const days = eachDayOfInterval({ start, end });
    const totalDays = days.length;

    if (totalDays === 0) return { percentage: 0, checked: 0, total: 0 };

    let checkedCount = 0;
    days.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        // Check for ANY value (truthy)
        if (habitLogs && habitLogs[dateStr]) {
            checkedCount++;
        }
    });

    return {
        percentage: Math.round((checkedCount / totalDays) * 100),
        checked: checkedCount,
        total: totalDays
    };
}

/**
 * Calculate overall consistency across ALL habits for the current month
 */
export function calculateOverallConsistency(habits, allLogs) {
    if (!habits || habits.length === 0) return 0;

    let totalChecked = 0;
    let totalPossible = 0;

    habits.forEach(habit => {
        const hLogs = allLogs?.[habit.id];
        const { checked, total } = calculateMonthlyStats(hLogs);
        totalChecked += checked;
        totalPossible += total;
    });

    if (totalPossible === 0) return 0;
    return Math.round((totalChecked / totalPossible) * 100);
}
