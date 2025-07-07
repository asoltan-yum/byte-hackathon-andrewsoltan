import { LayoutModel, ReceiptDSL } from '../types';

export interface IReceiptCompiler {
    compile(layout: LayoutModel): ReceiptDSL;
}
