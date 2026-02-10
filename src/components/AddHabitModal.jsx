
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Plus, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function AddHabitModal({ isOpen, onClose, onAdd, defaultPerson }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('standard');
    const [colorTheme, setColorTheme] = useState('rose');
    const [assignedPerson, setAssignedPerson] = useState(defaultPerson || 'Rachit');

    // Update default person when modal opens
    useEffect(() => {
        if (isOpen && defaultPerson) {
            setAssignedPerson(defaultPerson);
        }
    }, [isOpen, defaultPerson]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        onAdd({
            id: name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now().toString().slice(-4),
            name,
            type,
            colorTheme,
        }, assignedPerson);

        // Reset state
        setName('');
        setType('standard');
        setColorTheme('rose');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Habit">
            <div className="flex flex-col gap-4 mt-2">

                {/* Person Selector */}
                <div className="flex bg-stone-800/50 p-1 rounded-xl">
                    {['Rachit', 'Khushi'].map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setAssignedPerson(p)}
                            className={twMerge(
                                "flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                assignedPerson === p
                                    ? "bg-stone-700 text-white shadow-sm"
                                    : "text-stone-500 hover:text-stone-300"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-stone-400">Habit Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Read 10 Pages"
                        className="w-full bg-stone-800/50 border border-stone-700/50 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 placeholder-stone-600 transition-all duration-300"
                        autoFocus
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-stone-400">Frequency Type</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setType('standard')}
                            className={twMerge(
                                "flex-1 p-3 rounded-xl border font-medium text-sm transition-all duration-300",
                                type === 'standard'
                                    ? "bg-rose-500/20 border-rose-500 text-rose-300"
                                    : "bg-stone-800/30 border-stone-700 text-stone-500 hover:bg-stone-800"
                            )}
                        >
                            Standard (1 Click)
                        </button>
                        <button
                            onClick={() => setType('protein')}
                            className={twMerge(
                                "flex-1 p-3 rounded-xl border font-medium text-sm transition-all duration-300",
                                type === 'protein'
                                    ? "bg-rose-500/20 border-rose-500 text-rose-300"
                                    : "bg-stone-800/30 border-stone-700 text-stone-500 hover:bg-stone-800"
                            )}
                        >
                            Two-Step (2 Clicks)
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-stone-400">Theme</span>
                    <div className="flex gap-3 justify-center">
                        {['rose', 'peach', 'purple', 'indigo'].map((theme) => {
                            const colors = {
                                rose: 'bg-rose-500',
                                peach: 'bg-orange-400',
                                purple: 'bg-purple-500',
                                indigo: 'bg-indigo-500'
                            };
                            return (
                                <button
                                    key={theme}
                                    onClick={() => setColorTheme(theme)}
                                    className={twMerge(
                                        "w-8 h-8 rounded-full transition-all duration-300 ring-2 ring-transparent ring-offset-2 ring-offset-cozy-base hover:scale-110",
                                        colors[theme],
                                        colorTheme === theme ? "ring-white scale-110" : "opacity-50 hover:opacity-100"
                                    )}
                                />
                            );
                        })}
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    className="w-full mt-4 bg-white text-black font-bold py-3 rounded-xl hover:bg-stone-200 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Plus size={18} />
                    Create Habit
                </button>
            </div>
        </Modal>
    );
}
