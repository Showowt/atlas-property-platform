'use client';

import { useState, useEffect } from 'react';
import { useDemo } from '@/lib/demo-context';
import { Button, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { 
  Zap, Building2, CreditCard, FileSpreadsheet, CheckCircle2, AlertTriangle,
  ArrowRight, Sparkles, RefreshCw, Play, Trophy, Coffee, Brain, Rocket,
  PartyPopper, Clock, Bot, Flame, BarChart3, Settings, Users, Home,
  FileText, Shield, Scale, Bell, PieChart, Download, Mail
} from 'lucide-react';
import Link from 'next/link';

const funFacts = [
  { icon: Coffee, text: "The average landlord spends 12 hours/month on bookkeeping. ATLAS users spend 12 minutes. ☕", color: "text-amber-500" },
  { icon: Brain, text: "Our AI has processed 2M+ Lowe's items. It knows a toilet flapper from a flux capacitor. 🚽", color: "text-purple-500" },
  { icon: Trophy, text: "Zero ATLAS users audited. Coincidence? Our lawyers say yes. We say 'you're welcome.' 🏆", color: "text-yellow-500" },
  { icon: Rocket, text: "ATLAS categorizes faster than you can say 'Schedule E line 5.' Go ahead, try. 🚀", color: "text-blue-500" },
  { icon: Scale, text: "30+ reports ready for your CPA. They might actually smile at tax time. Stranger things have happened. 📊", color: "text-green-500" },
  { icon: Bell, text: "W-9 alerts at $600? We've prevented more IRS letters than we can count. Your mailman thanks us. 📬", color: "text-red-500" },
  { icon: Shield, text: "Bank-level encryption + SOC 2 compliance. Your data is safer than your password '123456'. Please change that. 🔐", color: "text-indigo-500" },
  { icon: Users, text: "Track unlimited vendors. Yes, even that guy who fixed your toilet at 2am. He needs a W-9 too. 🔧", color: "text-pink-500" },
];

function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const inc = target / 60;
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function DemoPage() {
  const { state, simulatePlaidConnect, simulateBuildiumSync, simulateLowesImport } = useDemo();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentFact, setCurrentFact] = useState(0);
  const [demoComplete, setDemoComplete] = useState({ 
    plaid: false, 
    buildium: false, 
    lowes: false,
    reports: false,
    w9: false,
    settings: false
  });
  const [savedHours, setSavedHours] = useState(0);
  const [savedMoney, setSavedMoney] = useState(0);
  const [generatedReports, setGeneratedReports] = useState<string[]>([]);
  const [w9Alerts, setW9Alerts] = useState<string[]>([]);

  const connectedBanks = state.bankAccounts.filter(b => b.connected).length;
  
  useEffect(() => {
    const interval = setInterval(() => setCurrentFact(p => (p + 1) % funFacts.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerCelebration = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handlePlaidDemo = async () => {
    setActiveDemo('plaid');
    await simulatePlaidConnect();
    setActiveDemo(null);
    setDemoComplete(p => ({ ...p, plaid: true }));
    setSavedHours(p => p + 8);
    setSavedMoney(p => p + 400);
    triggerCelebration();
  };

  const handleBuildiumDemo = async () => {
    setActiveDemo('buildium');
    await simulateBuildiumSync();
    setActiveDemo(null);
    setDemoComplete(p => ({ ...p, buildium: true }));
    setSavedHours(p => p + 4);
    setSavedMoney(p => p + 200);
    triggerCelebration();
  };

  const handleLowesDemo = async () => {
    setActiveDemo('lowes');
    await simulateLowesImport();
    setActiveDemo(null);
    setDemoComplete(p => ({ ...p, lowes: true }));
    setSavedHours(p => p + 3);
    setSavedMoney(p => p + 150);
    triggerCelebration();
  };

  const handleReportsDemo = async () => {
    setActiveDemo('reports');
    const reports = ['Schedule E', 'P&L Summary', 'Cash Flow', 'Rent Roll'];
    for (let i = 0; i < reports.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setGeneratedReports(prev => [...prev, reports[i]]);
    }
    await new Promise(r => setTimeout(r, 400));
    setActiveDemo(null);
    setDemoComplete(p => ({ ...p, reports: true }));
    setSavedHours(p => p + 6);
    setSavedMoney(p => p + 300);
    triggerCelebration();
  };

  const handleW9Demo = async () => {
    setActiveDemo('w9');
    const vendors = [
      { name: 'ABC Plumbing', amount: '$2,450' },
      { name: 'Quick Electric', amount: '$1,890' },
      { name: 'Green Lawn Care', amount: '$1,200' },
    ];
    for (let i = 0; i < vendors.length; i++) {
      await new Promise(r => setTimeout(r, 700));
      setW9Alerts(prev => [...prev, `⚠️ ${vendors[i].name} crossed $600 (YTD: ${vendors[i].amount})`]);
    }
    await new Promise(r => setTimeout(r, 500));
    setActiveDemo(null);
    setDemoComplete(p => ({ ...p, w9: true }));
    setSavedHours(p => p + 2);
    setSavedMoney(p => p + 100);
    triggerCelebration();
  };

  const handleSettingsDemo = async () => {
    setActiveDemo('settings');
    await new Promise(r => setTimeout(r, 2000));
    setActiveDemo(null);
    setDemoComplete(p => ({ ...p, settings: true }));
    setSavedHours(p => p + 1);
    triggerCelebration();
  };

  const allComplete = demoComplete.plaid && demoComplete.buildium && demoComplete.lowes && demoComplete.reports && demoComplete.w9;
  const completedCount = Object.values(demoComplete).filter(Boolean).length;
  const totalDemos = Object.keys(demoComplete).length - 1; // Exclude settings from required
  const fact = funFacts[currentFact];

  return (
    <div className="space-y-6">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="absolute animate-bounce" style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}>
              {['🎉', '🎊', '✨', '🚀', '💰'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}
      
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-4 right-4 animate-bounce"><Sparkles className="h-8 w-8 text-yellow-300 opacity-60" /></div>
        <div className="absolute bottom-4 left-4 animate-pulse"><Rocket className="h-6 w-6 text-pink-300 opacity-60" /></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full">
              <Flame className="h-4 w-4 text-orange-300" />
              <span className="text-sm font-medium">Interactive Demo</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">Watch the Magic Happen ✨</h1>
          <p className="text-purple-100 text-sm sm:text-base max-w-xl">
            Click the buttons below and watch ATLAS do in seconds what takes you hours.
            <span className="hidden sm:inline"> No spreadsheets were harmed in this demo.</span>
          </p>
        </div>
      </div>

      {/* Savings Tracker */}
      {savedHours > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl"><Trophy className="h-6 w-6" /></div>
              <div>
                <p className="text-sm text-green-100">You just saved</p>
                <p className="text-2xl font-bold"><AnimatedCounter target={savedHours} suffix=" hours" /> · <AnimatedCounter target={savedMoney} prefix="$" /></p>
              </div>
            </div>
            {allComplete && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full">
                <PartyPopper className="h-5 w-5" /><span className="font-medium">All complete!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fun Fact */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-gray-800 rounded-xl ${fact.color}`}><fact.icon className="h-5 w-5" /></div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-0.5">Did you know?</p>
            <p className="text-sm text-white font-medium">{fact.text}</p>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      {state.recentActivity.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
            </div>
            <span className="text-sm font-medium text-white">Live Activity</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {state.recentActivity.slice(0, 5).map((activity, idx) => (
              <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-xl ${idx === 0 ? 'bg-gray-800 ring-1 ring-green-500/50' : 'bg-gray-800/50'}`}>
                <div className={`p-1.5 rounded-lg ${activity.status === 'success' ? 'bg-green-500/20' : activity.status === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'}`}>
                  {activity.status === 'success' ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : activity.status === 'warning' ? <AlertTriangle className="h-4 w-4 text-yellow-400" /> : <Clock className="h-4 w-4 text-blue-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                  <p className="text-xs text-gray-400 truncate">{activity.description}</p>
                </div>
                {idx === 0 && <span className="text-xs text-green-400 animate-pulse">Just now</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Demo Cards */}
      <div className="space-y-4">
        {/* Plaid */}
        <div className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${demoComplete.plaid ? 'border-green-500' : 'border-gray-100'}`}>
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${demoComplete.plaid ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-emerald-400 to-teal-600'}`}>
                  {demoComplete.plaid ? <CheckCircle2 className="h-6 w-6 text-white" /> : <CreditCard className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Bank Account Sync</h3>
                  <p className="text-sm text-gray-500">{demoComplete.plaid ? '✅ 5 accounts connected!' : 'Faster than your coffee order'}</p>
                </div>
              </div>
              {demoComplete.plaid && <Badge variant="success">Done!</Badge>}
            </div>
            {!demoComplete.plaid && (
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-3 mb-4">
                <p className="text-sm text-teal-800">🏦 Watch 5 banks connect, 47 transactions import, and auto-categorize. <em>It's like Excel, but it doesn't hate you.</em></p>
              </div>
            )}
            {connectedBanks > 0 && (
              <div className="space-y-2 mb-4">
                {state.bankAccounts.filter(b => b.connected).slice(0, 3).map(bank => (
                  <div key={bank.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{bank.logo}</span>
                      <div><p className="font-medium text-gray-900 text-sm">{bank.name}</p><p className="text-xs text-gray-500">{bank.institution}</p></div>
                    </div>
                    <p className={`font-semibold ${bank.balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>{formatCurrency(bank.balance)}</p>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={handlePlaidDemo} disabled={activeDemo !== null || demoComplete.plaid} className={`w-full ${demoComplete.plaid ? 'bg-green-600' : ''}`}>
              {activeDemo === 'plaid' ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Connecting... {state.syncProgress}%</> : demoComplete.plaid ? <><CheckCircle2 className="h-4 w-4 mr-2" />Banks Connected!</> : <><Play className="h-4 w-4 mr-2" />Connect 5 Banks Instantly</>}
            </Button>
          </div>
          {state.animatingSync === 'plaid' && <div className="h-2 bg-gray-100"><div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all" style={{ width: `${state.syncProgress}%` }} /></div>}
        </div>

        {/* Buildium */}
        <div className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${demoComplete.buildium ? 'border-green-500' : 'border-gray-100'}`}>
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${demoComplete.buildium ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-purple-400 to-violet-600'}`}>
                  {demoComplete.buildium ? <CheckCircle2 className="h-6 w-6 text-white" /> : <Building2 className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Rent Roll Sync</h3>
                  <p className="text-sm text-gray-500">{demoComplete.buildium ? '✅ 6 properties synced!' : 'Buildium, meet your new best friend'}</p>
                </div>
              </div>
              {demoComplete.buildium && <Badge variant="success">Done!</Badge>}
            </div>
            {!demoComplete.buildium && (
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-3 mb-4">
                <p className="text-sm text-purple-800">🏠 Pull rent rolls, tenant info, HAP breakdowns. <em>No more copy-paste from Buildium to Excel. You're welcome.</em></p>
              </div>
            )}
            {demoComplete.buildium && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-purple-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-purple-600">6</p><p className="text-xs text-purple-600">Properties</p></div>
                <div className="bg-green-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-green-600">$7,950</p><p className="text-xs text-green-600">/month</p></div>
                <div className="bg-amber-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-amber-600">$4,850</p><p className="text-xs text-amber-600">HAP</p></div>
              </div>
            )}
            <Button onClick={handleBuildiumDemo} disabled={activeDemo !== null || demoComplete.buildium} variant={demoComplete.buildium ? 'primary' : 'secondary'} className={`w-full ${demoComplete.buildium ? 'bg-green-600' : ''}`}>
              {activeDemo === 'buildium' ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Syncing... {state.syncProgress}%</> : demoComplete.buildium ? <><CheckCircle2 className="h-4 w-4 mr-2" />Rent Roll Synced!</> : <><Play className="h-4 w-4 mr-2" />Sync Rent Roll</>}
            </Button>
          </div>
          {state.animatingSync === 'buildium' && <div className="h-2 bg-gray-100"><div className="h-full bg-gradient-to-r from-purple-400 to-violet-500 transition-all" style={{ width: `${state.syncProgress}%` }} /></div>}
        </div>

        {/* Lowe's */}
        <div className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${demoComplete.lowes ? 'border-green-500' : 'border-gray-100'}`}>
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${demoComplete.lowes ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-blue-400 to-indigo-600'}`}>
                  {demoComplete.lowes ? <CheckCircle2 className="h-6 w-6 text-white" /> : <FileSpreadsheet className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Lowe's AI Parser</h3>
                  <p className="text-sm text-gray-500">{demoComplete.lowes ? '✅ 14 items parsed!' : 'AI that reads receipts better than you'}</p>
                </div>
              </div>
              <Badge variant="info" className="flex items-center gap-1"><Bot className="h-3 w-3" /> AI</Badge>
            </div>
            {!demoComplete.lowes && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 mb-4">
                <p className="text-sm text-blue-800">🤖 AI reads your Lowe's statement, extracts items, matches to properties. <em>Like having an intern, but it doesn't need lunch breaks.</em></p>
              </div>
            )}
            {demoComplete.lowes && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-gray-900 mb-2">LLC Allocation (auto-calculated):</p>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-sm text-gray-600">0608 LLC</span><span className="font-semibold">$847.23</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Wabash Partners</span><span className="font-semibold">$1,459.83</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Personal</span><span className="font-semibold">$156.00</span></div>
                  <div className="border-t pt-2 flex justify-between"><span className="font-medium">Total</span><span className="font-bold">$2,463.06</span></div>
                </div>
              </div>
            )}
            <Button onClick={handleLowesDemo} disabled={activeDemo !== null || demoComplete.lowes} variant={demoComplete.lowes ? 'primary' : 'secondary'} className={`w-full ${demoComplete.lowes ? 'bg-green-600' : ''}`}>
              {activeDemo === 'lowes' ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Processing... {state.syncProgress}%</> : demoComplete.lowes ? <><CheckCircle2 className="h-4 w-4 mr-2" />Statement Parsed!</> : <><Zap className="h-4 w-4 mr-2" />Parse Lowe's Statement</>}
            </Button>
          </div>
          {state.animatingSync === 'lowes' && <div className="h-2 bg-gray-100"><div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all" style={{ width: `${state.syncProgress}%` }} /></div>}
        </div>

        {/* Reports Demo */}
        <div className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${demoComplete.reports ? 'border-green-500' : 'border-gray-100'}`}>
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${demoComplete.reports ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-amber-400 to-orange-600'}`}>
                  {demoComplete.reports ? <CheckCircle2 className="h-6 w-6 text-white" /> : <BarChart3 className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Report Generator</h3>
                  <p className="text-sm text-gray-500">{demoComplete.reports ? '✅ 4 reports generated!' : '30+ professional reports, one click'}</p>
                </div>
              </div>
              {demoComplete.reports && <Badge variant="success">Done!</Badge>}
            </div>
            {!demoComplete.reports && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 mb-4">
                <p className="text-sm text-amber-800">📊 Watch Schedule E, P&L, Cash Flow, and Rent Roll generate instantly. <em>Your CPA might actually smile.</em></p>
              </div>
            )}
            {generatedReports.length > 0 && (
              <div className="space-y-2 mb-4">
                {generatedReports.map((report, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">{report}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600">PDF</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={handleReportsDemo} disabled={activeDemo !== null || demoComplete.reports} variant={demoComplete.reports ? 'primary' : 'secondary'} className={`w-full ${demoComplete.reports ? 'bg-green-600' : ''}`}>
              {activeDemo === 'reports' ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Generating Reports...</> : demoComplete.reports ? <><CheckCircle2 className="h-4 w-4 mr-2" />Reports Ready!</> : <><PieChart className="h-4 w-4 mr-2" />Generate Tax Reports</>}
            </Button>
          </div>
        </div>

        {/* W-9 Demo */}
        <div className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${demoComplete.w9 ? 'border-green-500' : 'border-gray-100'}`}>
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${demoComplete.w9 ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-rose-600'}`}>
                  {demoComplete.w9 ? <CheckCircle2 className="h-6 w-6 text-white" /> : <AlertTriangle className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">W-9 Compliance</h3>
                  <p className="text-sm text-gray-500">{demoComplete.w9 ? '✅ 3 vendors flagged!' : 'Never miss a 1099 again'}</p>
                </div>
              </div>
              {demoComplete.w9 && <Badge variant="success">Done!</Badge>}
            </div>
            {!demoComplete.w9 && (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-3 mb-4">
                <p className="text-sm text-red-800">🚨 Watch ATLAS detect vendors crossing $600 in real-time. <em>The IRS sends enough letters already.</em></p>
              </div>
            )}
            {w9Alerts.length > 0 && (
              <div className="space-y-2 mb-4">
                {w9Alerts.map((alert, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                    <Bell className="h-4 w-4 text-amber-600" />
                    <span className="text-xs text-amber-800">{alert}</span>
                  </div>
                ))}
                {demoComplete.w9 && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                    <Mail className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-green-800">✅ W-9 request emails auto-generated!</span>
                  </div>
                )}
              </div>
            )}
            <Button onClick={handleW9Demo} disabled={activeDemo !== null || demoComplete.w9} variant={demoComplete.w9 ? 'primary' : 'secondary'} className={`w-full ${demoComplete.w9 ? 'bg-green-600' : ''}`}>
              {activeDemo === 'w9' ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Scanning Vendors...</> : demoComplete.w9 ? <><CheckCircle2 className="h-4 w-4 mr-2" />Compliance Check Done!</> : <><Scale className="h-4 w-4 mr-2" />Run Compliance Check</>}
            </Button>
          </div>
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          More Features to Explore
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Home, label: 'Properties', desc: '7 units tracked', href: '/dashboard/properties' },
            { icon: Building2, label: 'Entities', desc: '4 LLCs managed', href: '/dashboard/entities' },
            { icon: Users, label: 'Vendors', desc: '12 contractors', href: '/dashboard/vendors' },
            { icon: Settings, label: 'Settings', desc: '8 integrations', href: '/dashboard/settings' },
          ].map((feature, i) => (
            <Link key={i} href={feature.href} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
              <feature.icon className="h-6 w-6 text-gray-400 group-hover:text-purple-500 mb-2 transition-colors" />
              <p className="font-medium text-gray-900 text-sm">{feature.label}</p>
              <p className="text-xs text-gray-500">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      {allComplete ? (
        <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl p-6 text-center">
          <PartyPopper className="h-12 w-12 text-white mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-white mb-2">You're a Pro! 🎉</h3>
          <p className="text-green-100 text-sm mb-4">You just experienced the full ATLAS platform. <em>Imagine this with YOUR actual properties.</em></p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard"><Button className="bg-white text-green-600 hover:bg-green-50">View Dashboard <ArrowRight className="h-4 w-4 ml-2" /></Button></Link>
            <Link href="/dashboard/reports"><Button variant="secondary" className="border-white text-white hover:bg-white/10">Browse Reports</Button></Link>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">{savedHours > 0 ? `${5 - completedCount} demos left!` : 'Try All 5 Demos ☝️'}</h3>
          <p className="text-gray-400 text-sm mb-4">{savedHours > 0 ? 'Complete all demos to unlock the full experience' : 'Click the buttons above to watch ATLAS work'}</p>
          <div className="flex justify-center gap-2">
            <div className={`w-3 h-3 rounded-full transition-all ${demoComplete.plaid ? 'bg-green-500' : 'bg-gray-600'}`} title="Bank Sync" />
            <div className={`w-3 h-3 rounded-full transition-all ${demoComplete.buildium ? 'bg-green-500' : 'bg-gray-600'}`} title="Rent Roll" />
            <div className={`w-3 h-3 rounded-full transition-all ${demoComplete.lowes ? 'bg-green-500' : 'bg-gray-600'}`} title="Lowe's AI" />
            <div className={`w-3 h-3 rounded-full transition-all ${demoComplete.reports ? 'bg-green-500' : 'bg-gray-600'}`} title="Reports" />
            <div className={`w-3 h-3 rounded-full transition-all ${demoComplete.w9 ? 'bg-green-500' : 'bg-gray-600'}`} title="W-9" />
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-500">
        <p>💬 Questions? Click the purple bubble to chat with <strong>Sofia</strong> - she knows everything!</p>
      </div>
    </div>
  );
}
