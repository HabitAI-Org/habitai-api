export declare class AlexaService {
    private readonly logger;
    buildSchema(intentName: string, slots?: Record<string, any>): {
        intent: string;
        schema: import("zod-to-json-schema").JsonSchema7Type & {
            $schema?: string | undefined;
            definitions?: {
                [key: string]: import("zod-to-json-schema").JsonSchema7Type;
            } | undefined;
        };
        payload: {
            message: string;
        };
    } | {
        intent: string;
        schema: import("zod-to-json-schema").JsonSchema7Type & {
            $schema?: string | undefined;
            definitions?: {
                [key: string]: import("zod-to-json-schema").JsonSchema7Type;
            } | undefined;
        };
        payload: Record<string, any>;
    };
}
