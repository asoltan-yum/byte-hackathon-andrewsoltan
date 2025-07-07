export enum BarcodeType {
    CODE39 = 'CODE39',
    CODE128 = 'CODE128',
    QR = 'QR'
}

export class EpsonMockPrinter {
    addText(text: string): void {
        // TODO: Implement text printing logic
        throw new Error("Not implemented");
    }

    addBarcode(data: string, type: BarcodeType, ...args: any[]): void {
        // TODO: Implement barcode printing logic
        throw new Error("Not implemented");
    }

    addFeedLine(lines: number): void {
        // TODO: Implement line feed logic
        throw new Error("Not implemented");
    }

    cutPaper(): void {
        // TODO: Implement paper cutting logic
        throw new Error("Not implemented");
    }
}
