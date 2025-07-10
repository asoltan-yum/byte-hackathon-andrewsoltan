'use client';

import React from 'react';
import { 
    LayoutModel, 
    BlockType, 
    Alignment, 
    FontSize, 
    TextBlock,
    SpacerBlock,
    LineBlock
} from '../types';

interface ReceiptPreviewProps {
    layout: LayoutModel;
    width?: number; // Width in mm
}

// Mock data for token replacement
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

// Function to replace tokens in text
const replaceTokens = (text: string): string => {
    let result = text;
    
    // Replace tokens in the format {token_name}
    Object.entries(mockData).forEach(([key, value]) => {
        const token = `{${key}}`;
        result = result.replace(new RegExp(token, 'g'), value);
    });
    
    return result;
};

export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ 
    layout, 
    width = 80 
}) => {
    // Calculate the receipt width in pixels (approximately 3.5 pixels per mm for narrow look)
    const receiptWidthPx = width * 3.5;
    
    // Get effective alignment for a block
    const getEffectiveAlignment = (blockAlignment?: Alignment): Alignment => {
        return blockAlignment || layout.settings?.defaultAlignment || Alignment.CENTER;
    };
    
    // Get alignment CSS class
    const getAlignmentClass = (alignment: Alignment): string => {
        switch (alignment) {
            case Alignment.LEFT:
                return 'text-left';
            case Alignment.CENTER:
                return 'text-center';
            case Alignment.RIGHT:
                return 'text-right';
            default:
                return 'text-center';
        }
    };
    
    // Get font size CSS class
    const getFontSizeClass = (size?: FontSize): string => {
        switch (size) {
            case FontSize.SMALL:
                return 'text-[10px] leading-3';
            case FontSize.LARGE:
                return 'text-sm leading-4';
            case FontSize.EXTRA_LARGE:
                return 'text-base leading-5';
            case FontSize.MEDIUM:
            default:
                return 'text-xs leading-4';
        }
    };
    
    // Render a single block
    const renderBlock = (block: any, index: number) => {
        const alignment = getEffectiveAlignment(block.alignment);
        const alignClass = getAlignmentClass(alignment);
        
        switch (block.type) {
            case BlockType.TEXT:
                const textBlock = block as TextBlock;
                const processedContent = replaceTokens(textBlock.content);
                return (
                    <div
                        key={block.id || index}
                        className={`${alignClass} ${getFontSizeClass(textBlock.style?.size)} ${
                            textBlock.style?.bold ? 'font-bold' : 'font-normal'
                        } ${
                            textBlock.style?.italic ? 'italic' : ''
                        } ${
                            textBlock.style?.underline ? 'underline' : ''
                        } tracking-tight`}
                        style={{ 
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'Courier New, monospace',
                            letterSpacing: '-0.05em'
                        }}
                    >
                        {processedContent}
                    </div>
                );
                
            case BlockType.LINE:
                const lineBlock = block as LineBlock;
                const lineChar = lineBlock.content || '-';
                const lineLength = Math.floor(receiptWidthPx / 7); // Adjust for mono font width
                
                // Create dotted line effect for certain characters
                if (lineChar === '-' || lineChar === '.') {
                    return (
                        <div 
                            key={block.id || index} 
                            className={`${alignClass} text-gray-400 select-none`}
                            style={{ 
                                fontFamily: 'Courier New, monospace',
                                letterSpacing: '0.1em',
                                fontSize: '10px',
                                lineHeight: '8px'
                            }}
                        >
                            {Array(Math.floor(lineLength / 2)).fill('• ').join('')}
                        </div>
                    );
                } else {
                    return (
                        <div 
                            key={block.id || index} 
                            className={`${alignClass} overflow-hidden select-none`}
                            style={{ 
                                fontFamily: 'Courier New, monospace',
                                fontSize: '10px',
                                lineHeight: '8px'
                            }}
                        >
                            {lineChar.repeat(lineLength)}
                        </div>
                    );
                }
                
            case BlockType.SPACER:
                const spacerBlock = block as SpacerBlock;
                const height = spacerBlock.style?.height || 1;
                return (
                    <div 
                        key={block.id || index} 
                        style={{ height: `${height * 0.4}em` }} 
                    />
                );
                
            case BlockType.BARCODE:
                return (
                    <div key={block.id || index} className={`${alignClass} my-1`}>
                        <div className="inline-block">
                            <div 
                                className="bg-white border border-black px-2 py-1"
                                style={{ fontFamily: 'monospace' }}
                            >
                                <div 
                                    className="tracking-[0.2em] text-black"
                                    style={{ fontSize: '16px', lineHeight: '20px' }}
                                >
                                    ||||| |||| | |||| ||||| ||
                                </div>
                                {(block as any).style?.showText !== false && (
                                    <div 
                                        className="text-center mt-0.5 text-black"
                                        style={{ 
                                            fontSize: '9px',
                                            fontFamily: 'Courier New, monospace',
                                            letterSpacing: '0.05em'
                                        }}
                                    >
                                        {replaceTokens(block.content)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
                
            case BlockType.QR_CODE:
                const qrSize = (block as any).style?.size || 60;
                return (
                    <div key={block.id || index} className={`${alignClass} my-1`}>
                        <div className="inline-block">
                            <div 
                                className="bg-white border border-black p-1"
                                style={{ width: `${qrSize}px`, height: `${qrSize}px` }}
                            >
                                <div className="w-full h-full bg-black relative overflow-hidden">
                                    {/* Simple QR code pattern */}
                                    <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-px bg-white p-1">
                                        {[...Array(25)].map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`${
                                                    [0,1,2,4,5,6,8,10,12,14,16,18,19,20,22,23,24].includes(i) 
                                                        ? 'bg-black' 
                                                        : 'bg-white'
                                                }`} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div 
                                className="text-center mt-0.5 text-gray-600"
                                style={{ 
                                    fontSize: '9px',
                                    fontFamily: 'Courier New, monospace'
                                }}
                            >
                                {replaceTokens(block.content).substring(0, 20)}...
                            </div>
                        </div>
                    </div>
                );
                
            case BlockType.IMAGE:
                return (
                    <div key={block.id || index} className={`${alignClass} my-1`}>
                        <div className="inline-block">
                            <div 
                                className="bg-gray-100 border border-gray-300 border-dashed rounded-sm flex items-center justify-center"
                                style={{
                                    width: (block as any).style?.width || 100,
                                    height: (block as any).style?.height || 60,
                                    fontFamily: 'Courier New, monospace',
                                    fontSize: '9px'
                                }}
                            >
                                <span className="text-gray-500 text-center px-2">
                                    {replaceTokens(block.content)}
                                </span>
                            </div>
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    };
    
    return (
        <div className="flex justify-center p-4">
            <div 
                className="relative bg-white shadow-xl dark:shadow-2xl"
                style={{ 
                    width: `${receiptWidthPx}px`,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
            >
                {/* Top serrated edge */}
                <div 
                    className="absolute top-0 left-0 right-0 h-2 overflow-hidden"
                    style={{ transform: 'translateY(-8px)' }}
                >
                    <div className="relative h-4 bg-white">
                        <svg 
                            className="absolute bottom-0 w-full" 
                            height="8" 
                            viewBox={`0 0 ${receiptWidthPx} 8`}
                            preserveAspectRatio="none"
                        >
                            <path 
                                d={`M0,8 ${Array(Math.floor(receiptWidthPx / 10)).fill('').map((_, i) => 
                                    `L${i * 10 + 5},0 L${(i + 1) * 10},8`
                                ).join(' ')} L${receiptWidthPx},8 Z`}
                                fill="white"
                            />
                        </svg>
                    </div>
                </div>
                
                {/* Receipt Paper Texture */}
                <div 
                    className="relative bg-gradient-to-b from-gray-50 to-white"
                    style={{ 
                        backgroundImage: `
                            repeating-linear-gradient(
                                0deg,
                                transparent,
                                transparent 2px,
                                rgba(0,0,0,0.02) 2px,
                                rgba(0,0,0,0.02) 4px
                            )
                        `
                    }}
                >
                    {/* Receipt Content */}
                    <div 
                        className="px-4 pt-6 pb-4 text-gray-900"
                        style={{ fontFamily: 'Courier New, monospace' }}
                    >
                        {layout.blocks.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">
                                <p style={{ fontSize: '11px' }}>No receipt content</p>
                                <p style={{ fontSize: '9px' }} className="mt-2">Add blocks to see preview</p>
                            </div>
                        ) : (
                            <div className="space-y-0.5">
                                {layout.blocks.map((block, index) => renderBlock(block, index))}
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Bottom serrated edge */}
                <div 
                    className="relative h-2 overflow-hidden bg-white"
                    style={{ transform: 'translateY(0)' }}
                >
                    <svg 
                        className="absolute top-0 w-full" 
                        height="8" 
                        viewBox={`0 0 ${receiptWidthPx} 8`}
                        preserveAspectRatio="none"
                    >
                        <path 
                            d={`M0,0 ${Array(Math.floor(receiptWidthPx / 10)).fill('').map((_, i) => 
                                `L${i * 10 + 5},8 L${(i + 1) * 10},0`
                            ).join(' ')} L${receiptWidthPx},0 Z`}
                            fill="white"
                        />
                    </svg>
                </div>
                
                {/* Subtle paper shadow effect */}
                <div 
                    className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-b from-transparent to-gray-200 opacity-20"
                    style={{ transform: 'translateY(2px)' }}
                />
            </div>
        </div>
    );
}; 