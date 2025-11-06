import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { intentSchemas, toJsonSchema } from '../schemas/intents.schemas';

@Injectable()
export class AlexaService {
    private readonly logger = new Logger(AlexaService.name);

    buildSchema(intentName: string, slots: Record<string, any> = {}) {
        const zodSchema = intentSchemas[intentName];

        if (!zodSchema) {
            const fallback = z.object({ message: z.string() });
            const bundle = {
                intent: intentName,
                schema: toJsonSchema(fallback),
                payload: { message: `Intent no mapeado: ${intentName}` },
            };
            this.logger.log(`SchemaBundle (fallback): ${JSON.stringify(bundle)}`);
            return bundle;
        }

        const initial: Record<string, any> = {};
        Object.entries(slots || {}).forEach(([k, v]: any) => {
            initial[k] = v?.value ?? null;
        });

        const bundle = {
            intent: intentName,
            schema: toJsonSchema(zodSchema),
            payload: initial,
        };
        this.logger.log(`SchemaBundle: ${JSON.stringify(bundle)}`);
        return bundle;
    }
}
