import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/client';
import { clearSession, getSession } from '@/store/auth';
import { getTheme, toggleTheme } from '@/store/theme';
import { Trash2, X, Settings, LayoutDashboard, LogOut, Package, ClipboardList, Sun, Moon } from 'lucide-react';

interface TipoTicket { id: number; nombre: string; color: string }
interface ProductoTicket { tipoTicketId: number; cantidad: number; tipoTicket: TipoTicket }
interface Producto { id: number; nombre: string; precio: string; productoTickets: ProductoTicket[] }
interface LineaCarrito { productoId: number; nombre: string; precio: number; cantidad: number }
interface TicketFisico { id: number; numeroSerie: number; tipoTicket: { nombre: string; color: string } }
type MetodoPago = 'TARJETA' | 'EFECTIVO' | 'TRANSFERENCIA';

export default function TpvPage() {
  const navigate = useNavigate();
  const session = getSession();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [carrito, setCarrito] = useState<LineaCarrito[]>([]);
  const [lineaSel, setLineaSel] = useState<number | null>(null);
  const [padInput, setPadInput] = useState('');
  const [modal, setModal] = useState<MetodoPago | null>(null);
  const [efectivo, setEfectivo] = useState('');
  const [loadingCobro, setLoadingCobro] = useState(false);
  const [ventaOk, setVentaOk] = useState<{ id: number; tickets: TicketFisico[] } | null>(null);

  useEffect(() => {
    api.get<Producto[]>('/productos?soloActivos=true').then(setProductos).catch(() => {});
  }, []);

  function addProducto(p: Producto) {
    setCarrito(prev => {
      const idx = prev.findIndex(l => l.productoId === p.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], cantidad: next[idx].cantidad + 1 };
        return next;
      }
      return [...prev, { productoId: p.id, nombre: p.nombre, precio: Number(p.precio), cantidad: 1 }];
    });
  }

  function incrementLinea(idx: number, delta: number) {
    setCarrito(prev => {
      const next = [...prev];
      const nueva = next[idx].cantidad + delta;
      if (nueva <= 0) { setLineaSel(null); return next.filter((_, i) => i !== idx); }
      next[idx] = { ...next[idx], cantidad: nueva };
      return next;
    });
  }

  function setLineCantidad(idx: number, cant: number) {
    if (cant <= 0) { setCarrito(prev => prev.filter((_, i) => i !== idx)); setLineaSel(null); }
    else setCarrito(prev => prev.map((l, i) => i === idx ? { ...l, cantidad: cant } : l));
  }

  function pressPad(d: string) {
    if (lineaSel === null) return;
    const next = padInput + d;
    setPadInput(next);
    setLineCantidad(lineaSel, Number(next));
  }

  function backspacePad() {
    if (lineaSel === null) return;
    const next = padInput.slice(0, -1);
    setPadInput(next);
    if (next) setLineCantidad(lineaSel, Number(next));
  }

  const total = carrito.reduce((s, l) => s + l.precio * l.cantidad, 0);

  async function cobrar(metodo: MetodoPago) {
    if (!session || carrito.length === 0) return;
    setLoadingCobro(true);
    try {
      const res = await api.post<{ id: number; tickets: TicketFisico[] }>('/ventas', {
        metodoPago: metodo,
        taquilla: session.taquilla,
        lineas: carrito.map(l => ({ productoId: l.productoId, cantidad: l.cantidad })),
        ...(metodo === 'EFECTIVO' && efectivo ? { efectivoEntregado: Number(efectivo) } : {}),
      });
      setVentaOk(res);
      setCarrito([]);
      setLineaSel(null);
      setModal(null);
      setEfectivo('');
    } catch (e: any) {
      alert(e.message ?? 'Error al cobrar');
    } finally {
      setLoadingCobro(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden select-none">
      {/* NavBar */}
      <nav className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold text-amber-400 text-lg">TPV Corpus</span>
          <span className="text-gray-500 text-sm">· Taquilla {session?.taquilla} · {session?.nombre}</span>
        </div>
        <div className="flex items-center gap-1">
          <RelojNavBar />
          {session?.rol === 'ADMIN' && <>
            <NavBtn icon={<LayoutDashboard size={15} />} label="Dashboard" onClick={() => navigate('/dashboard')} />
            <NavBtn icon={<Package size={15} />} label="Productos" onClick={() => navigate('/productos')} />
          </>}
          <NavBtn icon={<ClipboardList size={15} />} label="Cierre" onClick={() => navigate('/cierre')} />
          <NavBtn icon={<Settings size={15} />} label="Config" onClick={() => navigate('/config')} />
          <ThemeToggleBtn />
          <NavBtn icon={<LogOut size={15} />} label="Salir" onClick={() => { clearSession(); navigate('/login'); }} />
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Grid de productos */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-3">
            {productos.map(p => <ProductoBtn key={p.id} producto={p} onClick={() => addProducto(p)} />)}
          </div>
        </div>

        {/* Panel carrito */}
        <div className="w-80 flex flex-col bg-gray-900 border-l border-gray-800 shrink-0">
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
            {carrito.length === 0 && <p className="text-gray-600 text-center mt-10 text-sm">Carrito vacío</p>}
            {carrito.map((l, i) => (
              <LineaRow key={l.productoId} linea={l} selected={lineaSel === i}
                onSelect={() => { setLineaSel(i); setPadInput(String(l.cantidad)); }}
                onPlus={() => incrementLinea(i, 1)}
                onMinus={() => incrementLinea(i, -1)}
                onRemove={() => { setCarrito(c => c.filter((_, j) => j !== i)); if (lineaSel === i) setLineaSel(null); }}
              />
            ))}
          </div>

          {/* Pad de cantidad */}
          {lineaSel !== null && carrito[lineaSel] && (
            <div className="p-3 border-t border-gray-800">
              <p className="text-xs text-gray-500 mb-2 truncate">Cantidad — {carrito[lineaSel].nombre}</p>
              <div className="flex gap-2 mb-2">
                <div className="flex-1 bg-gray-800 rounded-lg px-3 py-2 text-center text-xl font-mono font-bold text-amber-400">
                  {padInput || '—'}
                </div>
                <button onClick={backspacePad} className="px-3 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700">←</button>
                <button onClick={() => { setLineaSel(null); setPadInput(''); }} className="px-3 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700"><X size={14} /></button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[1,2,3,4,5,6,7,8,9].map(d => (
                  <button key={d} onClick={() => pressPad(String(d))}
                    className="py-2 rounded-lg bg-gray-800 hover:bg-gray-700 font-bold text-sm">{d}</button>
                ))}
                <div />
                <button onClick={() => pressPad('0')} className="py-2 rounded-lg bg-gray-800 hover:bg-gray-700 font-bold text-sm">0</button>
                <div />
              </div>
            </div>
          )}

          {/* Total + cobro */}
          <div className="p-4 border-t border-gray-800 shrink-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Total</span>
              <span className="text-2xl font-bold">{total.toFixed(2)} €</span>
            </div>
            <div className="flex flex-col gap-2">
              <CobrarBtn label="💳 Tarjeta" color="blue" disabled={!carrito.length} onClick={() => cobrar('TARJETA')} />
              <CobrarBtn label="💵 Efectivo" color="green" disabled={!carrito.length} onClick={() => setModal('EFECTIVO')} />
              <CobrarBtn label="📱 Transferencia" color="purple" disabled={!carrito.length} onClick={() => cobrar('TRANSFERENCIA')} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal efectivo */}
      {modal === 'EFECTIVO' && (
        <Modal onClose={() => setModal(null)}>
          <h2 className="text-xl font-bold mb-4">Cobro en efectivo</h2>
          <p className="text-gray-400 text-sm mb-1">Total a cobrar</p>
          <p className="text-3xl font-bold mb-5">{total.toFixed(2)} €</p>
          <label className="text-sm text-gray-400 mb-1 block">Efectivo entregado</label>
          <input type="number" min="0" step="0.50" autoFocus
            value={efectivo} onChange={e => setEfectivo(e.target.value)}
            className="w-full bg-gray-800 rounded-xl px-4 py-3 text-2xl font-bold text-center text-white mb-3 outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="0.00" />
          {efectivo && Number(efectivo) >= total && (
            <p className="text-green-400 text-center text-lg font-semibold mb-3">
              Cambio: {(Number(efectivo) - total).toFixed(2)} €
            </p>
          )}
          <button onClick={() => cobrar('EFECTIVO')}
            disabled={!efectivo || Number(efectivo) < total || loadingCobro}
            className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 font-bold text-lg transition-all">
            {loadingCobro ? 'Procesando…' : 'Cobrar'}
          </button>
        </Modal>
      )}

      {/* Modal venta OK */}
      {ventaOk && (
        <Modal onClose={() => setVentaOk(null)}>
          <div className="text-center">
            <div className="text-5xl mb-2">✓</div>
            <h2 className="text-xl font-bold text-green-400 mb-1">¡Cobrado!</h2>
            <p className="text-gray-500 text-sm mb-4">Venta #{ventaOk.id}</p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {ventaOk.tickets.map(t => (
                <div key={t.id} className="px-3 py-1 rounded-full text-sm font-bold text-gray-950"
                  style={{ backgroundColor: t.tipoTicket.color }}>
                  {t.tipoTicket.nombre} #{String(t.numeroSerie).padStart(4, '0')}
                </div>
              ))}
            </div>
            <button onClick={() => setVentaOk(null)}
              className="w-full py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-semibold">
              Nueva venta
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ProductoBtn({ producto, onClick }: { producto: Producto; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all min-h-22.5">
      <div className="flex gap-1">
        {producto.productoTickets.map(pt => (
          <span key={pt.tipoTicketId} className="w-3 h-3 rounded-full" style={{ backgroundColor: pt.tipoTicket.color }} />
        ))}
      </div>
      <span className="font-semibold text-sm text-center leading-tight">{producto.nombre}</span>
      <span className="text-amber-400 font-bold">{Number(producto.precio).toFixed(2)} €</span>
    </button>
  );
}

function LineaRow({ linea, selected, onSelect, onPlus, onMinus, onRemove }: {
  linea: LineaCarrito; selected: boolean;
  onSelect: () => void; onPlus: () => void; onMinus: () => void; onRemove: () => void;
}) {
  return (
    <div onClick={onSelect}
      className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all ${selected ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-gray-800 hover:bg-gray-750'}`}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{linea.nombre}</p>
        <p className="text-xs text-gray-400">{linea.precio.toFixed(2)} € × {linea.cantidad}</p>
      </div>
      <span className="text-sm font-bold text-amber-400 shrink-0">{(linea.precio * linea.cantidad).toFixed(2)} €</span>
      <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
        <button onClick={onMinus} className="w-6 h-6 rounded bg-gray-700 hover:bg-gray-600 text-sm flex items-center justify-center">−</button>
        <button onClick={onPlus} className="w-6 h-6 rounded bg-gray-700 hover:bg-gray-600 text-sm flex items-center justify-center">+</button>
        <button onClick={onRemove} className="w-6 h-6 rounded bg-red-900/50 hover:bg-red-800 text-red-400 flex items-center justify-center">
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}

function CobrarBtn({ label, color, disabled, onClick }: { label: string; color: string; disabled: boolean; onClick: () => void }) {
  const colors: Record<string, string> = { blue: 'bg-blue-600 hover:bg-blue-500', green: 'bg-green-600 hover:bg-green-500', purple: 'bg-purple-600 hover:bg-purple-500' };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-30 ${colors[color]}`}>
      {label}
    </button>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-white"><X size={20} /></button>
        {children}
      </div>
    </div>
  );
}

function NavBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-xs transition-all">
      {icon}{label}
    </button>
  );
}

function ThemeToggleBtn() {
  const [dark, setDark] = useState(getTheme() === 'dark');
  return (
    <button
      onClick={() => { const t = toggleTheme(); setDark(t === 'dark'); }}
      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
      title={dark ? 'Modo claro' : 'Modo oscuro'}
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

function RelojNavBar() {
  const [horaLocal, setHoraLocal] = useState('');
  const [horaBack, setHoraBack] = useState('');
  const timerLocal = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerBack = useRef<ReturnType<typeof setInterval> | null>(null);

  function fmt(iso: string) {
    return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  async function fetchBack() {
    try {
      const { ahora } = await api.get<{ ahora: string }>('/sistema/tiempo');
      setHoraBack(fmt(ahora));
    } catch { /* silencioso */ }
  }

  useEffect(() => {
    timerLocal.current = setInterval(() => setHoraLocal(fmt(new Date().toISOString())), 1000);
    fetchBack();
    timerBack.current = setInterval(fetchBack, 10_000);
    return () => {
      clearInterval(timerLocal.current!);
      clearInterval(timerBack.current!);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 text-xs font-mono text-gray-400 border-l border-gray-800 pl-3 ml-1">
      <span title="Hora local (navegador)">
        <span className="text-gray-600">Local </span>
        <span className="text-white">{horaLocal}</span>
      </span>
      <span title="Hora servidor (backend)">
        <span className="text-gray-600">Srv </span>
        <span className={horaBack ? 'text-amber-400' : 'text-gray-600'}>{horaBack || '—'}</span>
      </span>
    </div>
  );
}
