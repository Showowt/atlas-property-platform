'use client';

import { useState } from 'react';
import { useDemo } from '@/lib/demo-context';
import { Button, Badge, Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { 
  Zap, 
  Building2, 
  CreditCard, 
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Play,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
  const { state, simulatePlaidConnect, simulateBuildiumSync, simulateLowesImport } = useDemo();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const connectedBanks = state.bankAccounts.filter(b => b.connected).length;
  const totalBalance = state.bankAccounts.reduce((sum, b) => sum + b.balance, 0);

  const handlePlaidDemo = async () => {
    setActiveDemo('plaid');
    await simulatePlaidConnect();
    setActiveDemo(null);
  };

  const handleBuildiumDemo = async () => {
    setActiveDemo('buildium');
    await simulateBuildiumSync();
    setActiveDemo(null);
  };

  const handleLowesDemo = async () => {
    setActiveDemo('lowes');
    await simulateLowesImport();
    setActiveDemo(null);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-medium text-blue-100">Interactive Demo Mode</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Experience ATLAS in Action</h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl">
            Watch real-time bank syncing, automatic transaction categorization, and intelligent property attribution. 
            This is the future of property accounting.
          </p>
        </div>
      </div>

      {/* Live Activity Feed */}
      {state.recentActivity.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-4 overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white">Live Activity</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {state.recentActivity.slice(0, 5).map((activity, idx) => (
              <div 
                key={activity.id} 
                className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                  idx === 0 ? 'bg-gray-800 animate-pulse' : 'bg-gray-800/50'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${
                  activity.status === 'success' ? 'bg-green-500/20' :
                  activity.status === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                }`}>
                  {activity.status === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  ) : activity.status === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-blue-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                  <p className="text-xs text-gray-400 truncate">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integration Cards */}
      <div className="space-y-4">
        {/* Plaid Integration */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Bank Account Sync</h3>
                  <p className="text-sm text-gray-500">Powered by Plaid</p>
                </div>
              </div>
              {connectedBanks > 0 && (
                <Badge variant="success">{connectedBanks} Connected</Badge>
              )}
            </div>

            {connectedBanks > 0 ? (
              <div className="space-y-3 mb-4">
                {state.bankAccounts.filter(b => b.connected).slice(0, 3).map(bank => (
                  <div key={bank.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{bank.logo}</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{bank.name}</p>
                        <p className="text-xs text-gray-500">{bank.institution} •••• {bank.mask}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${bank.balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatCurrency(bank.balance)}
                    </p>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Total Balance</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(totalBalance)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-4">
                Connect your bank accounts to automatically import transactions, categorize expenses, 
                and attribute costs to properties.
              </p>
            )}

            <Button 
              onClick={handlePlaidDemo}
              disabled={activeDemo !== null}
              className="w-full"
            >
              {activeDemo === 'plaid' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connecting... {state.syncProgress}%
                </>
              ) : connectedBanks > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Transactions
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Connect Banks (Demo)
                </>
              )}
            </Button>
          </div>

          {state.animatingSync === 'plaid' && (
            <div className="h-1 bg-gray-100">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                style={{ width: `${state.syncProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Buildium Integration */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Rent Roll Sync</h3>
                  <p className="text-sm text-gray-500">Powered by Buildium</p>
                </div>
              </div>
              <Badge variant="info">{state.buildiumProperties.length} Properties</Badge>
            </div>

            <div className="space-y-2 mb-4">
              {state.buildiumProperties.slice(0, 3).map(prop => (
                <div key={prop.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {prop.address}{prop.unit ? ` #${prop.unit}` : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      {prop.tenant || 'Vacant'} 
                      {prop.hapAmount > 0 && ` • HAP: ${formatCurrency(prop.hapAmount)}`}
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="font-semibold text-gray-900">{formatCurrency(prop.rentAmount)}</p>
                    <Badge variant={prop.status === 'current' ? 'success' : prop.status === 'late' ? 'danger' : 'warning'} className="text-[10px]">
                      {prop.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              onClick={handleBuildiumDemo}
              disabled={activeDemo !== null}
              variant="secondary"
              className="w-full"
            >
              {activeDemo === 'buildium' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing... {state.syncProgress}%
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Rent Roll (Demo)
                </>
              )}
            </Button>
          </div>

          {state.animatingSync === 'buildium' && (
            <div className="h-1 bg-gray-100">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-300"
                style={{ width: `${state.syncProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Lowe's Integration */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <FileSpreadsheet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Lowe's Statement AI</h3>
                  <p className="text-sm text-gray-500">Powered by Claude Vision</p>
                </div>
              </div>
              <Badge variant="default">AI-Powered</Badge>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Upload your Lowe's statement and watch AI automatically extract line items, 
              match them to properties, and calculate LLC allocations.
            </p>

            <Button 
              onClick={handleLowesDemo}
              disabled={activeDemo !== null}
              variant="secondary"
              className="w-full"
            >
              {activeDemo === 'lowes' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing... {state.syncProgress}%
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Process Statement (Demo)
                </>
              )}
            </Button>
          </div>

          {state.animatingSync === 'lowes' && (
            <div className="h-1 bg-gray-100">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                style={{ width: `${state.syncProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Ready to Go Live?</h3>
        <p className="text-gray-400 text-sm mb-4">
          Connect your real accounts and start automating your property accounting today.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/settings">
            <Button className="w-full sm:w-auto">
              Connect Real Accounts
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" className="w-full sm:w-auto">
              Explore Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
