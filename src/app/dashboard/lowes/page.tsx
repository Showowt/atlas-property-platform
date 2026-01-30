'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, Button, Badge, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Modal, Select, EmptyState } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { mockProperties, mockEntities } from '@/lib/store';
import { FileSpreadsheet, Upload, Check, AlertCircle, Building2, Download, Eye, RefreshCw, DollarSign } from 'lucide-react';

// Mock Lowe's statement data
const mockLowesStatement = {
  id: 'ls_001',
  statement_date: '2024-01-31',
  statement_period: 'January 2024',
  total_amount: 2463.06,
  status: 'pending_review',
  line_items: [
    { id: 'li_001', job_name: '1234 Oak Street', description: 'Toilet flapper valve', amount: 12.99, quantity: 2, property_id: 'prop_001', entity_id: null },
    { id: 'li_002', job_name: '1234 Oak Street', description: 'PVC pipe 10ft', amount: 8.47, quantity: 3, property_id: 'prop_001', entity_id: null },
    { id: 'li_003', job_name: '1234 Oak Street', description: 'Contractor pack screws', amount: 24.99, quantity: 1, property_id: 'prop_001', entity_id: null },
    { id: 'li_004', job_name: '5678 Maple Ave', description: 'Paint - Interior White 5gal', amount: 189.00, quantity: 2, property_id: 'prop_002', entity_id: null },
    { id: 'li_005', job_name: '5678 Maple Ave', description: 'Paint brushes assorted', amount: 34.99, quantity: 1, property_id: 'prop_002', entity_id: null },
    { id: 'li_006', job_name: '5678 Maple Ave', description: 'Drop cloths', amount: 19.99, quantity: 2, property_id: 'prop_002', entity_id: null },
    { id: 'li_007', job_name: '910 Pine Road', description: 'Garbage disposal 1/2 HP', amount: 129.00, quantity: 1, property_id: 'prop_003', entity_id: null },
    { id: 'li_008', job_name: '910 Pine Road', description: 'Plumber putty', amount: 4.99, quantity: 1, property_id: 'prop_003', entity_id: null },
    { id: 'li_009', job_name: '2468 Elm Court', description: 'Water heater 50gal', amount: 649.00, quantity: 1, property_id: 'prop_004', entity_id: null },
    { id: 'li_010', job_name: '2468 Elm Court', description: 'Copper fittings', amount: 45.67, quantity: 1, property_id: 'prop_004', entity_id: null },
    { id: 'li_011', job_name: '2468 Elm Court', description: 'Water heater pan', amount: 24.99, quantity: 1, property_id: 'prop_004', entity_id: null },
    { id: 'li_012', job_name: '1357 Personal Home', description: 'Light bulbs LED 12pk', amount: 29.99, quantity: 2, property_id: 'prop_005', entity_id: null },
    { id: 'li_013', job_name: 'SHANTALIE', description: 'Office supplies', amount: 89.00, quantity: 1, property_id: null, entity_id: 'ent_003' },
    { id: 'li_014', job_name: 'Unknown Job', description: 'Misc hardware', amount: 156.00, quantity: 1, property_id: null, entity_id: null },
  ]
};

type LineItem = typeof mockLowesStatement.line_items[0];

export default function LowesPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [lineItems, setLineItems] = useState(mockLowesStatement.line_items);
  
  // Calculate allocations by entity
  const calculateAllocations = () => {
    const allocations: Record<string, { entity: typeof mockEntities[0], amount: number, items: LineItem[], properties: Record<string, { address: string, amount: number }> }> = {};
    
    lineItems.forEach(item => {
      let entityId: string | null = null;
      
      if (item.property_id) {
        const property = mockProperties.find(p => p.id === item.property_id);
        entityId = property?.owner_entity_id || null;
      } else if (item.entity_id) {
        entityId = item.entity_id;
      }
      
      if (entityId) {
        if (!allocations[entityId]) {
          const entity = mockEntities.find(e => e.id === entityId)!;
          allocations[entityId] = { entity, amount: 0, items: [], properties: {} };
        }
        const itemTotal = item.amount * item.quantity;
        allocations[entityId].amount += itemTotal;
        allocations[entityId].items.push(item);
        
        // Track by property
        if (item.property_id) {
          const property = mockProperties.find(p => p.id === item.property_id);
          if (property) {
            if (!allocations[entityId].properties[item.property_id]) {
              allocations[entityId].properties[item.property_id] = { address: property.address, amount: 0 };
            }
            allocations[entityId].properties[item.property_id].amount += itemTotal;
          }
        }
      }
    });
    
    return allocations;
  };
  
  const allocations = calculateAllocations();
  const unmatchedItems = lineItems.filter(item => !item.property_id && !item.entity_id);
  const totalMatched = Object.values(allocations).reduce((sum, a) => sum + a.amount, 0);
  const totalUnmatched = unmatchedItems.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
  
  const handleAssignProperty = (itemId: string, propertyId: string) => {
    setLineItems(items => items.map(item => 
      item.id === itemId ? { ...item, property_id: propertyId, entity_id: null } : item
    ));
  };
  
  const handleAssignEntity = (itemId: string, entityId: string) => {
    setLineItems(items => items.map(item => 
      item.id === itemId ? { ...item, entity_id: entityId, property_id: null } : item
    ));
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lowe's Statement Processor</h1>
          <p className="text-gray-500">Parse and allocate Lowe's purchases to properties and LLCs</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowUploadModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Statement
          </Button>
          <Button onClick={() => setShowAllocationModal(true)}>
            <DollarSign className="h-4 w-4 mr-2" />
            View Allocation Report
          </Button>
        </div>
      </div>
      
      {/* Current Statement Info */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{mockLowesStatement.statement_period} Statement</h3>
                <p className="text-sm text-gray-500">Statement Date: {formatDate(mockLowesStatement.statement_date)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockLowesStatement.total_amount)}</p>
              <p className="text-sm text-gray-500">Total Amount</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Allocation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(allocations).map(([entityId, data]) => (
          <Card key={entityId} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge variant={
                data.entity.name === 'Personal' ? 'default' :
                data.entity.type === 'llc' ? 'info' : 'success'
              }>
                {data.entity.type.toUpperCase()}
              </Badge>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(data.amount)}</span>
            </div>
            <h4 className="font-medium text-gray-900">{data.entity.name}</h4>
            <p className="text-sm text-gray-500">{data.items.length} line items</p>
          </Card>
        ))}
        
        {unmatchedItems.length > 0 && (
          <Card className="p-4 border-yellow-200 bg-yellow-50">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="warning">UNMATCHED</Badge>
              <span className="text-lg font-bold text-yellow-700">{formatCurrency(totalUnmatched)}</span>
            </div>
            <h4 className="font-medium text-gray-900">Needs Assignment</h4>
            <p className="text-sm text-gray-500">{unmatchedItems.length} line items</p>
          </Card>
        )}
      </div>
      
      {/* Unmatched Items - Priority */}
      {unmatchedItems.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader className="bg-yellow-50 border-b border-yellow-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">Unmatched Items - Assign Property/Entity</h2>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Job Name</TableHeader>
                  <TableHeader>Description</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Assign To</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {unmatchedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-gray-900">{item.job_name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{formatCurrency(item.amount * item.quantity)}</TableCell>
                    <TableCell>
                      <Select
                        value=""
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.startsWith('prop_')) {
                            handleAssignProperty(item.id, value);
                          } else if (value.startsWith('ent_')) {
                            handleAssignEntity(item.id, value);
                          }
                        }}
                        options={[
                          { value: '', label: 'Select...' },
                          ...mockProperties.map(p => ({ value: p.id, label: `📍 ${p.address}` })),
                          ...mockEntities.map(e => ({ value: e.id, label: `🏢 ${e.name} (Direct)` })),
                        ]}
                        className="min-w-[200px]"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* All Line Items */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">All Line Items</h2>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Job Name</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Qty</TableHeader>
                <TableHeader>Unit Price</TableHeader>
                <TableHeader>Total</TableHeader>
                <TableHeader>Assigned To</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {lineItems.map((item) => {
                const property = item.property_id ? mockProperties.find(p => p.id === item.property_id) : null;
                const entity = item.entity_id ? mockEntities.find(e => e.id === item.entity_id) : 
                              property ? mockEntities.find(e => e.id === property.owner_entity_id) : null;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-gray-900">{item.job_name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.amount)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(item.amount * item.quantity)}</TableCell>
                    <TableCell>
                      {property ? (
                        <div>
                          <p className="text-sm font-medium">{property.address}</p>
                          <p className="text-xs text-gray-500">{entity?.name}</p>
                        </div>
                      ) : entity ? (
                        <p className="text-sm font-medium">{entity.name} (Direct)</p>
                      ) : (
                        <span className="text-yellow-600 text-sm">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {property || entity ? (
                        <Badge variant="success">
                          <Check className="h-3 w-3 mr-1" /> Matched
                        </Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Upload Modal */}
      <Modal open={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Lowe's Statement">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your Lowe's statement PDF here, or click to browse
            </p>
            <p className="text-xs text-gray-500">
              Supports PDF and image files. We'll automatically extract line items.
            </p>
            <Button variant="secondary" className="mt-4">
              Choose File
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Our AI will parse the statement and match job names to your properties automatically.
          </p>
        </div>
      </Modal>
      
      {/* Allocation Report Modal */}
      <Modal open={showAllocationModal} onClose={() => setShowAllocationModal(false)} title="Lowe's Allocation Report">
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Statement Period: {mockLowesStatement.statement_period}</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockLowesStatement.total_amount)}</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Payment Breakdown by LLC</h3>
            
            {Object.entries(allocations).map(([entityId, data]) => (
              <div key={entityId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{data.entity.name}</h4>
                  <span className="text-lg font-bold text-blue-600">{formatCurrency(data.amount)}</span>
                </div>
                
                <div className="space-y-2">
                  {Object.entries(data.properties).map(([propId, propData]) => (
                    <div key={propId} className="flex justify-between text-sm">
                      <span className="text-gray-600">📍 {propData.address}</span>
                      <span className="font-medium">{formatCurrency(propData.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {unmatchedItems.length > 0 && (
              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-yellow-800">⚠️ Unallocated</h4>
                  <span className="text-lg font-bold text-yellow-700">{formatCurrency(totalUnmatched)}</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  {unmatchedItems.length} items need assignment before finalizing
                </p>
              </div>
            )}
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">
              Payment Instructions: Each LLC should pay the following from their accounts:
            </p>
            <div className="space-y-2">
              {Object.entries(allocations).map(([entityId, data]) => (
                <div key={entityId} className="flex justify-between p-2 bg-blue-50 rounded">
                  <span className="font-medium">{data.entity.name} → Lowe's</span>
                  <span className="font-bold text-blue-700">{formatCurrency(data.amount)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowAllocationModal(false)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
