'use client';

import React from 'react';
import { BlockType, Alignment, FontSize } from '../types';

interface QuickActionsProps {
    onAddTextBlock: (content: string, options?: any) => void;
    onAddLineBlock: (character?: string, alignment?: Alignment) => void;
    onAddSpacerBlock: (height?: number) => void;
    onAddBarcodeBlock: (content: string, options?: any) => void;
    onClearLayout: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
    onAddTextBlock,
    onAddLineBlock,
    onAddSpacerBlock,
    onAddBarcodeBlock,
    onClearLayout
}) => {
    const addHeader = () => {
        onAddTextBlock('{store_name}', { alignment: Alignment.CENTER, bold: true, size: FontSize.LARGE });
        onAddTextBlock('{store_address}', { alignment: Alignment.CENTER });
        onAddTextBlock('{store_city}', { alignment: Alignment.CENTER });
        onAddTextBlock('Tel: {store_phone}', { alignment: Alignment.CENTER });
        onAddSpacerBlock(1);
        onAddLineBlock('=', Alignment.CENTER);
    };

    const addOrderInfo = () => {
        onAddTextBlock('Order #{order_number}', { bold: true });
        onAddTextBlock('Date: {date} {time}');
        onAddLineBlock();
    };

    const addPaymentSection = () => {
        onAddLineBlock();
        onAddTextBlock('Subtotal:               {subtotal}', { alignment: Alignment.RIGHT });
        onAddTextBlock('Tax:                    {tax_amount}', { alignment: Alignment.RIGHT });
        onAddLineBlock('=');
        onAddTextBlock('TOTAL:                {total_amount}', { 
            alignment: Alignment.RIGHT, 
            bold: true, 
            size: FontSize.LARGE 
        });
        onAddSpacerBlock(1);
        onAddTextBlock('Payment: {payment_method}', { alignment: Alignment.CENTER });
    };

    const addFooter = () => {
        onAddSpacerBlock(1);
        onAddBarcodeBlock('{transaction_id}', { alignment: Alignment.CENTER, showText: true });
        onAddSpacerBlock(1);
        onAddTextBlock('{thank_you_message}', { alignment: Alignment.CENTER, bold: true });
        onAddTextBlock('Visit: {website}', { alignment: Alignment.CENTER, size: FontSize.SMALL });
    };

    const createFullReceipt = () => {
        onClearLayout();
        addHeader();
        onAddSpacerBlock(1);
        addOrderInfo();
        onAddSpacerBlock(1);
        onAddTextBlock('ITEMS:', { bold: true });
        onAddTextBlock('Crunchy Taco                $2.49');
        onAddTextBlock('Chalupa Supreme             $4.29');
        onAddTextBlock('Baja Blast (Large)          $2.99');
        onAddTextBlock('Cinnamon Twists             $1.49');
        addPaymentSection();
        addFooter();
    };

    const addTokenExample = () => {
        onAddTextBlock('=== Token Example ===', { alignment: Alignment.CENTER, bold: true });
        onAddTextBlock('Store: {store_name}');
        onAddTextBlock('Location: {store_city}');
        onAddTextBlock('Order: {order_number}');
        onAddTextBlock('Date: {date} at {time}');
        onAddTextBlock('Server: {server_name}');
        onAddTextBlock('Total: {total_amount}');
        onAddLineBlock('-');
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={addHeader}
                    className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-left"
                >
                    <span className="font-medium text-gray-900 dark:text-white">+ Header</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Store info</p>
                </button>
                
                <button
                    onClick={addOrderInfo}
                    className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-left"
                >
                    <span className="font-medium text-gray-900 dark:text-white">+ Order Info</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Order details</p>
                </button>
                
                <button
                    onClick={addPaymentSection}
                    className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-left"
                >
                    <span className="font-medium text-gray-900 dark:text-white">+ Payment</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Totals & payment</p>
                </button>
                
                <button
                    onClick={addFooter}
                    className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-left"
                >
                    <span className="font-medium text-gray-900 dark:text-white">+ Footer</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Thank you msg</p>
                </button>
                
                <button
                    onClick={addTokenExample}
                    className="px-3 py-2 text-sm bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded transition-colors text-left"
                >
                    <span className="font-medium">+ Token Demo</span>
                    <p className="text-xs">Shows tokens</p>
                </button>
                
                <button
                    onClick={createFullReceipt}
                    className="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded transition-colors"
                >
                    <span className="font-medium">Full Receipt</span>
                </button>
            </div>
        </div>
    );
}; 