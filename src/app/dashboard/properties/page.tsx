'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, Button, Badge, Input, Select, Modal, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, EmptyState } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { mockProperties, mockEntities } from '@/lib/store';
import { Property } from '@/lib/types';
import { Building2, Plus, Search, MapPin, Bed, Bath, DollarSign, Edit, Trash2 } from 'lucide-react';

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntity = entityFilter === 'all' || property.owner_entity_id === entityFilter;
    return matchesSearch && matchesEntity;
  });
  
  const getEntityName = (entityId: string) => {
    return mockEntities.find(e => e.id === entityId)?.name || 'Unknown';
  };
  
  const getPropertyTypeLabel = (type: Property['property_type']) => {
    const labels = {
      sfr: 'Single Family',
      multi_family: 'Multi-Family',
      commercial: 'Commercial',
      mixed_use: 'Mixed Use',
      personal: 'Personal',
    };
    return labels[type] || type;
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500">Manage your property portfolio</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by address or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
      
      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Building2}
              title="No properties found"
              description="Try adjusting your search or filters"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <Badge variant={property.property_type === 'personal' ? 'default' : 'info'}>
                    {getPropertyTypeLabel(property.property_type)}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{property.address}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                  <MapPin className="h-3 w-3" />
                  {property.city}, {property.state} {property.zip}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  {property.beds && (
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" /> {property.beds} beds
                    </span>
                  )}
                  {property.baths && (
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" /> {property.baths} baths
                    </span>
                  )}
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Owner</p>
                      <p className="text-sm font-medium text-gray-900">
                        {getEntityName(property.owner_entity_id)}
                      </p>
                    </div>
                    {property.monthly_rent && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Monthly Rent</p>
                        <p className="text-sm font-semibold text-green-600">
                          {formatCurrency(property.monthly_rent)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {property.lowes_job_name && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Lowe's Job Name</p>
                    <p className="text-sm font-mono text-gray-700">{property.lowes_job_name}</p>
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Property Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Property">
        <form className="space-y-4">
          <Input label="Street Address" placeholder="123 Main Street" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" placeholder="Indianapolis" />
            <Input label="State" placeholder="IN" maxLength={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="ZIP Code" placeholder="46201" />
            <Select
              label="Property Type"
              options={[
                { value: 'sfr', label: 'Single Family' },
                { value: 'multi_family', label: 'Multi-Family' },
                { value: 'commercial', label: 'Commercial' },
                { value: 'personal', label: 'Personal' },
              ]}
            />
          </div>
          <Select
            label="Owner Entity"
            options={mockEntities.map(e => ({ value: e.id, label: e.name }))}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Beds" type="number" />
            <Input label="Baths" type="number" step="0.5" />
            <Input label="Monthly Rent" type="number" placeholder="1200" />
          </div>
          <Input label="Lowe's Job Name" placeholder="Same as address usually" />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Property</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
