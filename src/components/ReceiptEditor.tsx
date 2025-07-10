'use client';

import React, { useState } from 'react';
import { useReceiptLayout } from '../hooks/useReceiptLayout';
import { ReceiptPreview } from './ReceiptPreview';
import { QuickActions } from './QuickActions';
import { TokenReference } from './TokenReference';
import { 
    BlockType, 
    Alignment, 
    FontSize, 
    ReceiptBlock,
    TextBlock,
    ImageBlock,
    BarcodeBlock,
    QRCodeBlock,
    LineBlock,
    SpacerBlock
} from '../types';

type ViewMode = 'edit' | 'preview';

export const ReceiptEditor: React.FC = () => {
    const {
        layout,
        addTextBlock,
        addImageBlock,
        addBarcodeBlock,
        addQRCodeBlock,
        addLineBlock,
        addSpacerBlock,
        updateBlock,
        removeBlock,
        moveBlock,
        clearLayout
    } = useReceiptLayout();

    // State for view mode
    const [viewMode, setViewMode] = useState<ViewMode>('edit');

    // State for adding new blocks
    const [blockType, setBlockType] = useState<BlockType>(BlockType.TEXT);
    const [content, setContent] = useState('');
    const [alignment, setAlignment] = useState<Alignment>(Alignment.CENTER);
    
    // State for text-specific options
    const [textBold, setTextBold] = useState(false);
    const [textSize, setTextSize] = useState<FontSize>(FontSize.MEDIUM);

    // Add new block based on type
    const handleAddBlock = () => {
        switch (blockType) {
            case BlockType.TEXT:
                addTextBlock(content || 'Default text content', {
                    alignment,
                    bold: textBold,
                    size: textSize
                });
                break;
            case BlockType.IMAGE:
                addImageBlock(content || 'placeholder.jpg', { alignment });
                break;
            case BlockType.BARCODE:
                addBarcodeBlock(content || '123456789012', { 
                    alignment,
                    showText: true 
                });
                break;
            case BlockType.QR_CODE:
                addQRCodeBlock(content || 'https://example.com', { alignment });
                break;
            case BlockType.LINE:
                addLineBlock(content || '-', alignment);
                break;
            case BlockType.SPACER:
                addSpacerBlock(parseInt(content) || 1);
                break;
        }
        
        // Reset form
        setContent('');
        setTextBold(false);
        setTextSize(FontSize.MEDIUM);
    };

    // Handle inline content update
    const handleContentUpdate = (id: string, newContent: string) => {
        updateBlock(id, { content: newContent });
    };

    // Handle alignment update
    const handleAlignmentUpdate = (id: string, newAlignment: Alignment) => {
        updateBlock(id, { alignment: newAlignment });
    };

    // Handle text style updates
    const handleTextStyleUpdate = (id: string, updates: Partial<TextBlock['style']>) => {
        const block = layout.blocks.find(b => b.id === id);
        if (block && block.type === BlockType.TEXT) {
            const textBlock = block as TextBlock;
            updateBlock(id, {
                style: {
                    ...textBlock.style,
                    ...updates
                }
            });
        }
    };

    // Handle spacer height update
    const handleSpacerHeightUpdate = (id: string, height: number) => {
        updateBlock(id, {
            style: { height }
        });
    };

    // Get inline editor for each block type
    const renderBlockEditor = (block: ReceiptBlock) => {
        switch (block.type) {
            case BlockType.TEXT:
                const textBlock = block as TextBlock;
                return (
                    <div className="space-y-2">
                        <textarea
                            value={block.content}
                            onChange={(e) => handleContentUpdate(block.id, e.target.value)}
                            className="w-full px-2 py-1 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                            rows={2}
                            placeholder="Enter text content"
                        />
                        <div className="flex items-center space-x-3 text-sm">
                            <label className="flex items-center text-gray-800 dark:text-gray-200">
                                <input
                                    type="checkbox"
                                    checked={textBlock.style?.bold || false}
                                    onChange={(e) => handleTextStyleUpdate(block.id, { bold: e.target.checked })}
                                    className="mr-1"
                                />
                                <span>Bold</span>
                            </label>
                            <select
                                value={textBlock.style?.size || FontSize.MEDIUM}
                                onChange={(e) => handleTextStyleUpdate(block.id, { size: e.target.value as FontSize })}
                                className="px-2 py-1 border rounded text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                            >
                                <option value={FontSize.SMALL}>Small</option>
                                <option value={FontSize.MEDIUM}>Medium</option>
                                <option value={FontSize.LARGE}>Large</option>
                                <option value={FontSize.EXTRA_LARGE}>Extra Large</option>
                            </select>
                        </div>
                    </div>
                );
            
            case BlockType.IMAGE:
            case BlockType.BARCODE:
            case BlockType.QR_CODE:
                return (
                    <input
                        type="text"
                        value={block.content}
                        onChange={(e) => handleContentUpdate(block.id, e.target.value)}
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                        placeholder={
                            block.type === BlockType.IMAGE ? 'Image path or URL' :
                            block.type === BlockType.BARCODE ? 'Barcode data' :
                            'QR code data'
                        }
                    />
                );
            
            case BlockType.LINE:
                return (
                    <input
                        type="text"
                        value={block.content || '-'}
                        onChange={(e) => handleContentUpdate(block.id, e.target.value)}
                        className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                        placeholder="Character"
                        maxLength={1}
                    />
                );
            
            case BlockType.SPACER:
                const spacerBlock = block as SpacerBlock;
                return (
                    <input
                        type="number"
                        value={spacerBlock.style?.height || 1}
                        onChange={(e) => handleSpacerHeightUpdate(block.id, parseInt(e.target.value) || 1)}
                        className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                        min="1"
                        max="10"
                    />
                );
            
            default:
                return null;
        }
    };

    // Get style classes for block container
    const getBlockContainerClasses = (block: ReceiptBlock) => {
        let classes = 'p-3 border-l-4 rounded-md ';
        
        // Color code by type
        switch (block.type) {
            case BlockType.TEXT:
                classes += 'border-blue-500 bg-blue-50 dark:bg-blue-950/30';
                break;
            case BlockType.IMAGE:
                classes += 'border-green-500 bg-green-50 dark:bg-green-950/30';
                break;
            case BlockType.BARCODE:
            case BlockType.QR_CODE:
                classes += 'border-purple-500 bg-purple-50 dark:bg-purple-950/30';
                break;
            case BlockType.LINE:
                classes += 'border-gray-500 bg-gray-50 dark:bg-gray-800/30';
                break;
            case BlockType.SPACER:
                classes += 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30';
                break;
        }
        
        return classes;
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header with Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">BYTE Receipt Designer</h1>
                
                {/* Mode Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('edit')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            viewMode === 'edit'
                                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Mode
                        </span>
                    </button>
                    <button
                        onClick={() => setViewMode('preview')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            viewMode === 'preview'
                                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Preview Mode
                        </span>
                    </button>
                </div>
            </div>
            
            {/* Edit Mode Content */}
            {viewMode === 'edit' ? (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Add Block Form */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Block</h2>
                            
                            <div className="space-y-4">
                                {/* Block Type Selection */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Block Type</label>
                                    <select
                                        value={blockType}
                                        onChange={(e) => setBlockType(e.target.value as BlockType)}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                    >
                                        <option value={BlockType.TEXT}>Text</option>
                                        <option value={BlockType.IMAGE}>Image</option>
                                        <option value={BlockType.BARCODE}>Barcode</option>
                                        <option value={BlockType.QR_CODE}>QR Code</option>
                                        <option value={BlockType.LINE}>Line</option>
                                        <option value={BlockType.SPACER}>Spacer</option>
                                    </select>
                                </div>

                                {/* Content Input */}
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                                        {blockType === BlockType.SPACER ? 'Height (lines)' : 'Content'}
                                    </label>
                                    {blockType === BlockType.TEXT ? (
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Enter text content"
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                            rows={3}
                                        />
                                    ) : (
                                        <input
                                            type={blockType === BlockType.SPACER ? 'number' : 'text'}
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder={
                                                blockType === BlockType.IMAGE ? 'image.jpg' :
                                                blockType === BlockType.BARCODE ? '123456789012' :
                                                blockType === BlockType.QR_CODE ? 'https://example.com' :
                                                blockType === BlockType.LINE ? 'Line character (e.g., -, =)' :
                                                '1'
                                            }
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                        />
                                    )}
                                </div>

                                {/* Alignment (not for spacer) */}
                                {blockType !== BlockType.SPACER && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Alignment</label>
                                        <select
                                            value={alignment}
                                            onChange={(e) => setAlignment(e.target.value as Alignment)}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                        >
                                            <option value={Alignment.CENTER}>Center</option>
                                            <option value={Alignment.LEFT}>Left</option>
                                            <option value={Alignment.RIGHT}>Right</option>
                                        </select>
                                    </div>
                                )}

                                {/* Text-specific options */}
                                {blockType === BlockType.TEXT && (
                                    <>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center text-gray-800 dark:text-gray-200">
                                                <input
                                                    type="checkbox"
                                                    checked={textBold}
                                                    onChange={(e) => setTextBold(e.target.checked)}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm">Bold</span>
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">Font Size</label>
                                            <select
                                                value={textSize}
                                                onChange={(e) => setTextSize(e.target.value as FontSize)}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                            >
                                                <option value={FontSize.SMALL}>Small</option>
                                                <option value={FontSize.MEDIUM}>Medium</option>
                                                <option value={FontSize.LARGE}>Large</option>
                                                <option value={FontSize.EXTRA_LARGE}>Extra Large</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                <button
                                    onClick={handleAddBlock}
                                    className="w-full px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                                >
                                    Add Block
                                </button>
                            </div>
                        </div>

                        {/* Block List with Inline Editing */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Receipt Blocks ({layout.blocks.length})</h2>
                                {layout.blocks.length > 0 && (
                                    <button
                                        onClick={clearLayout}
                                        className="px-3 py-1 text-sm bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {layout.blocks.length === 0 ? (
                                <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                                    No blocks added yet. Add your first block to get started!
                                </p>
                            ) : (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                    {layout.blocks.map((block, index) => (
                                        <div
                                            key={block.id}
                                            className={getBlockContainerClasses(block)}
                                        >
                                            {/* Block Header */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        {block.type.toUpperCase()}
                                                    </span>
                                                    {block.type !== BlockType.SPACER && (
                                                        <select
                                                            value={block.alignment || Alignment.CENTER}
                                                            onChange={(e) => handleAlignmentUpdate(block.id, e.target.value as Alignment)}
                                                            className="text-xs px-2 py-1 border rounded text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                                        >
                                                            <option value={Alignment.CENTER}>Center</option>
                                                            <option value={Alignment.LEFT}>Left</option>
                                                            <option value={Alignment.RIGHT}>Right</option>
                                                        </select>
                                                    )}
                                                </div>
                                                
                                                {/* Action Buttons */}
                                                <div className="flex items-center space-x-1">
                                                    <button
                                                        onClick={() => moveBlock(block.id, 'up')}
                                                        disabled={index === 0}
                                                        className="p-1 text-gray-700 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                                        title="Move up"
                                                    >
                                                        ↑
                                                    </button>
                                                    <button
                                                        onClick={() => moveBlock(block.id, 'down')}
                                                        disabled={index === layout.blocks.length - 1}
                                                        className="p-1 text-gray-700 dark:text-gray-300 disabled:opacity-30 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                                                        title="Move down"
                                                    >
                                                        ↓
                                                    </button>
                                                    <button
                                                        onClick={() => removeBlock(block.id)}
                                                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                                                        title="Delete block"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Inline Editor */}
                                            {renderBlockEditor(block)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions and Token Reference */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <QuickActions
                            onAddTextBlock={addTextBlock}
                            onAddLineBlock={addLineBlock}
                            onAddSpacerBlock={addSpacerBlock}
                            onAddBarcodeBlock={addBarcodeBlock}
                            onClearLayout={clearLayout}
                        />
                        <TokenReference />
                    </div>

                    {/* Preview Section in Edit Mode */}
                    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Receipt Preview</h2>
                        <ReceiptPreview layout={layout} />
                    </div>
                </>
            ) : (
                /* Preview Mode Content */
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Receipt Preview</h2>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {layout.blocks.length} blocks
                            </span>
                            {layout.blocks.length > 0 && (
                                <button
                                    onClick={clearLayout}
                                    className="px-3 py-1 text-sm bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Centered Preview */}
                    <div className="flex justify-center">
                        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg">
                            <ReceiptPreview layout={layout} />
                        </div>
                    </div>
                    
                    {/* Token Reference */}
                    <div className="mt-8">
                        <TokenReference />
                    </div>
                </div>
            )}
        </div>
    );
}; 