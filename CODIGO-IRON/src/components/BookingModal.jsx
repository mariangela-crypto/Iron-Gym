import React from 'react';
import { X, CheckCircle, Calendar, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BookingModal({
  isOpen,
  onClose,
  selectedDate,
  selectedSlot,
  specialty,
  trainer,
  onConfirm
}) {
  if (!isOpen || !selectedSlot || !trainer || !specialty) return null;

  const formatTime12H = (time24) => {
    const hour = parseInt(time24.split(':')[0], 10);
    if (hour === 12) return '12:00 PM';
    if (hour > 12) {
      const h12 = hour - 12;
      return `${h12 < 10 ? '0' + h12 : h12}:00 PM`;
    }
    return `${hour < 10 ? '0' + hour : hour}:00 AM`;
  };

  const getEndTime = (time24) => {
    const hour = parseInt(time24.split(':')[0], 10) + 1;
    const endStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    return formatTime12H(endStr);
  };

  const handleConfirmBooking = () => {
    onConfirm();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00FF66', '#00E5FF', '#ffffff']
      });
    } catch (_) {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-[#00FF66]/30 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl border flex items-center justify-center bg-emerald-500/20 border-[#00FF66] text-[#00FF66]">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">
              Confirmar Cita de Entrenamiento
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Verifica los detalles antes de agendar
            </p>
          </div>
        </div>

        <div className="space-y-3 my-5">
          {/* Fecha y Horario */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-700/50 text-[#00FF66]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fecha & Horario</span>
              <span className="text-xs font-extrabold text-white">
                {selectedDate} | {formatTime12H(selectedSlot)} - {getEndTime(selectedSlot)}
              </span>
            </div>
          </div>

          {/* Especialidad */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-700/50 text-[#00E5FF]">
              <span className="text-sm">{specialty.icon}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Especialidad</span>
              <span className="text-xs font-extrabold text-white">{specialty.name}</span>
            </div>
          </div>

          {/* Entrenador */}
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-3">
            <img
              src={trainer.avatarUrl}
              alt={trainer.name}
              className="w-10 h-10 rounded-full object-cover border border-[#00FF66]"
            />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Entrenador Asignado</span>
              <span className="text-xs font-extrabold text-white">{trainer.name}</span>
              <span className="text-[10px] text-[#00FF66] font-bold block">★ {trainer.rating} Rating</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl border flex items-start gap-2.5 mb-5 text-[11px] bg-emerald-500/10 border-[#00FF66]/20 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-[#00FF66] shrink-0 mt-0.5" />
          <span>
            Recordatorio automático activado: Te notificaremos 2 horas antes de tu sesión.
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-all cursor-pointer"
          >
            Volver
          </button>
          <button
            onClick={handleConfirmBooking}
            className="flex-1 py-3 text-xs btn-neon cursor-pointer"
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
}
