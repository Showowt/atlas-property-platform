'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Receipt,
  Users,
  FileSpreadsheet,
  Settings,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Menu,
  X,
  ChevronRight,
  Zap,
  Play,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Demo', href: '/dashboard/demo', icon: Zap },
  { name: 'Properties', href: '/dashboard/properties', icon: Building2 },
  { name: 'Entities', href: '/dashboard/entities', icon: Briefcase },
  { name: 'Transactions', href: '/dashboard/transactions', icon: Receipt },
  { name: 'Vendors', href: '/dashboard/vendors', icon: Users },
  { name: "Lowe's", href: '/dashboard/lowes', icon: FileSpreadsheet },
  { name: 'Banks', href: '/dashboard/banks', icon: CreditCard },
  { name: 'W-9', href: '/dashboard/w9', icon: AlertTriangle },
  { name: 'Reports', href: '/dashboard/reports', icon: TrendingUp },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const bottomNavItems = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Demo', href: '/dashboard/demo', icon: Zap },
  { name: 'Properties', href: '/dashboard/properties', icon: Building2 },
  { name: 'Banks', href: '/dashboard/banks', icon: CreditCard },
  { name: 'More', href: '#more', icon: Menu },
];

export function Sidebar({ onStartTour }: { onStartTour?: () => void }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full w-64 flex-col bg-gradient-to-b from-gray-900 to-gray-950 shadow-2xl">
        <div className="flex h-16 items-center px-6 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight">ATLAS</h1>
              <p className="text-gray-500 text-xs font-medium">Property Intelligence</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(item.href)
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
              {isActive(item.href) && <ChevronRight className="h-4 w-4 ml-auto" />}
            </Link>
          ))}
        </nav>
        
        {/* Tour Button */}
        {onStartTour && (
          <div className="px-3 pb-2">
            <button
              onClick={onStartTour}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Play className="h-5 w-5" />
              Start Guided Tour
            </button>
          </div>
        )}
        
        <div className="p-4 border-t border-gray-800/50">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-800/30">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">MM</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">MachineMind</p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800/50">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-white font-bold text-lg">ATLAS</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-400 hover:text-white">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between h-14 px-4 border-b border-gray-800/50">
              <span className="text-white font-semibold">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-56px)]">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all',
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'text-gray-300 hover:bg-gray-800 active:bg-gray-700'
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800/50 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomNavItems.map((item) => {
            const active = item.href !== '#more' && isActive(item.href);
            if (item.href === '#more') {
              return (
                <button key={item.name} onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center justify-center flex-1 py-1 text-gray-500">
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </button>
              );
            }
            return (
              <Link key={item.name} href={item.href} className={cn('flex flex-col items-center justify-center flex-1 py-1', active ? 'text-blue-500' : 'text-gray-500')}>
                <div className={cn('p-1.5 rounded-xl transition-all', active && 'bg-blue-500/20')}>
                  <item.icon className={cn('h-5 w-5', active && 'scale-110')} />
                </div>
                <span className={cn('text-[10px] font-medium mt-0.5', active && 'text-blue-400')}>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
