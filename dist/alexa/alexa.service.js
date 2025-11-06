"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AlexaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlexaService = void 0;
const common_1 = require("@nestjs/common");
const zod_1 = require("zod");
const intents_schemas_1 = require("../schemas/intents.schemas");
let AlexaService = AlexaService_1 = class AlexaService {
    logger = new common_1.Logger(AlexaService_1.name);
    buildSchema(intentName, slots = {}) {
        const zodSchema = intents_schemas_1.intentSchemas[intentName];
        if (!zodSchema) {
            const fallback = zod_1.z.object({ message: zod_1.z.string() });
            const bundle = {
                intent: intentName,
                schema: (0, intents_schemas_1.toJsonSchema)(fallback),
                payload: { message: `Intent no mapeado: ${intentName}` },
            };
            this.logger.log(`SchemaBundle (fallback): ${JSON.stringify(bundle)}`);
            return bundle;
        }
        const initial = {};
        Object.entries(slots || {}).forEach(([k, v]) => {
            initial[k] = v?.value ?? null;
        });
        const bundle = {
            intent: intentName,
            schema: (0, intents_schemas_1.toJsonSchema)(zodSchema),
            payload: initial,
        };
        this.logger.log(`SchemaBundle: ${JSON.stringify(bundle)}`);
        return bundle;
    }
};
exports.AlexaService = AlexaService;
exports.AlexaService = AlexaService = AlexaService_1 = __decorate([
    (0, common_1.Injectable)()
], AlexaService);
//# sourceMappingURL=alexa.service.js.map