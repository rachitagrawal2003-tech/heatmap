import { format } from 'date-fns';
import Modal from './Modal';
import Heatmap from './Heatmap';
import CheckInButton from './CheckInButton';

export default function HabitDetailModal({ habit, person, data = {}, isOpen, onClose, onCheckIn, onDelete }) {
    if (!habit) return null;

    // Determine today's check-in status
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayValue = data[todayStr];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={habit.name}
        >
            <div className="flex flex-col gap-8 items-center py-4">
                <Heatmap
                    data={data}
                    colorTheme={habit.colorTheme}
                />

                <div className="flex flex-col items-center gap-2">
                    <CheckInButton
                        isChecked={todayValue || 0}
                        onClick={() => onCheckIn(habit.id, todayValue)}
                        type={habit.type}
                        colorTheme={habit.colorTheme}
                    />
                    <p className="text-xs text-stone-500 max-w-[200px] text-center mt-2">
                        {habit.type === 'protein' ? 'Needs 2 check-ins daily.' : 'One click to complete for the day.'}
                    </p>
                </div>

                {/* Delete Button */}
                <button
                    onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${habit.name}"? This cannot be undone.`)) {
                            onDelete(habit.id);
                            onClose();
                        }
                    }}
                    className="text-xs text-red-500/50 hover:text-red-500 hover:underline mt-4 transition-colors"
                >
                    Delete Habit
                </button>
            </div>
        </Modal>
    );
}
