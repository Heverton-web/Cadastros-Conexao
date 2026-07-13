import React from 'react';
import { Settings, Database, Activity } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import '../styles/theme.css';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="catalogo-theme min-h-screen flex flex-col">
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
