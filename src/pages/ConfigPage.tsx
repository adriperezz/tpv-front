import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImpresora, saveImpresora, clearImpresora } from '@/store/impresora';
import { getFechaEvento, saveFechaEvento } from '@/store/evento';
import { ArrowLeft, Printer, Trash2, Calendar } from 'lucide-react';

const IMPRESORAS_PRESET = [
  { nombre: 'Impresora 1', ip: '192.168.1.101' },
  { nombre: 'Impresora 2', ip: '192.168.1.102' },
];

export default function ConfigPage() {
  const navigate = useNavigate();
  const actual = getImpresora();
  const [ip, setIp] = useState(actual?.ip ?? '');
  const [nombre, setNombre] = useState(actual?.nombre ?? '');
  const [guardado, setGuardado] = useState(false);
  const [fecha, setFecha] = useState(getFechaEvento());
  const [fechaGuardada, setFechaGuardada] = useState(false);

  function guardarFecha() {
    saveFechaEvento(fecha);
    setFechaGuardada(true);
    setTimeout(() => setFechaGuardada(false), 2000);
  }

  function guardar() {
    if (!ip) return;
    saveImpresora(ip, nombre || ip);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }

  function seleccionarPreset(p: { nombre: string; ip: string }) {
    setIp(p.ip);
    setNombre(p.nombre);
    saveImpresora(p.ip, p.nombre);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-lg mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={18} /> Volver
        </button>

        <h1 className="text-2xl font-bold mb-8">Configuración</h1>

        {/* Impresora activa */}
        {actual && (
          <div className="bg-green-900/30 border border-green-700/40 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Printer size={20} className="text-green-400" />
              <div>
                <p className="font-semibold text-green-300">{actual.nombre}</p>
                <p className="text-xs text-green-600">{actual.ip}</p>
              </div>
            </div>
            <button onClick={() => { clearImpresora(); setIp(''); setNombre(''); }}
              className="text-gray-500 hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        )}

        {/* Presets */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-3">Impresoras configuradas</p>
          <div className="flex flex-col gap-2">
            {IMPRESORAS_PRESET.map(p => (
              <button key={p.ip} onClick={() => seleccionarPreset(p)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  actual?.ip === p.ip
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-white'
                }`}>
                <div className="flex items-center gap-3">
                  <Printer size={18} />
                  <div className="text-left">
                    <p className="font-medium text-sm">{p.nombre}</p>
                    <p className="text-xs text-gray-400">{p.ip}</p>
                  </div>
                </div>
                {actual?.ip === p.ip && <span className="text-xs text-amber-400">Activa</span>}
              </button>
            ))}
          </div>
        </div>

        {/* IP manual */}
        <div className="bg-gray-900 rounded-2xl p-5">
          <p className="text-sm text-gray-500 mb-4">IP personalizada</p>
          <div className="flex flex-col gap-3">
            <input value={nombre} onChange={e => setNombre(e.target.value)}
              placeholder="Nombre (opcional)"
              className="bg-gray-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-500" />
            <input value={ip} onChange={e => setIp(e.target.value)}
              placeholder="192.168.1.100"
              className="bg-gray-800 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:ring-2 focus:ring-amber-500" />
            <button onClick={guardar} disabled={!ip}
              className="py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold disabled:opacity-30 transition-all">
              {guardado ? '✓ Guardado' : 'Guardar'}
            </button>
          </div>
        </div>

        {/* Fecha del evento para tickets */}
        <div className="bg-gray-900 rounded-2xl p-5 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-amber-400" />
            <p className="text-sm font-semibold">Fecha en el ticket impreso</p>
          </div>
          <input
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            placeholder="Ej: Viernes 6 Junio 2026"
            className="w-full bg-gray-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 mb-3"
          />
          {fecha && (
            <p className="text-xs text-gray-500 mb-3">
              Vista previa: <span className="text-white font-semibold">{fecha}</span>
            </p>
          )}
          <button onClick={guardarFecha}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold transition-all">
            {fechaGuardada ? '✓ Guardado' : 'Guardar fecha'}
          </button>
        </div>

        <p className="text-xs text-gray-600 text-center mt-4">
          La selección se recuerda 8 horas
        </p>
      </div>
    </div>
  );
}
