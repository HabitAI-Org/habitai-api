import { z } from 'zod';
export declare const ExecuteRoutineSchema: z.ZodObject<{
    routineName: z.ZodString;
    when: z.ZodOptional<z.ZodEnum<["mañana", "tarde", "noche", "fin de semana"]>>;
    devices: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    routineName: string;
    when?: "mañana" | "tarde" | "noche" | "fin de semana" | undefined;
    devices?: string[] | undefined;
}, {
    routineName: string;
    when?: "mañana" | "tarde" | "noche" | "fin de semana" | undefined;
    devices?: string[] | undefined;
}>;
export declare const SetDeviceStateSchema: z.ZodObject<{
    deviceName: z.ZodString;
    action: z.ZodEnum<["encender", "apagar", "toggle"]>;
    value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
}, "strip", z.ZodTypeAny, {
    deviceName: string;
    action: "encender" | "apagar" | "toggle";
    value?: string | number | undefined;
}, {
    deviceName: string;
    action: "encender" | "apagar" | "toggle";
    value?: string | number | undefined;
}>;
export declare const QueryStatusSchema: z.ZodObject<{
    deviceName: z.ZodString;
    metric: z.ZodDefault<z.ZodEnum<["estado", "batería", "consumo"]>>;
}, "strip", z.ZodTypeAny, {
    deviceName: string;
    metric: "estado" | "batería" | "consumo";
}, {
    deviceName: string;
    metric?: "estado" | "batería" | "consumo" | undefined;
}>;
export declare const intentSchemas: Record<string, z.ZodTypeAny>;
export declare const toJsonSchema: (schema: z.ZodTypeAny) => import("zod-to-json-schema").JsonSchema7Type & {
    $schema?: string | undefined;
    definitions?: {
        [key: string]: import("zod-to-json-schema").JsonSchema7Type;
    } | undefined;
};
