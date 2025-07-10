import { useState, useCallback } from 'react';
import { 
    LayoutModel, 
    ReceiptBlock, 
    BlockType, 
    Alignment, 
    FontSize,
    TextBlock,
    ImageBlock,
    BarcodeBlock,
    QRCodeBlock,
    LineBlock,
    SpacerBlock
} from '../types';

// Helper function to generate unique IDs
const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Initial empty layout
const initialLayout: LayoutModel = {
    blocks: [],
    metadata: {
        created: new Date(),
        modified: new Date()
    },
    settings: {
        paperWidth: 80, // 80mm default
        defaultAlignment: Alignment.CENTER,
        defaultFontSize: FontSize.MEDIUM
    }
};

export const useReceiptLayout = (defaultLayout: LayoutModel = initialLayout) => {
    const [layout, setLayout] = useState<LayoutModel>(defaultLayout);

    // Add a new block to the layout
    const addBlock = useCallback((block: Omit<ReceiptBlock, 'id'>) => {
        setLayout(prev => ({
            ...prev,
            blocks: [...prev.blocks, { ...block, id: generateId() } as ReceiptBlock],
            metadata: {
                ...prev.metadata,
                modified: new Date()
            }
        }));
    }, []);

    // Update an existing block
    const updateBlock = useCallback((id: string, updates: Partial<ReceiptBlock>) => {
        setLayout(prev => ({
            ...prev,
            blocks: prev.blocks.map(block => 
                block.id === id ? { ...block, ...updates } as ReceiptBlock : block
            ),
            metadata: {
                ...prev.metadata,
                modified: new Date()
            }
        }));
    }, []);

    // Remove a block
    const removeBlock = useCallback((id: string) => {
        setLayout(prev => ({
            ...prev,
            blocks: prev.blocks.filter(block => block.id !== id),
            metadata: {
                ...prev.metadata,
                modified: new Date()
            }
        }));
    }, []);

    // Move a block up or down in the order
    const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
        setLayout(prev => {
            const index = prev.blocks.findIndex(block => block.id === id);
            if (index === -1) return prev;
            
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= prev.blocks.length) return prev;
            
            const newBlocks = [...prev.blocks];
            [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
            
            return {
                ...prev,
                blocks: newBlocks,
                metadata: {
                    ...prev.metadata,
                    modified: new Date()
                }
            };
        });
    }, []);

    // Helper functions to add specific block types
    const addTextBlock = useCallback((
        content: string, 
        options?: {
            alignment?: Alignment;
            bold?: boolean;
            size?: FontSize;
        }
    ) => {
        const textBlock: Omit<TextBlock, 'id'> = {
            type: BlockType.TEXT,
            content,
            alignment: options?.alignment,
            style: {
                bold: options?.bold,
                size: options?.size
            }
        };
        addBlock(textBlock);
    }, [addBlock]);

    const addImageBlock = useCallback((
        content: string,
        options?: {
            alignment?: Alignment;
            width?: number;
            height?: number;
        }
    ) => {
        const imageBlock: Omit<ImageBlock, 'id'> = {
            type: BlockType.IMAGE,
            content,
            alignment: options?.alignment,
            style: {
                width: options?.width,
                height: options?.height
            }
        };
        addBlock(imageBlock);
    }, [addBlock]);

    const addBarcodeBlock = useCallback((
        content: string,
        options?: {
            alignment?: Alignment;
            height?: number;
            showText?: boolean;
        }
    ) => {
        const barcodeBlock: Omit<BarcodeBlock, 'id'> = {
            type: BlockType.BARCODE,
            content,
            alignment: options?.alignment,
            style: {
                height: options?.height,
                showText: options?.showText
            }
        };
        addBlock(barcodeBlock);
    }, [addBlock]);

    const addLineBlock = useCallback((
        character: string = '-',
        alignment?: Alignment
    ) => {
        const lineBlock: Omit<LineBlock, 'id'> = {
            type: BlockType.LINE,
            content: character,
            alignment
        };
        addBlock(lineBlock);
    }, [addBlock]);

    const addSpacerBlock = useCallback((height: number = 1) => {
        const spacerBlock: Omit<SpacerBlock, 'id'> = {
            type: BlockType.SPACER,
            style: { height }
        };
        addBlock(spacerBlock);
    }, [addBlock]);

    const addQRCodeBlock = useCallback((
        content: string,
        options?: {
            alignment?: Alignment;
            size?: number;
            errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
        }
    ) => {
        const qrCodeBlock: Omit<QRCodeBlock, 'id'> = {
            type: BlockType.QR_CODE,
            content,
            alignment: options?.alignment,
            style: {
                size: options?.size,
                errorCorrectionLevel: options?.errorCorrectionLevel
            }
        };
        addBlock(qrCodeBlock);
    }, [addBlock]);

    // Clear all blocks
    const clearLayout = useCallback(() => {
        setLayout(prev => ({
            ...prev,
            blocks: [],
            metadata: {
                ...prev.metadata,
                modified: new Date()
            }
        }));
    }, []);

    // Update layout settings
    const updateSettings = useCallback((settings: Partial<LayoutModel['settings']>) => {
        setLayout(prev => ({
            ...prev,
            settings: {
                ...prev.settings,
                ...settings
            },
            metadata: {
                ...prev.metadata,
                modified: new Date()
            }
        }));
    }, []);

    return {
        layout,
        setLayout,
        addBlock,
        updateBlock,
        removeBlock,
        moveBlock,
        addTextBlock,
        addImageBlock,
        addBarcodeBlock,
        addQRCodeBlock,
        addLineBlock,
        addSpacerBlock,
        clearLayout,
        updateSettings
    };
}; 