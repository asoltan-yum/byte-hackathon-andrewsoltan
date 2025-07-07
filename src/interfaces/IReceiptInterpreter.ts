import { ReceiptDSL } from '../types';
import { EpsonMockPrinter } from '../EpsonMockPrinter';

export interface IReceiptInterpreter {
    interpret(printer: EpsonMockPrinter, dsl: ReceiptDSL): void;
}
