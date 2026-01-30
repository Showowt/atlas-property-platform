'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Shield,
  Scale,
  Building2,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Zap,
  Play
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  content: string;
  position: 'center' | 'bottom' | 'top';
  icon: React.ElementType;
  category: 'feature' | 'compliance' | 'security' | 'integration';
  legalNote?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ATLAS',
    content: 'This guided tour walks you through every capability with special attention to IRS compliance, audit trails, and professional accounting standards. Built for property investors who demand accuracy.',
    position: 'center',
    icon: Sparkles,
    category: 'feature'
  },
  {
    id: 'dashboard',
    title: 'Real-Time Portfolio Dashboard',
    content: 'Your command center shows live financial data across all properties and entities. MTD revenue, expenses, and net income update automatically as transactions sync.',
    position: 'top',
    icon: TrendingUp,
    category: 'feature'
  },
  {
    id: 'multi-entity',
    title: 'Multi-Entity Architecture',
    content: 'Each LLC maintains complete separation with its own Chart of Accounts, P&L, and Balance Sheet. Critical for maintaining liability protection.',
    position: 'center',
    icon: Building2,
    category: 'compliance',
    legalNote: 'Proper entity separation is essential for LLC liability protection. Commingled funds can pierce the corporate veil.'
  },
  {
    id: 'bank-sync',
    title: 'Bank-Level Security via Plaid',
    content: 'ATLAS connects to 12,000+ institutions through Plaid. OAuth 2.0 means we never see your credentials. All data encrypted with AES-256.',
    position: 'center',
    icon: Shield,
    category: 'security',
    legalNote: 'Plaid is SOC 2 Type II certified and examined by the OCC.'
  },
  {
    id: 'auto-categorization',
    title: 'Intelligent Transaction Categorization',
    content: 'ML categorizes transactions based on vendor history and patterns. Schedule E categories built-in. Confidence scores flag uncertain items.',
    position: 'center',
    icon: Zap,
    category: 'feature',
    legalNote: 'Categories map directly to IRS Schedule E line items per Publication 527.'
  },
  {
    id: 'w9-tracking',
    title: 'W-9 Compliance Automation',
    content: 'Real-time vendor payment monitoring. Automatic alerts at $600 threshold. Auto-generated W-9 requests and 1099 preparation.',
    position: 'center',
    icon: AlertTriangle,
    category: 'compliance',
    legalNote: 'IRS requires W-9 before 1099 issuance for payments ≥$600. Penalties: $50-$280 per missing form.'
  },
  {
    id: 'lowes-ai',
    title: "Lowe's Statement AI Processing",
    content: 'Upload statements and Claude Vision AI extracts every line item. Matches to properties via Job Names, allocates to correct LLC.',
    position: 'center',
    icon: FileSpreadsheet,
    category: 'integration',
    legalNote: 'Proper expense documentation is your first line of audit defense.'
  },
  {
    id: 'reports',
    title: '30+ Professional Reports',
    content: 'Schedule E, P&L by entity, Cash Flow, Balance Sheet, Depreciation Schedules, 1099 Prep, Rent Rolls, and more. All IRS-ready formats.',
    position: 'center',
    icon: FileSpreadsheet,
    category: 'feature',
    legalNote: 'All reports follow GAAP standards. Schedule E reports map directly to IRS form line items.'
  },
  {
    id: 'settings',
    title: 'Enterprise-Grade Configuration',
    content: '8+ integrations (Plaid, Buildium, QuickBooks, Xero, Stripe, Zapier). Full API access. Granular notification controls. Team management.',
    position: 'center',
    icon: Shield,
    category: 'security',
    legalNote: 'SOC 2 compliant infrastructure. All data encrypted at rest and in transit. Full audit logging.'
  },
  {
    id: 'audit-trail',
    title: 'Complete Audit Trail',
    content: 'Every action logged with timestamps. Categorization changes, edits, deletions preserved. IRS requires 3-7 years - we keep forever.',
    position: 'center',
    icon: Scale,
    category: 'compliance',
    legalNote: 'Per IRS regulations, maintain records supporting income, deductions, and credits.'
  },
  {
    id: 'conclusion',
    title: 'Built for Professionals',
    content: 'ATLAS was designed with CPAs, not despite them. Every feature supports proper accounting. Questions? Sofia is always available.',
    position: 'center',
    icon: CheckCircle2,
    category: 'feature'
  }
];

export function GuidedTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);
  
  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;
  
  const getCategoryColor = (category: TourStep['category']) => {
    switch (category) {
      case 'compliance': return 'from-amber-500 to-orange-500';
      case 'security': return 'from-green-500 to-emerald-500';
      case 'integration': return 'from-blue-500 to-cyan-500';
      default: return 'from-violet-500 to-purple-500';
    }
  };
  
  const getCategoryLabel = (category: TourStep['category']) => {
    switch (category) {
      case 'compliance': return '⚖️ IRS Compliance';
      case 'security': return '🔒 Security';
      case 'integration': return '🔗 Integration';
      default: return '✨ Feature';
    }
  };

  if (!mounted) return null;
  
  return (
    <>
      {!isActive && (
        <button
          onClick={() => { setIsActive(true); setCurrentStep(0); }}
          className="fixed bottom-20 lg:bottom-6 left-4 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-105 transition-all"
        >
          <Play className="h-5 w-5" />
          <span className="font-medium">Accountant Demo</span>
        </button>
      )}
      
      {isActive && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsActive(false)} />
          
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
              <div className="h-1 bg-gray-100">
                <div className={`h-full bg-gradient-to-r ${getCategoryColor(step.category)} transition-all duration-500`} style={{ width: `${progress}%` }} />
              </div>
              
              <div className={`p-6 bg-gradient-to-r ${getCategoryColor(step.category)}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-white/80">Step {currentStep + 1} of {tourSteps.length}</span>
                  <button onClick={() => setIsActive(false)} className="p-1 hover:bg-white/20 rounded-lg"><X className="h-5 w-5 text-white" /></button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-white/70 uppercase tracking-wide">{getCategoryLabel(step.category)}</span>
                    <h2 className="text-xl font-bold text-white">{step.title}</h2>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">{step.content}</p>
                {step.legalNote && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <div className="flex items-start gap-2">
                      <Scale className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Legal Note</p>
                        <p className="text-sm text-amber-700 mt-1">{step.legalNote}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-6 pb-6 flex items-center justify-between">
                <button onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0} className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-30 transition-colors">
                  <ChevronLeft className="h-4 w-4" />Back
                </button>
                <div className="flex gap-1">
                  {tourSteps.map((_, i) => (
                    <button key={i} onClick={() => setCurrentStep(i)} className={`w-2 h-2 rounded-full transition-all ${i === currentStep ? 'w-6 bg-gradient-to-r ' + getCategoryColor(step.category) : i < currentStep ? 'bg-gray-400' : 'bg-gray-200'}`} />
                  ))}
                </div>
                <button onClick={() => currentStep === tourSteps.length - 1 ? setIsActive(false) : setCurrentStep(s => s + 1)} className={`flex items-center gap-1 px-5 py-2 bg-gradient-to-r ${getCategoryColor(step.category)} text-white rounded-xl font-medium hover:shadow-lg transition-all`}>
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}<ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
