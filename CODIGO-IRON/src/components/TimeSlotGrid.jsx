import React from 'react';
import { Clock, Lock, CheckCircle2 } from 'lucide-react';

export default function TimeSlotGrid({ occupiedSlots, onSelectSlot }) {
  // Slots de 1 hora entre las 7:00 AM y las 10:00 PM (15 slots)
  const timeSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
    '19:00', '20:00', '21:00'
  ];

  const formatTime12H = (time24) => {
    const hour = parseInt(time24.split(':')[0], 10);
    if (hour === 12) return '12:00 PM';
    if (hour > 12) {
      const h12 = hour - 12;
      return `${h12 < 10 ? '0' + h12 : h12}:00 PM`;
    }
    return `${hour < 10 ? '0' + hour : hour}:00 AM`;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#00FF66]" />
          <h2 className="text-sm font-extrabold tracking-wide text-white uppercase">
            4. Horarios Disponibles (7 AM - 10 PM)
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {timeSlots.map((slot) => {
          const isOccupied = occupiedSlots.includes(slot);
          const formattedTime = formatTime12H(slot);

          return (
            <button
              key={slot}
              disabled={isOccupied}
              onClick={() => onSelectSlot(slot)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                isOccupied
                  ? 'bg-rose-950/20 border-rose-500/30 text-slate-500 opacity-60 cursor-not-allowed'
                  : 'glass-card hover:border-[#00FF66] hover:bg-slate-800/90 text-white cursor-pointer hover:shadow-[0_0_15px_rgba(0,255,102,0.2)]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-black ${isOccupied ? 'text-slate-500' : 'text-white'}`}>
                  {formattedTime}
                </span>
                {isOccupied ? (
                  <Lock className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF66]" />
                )}
              </div>
              <span className={`text-[10px] font-bold ${
                isOccupied ? 'text-rose-400' : 'text-[#00FF66]'
              }`}>
                {isOccupied ? 'Ocupado' : 'Disponible'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
