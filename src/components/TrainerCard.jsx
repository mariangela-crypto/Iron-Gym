import React from 'react';
import { UserCheck, Star, Award } from 'lucide-react';

export default function TrainerCard({ trainers, selectedTrainer, onSelectTrainer }) {
  if (!trainers || trainers.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#00FF66]" />
          <h2 className="text-sm font-extrabold tracking-wide text-white uppercase">
            3. Selecciona tu Entrenador
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {trainers.map((trainer) => {
          const isSelected = selectedTrainer && selectedTrainer.id === trainer.id;
          return (
            <div
              key={trainer.id}
              onClick={() => onSelectTrainer(trainer)}
              className={`glass-card p-3.5 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-[#00FF66] bg-slate-800/90 shadow-[0_0_20px_rgba(0,255,102,0.2)] ring-1 ring-[#00FF66]'
                  : 'hover:border-slate-700'
              }`}
            >
              <img
                src={trainer.avatarUrl}
                alt={trainer.name}
                className={`w-12 h-12 rounded-full object-cover border-2 ${
                  isSelected ? 'border-[#00FF66]' : 'border-slate-700'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm font-black text-white truncate">
                    {trainer.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#00FF66]">
                    <Star className="w-3 h-3 fill-[#00FF66]" />
                    <span>{trainer.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {trainer.bio}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-semibold">
                  <Award className="w-3 h-3 text-[#00E5FF]" />
                  <span>{trainer.yearsExperience} años de experiencia</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
