'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, Button, Badge, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Modal, Input, EmptyState } from '@/components/ui';
import { formatCurrency, formatDate, calculateW9Status, generateW9Email } from '@/lib/utils';
import { getVendorYTDTotals, mockVendorPayments, mockEntities, mockProperties } from '@/lib/store';
import { AlertTriangle, Check, Clock, Send, FileText, Download, Mail, Building2 } from 'lucide-react';

export default function W9TrackerPage() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<{ name: string; email: string } | null>(null);
  
  const vendorData = getVendorYTDTotals();
  
  // Separate into categories
  const needsW9 = vendorData.filter(v => v.needs_w9);
  const underThreshold = vendorData.filter(v => 
    !v.vendor.is_corporation && !v.vendor.w9_on_file && v.ytd_total < 600 && v.ytd_total > 0
  );
  const complete = vendorData.filter(v => v.vendor.w9_on_file || v.vendor.is_corporation);
  
  const handleSendRequest = (vendorName: string, email?: string) => {
    if (!email) {
      alert('No email on file for this vendor. Please add their email first.');
      return;
    }
    setSelectedVendor({ name: vendorName, email });
    setShowEmailModal(true);
  };
  
  const getStatusBadge = (vendor: typeof vendorData[0]) => {
    const status = calculateW9Status(vendor.ytd_total, vendor.vendor.w9_on_file, vendor.vendor.is_corporation);
    switch (status) {
      case 'not_required':
        return <Badge variant="default">Corporation (Exempt)</Badge>;
      case 'under_threshold':
        return <Badge variant="info">Under $600</Badge>;
      case 'needs_w9':
        return <Badge variant="danger">Needs W-9</Badge>;
      case 'complete':
        return <Badge variant="success">On File</Badge>;
    }
  };
  
  const getPaymentsByVendor = (vendorId: string) => {
    return mockVendorPayments
      .filter(vp => vp.vendor_id === vendorId)
      .map(vp => {
        const entity = mockEntities.find(e => e.id === vp.entity_id);
        const property = mockProperties.find(p => p.id === vp.property_id);
        return { ...vp, entity, property };
      });
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">W-9 Tracker</h1>
          <p className="text-gray-500">Track vendor payments and W-9 compliance for 1099 filing</p>
        </div>
        <Button variant="secondary">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{needsW9.length}</p>
              <p className="text-sm text-gray-500">Need W-9</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-yellow-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{underThreshold.length}</p>
              <p className="text-sm text-gray-500">Approaching $600</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{complete.length}</p>
              <p className="text-sm text-gray-500">Complete/Exempt</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(needsW9.reduce((sum, v) => sum + v.ytd_total, 0))}
              </p>
              <p className="text-sm text-gray-500">Reportable (no W-9)</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Action Required Section */}
      {needsW9.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Action Required - W-9 Needed</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              These vendors have exceeded $600 in payments and require W-9 documentation for 1099 filing.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Vendor</TableHeader>
                  <TableHeader>YTD Payments</TableHeader>
                  <TableHeader>Email</TableHeader>
                  <TableHeader>Last Requested</TableHeader>
                  <TableHeader>Action</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {needsW9.map(({ vendor, ytd_total }) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{vendor.name}</p>
                        <p className="text-xs text-gray-500">{vendor.phone || 'No phone'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-red-600">
                      {formatCurrency(ytd_total)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {vendor.email || <span className="text-gray-400">No email</span>}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {vendor.w9_requested_date ? formatDate(vendor.w9_requested_date) : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => handleSendRequest(vendor.name, vendor.email)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send Request
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Approaching Threshold */}
      {underThreshold.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">Approaching $600 Threshold</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Consider requesting W-9 proactively from these vendors.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Vendor</TableHeader>
                  <TableHeader>YTD Payments</TableHeader>
                  <TableHeader>Remaining to $600</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {underThreshold.map(({ vendor, ytd_total }) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium text-gray-900">{vendor.name}</TableCell>
                    <TableCell>{formatCurrency(ytd_total)}</TableCell>
                    <TableCell className="text-yellow-600">
                      {formatCurrency(600 - ytd_total)} remaining
                    </TableCell>
                    <TableCell>{getStatusBadge({ vendor, ytd_total, needs_w9: false })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Complete/Exempt */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Complete & Exempt</h2>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Vendor</TableHeader>
                <TableHeader>YTD Payments</TableHeader>
                <TableHeader>Tax ID</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>W-9 Received</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {complete.map(({ vendor, ytd_total }) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium text-gray-900">{vendor.name}</TableCell>
                  <TableCell>{formatCurrency(ytd_total)}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {vendor.tax_id || (vendor.is_corporation ? 'N/A' : '—')}
                  </TableCell>
                  <TableCell>{getStatusBadge({ vendor, ytd_total, needs_w9: false })}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {vendor.w9_received_date ? formatDate(vendor.w9_received_date) : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Email Modal */}
      <Modal open={showEmailModal} onClose={() => setShowEmailModal(false)} title="Send W-9 Request">
        {selectedVendor && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>To:</strong> {selectedVendor.email}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Subject:</strong> {generateW9Email(selectedVendor.name, selectedVendor.email).subject}
              </p>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {generateW9Email(selectedVendor.name, selectedVendor.email).body}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                alert('W-9 request sent! (Demo mode)');
                setShowEmailModal(false);
              }}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
