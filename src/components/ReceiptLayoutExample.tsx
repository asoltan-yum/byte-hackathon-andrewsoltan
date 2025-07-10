'use client';

import React from 'react';
import { useReceiptLayout } from '../hooks/useReceiptLayout';
import { BlockType, Alignment, FontSize } from '../types';

export const ReceiptLayoutExample: React.FC = () => {
    const {
        layout,
        addTextBlock,
        addImageBlock,
        addBarcodeBlock,
        addLineBlock,
        addSpacerBlock,
        removeBlock,
        moveBlock,
        clearLayout
    } = useReceiptLayout();

    // Example: Create a sample receipt with tokens
    const createSampleReceipt = () => {
        clearLayout();
        
        // Header
        addTextBlock('{store_name}', {
            alignment: Alignment.CENTER,
            bold: true,
            size: FontSize.LARGE
        });
        
        addTextBlock('{store_address}', { alignment: Alignment.CENTER });
        addTextBlock('{store_city}', { alignment: Alignment.CENTER });
        addTextBlock('Tel: {store_phone}', { alignment: Alignment.CENTER });
        
        addSpacerBlock(1);
        addLineBlock('=', Alignment.CENTER);
        addSpacerBlock(1);
        
        // Order details
        addTextBlock('Order #{order_number}', { bold: true });
        addTextBlock('Table: {table_number}');
        addTextBlock('Server: {server_name}');
        addTextBlock('Date: {date}');
        addTextBlock('Time: {time}');
        
        addSpacerBlock(1);
        addLineBlock();
        addSpacerBlock(1);
        
        // Sample items
        addTextBlock('ITEMS:', { bold: true, size: FontSize.MEDIUM });
        addTextBlock('1x Burger                    $12.99');
        addTextBlock('2x Fries                     $6.98');
        addTextBlock('1x Soda                      $2.99');
        addTextBlock('1x Dessert                   $8.95');
        
        addLineBlock();
        
        // Totals with tokens
        addTextBlock('Subtotal:               {subtotal}', { alignment: Alignment.RIGHT });
        addTextBlock('Tax ({tax_rate}):        {tax_amount}', { alignment: Alignment.RIGHT });
        addTextBlock('Tip:                    {tip_amount}', { alignment: Alignment.RIGHT });
        addLineBlock('=');
        addTextBlock('TOTAL:                {total_amount}', { 
            alignment: Alignment.RIGHT, 
            bold: true,
            size: FontSize.LARGE 
        });
        
        addSpacerBlock(2);
        
        // Payment info
        addTextBlock('Payment: {payment_method}', { alignment: Alignment.CENTER });
        addTextBlock('Auth: {auth_code}', { alignment: Alignment.CENTER, size: FontSize.SMALL });
        
        addSpacerBlock(1);
        
        // Barcode
        addBarcodeBlock('{transaction_id}', {
            alignment: Alignment.CENTER,
            height: 50,
            showText: true
        });
        
        addSpacerBlock(1);
        
        // Footer
        addTextBlock('{thank_you_message}', { 
            alignment: Alignment.CENTER,
            bold: true 
        });
        addTextBlock('Visit us at {website}', { alignment: Alignment.CENTER, size: FontSize.SMALL });
        
        addSpacerBlock(1);
        addLineBlock('-', Alignment.CENTER);
        addTextBlock('Customer: {customer_name}', { alignment: Alignment.CENTER, size: FontSize.SMALL });
        addTextBlock('Points Earned: {loyalty_points}', { alignment: Alignment.CENTER, size: FontSize.SMALL });
    };

    // Create a simple receipt without tokens
    const createSimpleReceipt = () => {
        clearLayout();
        
        addTextBlock('SIMPLE RECEIPT', {
            alignment: Alignment.CENTER,
            bold: true,
            size: FontSize.LARGE
        });
        
        addLineBlock('=');
        addTextBlock('Item 1                      $10.00');
        addTextBlock('Item 2                      $15.00');
        addLineBlock();
        addTextBlock('Total:                      $25.00', { bold: true });
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Receipt Layout Example</h2>
            
            <div className="mb-4 space-x-2">
                <button 
                    onClick={createSampleReceipt}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Create Receipt with Tokens
                </button>
                
                <button 
                    onClick={createSimpleReceipt}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Create Simple Receipt
                </button>
                
                <button 
                    onClick={clearLayout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Clear Layout
                </button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                <h3 className="font-bold text-blue-900 mb-2">Available Tokens:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-800">
                    <code className="bg-blue-100 px-2 py-1 rounded">{'{store_name}'}</code>
                    <code className="bg-blue-100 px-2 py-1 rounded">{'{order_number}'}</code>
                    <code className="bg-blue-100 px-2 py-1 rounded">{'{total_amount}'}</code>
                    <code className="bg-blue-100 px-2 py-1 rounded">{'{date}'}</code>
                    <code className="bg-blue-100 px-2 py-1 rounded">{'{time}'}</code>
                    <code className="bg-blue-100 px-2 py-1 rounded">{'{customer_name}'}</code>
                </div>
                <p className="text-xs text-blue-700 mt-2">
                    Use these tokens in your text blocks and they'll be replaced with mock data in the preview.
                </p>
            </div>
            
            <div className="border rounded p-4 bg-gray-50">
                <h3 className="font-bold mb-2">Current Layout ({layout.blocks.length} blocks):</h3>
                
                {layout.blocks.length === 0 ? (
                    <p className="text-gray-500">No blocks added yet</p>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {layout.blocks.map((block, index) => (
                            <div 
                                key={block.id}
                                className="border rounded p-2 bg-white flex items-center justify-between"
                            >
                                <div className="flex-1">
                                    <span className="font-mono text-sm text-gray-500">
                                        [{index + 1}] {block.type}
                                    </span>
                                    {block.type === BlockType.TEXT && (
                                        <p className="mt-1 text-sm">{block.content}</p>
                                    )}
                                    {block.alignment && (
                                        <span className="text-xs text-gray-400 ml-2">
                                            (align: {block.alignment})
                                        </span>
                                    )}
                                </div>
                                
                                <div className="space-x-1">
                                    <button
                                        onClick={() => moveBlock(block.id, 'up')}
                                        disabled={index === 0}
                                        className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => moveBlock(block.id, 'down')}
                                        disabled={index === layout.blocks.length - 1}
                                        className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        onClick={() => removeBlock(block.id)}
                                        className="px-2 py-1 text-xs bg-red-200 rounded hover:bg-red-300"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="mt-4 p-4 bg-gray-100 rounded">
                <h4 className="font-bold mb-2">Layout JSON:</h4>
                <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(layout, null, 2)}
                </pre>
            </div>
        </div>
    );
}; 