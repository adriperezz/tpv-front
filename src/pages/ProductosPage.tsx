import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/client';
import { ArrowLeft, Plus, Pencil, ToggleLeft, ToggleRight, X } from 'lucide-react';

interface TipoTicket { id: number; nombre: string; color: string }
interface ProductoTicket { tipoTicketId: number; cantidad: number; tipoTicket: TipoTicket }
interface Producto { id: number; nombre: string; precio: string; activo: boolean; productoTickets: ProductoTicket[] }

interface FormState { nombre: string; precio: string; tickets: { tipoTicketId: number; cantidad: number }[] }
const FORM_EMPTY: FormState = { nombre: '', precio: '', tickets: [] };

export default function ProductosPage() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [tipos, setTipos] = useState<TipoTicket[]>([]);
  const [modal, setModal] = useState<'crear' | number | null>(null); // number = id a editar
  const [form, setForm] = useState<FormState>(FORM_EMPTY);
  const [saving, setSaving] = useState(false);

  async function cargar() {
    const [ps, ts] = await Promise.all([
      api.get<Producto[]>('/productos'),
      api.get<TipoTicket[]>('/productos/tipos-ticket'),
    ]);
    setProductos(ps);
    setTipos(ts);
  }

  useEffect(() => { cargar(); }, []);

  function abrirCrear() {
    setForm(FORM_EMPTY);
    setModal('crear');
  }

  function abrirEditar(p: Producto) {
    setForm({
      nombre: p.nombre,
      precio: p.precio,
      tickets: p.productoTickets.map(pt => ({ tipoTicketId: pt.tipoTicketId, cantidad: pt.cantidad })),
    });
    setModal(p.id);
  }

  function setTicketCantidad(tipoId: number, cant: number) {
    setForm(f => {
      const exists = f.tickets.find(t => t.tipoTicketId === tipoId);
      if (cant <= 0) return { ...f, tickets: f.tickets.filter(t => t.tipoTicketId !== tipoId) };
      if (exists) return { ...f, tickets: f.tickets.map(t => t.tipoTicketId === tipoId ? { ...t, cantidad: cant } : t) };
      return { ...f, tickets: [...f.tickets, { tipoTicketId: tipoId, cantidad: cant }] };
    });
  }

  async function guardar() {
    if (!form.nombre || !form.precio) return;
    setSaving(true);
    try {
      const body = { nombre: form.nombre, precio: Number(form.precio), tickets: form.tickets };
      if (modal === 'crear') await api.post('/productos', body);
      else await api.put(`/productos/${modal}`, body);
      await cargar();
      setModal(null);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActivo(p: Producto) {
    await api.patch(`/productos/${p.id}/activo`, { activo: !p.activo });
    await cargar();
  }

  const activos = productos.filter(p => p.activo);
  const inactivos = productos.filter(p => !p.activo);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/tpv')} className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold">Productos</h1>
          </div>
          <button onClick={abrirCrear}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm transition-all">
            <Plus size={16} /> Nuevo
          </button>
        </div>

        {activos.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Activos ({activos.length})</p>
            <div className="flex flex-col gap-2">
              {activos.map(p => <ProductoRow key={p.id} producto={p} onEdit={() => abrirEditar(p)} onToggle={() => toggleActivo(p)} />)}
            </div>
          </div>
        )}

        {inactivos.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Inactivos ({inactivos.length})</p>
            <div className="flex flex-col gap-2 opacity-50">
              {inactivos.map(p => <ProductoRow key={p.id} producto={p} onEdit={() => abrirEditar(p)} onToggle={() => toggleActivo(p)} />)}
            </div>
          </div>
        )}
      </div>

      {/* Modal crear/editar */}
      {modal !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setModal(null)} className="absolute top-3 right-3 text-gray-500 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4">{modal === 'crear' ? 'Nuevo producto' : 'Editar producto'}</h2>

            <div className="flex flex-col gap-3">
              <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                placeholder="Nombre" autoFocus
                className="bg-gray-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-500" />
              <input value={form.precio} onChange={e => setForm(f => ({ ...f, precio: e.target.value }))}
                placeholder="Precio (€)" type="number" min="0" step="0.50"
                className="bg-gray-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-amber-500" />

              <div>
                <p className="text-xs text-gray-500 mb-2">Tickets que genera</p>
                <div className="flex flex-col gap-2">
                  {tipos.map(t => {
                    const entry = form.tickets.find(x => x.tipoTicketId === t.id);
                    return (
                      <div key={t.id} className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                          <span className="text-sm">{t.nombre}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setTicketCantidad(t.id, (entry?.cantidad ?? 0) - 1)}
                            className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 font-bold flex items-center justify-center">−</button>
                          <span className="w-6 text-center font-mono text-sm">{entry?.cantidad ?? 0}</span>
                          <button onClick={() => setTicketCantidad(t.id, (entry?.cantidad ?? 0) + 1)}
                            className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 font-bold flex items-center justify-center">+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button onClick={guardar} disabled={!form.nombre || !form.precio || saving}
                className="py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold disabled:opacity-30 transition-all">
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductoRow({ producto, onEdit, onToggle }: { producto: Producto; onEdit: () => void; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between bg-gray-900 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {producto.productoTickets.map(pt => (
            <span key={pt.tipoTicketId} className="w-3 h-3 rounded-full" style={{ backgroundColor: pt.tipoTicket.color }} />
          ))}
        </div>
        <div>
          <p className="font-medium text-sm">{producto.nombre}</p>
          <p className="text-xs text-gray-400">{Number(producto.precio).toFixed(2)} €
            {producto.productoTickets.length > 0 && (
              <span className="ml-2">
                · {producto.productoTickets.map(pt => `${pt.cantidad} ${pt.tipoTicket.nombre}`).join(' + ')}
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onEdit} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
          <Pencil size={15} />
        </button>
        <button onClick={onToggle} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
          {producto.activo ? <ToggleRight size={18} className="text-green-400" /> : <ToggleLeft size={18} />}
        </button>
      </div>
    </div>
  );
}
