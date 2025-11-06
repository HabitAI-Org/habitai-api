"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AlexaController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlexaController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const alexa_service_1 = require("./alexa.service");
let AlexaController = AlexaController_1 = class AlexaController {
    alexaService;
    config;
    logger = new common_1.Logger(AlexaController_1.name);
    constructor(alexaService, config) {
        this.alexaService = alexaService;
        this.config = config;
    }
    handleAlexa(body) {
        const expectedSkillId = this.config.get('ALEXA_SKILL_ID');
        const receivedSkillId = body?.session?.application?.applicationId ??
            body?.context?.System?.application?.applicationId;
        if (expectedSkillId && receivedSkillId && expectedSkillId !== receivedSkillId) {
            this.logger.warn(`SkillId mismatch: got=${receivedSkillId}`);
            return {
                version: '1.0',
                response: {
                    outputSpeech: { type: 'PlainText', text: 'Skill no autorizada.' },
                    shouldEndSession: true,
                },
            };
        }
        const verifyTs = this.config.get('ALEXA_VERIFY_TIMESTAMP') === 'true';
        const maxSkewMs = Number(this.config.get('ALEXA_MAX_SKEW_MS') ?? '300000');
        const tsRaw = body?.request?.timestamp;
        const ts = tsRaw ? Date.parse(tsRaw) : NaN;
        const now = Date.now();
        const skewSec = tsRaw && !Number.isNaN(ts) ? Math.round((now - ts) / 1000) : NaN;
        this.logger.log(`Alexa ts=${tsRaw} | now=${new Date(now).toISOString()} | skew=${skewSec}s | verify=${verifyTs} | max=${maxSkewMs}ms`);
        if (verifyTs && (!tsRaw || Number.isNaN(ts) || Math.abs(now - ts) > maxSkewMs)) {
            return {
                version: '1.0',
                response: {
                    outputSpeech: { type: 'PlainText', text: 'Petición expirada.' },
                    shouldEndSession: true,
                },
            };
        }
        const type = body?.request?.type;
        this.logger.log(`Alexa request type: ${type}`);
        if (type === 'LaunchRequest') {
            return {
                version: '1.0',
                response: {
                    outputSpeech: { type: 'PlainText', text: 'HabitAI listo. ¿Qué quieres hacer?' },
                    reprompt: {
                        outputSpeech: {
                            type: 'PlainText',
                            text: 'Por ejemplo: “ejecuta mi rutina de mañana”.',
                        },
                    },
                    shouldEndSession: false,
                },
            };
        }
        if (type === 'IntentRequest') {
            const intentName = body?.request?.intent?.name ?? 'UnknownIntent';
            const slots = body?.request?.intent?.slots ?? {};
            const bundle = this.alexaService.buildSchema(intentName, slots);
            this.logger.log(`Bundle: ${JSON.stringify(bundle)}`);
            return {
                version: '1.0',
                response: {
                    outputSpeech: { type: 'PlainText', text: `Procesando ${bundle.intent}.` },
                    shouldEndSession: true,
                },
            };
        }
        if (type === 'SessionEndedRequest') {
            this.logger.warn(`SessionEnded: ${body?.request?.reason} ${body?.request?.error?.type ?? ''}`);
            return { version: '1.0', response: { shouldEndSession: true } };
        }
        return {
            version: '1.0',
            response: {
                outputSpeech: { type: 'PlainText', text: 'Evento no soportado.' },
                shouldEndSession: true,
            },
        };
    }
};
exports.AlexaController = AlexaController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AlexaController.prototype, "handleAlexa", null);
exports.AlexaController = AlexaController = AlexaController_1 = __decorate([
    (0, common_1.Controller)('webhook/alexa'),
    __metadata("design:paramtypes", [alexa_service_1.AlexaService,
        config_1.ConfigService])
], AlexaController);
//# sourceMappingURL=alexa.controller.js.map