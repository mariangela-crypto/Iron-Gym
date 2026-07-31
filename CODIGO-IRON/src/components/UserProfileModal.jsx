import React, { useState } from 'react';
import { X, User, Mail, Phone, Database, Download, Check, Save } from 'lucide-react';
import { dbService } from '../services/dbService';

export default function UserProfileModal({ isOpen, onClose, user, onUpdateUser }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [isSaved, setIsSaved] = useState(false);
  const [exportedJson, setExportedJson] = useState(null);

  if (!isOpen) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = dbService.updateUserProfile({ name, email, phone });
    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportJson = () => {
    const jsonStr = dbService.exportDatabaseJSON();
    setExportedJson(jsonStr);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-700 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#00FF66]/20 border border-[#00FF66] flex items-center justify-center text-[#00FF66]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Perfil de Atleta</h2>
            <p className="text-xs text-slate-400">Tus datos personales y exportador de SQLite</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#00FF66]" /> Nombre Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs font-bold focus:border-[#00FF66] outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#00FF66]" /> Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs font-bold focus:border-[#00FF66] outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#00FF66]" /> Teléfono de Contacto
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white text-xs font-bold focus:border-[#00FF66] outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full btn-neon py-3 text-xs flex items-center justify-center gap-2"
          >
            {isSaved ? <Check className="w-4 h-4 text-black" /> : <Save className="w-4 h-4 text-black" />}
            <span>{isSaved ? '¡Guardado Correctamente!' : 'Guardar Cambios de Perfil'}</span>
          </button>
        </form>

        {/* Sección Exportar SQLite DB a JSON */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-white">
              <Database className="w-4 h-4 text-[#00E5FF]" />
              <span>Base de Datos Local SQLite</span>
            </div>
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[#00E5FF] hover:border-[#00E5FF] text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar DB a JSON</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Requisito técnico: Exporta todas tus citas y estructura SQLite en formato JSON.
          </p>

          {exportedJson && (
            <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-[#00E5FF]/40 max-h-40 overflow-y-auto font-mono text-[10px] text-[#00E5FF] animate-fade-in">
              <pre>{exportedJson}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
