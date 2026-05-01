import { useState } from 'react';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProfessionalsPage } from '@/pages/ProfessionalsPage';
import { SettingsPage } from '@/pages/SettingsPage';

type Page = 'login' | 'dashboard' | 'settings' | 'professionals';

export default function App() {
  const [page, setPage] = useState<Page>('login');

  if (page === 'login') {
    return <LoginPage onLogin={() => setPage('dashboard')} />;
  }

  if (page === 'settings') {
    return <SettingsPage onNavigate={(id) => setPage(id as Page)} />;
  }

  if (page === 'professionals') {
    return <ProfessionalsPage onNavigate={(id) => setPage(id as Page)} />;
  }

  return <DashboardPage onNavigate={(id) => setPage(id as Page)} />;
}
