import React from 'react';
import { Layers } from 'lucide-react';

export default function SpecialtySelector({ specialties, selectedSpecialtyId, onSelectSpecialty }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Layers className="w-4 h-4 text-[#00FF66]" />
        <h2 className="text-sm font-extrabold tracking-wide text-white uppercase">
          2. Elige la Especialidad
        </h2>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {specialties.map((spec) => {
          const isSelected = spec.id === selectedSpecialtyId;
          return (
            <button
              key={spec.id}
              onClick={() => onSelectSpecialty(spec.id)}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#00FF66] text-black shadow-[0_0_15px_rgba(0,255,102,0.3)] scale-102'
                  : 'glass-card hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <span className="text-base leading-none">{spec.icon}</span>
              <span>{spec.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
