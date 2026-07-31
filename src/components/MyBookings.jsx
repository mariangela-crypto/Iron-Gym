import React, { useState } from 'react';
import { X, Calendar, Clock, User, AlertTriangle, RefreshCw, XCircle, CheckCircle2 } from 'lucide-react';
import { dbService } from '../services/dbService';

export default function MyBookings({ isOpen, onClose, bookings, onRefresh }) {
  const [activeTab, setActiveTab] = useState('all');
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [newDate, setNewDate] = useState('2026-07-29');
  const [newTime, setNewTime] = useState('08:00');
  const [warningModalMsg, setWarningModalMsg] = useState(null);

  if (!isOpen) return null;

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

  const getEndTime = (time24) => {
    const hour = parseInt(time24.split(':')[0], 10) + 1;
    const endStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    return formatTime12H(endStr);
  };

  // REGLA DE NEGOCIO: Intentar Cancelación
  const handleAttemptCancel = (booking) => {
    const check = dbService.canCancelBooking(booking);
    if (!check.canCancel) {
      setWarningModalMsg(check.reason);
      return;
    }

    if (window.confirm(`¿Estás seguro de cancelar la cita de ${booking.specialtyName} con ${booking.trainerName} el ${booking.date}?`)) {
      const result = dbService.cancelBooking(booking.id);
      if (result.success) {
        onRefresh();
      } else {
        setWarningModalMsg(result.message);
      }
    }
  };

  // Reagendar
  const handleConfirmReschedule = () => {
    if (!rescheduleTarget) return;
    const newEndTime = getEndTime(newTime);
    dbService.rescheduleBooking(rescheduleTarget.id, newDate, newTime, newEndTime);
    setRescheduleTarget(null);
    onRefresh();
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'active') return b.status === 'confirmed' || b.status === 'rescheduled';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] flex items-center justify-center text-[#00FF66]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Mis Citas Agendadas</h2>
              <p className="text-xs text-slate-400">Gestión CRUD de reservas de gimnasio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Filter */}
        <div className="flex gap-2 px-6 pt-4 border-b border-slate-800/80">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
              activeTab === 'all' ? 'border-[#00FF66] text-[#00FF66]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Todas ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 px-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
              activeTab === 'active' ? 'border-[#00FF66] text-[#00FF66]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Activas ({bookings.filter(b => b.status !== 'cancelled').length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`pb-3 px-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
              activeTab === 'cancelled' ? 'border-[#00FF66] text-[#00FF66]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Canceladas ({bookings.filter(b => b.status === 'cancelled').length})
          </button>
        </div>

        {/* Bookings List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
              <p className="text-sm font-bold text-slate-400">No se encontraron reservas en esta categoría.</p>
            </div>
          ) : (
            filteredBookings.map((b) => {
              const isCancelled = b.status === 'cancelled';
              const canCancelResult = dbService.canCancelBooking(b);
              
              // Detectar si hay sobre-reserva (conflicto de horario con el mismo entrenador y fecha)
              const hasConflict = !isCancelled && bookings.some(other => 
                other.id !== b.id && 
                other.status !== 'cancelled' && 
                other.date === b.date && 
                other.trainerId === b.trainerId && 
                other.startTime === b.startTime
              );

              return (
                <div
                  key={b.id}
                  className={`glass-card p-4 rounded-2xl border transition-all ${
                    isCancelled 
                      ? 'border-rose-500/30 bg-rose-950/10' 
                      : hasConflict 
                      ? 'border-rose-500 bg-rose-950/20 shadow-[0_0_20px_rgba(244,63,94,0.25)] animate-pulse' 
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isCancelled
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : hasConflict
                          ? 'bg-rose-600 text-white border border-rose-400 animate-bounce'
                          : b.status === 'rescheduled'
                          ? 'bg-cyan-500/20 text-[#00E5FF] border border-cyan-500/40'
                          : 'bg-emerald-500/20 text-[#00FF66] border border-[#00FF66]/40'
                      }`}>
                        {isCancelled ? 'Cancelada' : hasConflict ? '⚠️ SOBRERESERVA / CONFLICTO' : b.status === 'rescheduled' ? 'Reagendada' : 'Confirmada'}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{b.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-white">
                      <Clock className="w-3.5 h-3.5 text-[#00FF66]" />
                      <span>{formatTime12H(b.startTime)} - {formatTime12H(b.endTime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{b.specialtyName}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Entrenador: <strong className="text-slate-200">{b.trainerName}</strong></p>
                    </div>

                    {!isCancelled && (
                      <div className="flex items-center gap-2">
                        {/* Botón Reagendar */}
                        <button
                          onClick={() => {
                            setRescheduleTarget(b);
                            setNewDate(b.date);
                            setNewTime(b.startTime);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[#00E5FF] hover:border-[#00E5FF] font-bold text-xs flex items-center gap-1 transition-all"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reagendar</span>
                        </button>

                        {/* Botón Cancelar (Con validación de 4h) */}
                        <button
                          onClick={() => handleAttemptCancel(b)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
                            canCancelResult.canCancel
                              ? 'bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500 hover:text-white'
                              : 'bg-slate-800/80 border border-slate-700 text-slate-500 cursor-pointer'
                          }`}
                          title={canCancelResult.canCancel ? 'Cancelar cita' : canCancelResult.reason}
                        >
                          <XCircle className="w-3 h-3" />
                          <span>{canCancelResult.canCancel ? 'Cancelar' : '< 4h (Bloqueado)'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Reagendar */}
        {rescheduleTarget && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md p-6 flex flex-col justify-center animate-fade-in z-20">
            <h3 className="text-base font-extrabold text-white mb-1">Reagendar Cita</h3>
            <p className="text-xs text-slate-400 mb-4">{rescheduleTarget.specialtyName} con {rescheduleTarget.trainerName}</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nuevo Día</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nuevo Horario (7 AM - 10 PM)</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{formatTime12H(slot)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRescheduleTarget(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="flex-1 btn-neon text-xs"
              >
                Confirmar Nuevo Horario
              </button>
            </div>
          </div>
        )}

        {/* Modal de Advertencia 4 Horas */}
        {warningModalMsg && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center animate-fade-in z-30">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-500 mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white mb-2">Cancelación No Permitida</h3>
            <p className="text-xs text-slate-300 max-w-sm mb-6 leading-relaxed">
              {warningModalMsg}
            </p>
            <button
              onClick={() => setWarningModalMsg(null)}
              className="btn-neon px-6 py-2.5 text-xs"
            >
              Entendido
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
