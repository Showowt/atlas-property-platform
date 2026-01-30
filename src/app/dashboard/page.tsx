'use client';

import { StatCard, Card, CardHeader, CardContent, Badge } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  calculateDashboardStats, 
  mockTransactions, 
  mockProperties, 
  mockEntities,
  getVendorYTDTotals 
} from '@/lib/store';
import { 
  Building2, 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = calculateDashboardStats();
  const vendorTotals = getVendorYTDTotals();
  const vendorsNeedingW9 = vendorTotals.filter(v => v.needs_w9);
  const recentTransactions = mockTransactions.slice(0, 5);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm sm:text-base">Welcome to ATLAS Property Intelligence</p>
      </div>
      
      {/* Alert Banner - W9 */}
      {stats.pending_w9_count > 0 && (
        <Link href="/dashboard/w9" className="block">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-yellow-200/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-yellow-800">
                  {stats.pending_w9_count} vendor{stats.pending_w9_count > 1 ? 's' : ''} need W-9
                </p>
                <p className="text-xs text-yellow-700 truncate">
                  Exceeded $600 in payments
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            </div>
          </div>
        </Link>
      )}
      
      {/* Main Stats - Mobile Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">Properties</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total_properties}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-purple-50 rounded-lg">
              <Briefcase className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">Entities</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total_entities}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-green-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">Revenue</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(stats.total_revenue_mtd)}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">This month</p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-red-50 rounded-lg">
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
            <span className="text-xs text-gray-500 font-medium">Expenses</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(stats.total_expenses_mtd)}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">This month</p>
        </div>
      </div>
      
      {/* Net Income Card */}
      <div className={`rounded-2xl p-5 shadow-sm ${stats.net_income_mtd >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">Net Income MTD</p>
            <p className="text-3xl sm:text-4xl font-bold text-white mt-1">
              {formatCurrency(stats.net_income_mtd)}
            </p>
          </div>
          <div className="p-3 bg-white/20 rounded-2xl">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/dashboard/transactions" className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Unmatched</p>
              <p className="text-2xl font-bold text-amber-600">{stats.unmatched_transactions}</p>
              <p className="text-xs text-gray-400">transactions</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </div>
        </Link>
        
        <Link href="/dashboard/lowes" className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Lowe's</p>
              <p className="text-2xl font-bold text-blue-600">{stats.lowes_pending_allocation}</p>
              <p className="text-xs text-gray-400">pending</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </div>
        </Link>
      </div>
      
      {/* Recent Transactions - Mobile Card View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Transactions</h2>
          <Link href="/dashboard/transactions" className="text-sm text-blue-600 font-medium flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="divide-y divide-gray-50">
          {recentTransactions.map((txn) => (
            <div key={txn.id} className="p-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate text-sm">{txn.description}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(txn.date)}</p>
                </div>
                <div className="text-right ml-4">
                  <p className={`font-semibold ${txn.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                    {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </p>
                  <Badge variant={txn.status === 'reconciled' ? 'success' : txn.status === 'cleared' ? 'info' : 'warning'} className="mt-1 text-[10px]">
                    {txn.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Properties by Entity - Mobile Optimized */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Properties by Entity</h2>
          <Link href="/dashboard/entities" className="text-sm text-blue-600 font-medium flex items-center gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="p-3 space-y-2">
          {mockEntities.map((entity) => {
            const entityProperties = mockProperties.filter(p => p.owner_entity_id === entity.id);
            const totalRent = entityProperties.reduce((sum, p) => sum + (p.monthly_rent || 0), 0);
            
            return (
              <Link key={entity.id} href="/dashboard/entities" className="block">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors active:scale-[0.99]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-sm">
                        {entity.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{entity.name}</p>
                      <p className="text-xs text-gray-500">
                        {entityProperties.length} {entityProperties.length === 1 ? 'property' : 'properties'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(totalRent)}</p>
                    <p className="text-[10px] text-gray-500">/month</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* W-9 Alert Section - Mobile Card */}
      {vendorsNeedingW9.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-yellow-200/50 overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-yellow-200/50">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h2 className="font-semibold text-gray-900">W-9 Action Required</h2>
          </div>
          
          <div className="p-3 space-y-2">
            {vendorsNeedingW9.map(({ vendor, ytd_total }) => (
              <div key={vendor.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{vendor.name}</p>
                  <p className="text-xs text-gray-600">YTD: {formatCurrency(ytd_total)}</p>
                </div>
                <Link href="/dashboard/w9" className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-medium rounded-lg hover:bg-yellow-600 transition-colors">
                  Request
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
