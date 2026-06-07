import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { Schema } from 'zod';
export declare class ZodValidationPipe implements PipeTransform {
    private schema;
    constructor(schema: Schema);
    transform(value: unknown, _metadata: ArgumentMetadata): any;
}
//# sourceMappingURL=zod-validation.pipe.d.ts.map