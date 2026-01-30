'use client';

import { StatCard, Card, CardHeader, CardContent, Badge, Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui';
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
  Receipt,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = calculateDashboardStats();
  const vendorTotals = getVendorYTDTotals();
  const vendorsNeedingW9 = vendorTotals.filter(v => v.needs_w9);
  const recentTransactions = mockTransactions.slice(0, 5);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome to ATLAS Property Intelligence</p>
      </div>
      
      {/* Alert Banner - W9 */}
      {stats.pending_w9_count > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                {stats.pending_w9_count} vendor{stats.pending_w9_count > 1 ? 's' : ''} need W-9 forms
              </p>
              <p className="text-sm text-yellow-700">
                Vendors have exceeded $600 in payments this year and require W-9 documentation.
              </p>
            </div>
            <Link 
              href="/dashboard/w9" 
              className="text-sm font-medium text-yellow-800 hover:text-yellow-900 flex items-center gap-1"
            >
              View <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={stats.total_properties}
          icon={Building2}
        />
        <StatCard
          title="Entities (LLCs)"
          value={stats.total_entities}
          icon={Briefcase}
        />
        <StatCard
          title="Revenue MTD"
          value={formatCurrency(stats.total_revenue_mtd)}
          icon={TrendingUp}
          trend={{ value: 12.5, positive: true }}
        />
        <StatCard
          title="Expenses MTD"
          value={formatCurrency(stats.total_expenses_mtd)}
          icon={TrendingDown}
        />
      </div>
      
      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Net Income MTD"
          value={formatCurrency(stats.net_income_mtd)}
          className={stats.net_income_mtd >= 0 ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}
        />
        <StatCard
          title="Unmatched Transactions"
          value={stats.unmatched_transactions}
          subtitle="Need property attribution"
          className={stats.unmatched_transactions > 0 ? 'border-l-4 border-yellow-500' : ''}
        />
        <StatCard
          title="Lowe's Pending"
          value={stats.lowes_pending_allocation}
          subtitle="Statements to process"
          icon={FileSpreadsheet}
        />
      </div>
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <Link href="/dashboard/transactions" className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Date</TableHeader>
                  <TableHeader>Description</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="text-gray-500">{formatDate(txn.date)}</TableCell>
                    <TableCell className="font-medium text-gray-900 max-w-[200px] truncate">
                      {txn.description}
                    </TableCell>
                    <TableCell className={txn.type === 'income' ? 'text-green-600' : 'text-gray-900'}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        txn.status === 'reconciled' ? 'success' : 
                        txn.status === 'cleared' ? 'info' : 'warning'
                      }>
                        {txn.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Properties by Entity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Properties by Entity</h2>
              <Link href="/dashboard/properties" className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEntities.map((entity) => {
                const entityProperties = mockProperties.filter(p => p.owner_entity_id === entity.id);
                const totalRent = entityProperties.reduce((sum, p) => sum + (p.monthly_rent || 0), 0);
                
                return (
                  <div key={entity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{entity.name}</p>
                      <p className="text-sm text-gray-500">
                        {entityProperties.length} {entityProperties.length === 1 ? 'property' : 'properties'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(totalRent)}</p>
                      <p className="text-sm text-gray-500">monthly rent</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* W-9 Alert Section */}
      {vendorsNeedingW9.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">W-9 Action Required</h2>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Vendor</TableHeader>
                  <TableHeader>YTD Payments</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Action</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendorsNeedingW9.map(({ vendor, ytd_total }) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium text-gray-900">{vendor.name}</TableCell>
                    <TableCell>{formatCurrency(ytd_total)}</TableCell>
                    <TableCell>
                      <Badge variant="danger">Needs W-9</Badge>
                    </TableCell>
                    <TableCell>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Send Request
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
