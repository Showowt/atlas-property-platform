'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, Button, Badge, Input, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Modal, EmptyState } from '@/components/ui';
import { formatCurrency, formatDate, calculateW9Status } from '@/lib/utils';
import { mockVendors, getVendorYTDTotals } from '@/lib/store';
import { Users, Plus, Search, FileText, Mail, Phone, Check, AlertTriangle, Building } from 'lucide-react';

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const vendorData = getVendorYTDTotals();
  
  const filteredVendors = vendorData.filter(({ vendor }) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
          <p className="text-gray-500">Manage contractors, suppliers, and service providers</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>
      
      {/* Search */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Vendors Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Vendor</TableHeader>
                <TableHeader>Contact</TableHeader>
                <TableHeader>YTD Payments</TableHeader>
                <TableHeader>Tax ID</TableHeader>
                <TableHeader>W-9 Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredVendors.map(({ vendor, ytd_total, needs_w9 }) => {
                const status = calculateW9Status(ytd_total, vendor.w9_on_file, vendor.is_corporation);
                
                return (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {vendor.is_corporation ? (
                            <Building className="h-4 w-4 text-gray-600" />
                          ) : (
                            <Users className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{vendor.name}</p>
                          {vendor.is_corporation && (
                            <p className="text-xs text-gray-500">Corporation</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {vendor.email && (
                          <p className="text-sm flex items-center gap-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {vendor.email}
                          </p>
                        )}
                        {vendor.phone && (
                          <p className="text-sm flex items-center gap-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {vendor.phone}
                          </p>
                        )}
                        {!vendor.email && !vendor.phone && (
                          <span className="text-sm text-gray-400">No contact info</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(ytd_total)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {vendor.tax_id || '—'}
                    </TableCell>
                    <TableCell>
                      {status === 'not_required' && (
                        <Badge variant="default">Exempt (Corp)</Badge>
                      )}
                      {status === 'under_threshold' && (
                        <Badge variant="info">Under $600</Badge>
                      )}
                      {status === 'needs_w9' && (
                        <Badge variant="danger">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Needs W-9
                        </Badge>
                      )}
                      {status === 'complete' && (
                        <Badge variant="success">
                          <Check className="h-3 w-3 mr-1" />
                          On File
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        {needs_w9 && (
                          <Button size="sm">Request W-9</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Vendor Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Vendor">
        <form className="space-y-4">
          <Input label="Vendor Name" placeholder="Joe's Plumbing" />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_corp" className="rounded border-gray-300" />
            <label htmlFor="is_corp" className="text-sm text-gray-700">This is a corporation (exempt from 1099)</label>
          </div>
          <Input label="Email" type="email" placeholder="vendor@email.com" />
          <Input label="Phone" type="tel" placeholder="317-555-0100" />
          <Input label="Tax ID (EIN or SSN)" placeholder="12-3456789" />
          <Input label="Address" placeholder="123 Vendor Street" />
          
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">W-9 Document</p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Drag and drop W-9 PDF here, or click to upload</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Add Vendor</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
