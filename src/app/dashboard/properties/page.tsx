'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, Button, Badge, Input, Select, Modal, EmptyState } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { mockProperties, mockEntities } from '@/lib/store';
import { Building2, Plus, Search, MapPin, Bed, Bath, DollarSign, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [entityFilter, setEntityFilter] = useState('all');
  
  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntity = entityFilter === 'all' || property.owner_entity_id === entityFilter;
    return matchesSearch && matchesEntity;
  });
  
  const getEntityName = (entityId: string) => mockEntities.find(e => e.id === entityId)?.name || 'Unknown';
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 text-sm">Manage your property portfolio</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>
      
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search properties..."
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
          className="sm:w-48"
        />
      </div>
      
      {/* Property Cards - Mobile Optimized */}
      <div className="space-y-3">
        {filteredProperties.map((property) => (
          <div key={property.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all active:scale-[0.99]">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{property.address}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {property.city}, {property.state} {property.zip}
                      </p>
                    </div>
                    {property.monthly_rent && (
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-green-600">{formatCurrency(property.monthly_rent)}</p>
                        <p className="text-xs text-gray-500">/month</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3">
                    {property.beds && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Bed className="h-4 w-4" />
                        <span>{property.beds}</span>
                      </div>
                    )}
                    {property.baths && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Bath className="h-4 w-4" />
                        <span>{property.baths}</span>
                      </div>
                    )}
                    <Badge variant={property.property_type === 'sfr' ? 'info' : 'default'}>
                      {property.property_type.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-600">
                      {getEntityName(property.owner_entity_id).charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{getEntityName(property.owner_entity_id)}</span>
                </div>
                {property.lowes_job_name && (
                  <span className="text-xs text-gray-400 truncate max-w-[120px]">
                    Lowe's: {property.lowes_job_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProperties.length === 0 && (
        <EmptyState
          icon={Building2}
          title="No properties found"
          description="Try adjusting your search or add a new property."
          action={
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          }
        />
      )}
      
      {/* Add Property Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Property">
        <form className="space-y-4">
          <Input label="Street Address" placeholder="123 Main Street" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City" placeholder="Indianapolis" />
            <div className="grid grid-cols-2 gap-2">
              <Input label="State" placeholder="IN" maxLength={2} />
              <Input label="ZIP" placeholder="46201" />
            </div>
          </div>
          <Select
            label="Owner Entity"
            options={mockEntities.map(e => ({ value: e.id, label: e.name }))}
          />
          <Select
            label="Property Type"
            options={[
              { value: 'sfr', label: 'Single Family' },
              { value: 'multi_family', label: 'Multi-Family' },
              { value: 'commercial', label: 'Commercial' },
              { value: 'personal', label: 'Personal Residence' },
            ]}
          />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Beds" type="number" placeholder="3" />
            <Input label="Baths" type="number" step="0.5" placeholder="2" />
            <Input label="Sq Ft" type="number" placeholder="1500" />
          </div>
          <Input label="Monthly Rent" type="number" placeholder="1200" />
          <Input label="Lowe's Job Name" placeholder="123 Main Street" />
          
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)} type="button">
              Cancel
            </Button>
            <Button className="flex-1" type="submit">Add Property</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
