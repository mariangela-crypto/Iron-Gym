import React, { useState } from 'react';
import { Zap, Bell, Calendar, Dumbbell, ShieldAlert } from 'lucide-react';

export default function Header({
  user,
  onOpenProfile,
  onOpenMyBookings,
  isMobileFrame,
  onToggleFrame
}) {
  const [showNotification, setShowNotification] = useState(false);

  return (
    <header className="glass-panel px-6 py-4 mb-6 flex flex-wrap items-center justify-between gap-4 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#00FF66] flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(0,255,102,0.4)]">
          <Zap className="w-6 h-6 fill-black" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            IRON PULSE GYM
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Reserva de Citas con Entrenadores
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Device Frame Toggle Button */}
        <button
          onClick={onToggleFrame}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-bold text-slate-300 hover:text-[#00FF66] hover:border-[#00FF66]/50 transition-all cursor-pointer"
          title="Alternar entre vista Web y marco de Smartphone"
        >
          <Dumbbell className="w-3.5 h-3.5 text-[#00FF66]" />
          <span>{isMobileFrame ? 'Vista Fullscreen' : 'Modo Smartphone'}</span>
        </button>

        {/* 2-Hour Reminder Notification */}
        <div className="relative">
          <button
            onClick={() => setShowNotification(!showNotification)}
            className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-[#00FF66] hover:bg-slate-700 transition-all relative cursor-pointer"
            title="Notificaciones y Recordatorios"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00FF66] rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00FF66] rounded-full" />
          </button>

          {showNotification && (
            <div className="absolute right-0 mt-3 w-80 p-4 rounded-2xl glass-panel border border-[#00FF66]/40 shadow-2xl z-50 animate-fade-in">
              <div className="flex items-center gap-2 mb-2 text-[#00FF66] font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Recordatorio 2 Horas Antes</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ¡Hola <strong className="text-white">{user.name}</strong>! Tienes una cita confirmada hoy con tu entrenador. Te recordamos asistir 10 minutos antes a la recepción del gimnasio.
              </p>
            </div>
          )}
        </div>

        {/* My Bookings Button */}
        <button
          onClick={onOpenMyBookings}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-200 hover:text-[#00FF66] hover:border-[#00FF66]/50 font-bold text-xs md:text-sm transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-[#00FF66]" />
          <span className="hidden sm:inline">Mis Citas</span>
        </button>

        {/* User Profile Button */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/80 hover:border-[#00FF66] transition-all cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-[#00FF66] flex items-center justify-center font-black text-black text-xs">
            {user.name ? user.name.substring(0, 2).toUpperCase() : 'AT'}
          </div>
          <span className="text-xs font-bold text-slate-200 hidden lg:inline">
            {user.name.split(' ')[0]}
          </span>
        </button>
      </div>
    </header>
  );
}
