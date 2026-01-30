'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, Button, Badge, Input, Select, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Modal, EmptyState } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { mockTransactions, mockProperties, mockEntities, mockVendors } from '@/lib/store';
import { Receipt, Plus, Search, Filter, Download, AlertCircle, Check, Building2 } from 'lucide-react';

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<typeof mockTransactions[0] | null>(null);
  
  const filteredTransactions = mockTransactions.filter(txn => {
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || txn.type === typeFilter;
    const matchesEntity = entityFilter === 'all' || txn.entity_id === entityFilter;
    return matchesSearch && matchesType && matchesEntity;
  });
  
  const unmatchedTransactions = mockTransactions.filter(t => !t.property_id);
  
  const getEntityName = (entityId: string) => mockEntities.find(e => e.id === entityId)?.name || 'Unknown';
  const getPropertyAddress = (propertyId?: string) => propertyId ? mockProperties.find(p => p.id === propertyId)?.address : null;
  const getVendorName = (vendorId?: string) => vendorId ? mockVendors.find(v => v.id === vendorId)?.name : null;
  
  const handleAssignProperty = (transactionId: string) => {
    const txn = mockTransactions.find(t => t.id === transactionId);
    if (txn) {
      setSelectedTransaction(txn);
      setShowAssignModal(true);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500">Track income and expenses across all properties</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>
      
      {/* Unmatched Alert */}
      {unmatchedTransactions.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="font-medium text-yellow-800">
                  {unmatchedTransactions.length} transaction{unmatchedTransactions.length > 1 ? 's' : ''} need property assignment
                </p>
                <p className="text-sm text-yellow-700">
                  Click on a transaction to assign it to a property.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'income', label: 'Income' },
                { value: 'expense', label: 'Expense' },
                { value: 'transfer', label: 'Transfer' },
              ]}
              className="w-36"
            />
            <Select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Entities' },
                ...mockEntities.map(e => ({ value: e.id, label: e.name }))
              ]}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Date</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Category</TableHeader>
                <TableHeader>Property</TableHeader>
                <TableHeader>Entity</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((txn) => (
                <TableRow 
                  key={txn.id} 
                  className={!txn.property_id ? 'bg-yellow-50 cursor-pointer' : ''}
                  onClick={() => !txn.property_id && handleAssignProperty(txn.id)}
                >
                  <TableCell className="text-gray-500">{formatDate(txn.date)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{txn.description}</p>
                      {getVendorName(txn.vendor_id) && (
                        <p className="text-xs text-gray-500">{getVendorName(txn.vendor_id)}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{txn.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {getPropertyAddress(txn.property_id) ? (
                      <span className="text-sm">{getPropertyAddress(txn.property_id)}</span>
                    ) : (
                      <Badge variant="warning">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Unassigned
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{getEntityName(txn.entity_id)}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${txn.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      txn.status === 'reconciled' ? 'success' :
                      txn.status === 'cleared' ? 'info' : 'warning'
                    }>
                      {txn.status}
                    </Badge>
                    {txn.auto_categorized && txn.confidence_score && (
                      <span className="ml-2 text-xs text-gray-500">
                        AI {Math.round(txn.confidence_score * 100)}%
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Transaction Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Transaction">
        <form className="space-y-4">
          <Input label="Date" type="date" />
          <Input label="Description" placeholder="Description of transaction" />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              options={[
                { value: 'expense', label: 'Expense' },
                { value: 'income', label: 'Income' },
                { value: 'transfer', label: 'Transfer' },
              ]}
            />
            <Input label="Amount" type="number" step="0.01" placeholder="0.00" />
          </div>
          <Select
            label="Entity"
            options={mockEntities.map(e => ({ value: e.id, label: e.name }))}
          />
          <Select
            label="Property"
            options={[
              { value: '', label: 'Select property...' },
              ...mockProperties.map(p => ({ value: p.id, label: p.address }))
            ]}
          />
          <Select
            label="Category"
            options={[
              { value: 'Rental Income (LTR)', label: 'Rental Income (LTR)' },
              { value: 'Repairs & Maintenance', label: 'Repairs & Maintenance' },
              { value: 'Utilities', label: 'Utilities' },
              { value: 'Supplies', label: 'Supplies' },
              { value: 'Insurance', label: 'Insurance' },
              { value: 'Property Taxes', label: 'Property Taxes' },
            ]}
          />
          <Input label="Notes (Optional)" placeholder="Additional notes..." />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Add Transaction</Button>
          </div>
        </form>
      </Modal>
      
      {/* Assign Property Modal */}
      <Modal 
        open={showAssignModal} 
        onClose={() => setShowAssignModal(false)} 
        title="Assign Transaction to Property"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Transaction</p>
              <p className="font-medium text-gray-900">{selectedTransaction.description}</p>
              <p className="text-lg font-bold mt-2">
                {selectedTransaction.type === 'income' ? '+' : '-'}
                {formatCurrency(selectedTransaction.amount)}
              </p>
            </div>
            
            <Select
              label="Assign to Property"
              options={[
                { value: '', label: 'Select a property...' },
                ...mockProperties
                  .filter(p => p.owner_entity_id === selectedTransaction.entity_id)
                  .map(p => ({ value: p.id, label: p.address }))
              ]}
            />
            
            <p className="text-xs text-gray-500">
              Only showing properties owned by {getEntityName(selectedTransaction.entity_id)}
            </p>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowAssignModal(false)}>Cancel</Button>
              <Button>
                <Check className="h-4 w-4 mr-2" />
                Assign Property
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
