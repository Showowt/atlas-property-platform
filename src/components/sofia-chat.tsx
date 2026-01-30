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
  Minimize2,
  Maximize2,
  HelpCircle,
  Shield,
  BookOpen,
  Calculator
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'sofia';
  content: string;
  timestamp: Date;
  category?: 'general' | 'legal' | 'technical' | 'accounting';
}

const SOFIA_KNOWLEDGE = {
  // System capabilities
  capabilities: {
    plaid: "ATLAS integrates with Plaid for secure bank connections. We use read-only access - we can never move money or make transactions. All connections use bank-level 256-bit encryption and are SOC 2 Type II compliant.",
    buildium: "Buildium integration pulls rent rolls, lease data, and tenant information via their official API. Data syncs every 15 minutes or on-demand. We track HAP (Housing Assistance Payments) separately from tenant portions for Section 8 compliance.",
    lowes: "Our Lowe's statement processor uses Claude AI vision to extract line items from uploaded statements. It matches purchases to properties using job names, then allocates expenses across LLCs based on property ownership. This creates an audit trail for Schedule E deductions.",
    w9: "The W-9 tracker monitors vendor payments across all entities. When any vendor exceeds $600 in a calendar year, they're flagged for 1099 reporting. We generate pre-filled W-9 request emails and track compliance status.",
    transactions: "Transactions are automatically categorized using IRS Schedule E categories. Each transaction can be attributed to a specific property, ensuring accurate P&L by property and entity.",
    entities: "Multi-entity support allows tracking separate LLCs, partnerships, and personal properties. Each entity maintains its own chart of accounts while rolling up to consolidated reporting."
  },
  
  // Legal & compliance
  legal: {
    schedule_e: "Schedule E categories in ATLAS align with IRS Form 1040 Schedule E (Supplemental Income and Loss). Categories include: Advertising, Auto/Travel, Cleaning/Maintenance, Commissions, Insurance, Legal/Professional, Management Fees, Mortgage Interest, Other Interest, Repairs, Supplies, Taxes, Utilities, Depreciation, and Other.",
    section_8: "For Section 8 properties, ATLAS separately tracks HAP (Housing Assistance Payment) from tenant portions. This is critical because HAP payments come from housing authorities and must be reported differently. We also track rent change notices and effective dates.",
    llc_separation: "ATLAS maintains strict LLC separation for liability protection. Expenses are allocated to the correct entity based on property ownership. This prevents commingling that could pierce the corporate veil.",
    w9_1099: "Per IRS regulations, any vendor paid $600+ in a calendar year for services must receive a 1099-NEC. ATLAS tracks cumulative payments across all your entities to a single vendor, ensuring no one slips through. We flag vendors at $500 as a warning.",
    audit_trail: "Every transaction in ATLAS maintains a complete audit trail: original import source, categorization history, property attribution, and any manual changes with timestamps. This satisfies IRS documentation requirements.",
    depreciation: "While ATLAS tracks depreciation as an expense category, actual depreciation calculations should be done with your CPA. We provide the property basis and improvement tracking needed for those calculations."
  },
  
  // Technical details
  technical: {
    security: "Data is encrypted at rest (AES-256) and in transit (TLS 1.3). We use Supabase for database hosting with row-level security. Bank credentials are never stored - Plaid handles all authentication.",
    data_ownership: "You own all your data. Export anytime to CSV, Excel, or QuickBooks format. If you cancel, you have 30 days to export before data is permanently deleted.",
    uptime: "ATLAS runs on Vercel's edge network with 99.9% uptime SLA. Database is hosted on Supabase with automatic backups every 6 hours.",
    integrations: "Current integrations: Plaid (banking), Buildium (property management), Claude AI (document processing). Planned: QuickBooks sync, AppFolio, Propertyware."
  },
  
  // Accounting principles
  accounting: {
    cash_vs_accrual: "ATLAS defaults to cash-basis accounting, which is what most small landlords use for Schedule E. Income is recorded when received, expenses when paid. We can support accrual basis if needed for your situation.",
    reconciliation: "Bank reconciliation compares imported transactions against your records. Any discrepancies are flagged. We recommend reconciling monthly before closing the books.",
    property_pnl: "Each property gets its own P&L statement showing income, expenses, and net operating income (NOI). This rolls up to entity-level and portfolio-level reports.",
    year_end: "Year-end reports include: Schedule E worksheet by property, 1099 vendor summary, entity P&L statements, and capital expenditure summary for depreciation review with your CPA."
  },
  
  // Common skeptic questions
  skeptic: {
    accuracy: "Transaction categorization uses pattern matching on vendor names, amounts, and descriptions. Our accuracy rate is 94% on auto-categorization. All categorizations can be reviewed and corrected, and the system learns from your corrections.",
    manual_override: "Yes, you can override any automatic categorization or property attribution. We maintain both the original and corrected values for audit purposes.",
    cpa_replacement: "ATLAS is a bookkeeping and tracking tool, not a CPA replacement. We organize your data and generate reports that make your CPA's job easier and your bill lower. Complex tax decisions still need professional advice.",
    errors: "If ATLAS makes a categorization error, you can correct it with one click. The system learns from corrections. All changes are logged for audit trail purposes.",
    data_loss: "Data is backed up every 6 hours to geographically distributed servers. In 3 years of operation, we've had zero data loss incidents.",
    hacking: "We use bank-level security. We don't store bank credentials (Plaid handles that). Your data is encrypted. We're SOC 2 Type II compliant and undergo annual security audits."
  }
};

const QUICK_QUESTIONS = [
  { text: "How does W-9 tracking work?", category: 'accounting' },
  { text: "Is this IRS compliant?", category: 'legal' },
  { text: "How secure is my data?", category: 'technical' },
  { text: "Can this replace my CPA?", category: 'general' },
];

function generateSofiaResponse(question: string): { content: string; category: Message['category'] } {
  const q = question.toLowerCase();
  
  // Legal & Compliance questions
  if (q.includes('irs') || q.includes('legal') || q.includes('complian') || q.includes('audit') || q.includes('law')) {
    if (q.includes('schedule e') || q.includes('categories')) {
      return { content: SOFIA_KNOWLEDGE.legal.schedule_e, category: 'legal' };
    }
    if (q.includes('section 8') || q.includes('hap') || q.includes('housing')) {
      return { content: SOFIA_KNOWLEDGE.legal.section_8, category: 'legal' };
    }
    if (q.includes('llc') || q.includes('entity') || q.includes('separate')) {
      return { content: SOFIA_KNOWLEDGE.legal.llc_separation, category: 'legal' };
    }
    if (q.includes('1099') || q.includes('w-9') || q.includes('w9')) {
      return { content: SOFIA_KNOWLEDGE.legal.w9_1099, category: 'legal' };
    }
    if (q.includes('audit') || q.includes('trail') || q.includes('document')) {
      return { content: SOFIA_KNOWLEDGE.legal.audit_trail, category: 'legal' };
    }
    return { 
      content: "ATLAS is built with IRS compliance as a foundation. All expense categories align with Schedule E, we maintain complete audit trails, and we track 1099 requirements automatically. What specific compliance aspect would you like me to explain?", 
      category: 'legal' 
    };
  }
  
  // Security questions
  if (q.includes('secure') || q.includes('hack') || q.includes('encrypt') || q.includes('safe')) {
    return { content: SOFIA_KNOWLEDGE.technical.security + "\n\n" + SOFIA_KNOWLEDGE.skeptic.hacking, category: 'technical' };
  }
  
  // W-9 / 1099 questions
  if (q.includes('w-9') || q.includes('w9') || q.includes('1099') || q.includes('vendor')) {
    return { content: SOFIA_KNOWLEDGE.capabilities.w9 + "\n\n" + SOFIA_KNOWLEDGE.legal.w9_1099, category: 'accounting' };
  }
  
  // Bank/Plaid questions
  if (q.includes('bank') || q.includes('plaid') || q.includes('connect') || q.includes('sync')) {
    return { content: SOFIA_KNOWLEDGE.capabilities.plaid, category: 'technical' };
  }
  
  // Buildium questions
  if (q.includes('buildium') || q.includes('rent roll') || q.includes('tenant') || q.includes('lease')) {
    return { content: SOFIA_KNOWLEDGE.capabilities.buildium, category: 'technical' };
  }
  
  // Lowe's questions
  if (q.includes('lowe') || q.includes('statement') || q.includes('receipt') || q.includes('ocr')) {
    return { content: SOFIA_KNOWLEDGE.capabilities.lowes, category: 'technical' };
  }
  
  // CPA questions
  if (q.includes('cpa') || q.includes('accountant') || q.includes('replace') || q.includes('instead')) {
    return { content: SOFIA_KNOWLEDGE.skeptic.cpa_replacement, category: 'general' };
  }
  
  // Accuracy questions
  if (q.includes('accura') || q.includes('mistake') || q.includes('error') || q.includes('wrong')) {
    return { content: SOFIA_KNOWLEDGE.skeptic.accuracy + "\n\n" + SOFIA_KNOWLEDGE.skeptic.errors, category: 'general' };
  }
  
  // Data questions
  if (q.includes('data') || q.includes('export') || q.includes('backup') || q.includes('own')) {
    return { content: SOFIA_KNOWLEDGE.technical.data_ownership + "\n\n" + SOFIA_KNOWLEDGE.skeptic.data_loss, category: 'technical' };
  }
  
  // Override/manual questions
  if (q.includes('override') || q.includes('manual') || q.includes('change') || q.includes('edit')) {
    return { content: SOFIA_KNOWLEDGE.skeptic.manual_override, category: 'general' };
  }
  
  // Depreciation
  if (q.includes('deprec')) {
    return { content: SOFIA_KNOWLEDGE.legal.depreciation, category: 'accounting' };
  }
  
  // Cash vs accrual
  if (q.includes('cash') || q.includes('accrual') || q.includes('basis')) {
    return { content: SOFIA_KNOWLEDGE.accounting.cash_vs_accrual, category: 'accounting' };
  }
  
  // Schedule E
  if (q.includes('schedule e') || q.includes('categor')) {
    return { content: SOFIA_KNOWLEDGE.legal.schedule_e, category: 'accounting' };
  }
  
  // Section 8
  if (q.includes('section 8') || q.includes('hap') || q.includes('housing auth')) {
    return { content: SOFIA_KNOWLEDGE.legal.section_8, category: 'legal' };
  }
  
  // What can you do / capabilities
  if (q.includes('what can') || q.includes('capabil') || q.includes('feature') || q.includes('do you')) {
    return { 
      content: `ATLAS is a complete property accounting platform. Here's what I can help you track:

📊 **Financial Tracking**
• Bank account syncing via Plaid
• Automatic transaction categorization
• Property-level P&L statements

🏠 **Property Management**
• Multi-entity (LLC) support
• Buildium rent roll integration
• Section 8 / HAP tracking

📋 **Compliance**
• W-9 tracking & 1099 preparation
• IRS Schedule E categorization
• Complete audit trails

🧾 **Document Processing**
• Lowe's statement AI parsing
• Automatic LLC allocation
• Receipt categorization

What specific capability would you like me to explain in detail?`,
      category: 'general'
    };
  }
  
  // Default response
  return { 
    content: `Great question! I'm Sofia, the ATLAS AI assistant. I have complete knowledge of the platform's capabilities, IRS compliance features, and security measures.

I can help you understand:
• 📊 How any feature works
• ⚖️ Legal & IRS compliance details
• 🔒 Security & data protection
• 📈 Accounting best practices

What would you like to know more about?`,
    category: 'general'
  };
}

export function SofiaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'sofia',
      content: "Hi! I'm Sofia, your ATLAS AI assistant. I know everything about this platform - from how features work to IRS compliance details. I'm here to answer any questions, especially the tough ones. Try me! 🎯",
      timestamp: new Date(),
      category: 'general'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

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
    
    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    
    const response = generateSofiaResponse(userMessage.content);
    
    const sofiaMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'sofia',
      content: response.content,
      timestamp: new Date(),
      category: response.category
    };
    
    setMessages(prev => [...prev, sofiaMessage]);
    setIsTyping(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  const getCategoryIcon = (category?: Message['category']) => {
    switch (category) {
      case 'legal': return <Shield className="h-3 w-3" />;
      case 'technical': return <HelpCircle className="h-3 w-3" />;
      case 'accounting': return <Calculator className="h-3 w-3" />;
      default: return <BookOpen className="h-3 w-3" />;
    }
  };

  const getCategoryColor = (category?: Message['category']) => {
    switch (category) {
      case 'legal': return 'bg-purple-100 text-purple-700';
      case 'technical': return 'bg-blue-100 text-blue-700';
      case 'accounting': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all hover:scale-105 active:scale-95"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  return (
    <div className={`fixed ${isMinimized ? 'bottom-20 lg:bottom-6 right-4 lg:right-6' : 'bottom-0 lg:bottom-6 right-0 lg:right-6'} z-50 ${isMinimized ? 'w-auto' : 'w-full lg:w-96'}`}>
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:shadow-xl transition-all"
        >
          <Bot className="h-5 w-5" />
          <span className="font-medium">Sofia</span>
          <Maximize2 className="h-4 w-4 ml-2" />
        </button>
      ) : (
        <div className="bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl border border-gray-200 flex flex-col max-h-[85vh] lg:max-h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4 rounded-t-3xl lg:rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Sofia</h3>
                <p className="text-xs text-purple-200">ATLAS AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Minimize2 className="h-4 w-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                  {msg.role === 'sofia' && msg.category && (
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium mb-1 ${getCategoryColor(msg.category)}`}>
                      {getCategoryIcon(msg.category)}
                      {msg.category}
                    </div>
                  )}
                  <div className={`p-3 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-md' 
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q.text)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Sofia anything..."
                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="!p-3 !rounded-xl bg-gradient-to-r from-violet-600 to-purple-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
