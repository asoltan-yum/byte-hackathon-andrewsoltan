'use client';

import React, { useState } from 'react';

// Import the mock data from ReceiptPreview
const mockData: Record<string, string> = {
    store_name: 'TACO BELL',
    store_address: '1 Glen Bell Way',
    store_city: 'Irvine, CA 92615',
    store_phone: '(949) 555-0123',
    store_email: 'info@tacobell.com',
    
    order_number: 'ORD-2024-0042',
    table_number: 'Table 7',
    server_name: 'Andrew S.',
    
    timestamp: '12/7/2024, 3:45:23 PM',
    date: '12/7/2024',
    time: '3:45 PM',
    
    subtotal: '$42.50',
    tax_rate: '8.5%',
    tax_amount: '$3.61',
    tip_amount: '$8.50',
    total_amount: '$54.61',
    
    payment_method: 'VISA ****1234',
    auth_code: 'AUTH123456',
    transaction_id: 'TXN789012',
    
    customer_name: 'John Doe',
    customer_email: 'john.doe@email.com',
    loyalty_points: '425',
    
    website: 'www.tacobell.com',
    thank_you_message: 'Thank you for dining with us!',
    return_policy: 'Returns accepted within 30 days with receipt'
};

export const TokenReference: React.FC = () => {
    const [showAll, setShowAll] = useState(false);
    const [copiedToken, setCopiedToken] = useState<string | null>(null);

    const handleCopyToken = (token: string) => {
        navigator.clipboard.writeText(`{${token}}`);
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    const commonTokens = [
        'store_name', 'order_number', 'date', 'time', 
        'subtotal', 'tax_amount', 'total_amount', 'payment_method'
    ];

    const tokensToShow = showAll ? Object.keys(mockData) : commonTokens;

    return (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-blue-900 dark:text-blue-100">Available Tokens</h3>
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                >
                    {showAll ? 'Show Common' : 'Show All'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {tokensToShow.map((key) => (
                    <div 
                        key={key}
                        className="flex items-center justify-between bg-white dark:bg-gray-800 rounded px-3 py-2 group hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                        onClick={() => handleCopyToken(key)}
                    >
                        <div className="flex-1 mr-2">
                            <code className="text-blue-700 dark:text-blue-300 font-mono text-xs">
                                {`{${key}}`}
                            </code>
                            <span className="text-gray-600 dark:text-gray-400 ml-2 text-xs">
                                → {mockData[key]}
                            </span>
                        </div>
                        <span className={`text-xs ${
                            copiedToken === key 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                        }`}>
                            {copiedToken === key ? '✓ Copied' : 'Click to copy'}
                        </span>
                    </div>
                ))}
            </div>
            
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-3">
                Click any token to copy it. Use these in your text blocks and they'll be replaced with the values shown.
            </p>
        </div>
    );
}; 