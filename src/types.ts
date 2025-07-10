// Enum for block types to ensure type safety and easy extension
export enum BlockType {
    TEXT = 'text',
    IMAGE = 'image',
    BARCODE = 'barcode',
    QR_CODE = 'qr_code',
    LINE = 'line',
    SPACER = 'spacer'
}

// Enum for text alignment options
export enum Alignment {
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right'
}

// Enum for font sizes
export enum FontSize {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
    EXTRA_LARGE = 'extra_large'
}

// Style interface for text blocks
export interface TextStyle {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    size?: FontSize;
    fontFamily?: string;
}

// Style interface for image blocks
export interface ImageStyle {
    width?: number;
    height?: number;
    dithering?: boolean;
}

// Style interface for barcode blocks
export interface BarcodeStyle {
    width?: number;
    height?: number;
    showText?: boolean;
    textPosition?: 'above' | 'below';
}

// Base interface for all receipt blocks
export interface BaseBlock {
    id: string; // Unique identifier for React keys
    type: BlockType;
    alignment?: Alignment;
}

// Specific block type interfaces
export interface TextBlock extends BaseBlock {
    type: BlockType.TEXT;
    content: string;
    style?: TextStyle;
}

export interface ImageBlock extends BaseBlock {
    type: BlockType.IMAGE;
    content: string; // Base64 encoded image or URL
    style?: ImageStyle;
}

export interface BarcodeBlock extends BaseBlock {
    type: BlockType.BARCODE;
    content: string; // Barcode data
    style?: BarcodeStyle;
}

export interface QRCodeBlock extends BaseBlock {
    type: BlockType.QR_CODE;
    content: string; // QR code data
    style?: {
        size?: number;
        errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    };
}

export interface LineBlock extends BaseBlock {
    type: BlockType.LINE;
    content?: string; // Optional character to use for the line (default: '-')
    style?: {
        thickness?: 'thin' | 'medium' | 'thick';
    };
}

export interface SpacerBlock extends BaseBlock {
    type: BlockType.SPACER;
    content?: string; // Not used, but kept for consistency
    style?: {
        height?: number; // Height in lines
    };
}

// Union type for all block types
export type ReceiptBlock = TextBlock | ImageBlock | BarcodeBlock | QRCodeBlock | LineBlock | SpacerBlock;

// Layout model that holds the receipt structure
export interface LayoutModel {
    blocks: ReceiptBlock[];
    metadata?: {
        name?: string;
        version?: string;
        created?: Date;
        modified?: Date;
    };
    settings?: {
        paperWidth?: number;
        defaultAlignment?: Alignment;
        defaultFontSize?: FontSize;
    };
}

export interface ReceiptDSL {
    // To be extended by participants
    [key: string]: any;
}
