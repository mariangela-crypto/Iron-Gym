// Local Database Engine (SQLite API abstraction for Web)
const DB_STORAGE_KEY = 'ironpulse_sqlite_db_v1';
const USER_PROFILE_KEY = 'ironpulse_user_profile';

const defaultTrainers = [
  {
    id: 'tr_1',
    name: 'Carlos Mendoza',
    specialtyId: 'musculo_pesas',
    specialtyName: 'Músculo / Pesas',
    rating: 4.9,
    yearsExperience: 8,
    avatarUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150',
    bio: 'Especialista en hipertrofia, biomecánica y fuerza de alta potencia.',
  },
  {
    id: 'tr_2',
    name: 'Valeria Ríos',
    specialtyId: 'bailoterapia',
    specialtyName: 'Bailoterapia',
    rating: 4.95,
    yearsExperience: 6,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    bio: 'Instructora de ritmos latinos y acondicionamiento aeróbico dinámico.',
  },
  {
    id: 'tr_3',
    name: 'Dr. Fernando Silva',
    specialtyId: 'masajes',
    specialtyName: 'Masajes',
    rating: 4.88,
    yearsExperience: 10,
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
    bio: 'Fisioterapeuta deportivo experto en descarga muscular y descontracturante.',
  },
  {
    id: 'tr_4',
    name: 'Andrea Gómez',
    specialtyId: 'yoga',
    specialtyName: 'Yoga',
    rating: 4.92,
    yearsExperience: 7,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    bio: 'Maestra de Vinyasa Flow, control respiratorio y movilidad articular.',
  },
  {
    id: 'tr_5',
    name: 'Marcos "Iron" Torres',
    specialtyId: 'cardio',
    specialtyName: 'Cardio',
    rating: 4.85,
    yearsExperience: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    bio: 'Coach de HIIT, velocidad, resistencia y quema calórica extrema.',
  },
];

const defaultSpecialties = [
  { id: 'musculo_pesas', name: 'Músculo / Pesas', icon: '🏋️‍♂️', description: 'Fuerza e hipertrofia' },
  { id: 'bailoterapia', name: 'Bailoterapia', icon: '💃', description: 'Ritmo y cardio divertido' },
  { id: 'cardio', name: 'Cardio', icon: '🏃‍♂️', description: 'Resistencia aeróbica HIIT' },
  { id: 'yoga', name: 'Yoga', icon: '🧘‍♀️', description: 'Flexibilidad y movilidad' },
  { id: 'masajes', name: 'Masajes', icon: '💆‍♂️', description: 'Descarga muscular física' },
];

const initialSeedBookings = [
  {
    id: 'bk_1',
    userEmail: 'mariangel.fit@gym.com',
    trainerId: 'tr_1',
    trainerName: 'Carlos Mendoza',
    specialtyId: 'musculo_pesas',
    specialtyName: 'Músculo / Pesas',
    date: '2026-07-29',
    startTime: '08:00',
    endTime: '09:00',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bk_2',
    userEmail: 'mariangel.fit@gym.com',
    trainerId: 'tr_2',
    trainerName: 'Valeria Ríos',
    specialtyId: 'bailoterapia',
    specialtyName: 'Bailoterapia',
    date: '2026-07-30',
    startTime: '18:00',
    endTime: '19:00',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }
];

class DBService {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    if (!localStorage.getItem(DB_STORAGE_KEY)) {
      const dbPayload = {
        version: 1,
        engine: 'SQLite-Web-Storage',
        created: new Date().toISOString(),
        bookings: initialSeedBookings,
      };
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(dbPayload));
    }
    if (!localStorage.getItem(USER_PROFILE_KEY)) {
      const defaultUser = {
        name: 'Mariangel Atleta',
        email: 'mariangel.fit@gym.com',
        phone: '+57 300 123 4567',
      };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(defaultUser));
    }
  }

  // --- TRAINERS & SPECIALTIES ---
  getSpecialties() {
    return defaultSpecialties;
  }

  getTrainers() {
    return defaultTrainers;
  }

  getTrainersBySpecialty(specialtyId) {
    return defaultTrainers.filter(t => t.specialtyId === specialtyId);
  }

  // --- BOOKINGS CRUD ---
  getAllBookings() {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return parsed.bookings || [];
    } catch (e) {
      console.error('Error fetching bookings:', e);
      return [];
    }
  }

  getOccupiedSlots(dateStr, trainerId) {
    const bookings = this.getAllBookings();
    return bookings
      .filter(b => b.date === dateStr && b.trainerId === trainerId && b.status === 'confirmed')
      .map(b => b.startTime);
  }

  insertBooking(bookingData) {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    const parsed = JSON.parse(raw);

    const newBooking = {
      id: `bk_${Date.now()}`,
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    parsed.bookings.push(newBooking);
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(parsed));
    return newBooking;
  }

  // REGLA DE NEGOCIO: Validar 4 horas antes de cancelar
  canCancelBooking(booking) {
    if (booking.status === 'cancelled') return { canCancel: false, reason: 'La cita ya está cancelada.' };
    
    try {
      const [year, month, day] = booking.date.split('-').map(Number);
      const [hour, minute] = booking.startTime.split(':').map(Number);
      const bookingDate = new Date(year, month - 1, day, hour, minute);
      const now = new Date();

      const diffInHours = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 4) {
        return {
          canCancel: false,
          hoursLeft: diffInHours.toFixed(1),
          reason: `No se puede cancelar con menos de 4 horas de anticipación. Faltan ${diffInHours.toFixed(1)} horas para tu cita.`
        };
      }
      return { canCancel: true, hoursLeft: diffInHours.toFixed(1) };
    } catch (e) {
      return { canCancel: false, reason: 'Fecha de reserva inválida.' };
    }
  }

  cancelBooking(bookingId) {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    const parsed = JSON.parse(raw);

    const index = parsed.bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      const validation = this.canCancelBooking(parsed.bookings[index]);
      if (!validation.canCancel) {
        return { success: false, message: validation.reason };
      }
      parsed.bookings[index].status = 'cancelled';
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(parsed));
      return { success: true, message: 'Reserva cancelada exitosamente.' };
    }
    return { success: false, message: 'Reserva no encontrada.' };
  }

  rescheduleBooking(bookingId, newDate, newStartTime, newEndTime) {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    const parsed = JSON.parse(raw);

    const index = parsed.bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      parsed.bookings[index].date = newDate;
      parsed.bookings[index].startTime = newStartTime;
      parsed.bookings[index].endTime = newEndTime;
      parsed.bookings[index].status = 'rescheduled';
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(parsed));
      return { success: true, booking: parsed.bookings[index] };
    }
    return { success: false, message: 'Reserva no encontrada.' };
  }

  // --- USER PROFILE ---
  getUserProfile() {
    try {
      const raw = localStorage.getItem(USER_PROFILE_KEY);
      return raw ? JSON.parse(raw) : { name: 'Mariangel Atleta', email: 'mariangel.fit@gym.com', phone: '+57 300 123 4567' };
    } catch (_) {
      return { name: 'Mariangel Atleta', email: 'mariangel.fit@gym.com', phone: '+57 300 123 4567' };
    }
  }

  updateUserProfile(profile) {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    return profile;
  }

  // REQUISITO TÉCNICO: Exportar SQLite Database a JSON
  exportDatabaseJSON() {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    const profile = this.getUserProfile();
    const parsed = JSON.parse(raw);

    const exportData = {
      databaseName: 'gym_sqlite_local.db',
      exportedAt: new Date().toISOString(),
      user: profile,
      bookingsCount: parsed.bookings.length,
      bookings: parsed.bookings,
    };

    return JSON.stringify(exportData, null, 2);
  }
}

export const dbService = new DBService();
