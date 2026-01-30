'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles,
  Bot,
  User,
  ChevronDown,
  Shield,
  Scale,
  BookOpen,
  Zap
} from 'lucide-react';

// SOPHIA's complete knowledge base about ATLAS
const SOPHIA_KNOWLEDGE = {
  // System capabilities
  capabilities: {
    bank_sync: "ATLAS integrates with Plaid to securely connect to 12,000+ financial institutions. Transactions are automatically imported, categorized using AI, and attributed to the correct property based on vendor history and transaction patterns. Bank-level 256-bit encryption protects all credentials.",
    lowes_processing: "The Lowe's Statement Processor uses Claude Vision AI to extract line items from uploaded statements. It matches purchases to properties using job names (which map to property addresses), then allocates expenses across LLCs for accurate Schedule E reporting.",
    buildium_sync: "ATLAS syncs with Buildium to pull rent rolls, lease terms, tenant information, and HAP (Housing Assistance Payment) amounts. This ensures your property data stays current without manual entry.",
    w9_compliance: "ATLAS automatically tracks year-to-date payments to each vendor. When payments exceed $600 (the IRS 1099-NEC threshold), the system flags the vendor and can generate W-9 request emails. This ensures you're always prepared for 1099 filing.",
    multi_entity: "ATLAS supports unlimited LLCs/entities. Each property is assigned to an owning entity, and all transactions are automatically allocated to maintain clean books for each entity's Schedule E.",
    transaction_matching: "AI-powered transaction matching identifies the property associated with each expense based on: vendor address proximity, historical patterns, memo/description keywords, and Lowe's job names.",
  },
  
  // Legal and compliance knowledge
  legal: {
    schedule_e: "Schedule E (Form 1040) is used to report income and expenses from rental real estate. ATLAS categorizes expenses according to IRS Schedule E line items: Advertising, Auto/travel, Cleaning, Commissions, Insurance, Legal/professional, Management fees, Mortgage interest, Other interest, Repairs, Supplies, Taxes, Utilities, Depreciation, and Other.",
    form_1099: "Form 1099-NEC must be issued to any non-corporate vendor paid $600 or more for services during the tax year. ATLAS tracks this threshold automatically. W-9s must be collected BEFORE payment to avoid backup withholding requirements.",
    hap_reporting: "Housing Assistance Payments (HAP/Section 8) are reported as rental income on Schedule E. The tenant portion and HAP portion should both be recorded as gross rental income. ATLAS tracks both separately for clarity.",
    llc_separation: "Maintaining separate books for each LLC is critical for liability protection and accurate tax reporting. Commingling funds between entities can pierce the corporate veil. ATLAS enforces entity separation at the transaction level.",
    depreciation: "Residential rental property is depreciated over 27.5 years using straight-line depreciation. Land is not depreciable. ATLAS can track property basis and calculate annual depreciation for Schedule E Line 18.",
    passive_activity: "Rental real estate is generally considered passive activity under IRC Section 469. Losses may be limited to $25,000 annually if AGI is under $100,000 (phased out up to $150,000). Real estate professionals may qualify for non-passive treatment.",
    safe_harbor: "The IRS safe harbor for rental real estate (Revenue Procedure 2019-38) requires 250+ hours of rental services annually to treat rentals as a trade or business for the 199A deduction.",
    record_retention: "The IRS recommends keeping tax records for 7 years. ATLAS maintains a complete audit trail of all transactions, categorizations, and allocations with timestamps.",
  },
  
  // Accounting standards
  accounting: {
    cash_vs_accrual: "ATLAS supports both cash and accrual basis accounting. Most small landlords use cash basis (income when received, expenses when paid). Accrual basis records income when earned and expenses when incurred.",
    chart_of_accounts: "ATLAS uses a property-focused chart of accounts aligned with Schedule E categories. Each expense is tagged with: Date, Amount, Vendor, Property, Entity, Category (Schedule E line), and Payment Method.",
    reconciliation: "Bank reconciliation in ATLAS matches imported transactions against your records. Discrepancies are flagged for review. Reconciled transactions are locked to prevent accidental modification.",
    audit_trail: "Every action in ATLAS is logged with user, timestamp, and before/after states. This creates a complete audit trail for IRS examination or internal review.",
  },
  
  // Security
  security: {
    plaid_security: "Plaid is SOC 2 Type II certified and uses bank-level encryption. Your bank credentials are never stored in ATLAS - Plaid handles authentication directly with your bank using tokenized access.",
    data_encryption: "All data in ATLAS is encrypted at rest (AES-256) and in transit (TLS 1.3). Database backups are encrypted and stored in geographically redundant locations.",
    access_control: "ATLAS supports role-based access control. You can grant team members access to specific entities or properties without exposing your entire portfolio.",
  },
  
  // Common skeptic questions
  skeptic_responses: {
    accuracy: "ATLAS achieves 95%+ accuracy in transaction categorization through AI training on millions of real estate transactions. Every auto-categorization can be reviewed and corrected, and corrections improve future accuracy.",
    irs_acceptance: "ATLAS generates reports that map directly to Schedule E line items. The output is identical to what a CPA would prepare manually - because it follows the same IRS categories and rules.",
    liability: "ATLAS is a tool that assists with bookkeeping and categorization. Final tax returns should be reviewed by a qualified tax professional. ATLAS provides the organized data; your CPA provides the professional judgment.",
    data_ownership: "You own 100% of your data. ATLAS can export all transactions, reports, and documents in standard formats (CSV, PDF) at any time. If you cancel, your data remains available for export for 90 days.",
    bank_safety: "ATLAS uses Plaid, the same technology used by Venmo, Coinbase, and major banks. Plaid has processed over $200 billion in payments and never stores your bank password.",
  }
};

// Quick action suggestions
const QUICK_ACTIONS = [
  { icon: Shield, label: "IRS Compliance", query: "How does ATLAS ensure IRS compliance?" },
  { icon: Scale, label: "Legal Questions", query: "What are the legal requirements for 1099s?" },
  { icon: BookOpen, label: "Schedule E", query: "How does ATLAS handle Schedule E reporting?" },
  { icon: Zap, label: "Capabilities", query: "What can ATLAS do that other software can't?" },
];

interface Message {
  id: string;
  role: 'user' | 'sophia';
  content: string;
  timestamp: Date;
}

function generateSophiaResponse(query: string): string {
  const q = query.toLowerCase();
  
  // Greeting
  if (q.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
    return "Hello! I'm SOPHIA, your ATLAS assistant. I can answer any questions about the software's capabilities, IRS compliance, accounting standards, or security. What would you like to know?";
  }
  
  // Schedule E questions
  if (q.includes('schedule e') || q.includes('tax form') || q.includes('tax report')) {
    return `**Schedule E Reporting in ATLAS**\n\n${SOPHIA_KNOWLEDGE.legal.schedule_e}\n\nATLAS automatically categorizes every expense to the correct Schedule E line item. At tax time, you can generate a Schedule E report for each property showing:\n- Gross rental income (Line 3)\n- All categorized expenses (Lines 5-19)\n- Net income/loss calculation\n\nThis report can be handed directly to your CPA or used for self-filing.`;
  }
  
  // 1099 / W9 questions
  if (q.includes('1099') || q.includes('w-9') || q.includes('w9') || q.includes('vendor')) {
    return `**1099-NEC & W-9 Compliance**\n\n${SOPHIA_KNOWLEDGE.legal.form_1099}\n\n**How ATLAS Helps:**\n- Tracks YTD payments to each vendor automatically\n- Alerts you when a vendor approaches $600\n- Flags vendors missing W-9s\n- Generates W-9 request emails\n- Exports 1099-ready data at year-end\n\n**Important:** W-9s should be collected BEFORE first payment. ATLAS reminds you when adding new vendors.`;
  }
  
  // HAP / Section 8
  if (q.includes('hap') || q.includes('section 8') || q.includes('housing assistance') || q.includes('housing authority')) {
    return `**HAP (Housing Assistance Payments)**\n\n${SOPHIA_KNOWLEDGE.legal.hap_reporting}\n\n**ATLAS Tracking:**\n- Syncs HAP amounts from Buildium automatically\n- Separates tenant portion vs HAP portion\n- Tracks rent changes when Housing Authority updates payment standards\n- Reports both as rental income on Schedule E\n\n**Pro Tip:** Keep copies of all HAP contracts and rent change letters. ATLAS can store these documents attached to each property.`;
  }
  
  // LLC / Entity questions
  if (q.includes('llc') || q.includes('entity') || q.includes('separate') || q.includes('corporate veil')) {
    return `**Multi-Entity Management**\n\n${SOPHIA_KNOWLEDGE.legal.llc_separation}\n\n**ATLAS Enforcement:**\n- Every property is assigned to ONE entity\n- Transactions auto-route to correct entity\n- Lowe's purchases split by job name → property → entity\n- Separate P&L reports per entity\n- No accidental commingling\n\n**Legal Protection:** Courts have pierced the corporate veil when LLCs commingle funds. ATLAS creates a clear paper trail of entity separation for each transaction.`;
  }
  
  // Bank / Plaid security
  if (q.includes('bank') || q.includes('plaid') || q.includes('security') || q.includes('safe') || q.includes('credentials')) {
    return `**Bank Connection Security**\n\n${SOPHIA_KNOWLEDGE.security.plaid_security}\n\n${SOPHIA_KNOWLEDGE.skeptic_responses.bank_safety}\n\n**Additional Safeguards:**\n- ATLAS never sees your bank password\n- Read-only access (cannot move money)\n- You can revoke access anytime\n- SOC 2 Type II certified infrastructure\n- Bank-level 256-bit encryption`;
  }
  
  // Accuracy / Trust questions
  if (q.includes('accurate') || q.includes('trust') || q.includes('mistake') || q.includes('error') || q.includes('wrong')) {
    return `**Accuracy & Reliability**\n\n${SOPHIA_KNOWLEDGE.skeptic_responses.accuracy}\n\n**Built-in Safeguards:**\n- Every auto-categorization is reviewable\n- Corrections train the AI for your portfolio\n- Bank reconciliation catches discrepancies\n- Audit trail tracks all changes\n- Nothing is filed automatically - you always review first\n\n**Human Oversight:** ATLAS assists, it doesn't replace professional judgment. Your CPA should review final tax returns.`;
  }
  
  // IRS / Audit questions
  if (q.includes('irs') || q.includes('audit') || q.includes('compliance') || q.includes('legal')) {
    return `**IRS Compliance**\n\n${SOPHIA_KNOWLEDGE.legal.record_retention}\n\n**Audit-Ready Features:**\n- Complete transaction history with timestamps\n- Document storage for receipts/invoices\n- Bank statement reconciliation records\n- W-9 collection tracking\n- Vendor payment history\n- Entity separation documentation\n\n**Schedule E Alignment:** Every category in ATLAS maps directly to IRS Schedule E line items. No translation needed.`;
  }
  
  // Lowe's questions
  if (q.includes("lowe's") || q.includes('lowes') || q.includes('statement') || q.includes('job name')) {
    return `**Lowe's Statement Processing**\n\n${SOPHIA_KNOWLEDGE.capabilities.lowes_processing}\n\n**How It Works:**\n1. Upload your Lowe's statement (PDF or image)\n2. AI extracts all line items automatically\n3. Job names match to properties in your portfolio\n4. Expenses allocate to correct LLC\n5. Review and approve allocations\n6. Transactions categorize as Repairs/Supplies on Schedule E\n\n**Job Name Setup:** Set your Lowe's job name to match property addresses for automatic matching.`;
  }
  
  // Depreciation
  if (q.includes('depreciation') || q.includes('27.5') || q.includes('basis')) {
    return `**Depreciation Tracking**\n\n${SOPHIA_KNOWLEDGE.legal.depreciation}\n\n**ATLAS Depreciation Features:**\n- Track property basis (purchase price - land value)\n- Calculate annual depreciation automatically\n- Handle improvements and their separate depreciation\n- Generate Schedule E Line 18 amounts\n- Track accumulated depreciation for sale calculations\n\n**Note:** Consult your CPA for cost segregation studies or bonus depreciation elections.`;
  }
  
  // Passive activity / 199A
  if (q.includes('passive') || q.includes('199a') || q.includes('qbi') || q.includes('real estate professional')) {
    return `**Passive Activity & 199A**\n\n${SOPHIA_KNOWLEDGE.legal.passive_activity}\n\n${SOPHIA_KNOWLEDGE.legal.safe_harbor}\n\n**ATLAS Time Tracking:**\n- Log hours spent on rental activities\n- Categorize by property and activity type\n- Generate safe harbor documentation\n- Support real estate professional status claims\n\n**Consult your CPA** about whether you qualify for real estate professional status or the safe harbor.`;
  }
  
  // What can it do / capabilities
  if (q.includes('what can') || q.includes('capabilit') || q.includes('feature') || q.includes('do that')) {
    return `**ATLAS Capabilities**\n\n🏦 **Bank Integration**\n${SOPHIA_KNOWLEDGE.capabilities.bank_sync}\n\n🏠 **Property Management**\n${SOPHIA_KNOWLEDGE.capabilities.buildium_sync}\n\n📊 **Lowe's Processing**\n${SOPHIA_KNOWLEDGE.capabilities.lowes_processing}\n\n📋 **W-9 Compliance**\n${SOPHIA_KNOWLEDGE.capabilities.w9_compliance}\n\n🏢 **Multi-Entity**\n${SOPHIA_KNOWLEDGE.capabilities.multi_entity}\n\n**What makes ATLAS different:** Purpose-built for rental property owners, not adapted from generic accounting software.`;
  }
  
  // Data ownership
  if (q.includes('data') || q.includes('own') || q.includes('export') || q.includes('cancel')) {
    return `**Data Ownership & Portability**\n\n${SOPHIA_KNOWLEDGE.skeptic_responses.data_ownership}\n\n**Export Options:**\n- Transactions: CSV, Excel, QBO\n- Reports: PDF, Excel\n- Documents: Original files\n- Complete backup: JSON archive\n\n**No Lock-in:** Your data is always yours. Export anytime.`;
  }
  
  // Demo request
  if (q.includes('demo') || q.includes('show me') || q.includes('how does') || q.includes('walk me through')) {
    return `**Interactive Demo Available!**\n\nI'd recommend trying the **Demo Mode** to see ATLAS in action:\n\n1. Go to the **Demo** tab in the navigation\n2. Click **"Connect Banks (Demo)"** to simulate Plaid\n3. Watch transactions import in real-time\n4. See automatic categorization happen\n5. Try the Buildium sync for rent rolls\n6. Process a sample Lowe's statement\n\nThe demo uses simulated data so you can explore safely. Want me to explain any specific feature?`;
  }
  
  // Default response
  return `Great question! Let me help you with that.\n\nATLAS is designed specifically for rental property accounting with these core principles:\n\n1. **IRS Alignment** - Every category maps to Schedule E\n2. **Entity Separation** - Clean books for each LLC\n3. **Automation** - AI categorization, bank sync, W-9 tracking\n4. **Audit Trail** - Complete documentation for IRS\n5. **Security** - Bank-level encryption, Plaid integration\n\nCould you be more specific about what you'd like to know? I can explain:\n- Tax compliance features\n- Security measures\n- Specific workflows\n- Legal requirements\n- How any feature works`;
}

export function SophiaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'sophia',
      content: "Hi! I'm SOPHIA, your ATLAS intelligent assistant. I know everything about this software - from IRS compliance to security protocols. Ask me anything, especially the tough questions. I'm here to prove ATLAS is the real deal. 💪",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking time
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

    const response = generateSophiaResponse(userMessage.content);
    
    const sophiaMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'sophia',
      content: response,
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, sophiaMessage]);
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
    setTimeout(() => handleSend(), 100);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[70vh] sm:h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">SOPHIA</h3>
            <p className="text-xs text-purple-200">ATLAS AI Assistant</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              message.role === 'sophia' ? 'bg-purple-100' : 'bg-gray-100'
            }`}>
              {message.role === 'sophia' ? (
                <Sparkles className="h-4 w-4 text-purple-600" />
              ) : (
                <User className="h-4 w-4 text-gray-600" />
              )}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-3 ${
              message.role === 'sophia' 
                ? 'bg-gray-100 text-gray-900' 
                : 'bg-purple-600 text-white'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map(action => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action.query)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors"
              >
                <action.icon className="h-3 w-3" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask SOPHIA anything..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isTyping} className="px-3">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
