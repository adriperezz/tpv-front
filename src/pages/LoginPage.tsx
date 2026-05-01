import { Eye, EyeOff, Lock, Mail, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';

interface LoginPageProps {
  onLogin: () => void;
}

const FEATURES = [
  { icon: '🏗️', label: 'Gestión BIM avanzada',        desc: 'Coordinación de proyectos en tiempo real' },
  { icon: '🤖', label: 'Inteligencia Artificial',      desc: 'Predicción de costes y automatización' },
  { icon: '📊', label: 'Analytics ejecutivo',          desc: 'KPIs y métricas en un solo panel' },
  { icon: '🔗', label: 'Integración total',            desc: 'GitHub, Azure, Jira, Confluence y más' },
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email]       = useState('admin@quantia.es');
  const [password]    = useState('quantia2026');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 900);
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg-page)]">

      {/* ── LEFT — Brand panel (siempre oscuro) ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between bg-[#0A0A12] overflow-hidden p-12">

        {/* Decorative glows */}
        <div className="pointer-events-none absolute -top-32 -right-24 size-[500px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(91,79,240,0.30) 0%, transparent 65%)' }} />
        <div className="pointer-events-none absolute -bottom-24 left-[10%] size-[320px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(194,229,58,0.12) 0%, transparent 65%)' }} />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(91,79,240,0.06) 0%, transparent 60%)' }} />

        {/* Header logo */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="size-8 rounded-lg bg-[var(--q-purple)] flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-[family-name:var(--font-display)] text-xl font-black text-white tracking-[-0.01em]">
              QUANT<span className="text-[var(--q-lime)]">IA</span>
            </span>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
            Ingeniería y Consultoría
          </p>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-16">
          <div className="inline-flex items-center gap-1.5 mb-8 rounded-full border border-[var(--q-lime)]/25 bg-[var(--q-lime)]/8 px-3 py-1.5 w-fit">
            <Sparkles size={11} className="text-[var(--q-lime)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.10em] text-[var(--q-lime)]">Plataforma IA · v2.0</span>
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-[52px] font-black leading-[1.02] tracking-[-0.03em] text-white mb-6">
            El futuro de la<br />
            ingeniería,{' '}
            <em className="not-italic text-[var(--q-lime)]">hoy.</em>
          </h1>

          <p className="text-white/50 text-lg font-light leading-relaxed mb-12 max-w-md">
            Gestiona proyectos BIM, automatiza con IA y toma decisiones basadas en datos desde un único panel centralizado.
          </p>

          <ul className="space-y-4">
            {FEATURES.map(f => (
              <li key={f.label} className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-lg shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90">{f.label}</p>
                  <p className="text-xs text-white/40">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between">
          <p className="text-[11px] text-white/20 font-mono">Brand Style Guide v2.0 · Abril 2026</p>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={cn('size-1.5 rounded-full', i === 0 ? 'bg-[var(--q-lime)]' : 'bg-white/15')} />
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT — Login form ── */}
      <div className="flex-1 flex flex-col">

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 pt-7">
          {/* Logo mobile */}
          <div className="lg:hidden font-[family-name:var(--font-display)] text-xl font-black text-[var(--text-primary)] tracking-[-0.01em]">
            QUANT<span className="text-[var(--brand-primary)]">IA</span>
          </div>
          <div className="hidden lg:block" />
          <ThemeToggle />
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-[400px]">

            {/* Heading */}
            <div className="mb-10">
              <h2 className="font-[family-name:var(--font-display)] text-[32px] font-black tracking-[-0.02em] text-[var(--text-primary)] leading-tight">
                Bienvenido<br />
                <span className="text-[var(--brand-primary)]">de vuelta.</span>
              </h2>
              <p className="mt-3 text-sm text-[var(--text-muted)]">
                Introduce tus credenciales para acceder al panel.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.10em] text-[var(--text-secondary)]">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                  <input
                    type="email"
                    defaultValue={email}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[var(--bg-surface)] border-[1.5px] border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)] focus:shadow-[0_0_0_3px_var(--focus-ring)] transition-all duration-[220ms] placeholder:text-[var(--text-faint)]"
                    placeholder="tu@empresa.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-[0.10em] text-[var(--text-secondary)]">
                    Contraseña
                  </label>
                  <button type="button" className="text-[11px] font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] transition-colors">
                    ¿Olvidaste la contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    defaultValue={password}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-[var(--bg-surface)] border-[1.5px] border-[var(--border-default)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)] focus:shadow-[0_0_0_3px_var(--focus-ring)] transition-all duration-[220ms] placeholder:text-[var(--text-faint)]"
                    placeholder="••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
                    aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 rounded border-[var(--border-default)] accent-[var(--brand-primary)] cursor-pointer"
                />
                <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                  Mantener sesión iniciada
                </span>
              </label>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full mt-2 justify-center"
              >
                {loading ? 'Verificando…' : 'Acceder al panel →'}
              </Button>

            </form>

            {/* Divider hint */}
            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
              <p className="text-center text-[11px] text-[var(--text-faint)]">
                Acceso restringido · Solo personal autorizado de QUANTIA
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
