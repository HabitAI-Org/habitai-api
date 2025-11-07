import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Define la estructura (Zod) para cada intent que quieras soportar
export const ExecuteRoutineSchema = z.object({
    routineName: z.string().describe('Nombre de la rutina a ejecutar'),
    when: z.enum(['mañana', 'tarde', 'noche', 'fin de semana']).optional(),
    devices: z.array(z.string()).optional().describe('Dispositivos IoT involucrados'),
});

export const SetDeviceStateSchema = z.object({
    deviceName: z.string(),
    action: z.enum(['encender', 'apagar', 'toggle']),
    value: z.union([z.string(), z.number()]).optional().describe('Nivel o valor opcional'),
});

export const QueryStatusSchema = z.object({
    deviceName: z.string(),
    metric: z.enum(['estado', 'batería', 'consumo']).default('estado'),
});

// Mapa: nombre del intent -> esquema Zod
export const intentSchemas: Record<string, z.ZodTypeAny> = {
    'EjecutarRutinaPorMomentoIntent': ExecuteRoutineSchema,
    'SetDeviceStateIntent': SetDeviceStateSchema,
    'QueryStatusIntent': QueryStatusSchema,
};

// Helper: Zod -> JSON Schema (para usar luego con OpenAI structured outputs)
export const toJsonSchema = (schema: z.ZodTypeAny) =>
    zodToJsonSchema(schema, { name: 'IntentPayload' });
