'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DemoState {
  isDemo: boolean;
  showTour: boolean;
  tourStep: number;
  animatingSync: 'plaid' | 'buildium' | 'lowes' | null;
  recentActivity: Activity[];
  bankAccounts: BankAccount[];
  buildiumProperties: BuildiumProperty[];
  syncProgress: number;
}

interface Activity {
  id: string;
  type: 'transaction' | 'sync' | 'w9' | 'lowes' | 'rent_change';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'warning';
}

interface BankAccount {
  id: string;
  name: string;
  institution: string;
  mask: string;
  balance: number;
  type: 'checking' | 'savings' | 'credit';
  logo: string;
  connected: boolean;
  lastSync?: Date;
}

interface BuildiumProperty {
  id: string;
  address: string;
  unit?: string;
  tenant: string;
  rentAmount: number;
  hapAmount: number;
  tenantPortion: number;
  leaseEnd: string;
  status: 'current' | 'late' | 'vacant';
}

const initialBankAccounts: BankAccount[] = [
  { id: 'ba_1', name: 'Business Checking', institution: 'Chase', mask: '4521', balance: 47832.56, type: 'checking', logo: '🏦', connected: false },
  { id: 'ba_2', name: 'Property Reserve', institution: 'Chase', mask: '8834', balance: 125000.00, type: 'savings', logo: '🏦', connected: false },
  { id: 'ba_3', name: '0608 LLC Operating', institution: 'Bank of America', mask: '2291', balance: 18445.23, type: 'checking', logo: '🏛️', connected: false },
  { id: 'ba_4', name: 'Wabash Partners', institution: 'PNC', mask: '6672', balance: 34221.89, type: 'checking', logo: '🏦', connected: false },
  { id: 'ba_5', name: 'Lowe\'s Credit', institution: 'Synchrony', mask: '0099', balance: -2463.06, type: 'credit', logo: '💳', connected: false },
];

const initialBuildiumProperties: BuildiumProperty[] = [
  { id: 'bp_1', address: '1234 Oak Street', tenant: 'Marcus Johnson', rentAmount: 1200, hapAmount: 950, tenantPortion: 250, leaseEnd: '2025-08-31', status: 'current' },
  { id: 'bp_2', address: '5678 Maple Ave', tenant: 'Sarah Williams', rentAmount: 1400, hapAmount: 1100, tenantPortion: 300, leaseEnd: '2025-06-30', status: 'current' },
  { id: 'bp_3', address: '910 Pine Road', tenant: 'David Chen', rentAmount: 1100, hapAmount: 0, tenantPortion: 1100, leaseEnd: '2025-12-31', status: 'current' },
  { id: 'bp_4', address: '2468 Elm Court', tenant: 'Lisa Martinez', rentAmount: 1350, hapAmount: 1050, tenantPortion: 300, leaseEnd: '2025-04-30', status: 'late' },
  { id: 'bp_5', address: '1357 Birch Lane', unit: 'A', tenant: 'James Wilson', rentAmount: 950, hapAmount: 750, tenantPortion: 200, leaseEnd: '2025-09-30', status: 'current' },
  { id: 'bp_6', address: '1357 Birch Lane', unit: 'B', tenant: '', rentAmount: 950, hapAmount: 0, tenantPortion: 0, leaseEnd: '', status: 'vacant' },
];

const DemoContext = createContext<{
  state: DemoState;
  startTour: () => void;
  nextTourStep: () => void;
  endTour: () => void;
  simulatePlaidConnect: () => Promise<void>;
  simulateBuildiumSync: () => Promise<void>;
  simulateLowesImport: () => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  connectBank: (bankId: string) => void;
} | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>({
    isDemo: true,
    showTour: false,
    tourStep: 0,
    animatingSync: null,
    recentActivity: [],
    bankAccounts: initialBankAccounts,
    buildiumProperties: initialBuildiumProperties,
    syncProgress: 0,
  });

  const addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: `act_${Date.now()}`,
      timestamp: new Date(),
    };
    setState(s => ({
      ...s,
      recentActivity: [newActivity, ...s.recentActivity].slice(0, 20)
    }));
  };

  const startTour = () => setState(s => ({ ...s, showTour: true, tourStep: 0 }));
  const nextTourStep = () => setState(s => ({ ...s, tourStep: s.tourStep + 1 }));
  const endTour = () => setState(s => ({ ...s, showTour: false, tourStep: 0 }));

  const connectBank = (bankId: string) => {
    setState(s => ({
      ...s,
      bankAccounts: s.bankAccounts.map(b => 
        b.id === bankId ? { ...b, connected: true, lastSync: new Date() } : b
      )
    }));
  };

  const simulatePlaidConnect = async () => {
    setState(s => ({ ...s, animatingSync: 'plaid', syncProgress: 0 }));
    
    // Simulate connection progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 200));
      setState(s => ({ ...s, syncProgress: i }));
    }

    // Connect all banks
    setState(s => ({
      ...s,
      bankAccounts: s.bankAccounts.map(b => ({ ...b, connected: true, lastSync: new Date() })),
      animatingSync: null,
      syncProgress: 0,
    }));

    // Add activities for imported transactions
    const txnActivities = [
      { type: 'transaction' as const, title: 'Home Depot - $342.18', description: 'Auto-categorized: Repairs & Maintenance → 1234 Oak Street', status: 'success' as const },
      { type: 'transaction' as const, title: 'City Water Utility - $89.45', description: 'Auto-categorized: Utilities → 5678 Maple Ave', status: 'success' as const },
      { type: 'transaction' as const, title: 'Unknown Vendor - $156.00', description: 'Needs property attribution', status: 'warning' as const },
      { type: 'transaction' as const, title: 'Rent Deposit - $1,200.00', description: 'Auto-matched: Marcus Johnson → 1234 Oak Street', status: 'success' as const },
      { type: 'sync' as const, title: 'Plaid Sync Complete', description: '47 transactions imported from 5 accounts', status: 'success' as const },
    ];

    for (const act of txnActivities) {
      await new Promise(r => setTimeout(r, 300));
      addActivity(act);
    }
  };

  const simulateBuildiumSync = async () => {
    setState(s => ({ ...s, animatingSync: 'buildium', syncProgress: 0 }));
    
    for (let i = 0; i <= 100; i += 15) {
      await new Promise(r => setTimeout(r, 250));
      setState(s => ({ ...s, syncProgress: i }));
    }

    setState(s => ({ ...s, animatingSync: null, syncProgress: 0 }));

    const activities = [
      { type: 'rent_change' as const, title: 'HAP Change Detected', description: '2468 Elm Court: $1,050 → $1,125 effective Feb 1', status: 'warning' as const },
      { type: 'sync' as const, title: 'Lease Expiring Soon', description: '2468 Elm Court - Lisa Martinez - Apr 30, 2025', status: 'warning' as const },
      { type: 'sync' as const, title: 'Rent Roll Updated', description: '6 properties synced from Buildium', status: 'success' as const },
    ];

    for (const act of activities) {
      await new Promise(r => setTimeout(r, 400));
      addActivity(act);
    }
  };

  const simulateLowesImport = async () => {
    setState(s => ({ ...s, animatingSync: 'lowes', syncProgress: 0 }));
    
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(r => setTimeout(r, 300));
      setState(s => ({ ...s, syncProgress: i }));
    }

    setState(s => ({ ...s, animatingSync: null, syncProgress: 0 }));

    const activities = [
      { type: 'lowes' as const, title: 'Statement Parsed', description: '14 line items extracted via AI', status: 'success' as const },
      { type: 'lowes' as const, title: 'Auto-Matched: 12 items', description: 'Matched to properties by job name', status: 'success' as const },
      { type: 'lowes' as const, title: '2 Items Need Review', description: 'Unknown job names require manual assignment', status: 'warning' as const },
      { type: 'lowes' as const, title: 'LLC Allocation Ready', description: '0608 LLC: $847.23 | Wabash: $1,459.83 | Personal: $156.00', status: 'success' as const },
    ];

    for (const act of activities) {
      await new Promise(r => setTimeout(r, 350));
      addActivity(act);
    }
  };

  return (
    <DemoContext.Provider value={{
      state,
      startTour,
      nextTourStep,
      endTour,
      simulatePlaidConnect,
      simulateBuildiumSync,
      simulateLowesImport,
      addActivity,
      connectBank,
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within DemoProvider');
  return context;
}
