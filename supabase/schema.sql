-- ATLAS Database Schema
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENTITIES (LLCs, Companies, Individuals)
-- ============================================
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('llc', 'individual', 'company')),
    tax_id VARCHAR(20),
    parent_entity_id UUID REFERENCES entities(id),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for parent lookup
CREATE INDEX idx_entities_parent ON entities(parent_entity_id);

-- ============================================
-- PROPERTIES
-- ============================================
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    owner_entity_id UUID NOT NULL REFERENCES entities(id),
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('sfr', 'multi_family', 'commercial', 'mixed_use', 'personal')),
    buildium_property_id VARCHAR(50),
    lowes_job_name VARCHAR(255),
    beds INTEGER,
    baths DECIMAL(3,1),
    sqft INTEGER,
    purchase_date DATE,
    purchase_price DECIMAL(12,2),
    monthly_rent DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_properties_owner ON properties(owner_entity_id);
CREATE INDEX idx_properties_lowes_job ON properties(lowes_job_name);

-- ============================================
-- VENDORS
-- ============================================
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(20),
    w9_on_file BOOLEAN DEFAULT FALSE,
    w9_document_url TEXT,
    w9_received_date DATE,
    w9_requested_date DATE,
    is_corporation BOOLEAN DEFAULT FALSE,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for W9 tracking
CREATE INDEX idx_vendors_w9 ON vendors(w9_on_file, is_corporation);

-- ============================================
-- BANK ACCOUNTS
-- ============================================
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('checking', 'savings', 'credit_card', 'line_of_credit')),
    mask VARCHAR(4) NOT NULL,
    entity_id UUID NOT NULL REFERENCES entities(id),
    plaid_account_id VARCHAR(255),
    plaid_access_token TEXT,
    current_balance DECIMAL(12,2),
    available_balance DECIMAL(12,2),
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_bank_accounts_entity ON bank_accounts(entity_id);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    parent_id UUID REFERENCES categories(id),
    schedule_e_line VARCHAR(10),
    is_deductible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, type, schedule_e_line, is_deductible) VALUES
    ('Rental Income (LTR)', 'income', '3', FALSE),
    ('Rental Income (STR)', 'income', '3', FALSE),
    ('Cleaning Fees', 'income', '3', FALSE),
    ('Pet Fees', 'income', '3', FALSE),
    ('Late Fees', 'income', '3', FALSE),
    ('Mortgage Interest', 'expense', '12', TRUE),
    ('Property Taxes', 'expense', '16', TRUE),
    ('Insurance', 'expense', '9', TRUE),
    ('Utilities', 'expense', '17', TRUE),
    ('Repairs & Maintenance', 'expense', '14', TRUE),
    ('Cleaning & Turnover', 'expense', '14', TRUE),
    ('Supplies', 'expense', '15', TRUE),
    ('Landscaping', 'expense', '14', TRUE),
    ('HOA Fees', 'expense', '17', TRUE),
    ('Platform Fees', 'expense', '10', TRUE),
    ('Management Fees', 'expense', '11', TRUE),
    ('Professional Services', 'expense', '17', TRUE),
    ('Travel', 'expense', '18', TRUE),
    ('Home Improvement', 'expense', '14', TRUE);

-- ============================================
-- TRANSACTIONS
-- ============================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cleared', 'reconciled')),
    entity_id UUID NOT NULL REFERENCES entities(id),
    property_id UUID REFERENCES properties(id),
    vendor_id UUID REFERENCES vendors(id),
    category_id UUID REFERENCES categories(id),
    bank_account_id UUID REFERENCES bank_accounts(id),
    plaid_transaction_id VARCHAR(255),
    receipt_url TEXT,
    notes TEXT,
    auto_categorized BOOLEAN DEFAULT FALSE,
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_transactions_date ON transactions(date DESC);
CREATE INDEX idx_transactions_entity ON transactions(entity_id);
CREATE INDEX idx_transactions_property ON transactions(property_id);
CREATE INDEX idx_transactions_vendor ON transactions(vendor_id);
CREATE INDEX idx_transactions_plaid ON transactions(plaid_transaction_id);

-- ============================================
-- VENDOR PAYMENTS (for W-9/1099 tracking)
-- ============================================
CREATE TABLE vendor_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    entity_id UUID NOT NULL REFERENCES entities(id),
    property_id UUID REFERENCES properties(id),
    amount DECIMAL(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    tax_year INTEGER NOT NULL,
    transaction_id UUID REFERENCES transactions(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for YTD calculations
CREATE INDEX idx_vendor_payments_ytd ON vendor_payments(vendor_id, tax_year);

-- ============================================
-- LOWE'S STATEMENTS
-- ============================================
CREATE TABLE lowes_statements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    statement_date DATE NOT NULL,
    statement_period_start DATE NOT NULL,
    statement_period_end DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    document_url TEXT,
    processed BOOLEAN DEFAULT FALSE,
    processing_status VARCHAR(20) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'error')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LOWE'S LINE ITEMS
-- ============================================
CREATE TABLE lowes_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    statement_id UUID NOT NULL REFERENCES lowes_statements(id) ON DELETE CASCADE,
    job_name VARCHAR(255) NOT NULL,
    item_description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    purchase_date DATE,
    property_id UUID REFERENCES properties(id),
    entity_id UUID REFERENCES entities(id),
    matched BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_lowes_items_statement ON lowes_line_items(statement_id);
CREATE INDEX idx_lowes_items_job ON lowes_line_items(job_name);

-- ============================================
-- HOUSING AUTHORITY RENT CHANGES
-- ============================================
CREATE TABLE rent_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id),
    tenant_name VARCHAR(255),
    old_hap_amount DECIMAL(10,2),
    new_hap_amount DECIMAL(10,2),
    old_tenant_portion DECIMAL(10,2),
    new_tenant_portion DECIMAL(10,2),
    effective_date DATE NOT NULL,
    document_url TEXT,
    applied_to_buildium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_rent_changes_property ON rent_changes(property_id);

-- ============================================
-- VIEWS
-- ============================================

-- Vendor YTD Totals with W-9 Status
CREATE VIEW vendor_ytd_summary AS
SELECT 
    v.id,
    v.name,
    v.w9_on_file,
    v.is_corporation,
    v.email,
    v.w9_requested_date,
    COALESCE(SUM(vp.amount), 0) as ytd_total,
    CASE 
        WHEN v.is_corporation THEN 'exempt'
        WHEN v.w9_on_file THEN 'complete'
        WHEN COALESCE(SUM(vp.amount), 0) >= 600 THEN 'needs_w9'
        ELSE 'under_threshold'
    END as w9_status
FROM vendors v
LEFT JOIN vendor_payments vp ON v.id = vp.vendor_id 
    AND vp.tax_year = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY v.id, v.name, v.w9_on_file, v.is_corporation, v.email, v.w9_requested_date;

-- Property P&L Summary
CREATE VIEW property_pnl AS
SELECT 
    p.id,
    p.address,
    p.owner_entity_id,
    e.name as entity_name,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expenses,
    COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END), 0) as net_income
FROM properties p
JOIN entities e ON p.owner_entity_id = e.id
LEFT JOIN transactions t ON p.id = t.property_id
GROUP BY p.id, p.address, p.owner_entity_id, e.name;

-- Lowe's Allocation by Entity
CREATE VIEW lowes_allocation_by_entity AS
SELECT 
    ls.id as statement_id,
    ls.statement_date,
    e.id as entity_id,
    e.name as entity_name,
    SUM(lli.amount * lli.quantity) as total_amount,
    COUNT(lli.id) as item_count
FROM lowes_statements ls
JOIN lowes_line_items lli ON ls.id = lli.statement_id
LEFT JOIN properties p ON lli.property_id = p.id
LEFT JOIN entities e ON COALESCE(lli.entity_id, p.owner_entity_id) = e.id
WHERE e.id IS NOT NULL
GROUP BY ls.id, ls.statement_date, e.id, e.name;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_entities_timestamp BEFORE UPDATE ON entities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_properties_timestamp BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_vendors_timestamp BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bank_accounts_timestamp BEFORE UPDATE ON bank_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_transactions_timestamp BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_lowes_statements_timestamp BEFORE UPDATE ON lowes_statements FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables (for multi-tenant future)
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lowes_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE lowes_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_changes ENABLE ROW LEVEL SECURITY;

-- For now, allow all authenticated users (single tenant)
CREATE POLICY "Allow all for authenticated" ON entities FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON properties FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON vendors FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON bank_accounts FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON vendor_payments FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON lowes_statements FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON lowes_line_items FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated" ON rent_changes FOR ALL USING (true);
