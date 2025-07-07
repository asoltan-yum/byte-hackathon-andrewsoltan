import { IReceiptCompiler } from './interfaces/IReceiptCompiler';
import { LayoutModel, ReceiptDSL } from './types';

export class ReceiptCompiler implements IReceiptCompiler {
    compile(layout: LayoutModel): ReceiptDSL {
        // TODO: Implement compilation logic
        throw new Error("Not implemented");
    }
}
