import {
  ArrowUpRight,
  Bot,
  Building2,
  ExternalLink,
  Plus,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { KPIGrid, DataTable } from '@/components/data';
import { Alert, Badge, Button } from '@/components/ui';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabList, TabTrigger, TabPanel } from '@/components/ui/Tabs';
import { AppLayout } from '@/components/layout';
import { RevenueChart, ProjectsDonut } from '@/components/charts';
import type { ActivityItem } from '@/types';

/* ── Activity feed ── */
const ACTIVITY: ActivityItem[] = [
  { id: '1', type: 'brand',   title: 'Nueva integración IA v2.0',          description: 'El módulo de análisis IA ya está disponible.',  time: 'Hace 5 min' },
  { id: '2', type: 'success', title: 'Plaza Sur avanzó al 72%',             description: 'Actualización de progreso registrada.',         time: 'Hace 23 min' },
  { id: '3', type: 'warning', title: '3 interferencias BIM detectadas',     description: 'Revisión requerida antes de la entrega.',        time: 'Hace 1h' },
  { id: '4', type: 'info',    title: 'Reunión de coordinación mañana',      description: '10:00h · Sala A2 · 5 asistentes.',              time: 'Hace 2h' },
  { id: '5', type: 'success', title: 'Propuesta aprobada por Manufacturas', description: 'Contrato €320K en proceso de firma.',            time: 'Hace 3h' },
];

const TYPE_DOT: Record<ActivityItem['type'], string> = {
  brand:   'bg-[var(--brand-primary)]',
  success: 'bg-[var(--q-success)]',
  warning: 'bg-[var(--q-warning)]',
  info:    'bg-[var(--q-info)]',
};

const TYPE_ICON: Record<ActivityItem['type'], string> = {
  brand: '🚀', success: '✓', warning: '⚠', info: 'ℹ',
};

/* ── Services ── */
const SERVICES = [
  {
    icon: <Building2 size={20} />,
    tag: 'BIM',
    title: 'Modelado BIM Avanzado',
    desc: 'Coordinación de proyectos, detección de interferencias y entrega en IFC 4.0.',
    badge: { label: 'BIM · Revit · IFC', variant: 'lime' as const },
    stat: '18 proyectos activos',
  },
  {
    icon: <Bot size={20} />,
    tag: 'IA',
    title: 'IA para Ingeniería',
    desc: 'Predicción de costes, optimización de plazos y automatización de informes técnicos.',
    badge: { label: 'IA · ML · Python', variant: 'dark' as const },
    stat: '3.2K horas procesadas',
    featured: true,
  },
  {
    icon: <Sparkles size={20} />,
    tag: 'Desarrollo',
    title: 'Software a Medida',
    desc: 'Plugins de Revit, dashboards ejecutivos, APIs de integración y automatizaciones.',
    badge: { label: 'Dev · API · Cloud', variant: 'dark' as const },
    stat: '6 aplicaciones en producción',
    darkCard: true,
  },
];

/* ══════════════════════════════════════════════════════ */
interface DashboardPageProps {
  onNavigate?: (page: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <AppLayout activeLink="dashboard" onNavigate={onNavigate} title="Panel Principal" subtitle="Bienvenido de vuelta, Fernando">
      <div className="space-y-6 lg:space-y-8">

        {/* ── Hero banner ── */}
        <div className="relative overflow-hidden rounded-2xl bg-[var(--q-black)] px-6 sm:px-8 py-6 sm:py-7">
          <div className="pointer-events-none absolute -top-20 -right-10 size-64 rounded-full"
               style={{ background: 'radial-gradient(circle, rgba(91,79,240,0.35) 0%, transparent 65%)' }} />
          <div className="pointer-events-none absolute bottom-0 left-[20%] size-40 rounded-full"
               style={{ background: 'radial-gradient(circle, rgba(194,229,58,0.10) 0%, transparent 65%)' }} />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 mb-3 rounded-full border border-[var(--q-lime)]/25 bg-[var(--q-lime)]/8 px-3 py-1">
                <span className="size-1.5 rounded-full bg-[var(--q-lime)] animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-[0.10em] text-[var(--q-lime)]">Sistema operativo</span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-black text-white tracking-tight">
                Buenos días, <span className="text-[var(--q-lime)]">Fernando.</span>
              </h2>
              <p className="text-white/45 text-sm mt-1 capitalize">{today}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Button variant="outline-light" size="sm">
                <ExternalLink size={13} /> Exportar
              </Button>
              <Button variant="accent" size="sm">
                <Plus size={13} /> Nuevo proyecto
              </Button>
            </div>
          </div>
        </div>

        {/* ── KPIs ── */}
        <KPIGrid />

        {/* ── Alert ── */}
        <Alert
          variant="brand"
          title="Nueva integración IA v2.0 disponible"
          description="El módulo de análisis predictivo ya está listo para todos los proyectos activos. Actívalo desde Configuración."
        />

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">

          {/* Revenue + Projects — Recharts ComposedChart */}
          <div className="lg:col-span-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.10em] text-[var(--brand-primary)]">Evolución · 2026</p>
                <h3 className="text-base font-black text-[var(--text-primary)] mt-0.5">Ingresos y proyectos por mes</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-[var(--brand-primary)] opacity-80" />
                  <span className="text-xs text-[var(--text-muted)]">Ingresos (K€)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-[var(--brand-accent)] opacity-80" />
                  <span className="text-xs text-[var(--text-muted)]">Proyectos</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[var(--q-success)]">
                  <TrendingUp size={13} /> +38% vs 2025
                </div>
              </div>
            </div>
            <RevenueChart />
          </div>

          {/* Projects by area — Recharts PieChart */}
          <div className="lg:col-span-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.10em] text-[var(--brand-primary)]">Distribución</p>
            <h3 className="text-base font-black text-[var(--text-primary)] mt-0.5 mb-4">Proyectos por área</h3>
            <ProjectsDonut />
          </div>
        </div>

        {/* ── Table + Activity ── */}
        <div className="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-3">

          {/* Table with tabs */}
          <div className="lg:col-span-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
            <div className="px-5 sm:px-6 pt-5 pb-0 border-b border-[var(--border-subtle)]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-black text-[var(--text-primary)]">Proyectos</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Gestión y seguimiento en tiempo real</p>
                </div>
                <button className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] transition-colors">
                  Ver todos <ArrowUpRight size={12} />
                </button>
              </div>
              <Tabs defaultValue="active" variant="line">
                <TabList>
                  <TabTrigger value="active" badge={18}>Activos</TabTrigger>
                  <TabTrigger value="review" badge={3}>En revisión</TabTrigger>
                  <TabTrigger value="all">Todos</TabTrigger>
                </TabList>
                <TabPanel value="active" className="pt-0">
                  <DataTable title="" />
                </TabPanel>
                <TabPanel value="review" className="pt-0">
                  <div className="py-12 text-center text-[var(--text-muted)] text-sm">3 proyectos en revisión</div>
                </TabPanel>
                <TabPanel value="all" className="pt-0">
                  <DataTable title="" />
                </TabPanel>
              </Tabs>
            </div>
          </div>

          {/* Activity feed */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-[var(--border-subtle)]">
              <h3 className="text-base font-black text-[var(--text-primary)]">Actividad reciente</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Últimas acciones del equipo</p>
            </div>
            <ul className="flex-1 divide-y divide-[var(--border-subtle)]">
              {ACTIVITY.map(item => (
                <li key={item.id} className="group flex items-start gap-3 px-5 py-4 hover:bg-[var(--brand-primary-soft)] transition-colors duration-150 cursor-pointer">
                  <div className="relative mt-1 shrink-0">
                    <div className="size-8 rounded-full flex items-center justify-center text-[13px] font-bold bg-[var(--bg-subtle)] text-[var(--text-muted)] group-hover:scale-110 transition-transform">
                      {TYPE_ICON[item.type]}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[var(--bg-surface)] ${TYPE_DOT[item.type]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--text-primary)] leading-snug">{item.title}</p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug line-clamp-2">{item.description}</p>
                    <p className="text-[10px] text-[var(--text-faint)] mt-1">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-5 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)]/50">
              <button className="text-[11px] font-bold uppercase tracking-widest text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] transition-colors w-full text-center">
                Ver historial completo →
              </button>
            </div>
          </div>
        </div>

        {/* ── Quick metrics ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Almacenamiento BIM', value: 71,  unit: '14.2 / 20 GB',    variant: 'brand'   as const },
            { label: 'Capacidad del equipo', value: 80, unit: '8 / 10 usuarios', variant: 'warning' as const },
            { label: 'SLA cumplido',        value: 97, unit: '97% este mes',    variant: 'success' as const },
          ].map(m => (
            <div key={m.label} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">{m.label}</p>
                <span className="text-sm font-black text-[var(--text-primary)]">{m.value}%</span>
              </div>
              <Progress value={m.value} variant={m.variant} size="sm" />
              <p className="text-[11px] text-[var(--text-faint)] mt-2">{m.unit}</p>
            </div>
          ))}
        </div>

        {/* ── Services ── */}
        <div>
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.10em] text-[var(--brand-primary)]">Servicios</p>
              <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)] mt-0.5">
                Áreas de <span className="text-[var(--brand-primary)]">especialización</span>
              </h3>
            </div>
            <button className="text-sm font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] transition-colors hidden sm:flex items-center gap-1">
              Ver todos <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(svc => {
              const isFeatured = svc.featured;
              const isDark     = svc.darkCard;
              const baseBg     = isFeatured ? 'bg-[var(--brand-primary)]' : isDark ? 'bg-[var(--q-black)]' : 'bg-[var(--bg-surface)]';
              const border     = isFeatured ? 'border-[var(--brand-primary)]' : isDark ? 'border-transparent' : 'border-[var(--border-subtle)]';
              const iconBg     = isFeatured ? 'bg-white/10' : isDark ? 'bg-white/5' : 'bg-[var(--brand-primary-soft)]';
              const iconColor  = isFeatured || isDark ? 'text-[var(--q-lime)]' : 'text-[var(--brand-primary)]';
              const tagColor   = isFeatured || isDark ? 'text-[var(--q-lime)]' : 'text-[var(--brand-primary)]';
              const titleColor = isFeatured || isDark ? 'text-white' : 'text-[var(--text-primary)]';
              const descColor  = isFeatured ? 'text-white/60' : isDark ? 'text-white/50' : 'text-[var(--text-muted)]';
              const statColor  = isFeatured ? 'text-white/45' : isDark ? 'text-white/35' : 'text-[var(--text-faint)]';
              const linkColor  = isFeatured || isDark ? 'text-[var(--q-lime)]' : 'text-[var(--brand-primary)]';

              return (
                <div
                  key={svc.title}
                  className={`group rounded-2xl border p-6 transition-all duration-[220ms] hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] cursor-pointer ${baseBg} ${border}`}
                >
                  <div className={`size-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-[220ms] group-hover:scale-110 ${iconBg} ${iconColor}`}>
                    {svc.icon}
                  </div>
                  <p className={`text-[11px] font-bold uppercase tracking-[0.08em] mb-1.5 ${tagColor}`}>{svc.tag}</p>
                  <h4 className={`font-black text-[17px] mb-2 leading-snug ${titleColor}`}>{svc.title}</h4>
                  <p className={`text-sm leading-relaxed mb-4 ${descColor}`}>{svc.desc}</p>
                  <p className={`text-[11px] font-medium mb-4 ${statColor}`}>📊 {svc.stat}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={svc.badge.variant}>{svc.badge.label}</Badge>
                    <a href="#" className={`text-sm font-semibold flex items-center gap-1 ${linkColor}`}>
                      Ver más <ArrowUpRight size={13} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
