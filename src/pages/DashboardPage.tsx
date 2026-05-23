import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/client';
import { ArrowLeft, RefreshCw } from 'lucide-react';

interface ResumenDia {
  fecha: string;
  totalVentasActivas: number;
  totalVentasAnuladas: number;
  totalEfectivo: number;
  totalTarjeta: number;
  totalTransferencia: number;
  totalGeneral: number;
  productoResumen: { nombre: string; unidades: number; total: number }[];
  ticketResumen: Record<string, { cantidad: number; color: string }>;
}

interface LogAccion {
  id: number;
  accion: string;
  entidad: string;
  entidadId: number;
  timestamp: string;
  usuario: { nombre: string };
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [resumen, setResumen] = useState<ResumenDia | null>(null);
  const [logs, setLogs] = useState<LogAccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'resumen' | 'logs'>('resumen');

  async function cargar() {
    setLoading(true);
    try {
      const [r, l] = await Promise.all([
        api.get<ResumenDia>('/dashboard/resumen'),
        api.get<LogAccion[]>('/dashboard/log-acciones'),
      ]);
      setResumen(r);
      setLogs(l);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/tpv')} className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            {resumen && <span className="text-gray-500 text-sm">{resumen.fecha}</span>}
          </div>
          <button onClick={cargar} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Actualizar
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['resumen', 'logs'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-amber-500 text-gray-950' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {t === 'logs' ? 'Log acciones' : 'Resumen del día'}
            </button>
          ))}
        </div>

        {tab === 'resumen' && resumen && (
          <div className="flex flex-col gap-4">
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <KPI label="Total día" value={`${resumen.totalGeneral.toFixed(2)} €`} accent />
              <KPI label="Efectivo" value={`${resumen.totalEfectivo.toFixed(2)} €`} />
              <KPI label="Tarjeta" value={`${resumen.totalTarjeta.toFixed(2)} €`} />
              <KPI label="Transfer." value={`${resumen.totalTransferencia.toFixed(2)} €`} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <KPI label="Ventas activas" value={String(resumen.totalVentasActivas)} />
              <KPI label="Ventas anuladas" value={String(resumen.totalVentasAnuladas)} />
            </div>

            {/* Tickets */}
            {Object.keys(resumen.ticketResumen).length > 0 && (
              <div className="bg-gray-900 rounded-2xl p-4">
                <p className="text-sm text-gray-500 mb-3">Tickets impresos</p>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(resumen.ticketResumen).map(([nombre, { cantidad, color }]) => (
                    <div key={nombre} className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm">{nombre}</span>
                      <span className="font-bold text-white">{cantidad}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Productos */}
            {resumen.productoResumen.length > 0 && (
              <div className="bg-gray-900 rounded-2xl p-4">
                <p className="text-sm text-gray-500 mb-3">Ventas por producto</p>
                <div className="flex flex-col gap-2">
                  {resumen.productoResumen.map(p => (
                    <div key={p.nombre} className="flex items-center justify-between">
                      <span className="text-sm">{p.nombre}</span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-400">{p.unidades} uds</span>
                        <span className="font-semibold text-amber-400">{p.total.toFixed(2)} €</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'logs' && (
          <div className="flex flex-col gap-2">
            {logs.length === 0 && <p className="text-gray-600 text-center py-8">Sin acciones registradas</p>}
            {logs.map(l => (
              <div key={l.id} className="bg-gray-900 rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded font-mono">{l.accion}</span>
                    <span className="text-xs text-gray-500">{l.entidad} #{l.entidadId}</span>
                  </div>
                  <p className="text-sm text-gray-300">{l.usuario.nombre}</p>
                </div>
                <span className="text-xs text-gray-600 shrink-0">
                  {new Date(l.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KPI({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${accent ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-gray-900'}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${accent ? 'text-amber-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}
