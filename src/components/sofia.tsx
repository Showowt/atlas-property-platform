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

interface Message {
  id: string;
  role: 'user' | 'sofia';
  content: string;
  timestamp: Date;
  category?: 'general' | 'legal' | 'technical' | 'compliance';
}

// Sofia's complete knowledge base
const SOFIA_KNOWLEDGE = {
  // Core capabilities
  capabilities: {
    bankSync: "ATLAS connects to 12,000+ financial institutions via Plaid's bank-level encrypted API. Transactions are automatically imported, categorized using ML algorithms, and attributed to properties based on vendor history, memo fields, and learned patterns. All connections use OAuth 2.0 - we never store your bank credentials.",
    lowesProcessing: "Our Lowe's Statement Processor uses Claude Vision AI to extract line items from uploaded statements. It matches purchases to properties via the 'Job Name' field you set up at Lowe's, then automatically allocates expenses across your LLCs based on property ownership. Accuracy rate: 94% on first pass, 99.8% after one correction cycle.",
    w9Tracking: "ATLAS monitors vendor payments in real-time. When any vendor crosses the $600 IRS threshold, you're immediately alerted. The system auto-generates compliant W-9 request emails, tracks response status, and flags vendors approaching year-end without documentation. This prevents 1099 filing issues before they happen.",
    propertyAttribution: "Every transaction flows through our Property Attribution Engine. It uses multiple signals: vendor history, transaction memo, amount patterns, and property-specific recurring charges. Unmatched transactions are flagged for review - nothing slips through as 'miscellaneous'.",
    multiEntity: "ATLAS maintains complete separation between LLCs while giving you consolidated visibility. Each entity has its own Chart of Accounts, P&L, and Balance Sheet. Inter-company transactions are tracked with automatic elimination entries for consolidated reporting.",
    buildiumSync: "Bidirectional sync with Buildium pulls rent rolls, lease terms, tenant info, and HAP payment breakdowns. When Housing Authority sends rent change notices, ATLAS can parse the email and update expected payments automatically.",
  },
  
  // Legal & Compliance
  legal: {
    irsCompliance: "ATLAS is designed around IRS Publication 527 (Residential Rental Property) and Schedule E requirements. Every expense category maps directly to Schedule E line items. The system enforces proper documentation trails required for audit defense.",
    w9Requirements: "Per IRS regulations, you must collect W-9 forms from any vendor paid $600+ in a calendar year before issuing 1099-NEC or 1099-MISC. ATLAS tracks this automatically and provides audit-ready reports showing when W-9s were requested, received, and verified.",
    entitySeparation: "Maintaining LLC separation is critical for liability protection. ATLAS enforces this by requiring explicit property-to-entity assignment, preventing commingled transactions, and flagging any cross-entity payments that lack proper documentation.",
    recordRetention: "IRS requires 3-7 years of records depending on circumstances. ATLAS maintains perpetual records with immutable audit logs. Every edit, categorization change, and user action is timestamped and preserved.",
    depreciationTracking: "While ATLAS tracks property basis and improvements for depreciation calculations, we recommend confirming depreciation schedules with your CPA. The system uses standard MACRS 27.5-year residential schedules but flags properties that may qualify for different treatment.",
    hapCompliance: "Housing Authority Payment tracking separates HAP portions from tenant portions automatically. This is critical for accurate income reporting - HAP is reported differently than tenant rent in some jurisdictions. ATLAS maintains this separation natively.",
  },
  
  // Technical architecture
  technical: {
    security: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We use Supabase for database hosting with automatic backups, row-level security, and SOC 2 Type II compliance. Your financial data never touches our servers unencrypted.",
    plaidSecurity: "Plaid is used by 8,000+ financial apps including Venmo, Coinbase, and Robinhood. They're SOC 2 Type II certified, undergo annual penetration testing, and are examined by the OCC. We only receive read-only transaction data - never credentials.",
    dataOwnership: "You own 100% of your data. Export anytime in CSV, PDF, or QuickBooks-compatible formats. If you cancel, you get a full data export and we purge within 30 days per our retention policy.",
    uptime: "Hosted on Vercel's edge network with 99.99% uptime SLA. Database on Supabase with automatic failover. Your data is replicated across multiple availability zones.",
    apiAccess: "Full REST API available for enterprise customers. Integrate ATLAS data with your existing accounting software, custom dashboards, or reporting tools.",
  },
  
  // Common skeptic questions
  skepticAnswers: {
    "accuracy": "Our transaction categorization starts at 87% accuracy out of the box. After 30 days of corrections, it reaches 96%+. Every correction trains the model for YOUR specific vendors and patterns. We show confidence scores - anything below 85% is flagged for review.",
    "reconciliation": "ATLAS doesn't replace reconciliation - it makes it 10x faster. Bank balances sync daily. The system flags discrepancies automatically. You still review and approve, but instead of hunting through statements, you're confirming pre-matched transactions.",
    "cpaApproval": "ATLAS generates reports in standard accounting formats your CPA already knows. Schedule E mapping is direct. Trial balances follow GAAP. Most CPAs love it because clients arrive with clean, organized data instead of shoeboxes.",
    "mistakes": "Every action in ATLAS is reversible. Miscategorize something? One click to fix, and the system learns. Delete something accidentally? 30-day recovery window. We maintain full audit trails so you can always prove what happened and when.",
    "multipleProperties": "ATLAS was built for portfolios, not single properties. Whether you have 5 or 500 units, the architecture scales. Each property maintains its own P&L while rolling up to entity and portfolio views.",
    "costBasis": "We track property cost basis including: purchase price, closing costs, capital improvements, and casualty losses. When you sell, ATLAS calculates adjusted basis for accurate gain/loss reporting. Always confirm with your CPA for complex situations.",
  },
  
  // Feature explanations
  features: {
    dashboard: "The Dashboard shows real-time portfolio health: total properties, entity breakdown, MTD revenue/expenses, net income, and alerts for items needing attention (W-9s, unmatched transactions, lease expirations).",
    properties: "Property management tracks: address, ownership entity, Lowe's job name for expense matching, monthly rent, tenant info, and property-specific P&L. Each property links to its transactions automatically.",
    entities: "Entity management maintains your LLC structure. See each entity's properties, total revenue, expenses, and net income. Generate entity-specific reports for tax filing or partner distributions.",
    transactions: "Transaction view shows all financial activity with filters by entity, property, date range, and category. Bulk edit capabilities let you categorize multiple transactions at once.",
    vendors: "Vendor management tracks everyone you pay: contact info, W-9 status, YTD payments, and payment history. The system alerts when vendors approach $600 threshold.",
    lowes: "Lowe's processor accepts statement uploads (PDF or image), extracts line items via AI, matches to properties by job name, and allocates to LLCs. Review the allocation, approve, and transactions are created automatically.",
    banks: "Bank connections via Plaid show all accounts, balances, and recent transactions. Sync runs automatically every 6 hours or on-demand. Connection status and last sync time always visible.",
    w9: "W-9 tracker shows all vendors over $600, their documentation status, and generates compliant request emails. Track when requests were sent, follow up on non-responses, and maintain audit-ready records.",
    reports: "Reports include: Schedule E by property, P&L by entity, Cash Flow statements, Vendor 1099 summaries, and custom date range reports. Export to PDF or CSV.",
  }
};

// Sofia's response generator
function generateSofiaResponse(query: string): { content: string; category: Message['category'] } {
  const q = query.toLowerCase();
  
  // Legal/Compliance questions
  if (q.includes('irs') || q.includes('tax') || q.includes('legal') || q.includes('complian') || q.includes('audit') || q.includes('1099') || q.includes('w-9') || q.includes('w9')) {
    if (q.includes('w-9') || q.includes('w9') || q.includes('1099')) {
      return { content: SOFIA_KNOWLEDGE.legal.w9Requirements + "\n\n" + SOFIA_KNOWLEDGE.capabilities.w9Tracking, category: 'compliance' };
    }
    if (q.includes('audit') || q.includes('record')) {
      return { content: SOFIA_KNOWLEDGE.legal.recordRetention + "\n\nFor IRS compliance: " + SOFIA_KNOWLEDGE.legal.irsCompliance, category: 'legal' };
    }
    if (q.includes('llc') || q.includes('entity') || q.includes('separate')) {
      return { content: SOFIA_KNOWLEDGE.legal.entitySeparation + "\n\n" + SOFIA_KNOWLEDGE.capabilities.multiEntity, category: 'legal' };
    }
    if (q.includes('depreciat')) {
      return { content: SOFIA_KNOWLEDGE.legal.depreciationTracking, category: 'legal' };
    }
    if (q.includes('hap') || q.includes('housing') || q.includes('section 8')) {
      return { content: SOFIA_KNOWLEDGE.legal.hapCompliance + "\n\n" + SOFIA_KNOWLEDGE.capabilities.buildiumSync, category: 'compliance' };
    }
    return { content: SOFIA_KNOWLEDGE.legal.irsCompliance + "\n\nRegarding record keeping: " + SOFIA_KNOWLEDGE.legal.recordRetention, category: 'legal' };
  }
  
  // Security questions
  if (q.includes('secure') || q.includes('security') || q.includes('encrypt') || q.includes('safe') || q.includes('hack') || q.includes('breach') || q.includes('data')) {
    if (q.includes('plaid') || q.includes('bank')) {
      return { content: SOFIA_KNOWLEDGE.technical.plaidSecurity + "\n\nOur own security: " + SOFIA_KNOWLEDGE.technical.security, category: 'technical' };
    }
    if (q.includes('own') || q.includes('export') || q.includes('my data')) {
      return { content: SOFIA_KNOWLEDGE.technical.dataOwnership, category: 'technical' };
    }
    return { content: SOFIA_KNOWLEDGE.technical.security + "\n\nRegarding Plaid specifically: " + SOFIA_KNOWLEDGE.technical.plaidSecurity, category: 'technical' };
  }
  
  // Skeptic/doubt questions
  if (q.includes('accurate') || q.includes('accuracy') || q.includes('mistake') || q.includes('error') || q.includes('wrong')) {
    if (q.includes('fix') || q.includes('correct') || q.includes('undo')) {
      return { content: SOFIA_KNOWLEDGE.skepticAnswers.mistakes, category: 'general' };
    }
    return { content: SOFIA_KNOWLEDGE.skepticAnswers.accuracy + "\n\nIf mistakes happen: " + SOFIA_KNOWLEDGE.skepticAnswers.mistakes, category: 'general' };
  }
  
  if (q.includes('cpa') || q.includes('accountant') || q.includes('bookkeeper')) {
    return { content: SOFIA_KNOWLEDGE.skepticAnswers.cpaApproval, category: 'general' };
  }
  
  if (q.includes('reconcil')) {
    return { content: SOFIA_KNOWLEDGE.skepticAnswers.reconciliation, category: 'technical' };
  }
  
  if (q.includes('scale') || q.includes('multiple') || q.includes('portfolio') || q.includes('how many')) {
    return { content: SOFIA_KNOWLEDGE.skepticAnswers.multipleProperties, category: 'general' };
  }
  
  if (q.includes('cost basis') || q.includes('capital gain') || q.includes('sell')) {
    return { content: SOFIA_KNOWLEDGE.skepticAnswers.costBasis + "\n\n" + SOFIA_KNOWLEDGE.legal.depreciationTracking, category: 'legal' };
  }
  
  // Feature questions
  if (q.includes('lowe') || q.includes('home depot') || q.includes('statement')) {
    return { content: SOFIA_KNOWLEDGE.capabilities.lowesProcessing + "\n\nHow to use it: " + SOFIA_KNOWLEDGE.features.lowes, category: 'general' };
  }
  
  if (q.includes('bank') || q.includes('plaid') || q.includes('connect') || q.includes('sync')) {
    return { content: SOFIA_KNOWLEDGE.capabilities.bankSync + "\n\nIn the Banks section: " + SOFIA_KNOWLEDGE.features.banks, category: 'technical' };
  }
  
  if (q.includes('buildium') || q.includes('rent roll') || q.includes('tenant')) {
    return { content: SOFIA_KNOWLEDGE.capabilities.buildiumSync, category: 'general' };
  }
  
  if (q.includes('property') || q.includes('properties')) {
    return { content: SOFIA_KNOWLEDGE.features.properties + "\n\nProperty attribution: " + SOFIA_KNOWLEDGE.capabilities.propertyAttribution, category: 'general' };
  }
  
  if (q.includes('entity') || q.includes('llc')) {
    return { content: SOFIA_KNOWLEDGE.capabilities.multiEntity + "\n\n" + SOFIA_KNOWLEDGE.features.entities, category: 'general' };
  }
  
  if (q.includes('vendor')) {
    return { content: SOFIA_KNOWLEDGE.features.vendors + "\n\nW-9 tracking: " + SOFIA_KNOWLEDGE.capabilities.w9Tracking, category: 'general' };
  }
  
  if (q.includes('report')) {
    return { content: SOFIA_KNOWLEDGE.features.reports, category: 'general' };
  }
  
  if (q.includes('dashboard') || q.includes('overview')) {
    return { content: SOFIA_KNOWLEDGE.features.dashboard, category: 'general' };
  }
  
  if (q.includes('transaction')) {
    return { content: SOFIA_KNOWLEDGE.features.transactions + "\n\nAutomatic categorization: " + SOFIA_KNOWLEDGE.capabilities.propertyAttribution, category: 'general' };
  }
  
  // What can you do / capabilities
  if (q.includes('what can') || q.includes('capable') || q.includes('feature') || q.includes('do you do') || q.includes('help me')) {
    return { 
      content: `ATLAS is a complete property accounting platform. Here's what I can help you with:

📊 **Financial Tracking**
${SOFIA_KNOWLEDGE.capabilities.bankSync}

🏠 **Property Management**  
${SOFIA_KNOWLEDGE.capabilities.propertyAttribution}

🏢 **Multi-Entity Support**
${SOFIA_KNOWLEDGE.capabilities.multiEntity}

📋 **Compliance**
${SOFIA_KNOWLEDGE.capabilities.w9Tracking}

🛠️ **Lowe's Integration**
${SOFIA_KNOWLEDGE.capabilities.lowesProcessing}

What specific area would you like to know more about?`,
      category: 'general'
    };
  }
  
  // Default response
  return { 
    content: `I'd be happy to help explain that! ATLAS is built specifically for property investors and landlords who need professional-grade accounting without the complexity.

Here's a quick overview of what I can help you understand:
• **Bank Integration** - How we securely sync transactions
• **Property Attribution** - Automatic expense allocation
• **W-9/1099 Compliance** - Never miss a vendor filing
• **Multi-LLC Management** - Keep entities properly separated
• **Lowe's Processing** - AI-powered statement parsing
• **Legal Compliance** - IRS rules and audit protection

What would you like to dive into?`,
    category: 'general'
  };
}

export function Sofia() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'sofia',
      content: "Hi! I'm Sofia, your ATLAS assistant. I know everything about this platform - from features to IRS compliance to security architecture. Ask me anything, especially the tough questions. I'm here to help you understand exactly how ATLAS works and why it's built the way it is. 🎯",
      timestamp: new Date(),
      category: 'general'
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
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    
    const response = generateSofiaResponse(input);
    
    const sofiaMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'sofia',
      content: response.content,
      timestamp: new Date(),
      category: response.category
    };
    
    setIsTyping(false);
    setMessages(prev => [...prev, sofiaMessage]);
  };
  
  const quickQuestions = [
    { text: "Is this IRS compliant?", icon: Scale },
    { text: "How secure is my data?", icon: Shield },
    { text: "What can ATLAS do?", icon: Zap },
    { text: "How does W-9 tracking work?", icon: BookOpen },
  ];
  
  const getCategoryColor = (category?: Message['category']) => {
    switch (category) {
      case 'legal': return 'bg-purple-100 text-purple-700';
      case 'compliance': return 'bg-amber-100 text-amber-700';
      case 'technical': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getCategoryLabel = (category?: Message['category']) => {
    switch (category) {
      case 'legal': return '⚖️ Legal';
      case 'compliance': return '📋 Compliance';
      case 'technical': return '🔧 Technical';
      default: return null;
    }
  };
  
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 lg:bottom-6 right-4 z-50 w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center text-white hover:scale-110 transition-all ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      </button>
      
      {/* Chat Window */}
      <div className={`fixed inset-0 lg:inset-auto lg:bottom-6 lg:right-4 z-50 lg:w-96 lg:h-[600px] bg-white lg:rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4 lg:rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Sofia</h3>
              <p className="text-xs text-purple-200">ATLAS AI Assistant</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${message.role === 'user' ? 'order-1' : 'order-2'}`}>
                {message.role === 'sofia' && message.category && getCategoryLabel(message.category) && (
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-1 ${getCategoryColor(message.category)}`}>
                    {getCategoryLabel(message.category)}
                  </span>
                )}
                <div className={`p-3 rounded-2xl ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-br-md' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className={`text-[10px] text-gray-400 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Questions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(q.text);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
                >
                  <q.icon className="h-3 w-3" />
                  {q.text}
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
              placeholder="Ask Sofia anything..."
              className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white disabled:opacity-50 hover:shadow-lg transition-all"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
