'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, Button, Badge, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Modal, Input, Select, EmptyState } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { mockEntities, mockProperties, mockTransactions } from '@/lib/store';
import { Briefcase, Plus, Building2, DollarSign, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';

export default function EntitiesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  
  const getEntityStats = (entityId: string) => {
    const properties = mockProperties.filter(p => p.owner_entity_id === entityId);
    const transactions = mockTransactions.filter(t => t.entity_id === entityId);
    
    const revenue = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const monthlyRent = properties.reduce((sum, p) => sum + (p.monthly_rent || 0), 0);
    
    return { properties, revenue, expenses, netIncome: revenue - expenses, monthlyRent };
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Entities (LLCs)</h1>
          <p className="text-gray-500">Manage your business entities and ownership structures</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Entity
        </Button>
      </div>
      
      {/* Entity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockEntities.map((entity) => {
          const stats = getEntityStats(entity.id);
          
          return (
            <Card key={entity.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Briefcase className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{entity.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={
                          entity.type === 'llc' ? 'info' : 
                          entity.type === 'company' ? 'success' : 'default'
                        }>
                          {entity.type.toUpperCase()}
                        </Badge>
                        {entity.tax_id && (
                          <span className="text-xs text-gray-500 font-mono">EIN: {entity.tax_id}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Properties</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 mt-1">{stats.properties.length}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Monthly Rent</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(stats.monthlyRent)}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-500">Revenue MTD</span>
                    </div>
                    <p className="text-xl font-bold text-green-600 mt-1">{formatCurrency(stats.revenue)}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-gray-500">Expenses MTD</span>
                    </div>
                    <p className="text-xl font-bold text-red-600 mt-1">{formatCurrency(stats.expenses)}</p>
                  </div>
                </div>
                
                {/* Net Income */}
                <div className={`rounded-lg p-3 ${stats.netIncome >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Net Income MTD</span>
                    <span className={`text-lg font-bold ${stats.netIncome >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {formatCurrency(stats.netIncome)}
                    </span>
                  </div>
                </div>
                
                {/* Properties List */}
                {stats.properties.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">Properties</p>
                    <div className="space-y-2">
                      {stats.properties.slice(0, 3).map((property) => (
                        <div key={property.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{property.address}</span>
                          <span className="font-medium">{property.monthly_rent ? formatCurrency(property.monthly_rent) : '—'}/mo</span>
                        </div>
                      ))}
                      {stats.properties.length > 3 && (
                        <p className="text-xs text-gray-500">+{stats.properties.length - 3} more properties</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Add Entity Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Entity">
        <form className="space-y-4">
          <Input label="Entity Name" placeholder="My Property LLC" />
          <Select
            label="Entity Type"
            options={[
              { value: 'llc', label: 'LLC' },
              { value: 'company', label: 'Corporation' },
              { value: 'individual', label: 'Individual' },
            ]}
          />
          <Input label="Tax ID (EIN)" placeholder="12-3456789" />
          <Input label="Address" placeholder="123 Business Ave, Suite 100" />
          <Select
            label="Parent Entity (Optional)"
            options={[
              { value: '', label: 'None (Top Level)' },
              ...mockEntities
                .filter(e => e.type === 'llc' || e.type === 'company')
                .map(e => ({ value: e.id, label: e.name }))
            ]}
          />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Entity</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
