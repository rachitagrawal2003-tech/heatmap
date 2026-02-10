
import { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue, set } from 'firebase/database';
import { format } from 'date-fns';
import HabitCard from './components/HabitCard';
import AddHabitModal from './components/AddHabitModal';
import HabitDetailModal from './components/HabitDetailModal';
import StatsView from './components/StatsView';
import { Plus, GripVertical, CheckSquare, BarChart2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// DND Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Default Habits (Fallback/Initial State)
const DEFAULT_HABITS = {
  Rachit: [
    { id: 'gym', name: 'Gym', type: 'standard', colorTheme: 'rose' },
    { id: 'protein_shake', name: 'Protein Shake', type: 'standard', colorTheme: 'peach' },
    { id: 'afternoon_meds', name: 'Afternoon Meds', type: 'standard', colorTheme: 'indigo' },
    { id: 'hair_serum', name: 'Hair Serum', type: 'standard', colorTheme: 'purple' },
    { id: 'night_meds', name: 'Night Meds', type: 'standard', colorTheme: 'rose' },
  ],
  Khushi: [
    { id: 'brain_meds_morning', name: 'Brain Meds (Morning)', type: 'standard', colorTheme: 'rose' },
    { id: 'omega_3', name: 'Omega 3', type: 'standard', colorTheme: 'peach' },
    { id: 'b_complex', name: 'B Complex', type: 'standard', colorTheme: 'indigo' },
    { id: 'vitamin_c', name: 'Vitamin C', type: 'standard', colorTheme: 'peach' },
    { id: 'brain_med_night', name: 'Brain Med (Night)', type: 'standard', colorTheme: 'purple' },
    { id: 'multivitamin', name: 'Multivitamin', type: 'standard', colorTheme: 'indigo' },
    { id: 'vitamin_d', name: 'Vitamin D', type: 'standard', colorTheme: 'peach' },
    { id: 'night_brush', name: 'Night Brush', type: 'standard', colorTheme: 'purple' },
    { id: 'protein_intake', name: 'Protein Intake', type: 'protein', colorTheme: 'rose' },
  ]
};

// --- Sortable Item with Handle ---
function SortableHabitRow({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    touchAction: 'manipulation',
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/item flex items-center mb-3">
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-1 z-20 text-stone-600 p-3 cursor-grab active:cursor-grabbing touch-none opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity"
      >
        <GripVertical size={24} />
      </div>

      {/* Content */}
      <div className="flex-1 pl-10 pr-1">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [logs, setLogs] = useState({});
  const [habits, setHabits] = useState(null);
  const [loading, setLoading] = useState(true);

  // View State
  const [currentView, setCurrentView] = useState('tracker'); // 'tracker' | 'stats'

  // Drag State
  const [activeId, setActiveId] = useState(null);

  // Modal States
  const [addHabitModal, setAddHabitModal] = useState({ isOpen: false, person: null });
  const [activeHabit, setActiveHabit] = useState(null);

  // Sensors for Dnd
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Subscribe to Firebase
  useEffect(() => {
    const logsRef = ref(db, 'logs');
    const habitsRef = ref(db, 'habits');

    const unsubscribeLogs = onValue(logsRef, (snapshot) => setLogs(snapshot.val() || {}));

    const unsubscribeHabits = onValue(habitsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setHabits(data);
      else set(ref(db, 'habits'), DEFAULT_HABITS);
      setLoading(false);
    });

    return () => { unsubscribeLogs(); unsubscribeHabits(); };
  }, []);


  // --- Logic ---

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;
    if (active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    // Find Person
    let person = null;
    ['Rachit', 'Khushi'].forEach(p => {
      if (habits?.[p]?.find(h => h.id === activeId)) person = p;
    });

    if (!person) return;

    const currentList = habits[person];
    const oldIndex = currentList.findIndex(h => h.id === activeId);
    const newIndex = currentList.findIndex(h => h.id === overId);

    const newHabits = arrayMove(currentList, oldIndex, newIndex);
    set(ref(db, `habits/${person}`), newHabits);
  };

  const onCheckIn = (habitId, val) => {
    if (!activeHabit) return;
    const { person, habit } = activeHabit;

    const today = format(new Date(), 'yyyy-MM-dd');
    let newValue;

    if (habit.type === 'protein') {
      const current = val || 0;
      newValue = (current + 1) % 3;
      if (newValue === 0) newValue = null;
    } else {
      newValue = val ? null : true;
    }
    set(ref(db, `logs/${person}/${habitId}/${today}`), newValue);
  };

  const onAddHabit = (person, habit) => {
    const current = habits?.[person] || [];
    const newHabit = { ...habit };
    set(ref(db, `habits/${person}`), [...current, newHabit]);
  };

  const onDeleteHabit = (id) => {
    if (!activeHabit) return;
    const { person } = activeHabit;
    const current = habits?.[person] || [];
    set(ref(db, `habits/${person}`), current.filter(h => h.id !== id));
    setActiveHabit(null);
  };


  if (loading) return <div className="min-h-screen bg-cozy-bg flex items-center justify-center text-rose-500">Loading...</div>;

  const displayHabits = habits || DEFAULT_HABITS;

  return (
    <div className="min-h-screen bg-cozy-bg text-cozy-text font-sans selection:bg-rose-500/30 flex flex-col">

      {/* Navigation Bar */}
      <nav className="flex justify-center p-4 bg-stone-900 border-b border-stone-800 sticky top-0 z-50">
        <div className="bg-stone-800 p-1 rounded-full flex gap-1 shadow-lg">
          <button
            onClick={() => setCurrentView('tracker')}
            className={twMerge(
              "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all",
              currentView === 'tracker' ? "bg-stone-700 text-white shadow-md" : "text-stone-500 hover:text-stone-300"
            )}
          >
            <CheckSquare size={16} /> Tracker
          </button>
          <button
            onClick={() => setCurrentView('stats')}
            className={twMerge(
              "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all",
              currentView === 'stats' ? "bg-stone-700 text-white shadow-md" : "text-stone-500 hover:text-stone-300"
            )}
          >
            <BarChart2 size={16} /> Stats
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1">
        {currentView === 'tracker' ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-col md:flex-row min-h-full">
              <PersonColumn
                person="Rachit"
                title="Rachit"
                titleGradient="from-rose-400 to-orange-300"
                habits={displayHabits.Rachit || []}
                logs={logs.Rachit || {}}
                setAddHabitModal={setAddHabitModal}
                openHabit={(h) => setActiveHabit({ person: "Rachit", habit: h })}
              />
              <PersonColumn
                person="Khushi"
                title="Khushi"
                titleGradient="from-purple-400 to-pink-300"
                habits={displayHabits.Khushi || []}
                logs={logs.Khushi || {}}
                setAddHabitModal={setAddHabitModal}
                openHabit={(h) => setActiveHabit({ person: "Khushi", habit: h })}
              />

              {/* Drag Overlay */}
              <DragOverlay>
                {activeId ? (
                  <div className="bg-stone-800 p-4 rounded-xl shadow-2xl border border-rose-500/50 opacity-90 rotate-2 cursor-grabbing w-[300px]">
                    Dragging Item...
                  </div>
                ) : null}
              </DragOverlay>
            </div>
          </DndContext>
        ) : (
          <StatsView habits={displayHabits} logs={logs} />
        )}
      </div>

      {/* Global Modals */}
      <AddHabitModal
        isOpen={addHabitModal.isOpen}
        defaultPerson={addHabitModal.person}
        onClose={() => setAddHabitModal({ isOpen: false, person: null })}
        onAdd={(h, p) => onAddHabit(p, h)}
      />

      {activeHabit && (
        <HabitDetailModal
          isOpen={!!activeHabit}
          onClose={() => setActiveHabit(null)}
          habit={activeHabit.habit}
          person={activeHabit.person}
          data={logs?.[activeHabit.person]?.[activeHabit.habit.id]}
          onCheckIn={onCheckIn}
          onDelete={onDeleteHabit}
        />
      )}
    </div>
  );
}

function PersonColumn({ person, title, titleGradient, habits, logs, setAddHabitModal, openHabit }) {
  return (
    <div className="flex-1 p-6 md:p-12 border-b md:border-b-0 md:border-r border-stone-800 flex flex-col gap-6 relative">
      <header className="flex justify-between items-end mb-4">
        <div>
          <h1 className={`text-4xl font-bold bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}>{title}</h1>
        </div>
      </header>

      <div className="flex flex-col gap-8 pb-32">
        <SortableContext items={habits.map(h => h.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col">
            {habits.map(habit => (
              <SortableHabitRow key={habit.id} id={habit.id}>
                <HabitCard
                  habit={habit}
                  data={logs?.[habit.id]}
                  onClick={() => openHabit(habit)}
                />
              </SortableHabitRow>
            ))}
          </div>
        </SortableContext>

        {habits.length === 0 && (
          <div className="text-center p-8 text-stone-600 italic border border-dashed border-stone-800 rounded-xl">
            No habits yet. Start small!
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setAddHabitModal({ isOpen: true, person })}
        className="fixed bottom-8 right-8 z-50 bg-stone-800 hover:bg-stone-700 text-cozy-text p-4 rounded-full shadow-lg border border-stone-700 transition-all hover:scale-105 active:scale-95 group"
        title="Add New Habit"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
}
