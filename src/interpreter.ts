import { IReceiptInterpreter } from './interfaces/IReceiptInterpreter';
import { ReceiptDSL } from './types';
import { EpsonMockPrinter } from './EpsonMockPrinter';

export class ReceiptInterpreter implements IReceiptInterpreter {
    interpret(printer: EpsonMockPrinter, dsl: ReceiptDSL): void {
        // TODO: Implement interpretation logic
        throw new Error("Not implemented");
    }
}
