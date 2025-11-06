"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJsonSchema = exports.intentSchemas = exports.QueryStatusSchema = exports.SetDeviceStateSchema = exports.ExecuteRoutineSchema = void 0;
const zod_1 = require("zod");
const zod_to_json_schema_1 = require("zod-to-json-schema");
exports.ExecuteRoutineSchema = zod_1.z.object({
    routineName: zod_1.z.string().describe('Nombre de la rutina a ejecutar'),
    when: zod_1.z.enum(['mañana', 'tarde', 'noche', 'fin de semana']).optional(),
    devices: zod_1.z.array(zod_1.z.string()).optional().describe('Dispositivos IoT involucrados'),
});
exports.SetDeviceStateSchema = zod_1.z.object({
    deviceName: zod_1.z.string(),
    action: zod_1.z.enum(['encender', 'apagar', 'toggle']),
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).optional().describe('Nivel o valor opcional'),
});
exports.QueryStatusSchema = zod_1.z.object({
    deviceName: zod_1.z.string(),
    metric: zod_1.z.enum(['estado', 'batería', 'consumo']).default('estado'),
});
exports.intentSchemas = {
    'EjecutarRutinaPorMomentoIntent': exports.ExecuteRoutineSchema,
    'SetDeviceStateIntent': exports.SetDeviceStateSchema,
    'QueryStatusIntent': exports.QueryStatusSchema,
};
const toJsonSchema = (schema) => (0, zod_to_json_schema_1.zodToJsonSchema)(schema, { name: 'IntentPayload' });
exports.toJsonSchema = toJsonSchema;
//# sourceMappingURL=intents.schemas.js.map