import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

export default function WeeklyCalendar({ selectedDate, onSelectDate }) {
  // Genera los próximos días de Martes a Domingo (Lunes excluido por horario del gimnasio)
  const getUpcomingGymDays = () => {
    const days = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      // weekday: 0=Domingo, 1=Lunes, 2=Martes, ..., 6=Sábado
      if (d.getDay() !== 1) { // Excluir Lunes
        days.push(d);
      }
    }
    return days;
  };

  const gymDays = getUpcomingGymDays();
  const daysSpanish = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthsSpanish = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  const formatDateStr = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#00FF66]" />
          <h2 className="text-sm font-extrabold tracking-wide text-white uppercase">
            1. Selecciona el Día
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-[#00FF66]/30 text-[#00FF66] text-xs font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>Mar - Dom | 7:00 AM - 10:00 PM</span>
        </div>
      </div>

      {/* Slider horizontal de días */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {gymDays.map((date) => {
          const dateStr = formatDateStr(date);
          const isSelected = dateStr === selectedDate;
          const dayName = daysSpanish[date.getDay()];
          const dayNum = date.getDate();
          const monthName = monthsSpanish[date.getMonth()];

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`min-w-[70px] py-3.5 px-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#00FF66] text-black font-extrabold shadow-[0_0_20px_rgba(0,255,102,0.35)] scale-105'
                  : 'glass-card hover:bg-slate-800/80 text-slate-300 border-slate-800'
              }`}
            >
              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isSelected ? 'text-black' : 'text-slate-400'}`}>
                {dayName}
              </span>
              <span className="text-xl font-black my-0.5 leading-none">
                {dayNum}
              </span>
              <span className={`text-[10px] font-bold ${isSelected ? 'text-black/80' : 'text-slate-500'}`}>
                {monthName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
