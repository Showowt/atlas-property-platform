'use client';

import { useState } from 'react';
import { Button, Badge, Card, CardHeader, CardContent, Input, Select, Modal } from '@/components/ui';
import { 
  Settings, User, Building2, CreditCard, Bell, Shield, Database, Palette,
  Mail, Phone, Globe, Key, Link2, Unlink, CheckCircle2, AlertTriangle,
  RefreshCw, Download, Upload, Trash2, ChevronRight, Zap, Bot,
  FileText, Calculator, DollarSign, Clock, Users, Lock, Eye, EyeOff,
  Smartphone, Monitor, Moon, Sun, Volume2, VolumeX, HelpCircle, ExternalLink,
  Webhook, Code, BookOpen, MessageSquare, Star, Heart, Coffee
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  connected: boolean;
  status?: 'active' | 'error' | 'syncing';
  lastSync?: string;
  color: string;
}

const integrations: Integration[] = [
  { id: 'plaid', name: 'Plaid', description: 'Bank account connections', icon: CreditCard, connected: true, status: 'active', lastSync: '2 minutes ago', color: 'bg-green-500' },
  { id: 'buildium', name: 'Buildium', description: 'Property management sync', icon: Building2, connected: true, status: 'active', lastSync: '1 hour ago', color: 'bg-purple-500' },
  { id: 'quickbooks', name: 'QuickBooks', description: 'Accounting software export', icon: Calculator, connected: false, color: 'bg-emerald-500' },
  { id: 'xero', name: 'Xero', description: 'Cloud accounting platform', icon: Globe, connected: false, color: 'bg-blue-500' },
  { id: 'stripe', name: 'Stripe', description: 'Online rent payments', icon: DollarSign, connected: false, color: 'bg-violet-500' },
  { id: 'google', name: 'Google Workspace', description: 'Calendar & email sync', icon: Mail, connected: false, color: 'bg-red-500' },
  { id: 'zapier', name: 'Zapier', description: 'Workflow automation', icon: Zap, connected: false, color: 'bg-orange-500' },
  { id: 'slack', name: 'Slack', description: 'Team notifications', icon: MessageSquare, connected: false, color: 'bg-pink-500' },
];

const settingsSections = [
  { id: 'profile', name: 'Profile', icon: User, description: 'Your personal information' },
  { id: 'business', name: 'Business', icon: Building2, description: 'Company and entity settings' },
  { id: 'integrations', name: 'Integrations', icon: Link2, description: 'Connected services' },
  { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Alert preferences' },
  { id: 'security', name: 'Security', icon: Shield, description: 'Password and 2FA' },
  { id: 'billing', name: 'Billing', icon: CreditCard, description: 'Subscription and invoices' },
  { id: 'data', name: 'Data Management', icon: Database, description: 'Import, export, backup' },
  { id: 'appearance', name: 'Appearance', icon: Palette, description: 'Theme and display' },
  { id: 'api', name: 'API Access', icon: Code, description: 'Developer settings' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    w9Alerts: true,
    weeklyDigest: true,
    transactionAlerts: true,
    leaseExpiration: true,
    rentReminders: true,
  });

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                MM
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">MachineMind</h3>
                <p className="text-sm text-gray-500">admin@machinemind.io</p>
                <Button size="sm" variant="secondary" className="mt-2">Change Photo</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="First Name" defaultValue="Machine" />
              <Input label="Last Name" defaultValue="Mind" />
              <Input label="Email" type="email" defaultValue="admin@machinemind.io" />
              <Input label="Phone" type="tel" defaultValue="(555) 123-4567" />
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Business Address</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Street Address" defaultValue="123 Innovation Drive" className="sm:col-span-2" />
                <Input label="City" defaultValue="Indianapolis" />
                <div className="grid grid-cols-2 gap-2">
                  <Input label="State" defaultValue="IN" />
                  <Input label="ZIP" defaultValue="46201" />
                </div>
              </div>
            </div>
            
            <Button>Save Changes</Button>
          </div>
        );

      case 'business':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Multi-Entity Support Active</h4>
                  <p className="text-sm text-blue-700">You have {4} entities configured. Each maintains separate books.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Your Entities</h4>
              {['Wabash Partners LLC', '0608 LLC', 'Shantalie Properties', 'Personal Holdings'].map((entity, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {entity.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{entity}</p>
                      <p className="text-xs text-gray-500">{[3, 2, 1, 1][i]} properties</p>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary">Edit</Button>
                </div>
              ))}
              <Button variant="secondary" className="w-full">
                <Building2 className="h-4 w-4 mr-2" /> Add New Entity
              </Button>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Tax Settings</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Tax Year" defaultValue="2026" />
                <Select
                  label="Accounting Method"
                  options={[
                    { value: 'cash', label: 'Cash Basis' },
                    { value: 'accrual', label: 'Accrual Basis' },
                  ]}
                />
                <Input label="EIN (Primary)" defaultValue="XX-XXXXXXX" />
                <Select
                  label="State Tax Filing"
                  options={[
                    { value: 'IN', label: 'Indiana' },
                    { value: 'IL', label: 'Illinois' },
                    { value: 'OH', label: 'Ohio' },
                  ]}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Default Categories</h4>
              <p className="text-sm text-gray-500 mb-3">Map transaction categories to Schedule E line items</p>
              <Button variant="secondary">
                <FileText className="h-4 w-4 mr-2" /> Manage Categories
              </Button>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900">2 Integrations Active</h4>
                    <p className="text-sm text-green-700">All systems syncing normally</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary">
                  <RefreshCw className="h-4 w-4 mr-1" /> Sync All
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {integrations.map(integration => (
                <div key={integration.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <integration.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{integration.name}</h4>
                          {integration.connected && (
                            <Badge variant={integration.status === 'active' ? 'success' : integration.status === 'error' ? 'danger' : 'warning'}>
                              {integration.status === 'active' ? 'Connected' : integration.status === 'error' ? 'Error' : 'Syncing'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                        {integration.lastSync && (
                          <p className="text-xs text-gray-400 mt-1">Last sync: {integration.lastSync}</p>
                        )}
                      </div>
                    </div>
                    {integration.connected ? (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="secondary">Configure</Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50">
                          <Unlink className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm">
                        <Link2 className="h-4 w-4 mr-1" /> Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Need a different integration?</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">We're always adding new integrations. Let us know what you need.</p>
              <Button variant="secondary" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" /> Request Integration
              </Button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Notification Channels</h4>
              {[
                { key: 'email', label: 'Email Notifications', icon: Mail, desc: 'Receive updates via email' },
                { key: 'push', label: 'Push Notifications', icon: Smartphone, desc: 'Browser and mobile alerts' },
                { key: 'sms', label: 'SMS Notifications', icon: Phone, desc: 'Text message alerts (premium)' },
              ].map(channel => (
                <div key={channel.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <channel.icon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">{channel.label}</p>
                      <p className="text-sm text-gray-500">{channel.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(n => ({ ...n, [channel.key]: !n[channel.key as keyof typeof n] }))}
                    className={`w-12 h-6 rounded-full transition-colors ${notifications[channel.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[channel.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <h4 className="font-medium text-gray-900">Alert Types</h4>
              {[
                { key: 'w9Alerts', label: 'W-9 Threshold Alerts', desc: 'When vendors cross $600' },
                { key: 'transactionAlerts', label: 'Large Transaction Alerts', desc: 'Transactions over $1,000' },
                { key: 'leaseExpiration', label: 'Lease Expiration Reminders', desc: '30, 60, 90 day warnings' },
                { key: 'rentReminders', label: 'Rent Collection Reminders', desc: 'Late rent notifications' },
                { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of all activity' },
              ].map(alert => (
                <div key={alert.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{alert.label}</p>
                    <p className="text-xs text-gray-500">{alert.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(n => ({ ...n, [alert.key]: !n[alert.key as keyof typeof n] }))}
                    className={`w-10 h-5 rounded-full transition-colors ${notifications[alert.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications[alert.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>

            <Button>Save Notification Preferences</Button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Security Status: Strong</h4>
                  <p className="text-sm text-green-700">2FA enabled, last login from trusted device</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Password</h4>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-500">Last changed 45 days ago</p>
                </div>
                <Button variant="secondary">Update</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Authenticator App</p>
                    <p className="text-sm text-gray-500">Google Authenticator configured</p>
                  </div>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">SMS Backup</p>
                    <p className="text-sm text-gray-500">Backup codes via text message</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary">Enable</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Active Sessions</h4>
              <div className="space-y-2">
                {[
                  { device: 'MacBook Pro', location: 'Indianapolis, IN', current: true },
                  { device: 'iPhone 15', location: 'Indianapolis, IN', current: false },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      {session.device.includes('Mac') ? <Monitor className="h-5 w-5 text-gray-500" /> : <Smartphone className="h-5 w-5 text-gray-500" />}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{session.device}</p>
                        <p className="text-xs text-gray-500">{session.location}</p>
                      </div>
                    </div>
                    {session.current ? (
                      <Badge variant="success">Current</Badge>
                    ) : (
                      <Button size="sm" variant="ghost" className="text-red-600">Revoke</Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-violet-200 text-sm">Current Plan</p>
                  <h3 className="text-2xl font-bold">Professional</h3>
                </div>
                <Star className="h-8 w-8 text-yellow-300" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">$49<span className="text-lg font-normal">/mo</span></p>
                  <p className="text-violet-200 text-sm">Billed annually ($588/year)</p>
                </div>
                <Button className="bg-white text-purple-600 hover:bg-purple-50">Upgrade Plan</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">7</p>
                <p className="text-xs text-gray-500">Properties</p>
                <p className="text-xs text-green-600">of 25</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">4</p>
                <p className="text-xs text-gray-500">Entities</p>
                <p className="text-xs text-green-600">of 10</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-xs text-gray-500">Bank Accounts</p>
                <p className="text-xs text-green-600">Unlimited</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-500">Team Members</p>
                <p className="text-xs text-green-600">of 5</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Payment Method</h4>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/2027</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary">Update</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Billing History</h4>
              <div className="space-y-2">
                {[
                  { date: 'Jan 1, 2026', amount: 49, status: 'Paid' },
                  { date: 'Dec 1, 2025', amount: 49, status: 'Paid' },
                  { date: 'Nov 1, 2025', amount: 49, status: 'Paid' },
                ].map((invoice, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{invoice.date}</p>
                      <p className="text-xs text-gray-500">Professional Plan</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">${invoice.amount}</span>
                      <Badge variant="success">{invoice.status}</Badge>
                      <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Upload className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">Import Data</h4>
                </div>
                <p className="text-sm text-gray-500 mb-4">Import transactions, properties, or vendors from CSV files.</p>
                <Button variant="secondary" className="w-full">
                  <Upload className="h-4 w-4 mr-2" /> Import CSV
                </Button>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Download className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">Export Data</h4>
                </div>
                <p className="text-sm text-gray-500 mb-4">Download all your data in various formats.</p>
                <Button variant="secondary" className="w-full">
                  <Download className="h-4 w-4 mr-2" /> Export All
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Database className="h-5 w-5 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900">Automatic Backups</h4>
              </div>
              <p className="text-sm text-gray-500 mb-4">Your data is automatically backed up daily. Backups are retained for 90 days.</p>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                <span className="text-sm text-gray-600">Last backup</span>
                <span className="text-sm font-medium text-gray-900">Today at 3:00 AM</span>
              </div>
              <Button variant="secondary">
                <Clock className="h-4 w-4 mr-2" /> View Backup History
              </Button>
            </div>

            <div className="bg-red-50 rounded-xl border border-red-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <h4 className="font-medium text-red-900">Danger Zone</h4>
              </div>
              <p className="text-sm text-red-700 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete Account
              </Button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Theme</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'system', label: 'System', icon: Monitor },
                ].map(theme => (
                  <button
                    key={theme.id}
                    className={`p-4 rounded-xl border-2 transition-all ${theme.id === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <theme.icon className={`h-6 w-6 mx-auto mb-2 ${theme.id === 'light' ? 'text-blue-600' : 'text-gray-500'}`} />
                    <p className="text-sm font-medium text-gray-900">{theme.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Display</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-700">Compact Mode</span>
                  <button className="w-10 h-5 bg-gray-300 rounded-full">
                    <div className="w-4 h-4 bg-white rounded-full shadow translate-x-0.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-700">Show Currency Symbol</span>
                  <button className="w-10 h-5 bg-blue-600 rounded-full">
                    <div className="w-4 h-4 bg-white rounded-full shadow translate-x-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Regional</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Currency"
                  options={[
                    { value: 'USD', label: 'USD ($)' },
                    { value: 'EUR', label: 'EUR (€)' },
                    { value: 'GBP', label: 'GBP (£)' },
                  ]}
                />
                <Select
                  label="Date Format"
                  options={[
                    { value: 'mdy', label: 'MM/DD/YYYY' },
                    { value: 'dmy', label: 'DD/MM/YYYY' },
                    { value: 'ymd', label: 'YYYY-MM-DD' },
                  ]}
                />
              </div>
            </div>

            <Button>Save Preferences</Button>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-5 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Code className="h-6 w-6" />
                <h4 className="font-semibold">API Access</h4>
              </div>
              <p className="text-gray-400 text-sm mb-4">Build integrations with the ATLAS API. Full REST API documentation available.</p>
              <div className="flex gap-3">
                <Button className="bg-white text-gray-900 hover:bg-gray-100">
                  <BookOpen className="h-4 w-4 mr-2" /> View Docs
                </Button>
                <Button variant="secondary" className="border-gray-600 text-white hover:bg-gray-700" onClick={() => setShowApiKeyModal(true)}>
                  <Key className="h-4 w-4 mr-2" /> Get API Key
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">API Keys</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Production Key</p>
                    <p className="text-sm text-gray-500 font-mono">sk_live_••••••••••••••••</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Active</Badge>
                    <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Test Key</p>
                    <p className="text-sm text-gray-500 font-mono">sk_test_••••••••••••••••</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">Test</Badge>
                    <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Webhooks</h4>
              <p className="text-sm text-gray-500">Receive real-time notifications when events happen in ATLAS.</p>
              <Button variant="secondary">
                <Webhook className="h-4 w-4 mr-2" /> Configure Webhooks
              </Button>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Need Help?</h4>
                  <p className="text-sm text-blue-700">Check our API documentation or contact developer support.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your account, integrations, and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-2">
              {settingsSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <section.icon className={`h-5 w-5 ${activeSection === section.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm">{section.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Support Card */}
          <div className="mt-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-4 text-white">
            <Coffee className="h-8 w-8 mb-3 opacity-80" />
            <h4 className="font-semibold mb-1">Need Help?</h4>
            <p className="text-sm text-violet-200 mb-3">Our support team is here 24/7</p>
            <Button size="sm" className="w-full bg-white text-purple-600 hover:bg-purple-50">
              <MessageSquare className="h-4 w-4 mr-2" /> Contact Support
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {settingsSections.find(s => s.id === activeSection)?.name}
          </h2>
          {renderSection()}
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account">
        <div className="space-y-4">
          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> This will permanently delete your account and all data including:
            </p>
            <ul className="text-sm text-red-700 mt-2 list-disc list-inside">
              <li>All properties and entities</li>
              <li>All transactions and reports</li>
              <li>All vendor information</li>
              <li>All connected integrations</li>
            </ul>
          </div>
          <Input label="Type 'DELETE' to confirm" placeholder="DELETE" />
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" className="flex-1">Delete Forever</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
