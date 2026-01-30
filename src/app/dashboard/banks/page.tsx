'use client';

import { useState } from 'react';
import { useDemo } from '@/lib/demo-context';
import { Button, Badge, Modal } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { 
  CreditCard, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Link as LinkIcon
} from 'lucide-react';

export default function BanksPage() {
  const { state, simulatePlaidConnect, connectBank } = useDemo();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const connectedAccounts = state.bankAccounts.filter(b => b.connected);
  const availableAccounts = state.bankAccounts.filter(b => !b.connected);
  
  const totalBalance = connectedAccounts.reduce((sum, b) => sum + b.balance, 0);
  const totalAssets = connectedAccounts.filter(b => b.balance > 0).reduce((sum, b) => sum + b.balance, 0);
  const totalLiabilities = Math.abs(connectedAccounts.filter(b => b.balance < 0).reduce((sum, b) => sum + b.balance, 0));

  const handleConnectAll = async () => {
    setConnecting(true);
    await simulatePlaidConnect();
    setConnecting(false);
    setShowConnectModal(false);
  };

  const handleConnectSingle = async (bankId: string) => {
    setSelectedBank(bankId);
    await new Promise(r => setTimeout(r, 1500));
    connectBank(bankId);
    setSelectedBank(null);
  };

  const recentTransactions = [
    { id: 't1', date: '2026-01-30', description: 'Home Depot #4521', amount: -342.18, account: 'Business Checking', category: 'Repairs' },
    { id: 't2', date: '2026-01-30', description: 'Rent Deposit - M. Johnson', amount: 1200.00, account: 'Business Checking', category: 'Rental Income' },
    { id: 't3', date: '2026-01-29', description: 'City Water Utility', amount: -89.45, account: '0608 LLC Operating', category: 'Utilities' },
    { id: 't4', date: '2026-01-29', description: 'Transfer from Reserve', amount: 5000.00, account: 'Business Checking', category: 'Transfer' },
    { id: 't5', date: '2026-01-28', description: "Lowe's #2847", amount: -156.00, account: "Lowe's Credit", category: 'Supplies' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bank Accounts</h1>
          <p className="text-gray-500 text-sm">Connect and manage your financial accounts</p>
        </div>
        <Button onClick={() => setShowConnectModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </div>

      {connectedAccounts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-200" />
              <span className="text-sm text-green-100">Total Assets</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(totalAssets)}</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-red-200" />
              <span className="text-sm text-red-100">Liabilities</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(totalLiabilities)}</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-5 w-5 text-blue-200" />
              <span className="text-sm text-blue-100">Net Position</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold">{formatCurrency(totalBalance)}</p>
          </div>
        </div>
      )}

      {connectedAccounts.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Connected Accounts</h2>
            <Badge variant="success">{connectedAccounts.length} Active</Badge>
          </div>
          <div className="divide-y divide-gray-50">
            {connectedAccounts.map(account => (
              <div key={account.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                      {account.logo}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{account.name}</p>
                      <p className="text-sm text-gray-500">{account.institution} •••• {account.mask}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${account.balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatCurrency(account.balance)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Synced just now
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Accounts Connected</h3>
          <p className="text-gray-600 text-sm mb-4 max-w-sm mx-auto">
            Connect your bank accounts to automatically import transactions and track cash flow.
          </p>
          <Button onClick={() => setShowConnectModal(true)}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Connect via Plaid
          </Button>
        </div>
      )}

      {connectedAccounts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recentTransactions.map(txn => (
              <div key={txn.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      txn.amount > 0 ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {txn.amount > 0 ? (
                        <ArrowDownRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{txn.description}</p>
                      <p className="text-xs text-gray-500">{txn.account} • {txn.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${txn.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {txn.amount > 0 ? '+' : ''}{formatCurrency(txn.amount)}
                    </p>
                    <p className="text-xs text-gray-500">{txn.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={showConnectModal} onClose={() => setShowConnectModal(false)} title="Connect Bank Account">
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-blue-900">Secure Connection via Plaid</p>
              <p className="text-sm text-blue-700">Your credentials are never stored.</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Available Accounts</p>
            {state.bankAccounts.map(account => (
              <div 
                key={account.id} 
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  account.connected ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{account.logo}</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.institution}</p>
                  </div>
                </div>
                {account.connected ? (
                  <Badge variant="success">Connected</Badge>
                ) : selectedBank === account.id ? (
                  <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => handleConnectSingle(account.id)}>
                    Connect
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setShowConnectModal(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleConnectAll}
              disabled={connecting || availableAccounts.length === 0}
            >
              {connecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>Connect All ({availableAccounts.length})</>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
