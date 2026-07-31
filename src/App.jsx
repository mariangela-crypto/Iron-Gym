import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WeeklyCalendar from './components/WeeklyCalendar';
import SpecialtySelector from './components/SpecialtySelector';
import TrainerCard from './components/TrainerCard';
import TimeSlotGrid from './components/TimeSlotGrid';
import BookingModal from './components/BookingModal';
import MyBookings from './components/MyBookings';
import UserProfileModal from './components/UserProfileModal';
import { dbService } from './services/dbService';
import { Dumbbell, Sparkles } from 'lucide-react';

export default function App() {
  const [selectedDate, setSelectedDate] = useState('2026-07-29');
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('musculo_pesas');
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [user, setUser] = useState({ name: '', email: '', phone: '' });
  const [bookings, setBookings] = useState([]);
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Cargar datos iniciales de SQLite local
  useEffect(() => {
    const specs = dbService.getSpecialties();
    setSpecialties(specs);

    const currentUser = dbService.getUserProfile();
    setUser(currentUser);

    refreshBookings();
  }, []);

  // Actualizar entrenadores cuando cambia la especialidad
  useEffect(() => {
    const availableTrainers = dbService.getTrainersBySpecialty(selectedSpecialtyId);
    setTrainers(availableTrainers);
    if (availableTrainers.length > 0) {
      setSelectedTrainer(availableTrainers[0]);
    } else {
      setSelectedTrainer(null);
    }
  }, [selectedSpecialtyId]);

  // Actualizar slots ocupados cuando cambia fecha o entrenador
  useEffect(() => {
    if (selectedTrainer && selectedDate) {
      const occupied = dbService.getOccupiedSlots(selectedDate, selectedTrainer.id);
      setOccupiedSlots(occupied);
    }
  }, [selectedDate, selectedTrainer, bookings]);

  const refreshBookings = () => {
    const all = dbService.getAllBookings();
    setBookings(all);
  };

  const handleOpenBookingModal = (slot) => {
    setSelectedSlot(slot);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedSlot || !selectedTrainer) return;

    const specialty = specialties.find(s => s.id === selectedSpecialtyId);
    const hour = parseInt(selectedSlot.split(':')[0], 10) + 1;
    const endStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;

    dbService.insertBooking({
      userEmail: user.email,
      trainerId: selectedTrainer.id,
      trainerName: selectedTrainer.name,
      specialtyId: selectedSpecialtyId,
      specialtyName: specialty ? specialty.name : 'Entrenamiento',
      date: selectedDate,
      startTime: selectedSlot,
      endTime: endStr,
    });

    setIsBookingModalOpen(false);
    setSelectedSlot(null);
    refreshBookings();
  };

  const currentSpecialty = specialties.find(s => s.id === selectedSpecialtyId) || specialties[0];

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 md:p-8 transition-all ${isMobileFrame ? 'items-center justify-center py-6' : ''}`}>
      
      {/* Wrapper contenedor (soporta marco de Smartphone o Pantalla Completa Web) */}
      <div className={`w-full transition-all duration-300 ${
        isMobileFrame
          ? 'max-w-[420px] h-[860px] glass-panel border-[10px] border-slate-800 rounded-[44px] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(0,255,102,0.15)] flex flex-col overflow-hidden'
          : 'max-w-6xl mx-auto'
      }`}>
        
        {/* Header Bar */}
        <Header
          user={user}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenMyBookings={() => setIsMyBookingsOpen(true)}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        />

        {/* Banner Hero */}
        <div className={`glass-panel p-6 mb-6 rounded-3xl border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#12171F]`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF66]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-[#00FF66]/30 text-[#00FF66] text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Atención: Martes a Domingo | 7:00 AM - 10:00 PM</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Reserva tu Entrenamiento Personalizado
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
                Selecciona el día, elige la especialidad deportiva y aparta tu slot de 1 hora con nuestros coaches certificados.
              </p>
            </div>

            <button
              onClick={() => setIsMyBookingsOpen(true)}
              className="btn-neon text-xs md:text-sm whitespace-nowrap self-start md:self-auto cursor-pointer"
            >
              <Dumbbell className="w-4 h-4 text-black" />
              <span>Ver Mis Citas ({bookings.filter(b => b.status !== 'cancelled').length})</span>
            </button>
          </div>
        </div>

        {/* 1. Calendario Semanal */}
        <WeeklyCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* 2. Selector de Especialidad */}
        <SpecialtySelector
          specialties={specialties}
          selectedSpecialtyId={selectedSpecialtyId}
          onSelectSpecialty={setSelectedSpecialtyId}
        />

        {/* 3. Selección de Entrenador */}
        <TrainerCard
          trainers={trainers}
          selectedTrainer={selectedTrainer}
          onSelectTrainer={setSelectedTrainer}
        />

        {/* 4. Grid de Horarios Disponibles */}
        <TimeSlotGrid
          occupiedSlots={occupiedSlots}
          onSelectSlot={handleOpenBookingModal}
        />

        {/* Footer info */}
        <footer className="text-center py-4 text-xs text-slate-500 border-t border-slate-800/60 mt-auto">
          <p>IronPulse Gym &copy; 2026 • React + SQLite Engine local</p>
        </footer>
      </div>

      {/* Modales */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedDate={selectedDate}
        selectedSlot={selectedSlot}
        specialty={currentSpecialty}
        trainer={selectedTrainer}
        onConfirm={handleConfirmBooking}
      />

      <MyBookings
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        bookings={bookings}
        onRefresh={refreshBookings}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUser={setUser}
      />
    </div>
  );
}
