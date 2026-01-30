'use client';

import { useState } from 'react';
import { Button, Badge, Card, CardHeader, CardContent, Select, Input } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { mockProperties, mockEntities, mockTransactions, mockVendors, getVendorYTDTotals } from '@/lib/store';
import { 
  FileText, Download, Calendar, Building2, Briefcase, TrendingUp, TrendingDown,
  PieChart, BarChart3, DollarSign, FileSpreadsheet, Users, AlertTriangle,
  Printer, Mail, Clock, CheckCircle2, Filter, ChevronRight, Sparkles,
  Calculator, Receipt, Home, CreditCard, Scale, Target, Zap
} from 'lucide-react';

// Report categories
const reportCategories = [
  {
    id: 'tax',
    name: 'Tax Reports',
    icon: Scale,
    color: 'from-purple-500 to-violet-600',
    description: 'IRS-ready reports for tax filing',
    reports: [
      { id: 'schedule-e', name: 'Schedule E Report', description: 'Complete rental income & expenses by property', popular: true },
      { id: 'schedule-e-summary', name: 'Schedule E Summary', description: 'Condensed view for quick review' },
      { id: '1099-prep', name: '1099 Preparation', description: 'Vendor payments over $600 with W-9 status' },
      { id: 'depreciation', name: 'Depreciation Schedule', description: 'MACRS 27.5-year property depreciation' },
      { id: 'capital-improvements', name: 'Capital Improvements', description: 'Basis adjustments and improvements log' },
      { id: 'mileage-log', name: 'Mileage Log', description: 'Property visit mileage for deductions' },
    ]
  },
  {
    id: 'financial',
    name: 'Financial Statements',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-600',
    description: 'Professional accounting reports',
    reports: [
      { id: 'pnl-portfolio', name: 'P&L - Full Portfolio', description: 'Profit & Loss across all properties', popular: true },
      { id: 'pnl-entity', name: 'P&L by Entity', description: 'Profit & Loss separated by LLC' },
      { id: 'pnl-property', name: 'P&L by Property', description: 'Individual property performance' },
      { id: 'balance-sheet', name: 'Balance Sheet', description: 'Assets, liabilities, and equity' },
      { id: 'cash-flow', name: 'Cash Flow Statement', description: 'Operating, investing, financing activities' },
      { id: 'trial-balance', name: 'Trial Balance', description: 'All accounts with debit/credit balances' },
    ]
  },
  {
    id: 'operations',
    name: 'Operations Reports',
    icon: Building2,
    color: 'from-green-500 to-emerald-600',
    description: 'Day-to-day property management',
    reports: [
      { id: 'rent-roll', name: 'Rent Roll', description: 'All units with tenant info and rent amounts', popular: true },
      { id: 'vacancy-report', name: 'Vacancy Report', description: 'Empty units and days vacant' },
      { id: 'lease-expiration', name: 'Lease Expiration', description: 'Upcoming lease renewals' },
      { id: 'maintenance-log', name: 'Maintenance Log', description: 'Repairs and maintenance history' },
      { id: 'hap-summary', name: 'HAP Payment Summary', description: 'Housing Authority payments breakdown' },
      { id: 'late-rent', name: 'Late Rent Report', description: 'Overdue rent and collection status' },
    ]
  },
  {
    id: 'vendor',
    name: 'Vendor Reports',
    icon: Users,
    color: 'from-amber-500 to-orange-600',
    description: 'Contractor and vendor analysis',
    reports: [
      { id: 'vendor-summary', name: 'Vendor Payment Summary', description: 'YTD payments by vendor', popular: true },
      { id: 'w9-status', name: 'W-9 Status Report', description: 'Missing W-9s and compliance status' },
      { id: 'vendor-by-property', name: 'Vendor by Property', description: 'Who worked on which property' },
      { id: 'vendor-comparison', name: 'Vendor Cost Comparison', description: 'Compare costs across similar services' },
    ]
  },
  {
    id: 'banking',
    name: 'Banking Reports',
    icon: CreditCard,
    color: 'from-slate-500 to-gray-600',
    description: 'Bank account and transaction reports',
    reports: [
      { id: 'bank-reconciliation', name: 'Bank Reconciliation', description: 'Match bank statements to records' },
      { id: 'unmatched-transactions', name: 'Unmatched Transactions', description: 'Transactions needing property attribution' },
      { id: 'account-activity', name: 'Account Activity', description: 'All transactions by bank account' },
      { id: 'transfer-log', name: 'Inter-Account Transfers', description: 'Money movement between accounts' },
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics & Insights',
    icon: Sparkles,
    color: 'from-pink-500 to-rose-600',
    description: 'AI-powered insights and trends',
    reports: [
      { id: 'portfolio-health', name: 'Portfolio Health Score', description: 'AI analysis of overall performance', popular: true },
      { id: 'expense-trends', name: 'Expense Trends', description: 'Month-over-month expense analysis' },
      { id: 'roi-analysis', name: 'ROI by Property', description: 'Return on investment calculations' },
      { id: 'cash-on-cash', name: 'Cash-on-Cash Return', description: 'Annual cash flow vs. investment' },
      { id: 'cap-rate', name: 'Cap Rate Analysis', description: 'Capitalization rate by property' },
      { id: 'break-even', name: 'Break-Even Analysis', description: 'Occupancy needed to break even' },
    ]
  },
];

// Quick stats calculation
const calculateQuickStats = () => {
  const totalRevenue = mockTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = mockTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  const vendorTotals = getVendorYTDTotals();
  const vendorsNeedingW9 = vendorTotals.filter(v => v.needs_w9).length;
  
  return { totalRevenue, totalExpenses, netIncome, vendorsNeedingW9 };
};

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('ytd');
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  
  const stats = calculateQuickStats();

  const handleGenerateReport = async (reportId: string) => {
    setGeneratingReport(reportId);
    // Simulate report generation
    await new Promise(r => setTimeout(r, 2000));
    setGeneratingReport(null);
    // In real implementation, this would trigger a download or open a modal
    alert(`Report "${reportId}" generated! In production, this would download a PDF/Excel file.`);
  };

  const selectedCategoryData = reportCategories.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm">Generate professional reports for taxes, analysis, and operations</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-xs text-gray-500">YTD Revenue</span>
          </div>
          <p className="text-xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span className="text-xs text-gray-500">YTD Expenses</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalExpenses)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-500">Net Income</span>
          </div>
          <p className={`text-xl font-bold ${stats.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(stats.netIncome)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-gray-500">W-9 Needed</span>
          </div>
          <p className="text-xl font-bold text-amber-600">{stats.vendorsNeedingW9}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters:</span>
          </div>
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: 'ytd', label: 'Year to Date' },
              { value: 'mtd', label: 'Month to Date' },
              { value: 'last-month', label: 'Last Month' },
              { value: 'last-quarter', label: 'Last Quarter' },
              { value: 'last-year', label: 'Last Year' },
              { value: 'custom', label: 'Custom Range' },
            ]}
            className="sm:w-40"
          />
          <Select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            options={[
              { value: 'all', label: 'All Entities' },
              ...mockEntities.map(e => ({ value: e.id, label: e.name }))
            ]}
            className="sm:w-48"
          />
        </div>
      </div>

      {/* Popular Reports Quick Access */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-yellow-300" />
          <h2 className="font-semibold">Quick Reports</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'schedule-e', name: 'Schedule E', icon: Scale },
            { id: 'pnl-portfolio', name: 'Full P&L', icon: BarChart3 },
            { id: 'rent-roll', name: 'Rent Roll', icon: Home },
            { id: '1099-prep', name: '1099 Prep', icon: FileText },
          ].map(report => (
            <button
              key={report.id}
              onClick={() => handleGenerateReport(report.id)}
              disabled={generatingReport !== null}
              className="flex items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-left"
            >
              <report.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{report.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Report Categories */}
      {!selectedCategory ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{category.reports.length} reports</span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Back button */}
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to all reports
          </button>

          {/* Category Header */}
          <div className={`bg-gradient-to-br ${selectedCategoryData?.color} rounded-2xl p-5 text-white`}>
            <div className="flex items-center gap-3">
              {selectedCategoryData && <selectedCategoryData.icon className="h-8 w-8" />}
              <div>
                <h2 className="text-xl font-bold">{selectedCategoryData?.name}</h2>
                <p className="text-white/80 text-sm">{selectedCategoryData?.description}</p>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-3">
            {selectedCategoryData?.reports.map(report => (
              <div
                key={report.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{report.name}</h3>
                      {report.popular && <Badge variant="info" className="text-xs">Popular</Badge>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={generatingReport !== null}
                    >
                      {generatingReport === report.id ? (
                        <><Clock className="h-4 w-4 mr-1 animate-spin" /> Generating...</>
                      ) : (
                        <><Download className="h-4 w-4 mr-1" /> Generate</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Scheduled Reports</h2>
          <p className="text-sm text-gray-500">Automatically generate and email reports</p>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Monthly P&L Summary</p>
                <p className="text-xs text-gray-500">Sends 1st of each month</p>
              </div>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">W-9 Compliance Alert</p>
                <p className="text-xs text-gray-500">Sends when vendors cross $600</p>
              </div>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <Button variant="secondary" className="w-full mt-4">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule New Report
          </Button>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gray-50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-medium text-gray-900">Export All Data</p>
          <p className="text-sm text-gray-500">Download everything for backup or migration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <FileSpreadsheet className="h-4 w-4 mr-1" /> Excel
          </Button>
          <Button variant="secondary" size="sm">
            <FileText className="h-4 w-4 mr-1" /> CSV
          </Button>
          <Button variant="secondary" size="sm">
            <Printer className="h-4 w-4 mr-1" /> PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
