import { Body, Controller, Post, HttpCode, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AlexaService } from './alexa.service';

@Controller('webhook/alexa')
export class AlexaController {
    private readonly logger = new Logger(AlexaController.name);

    constructor(
        private readonly alexaService: AlexaService,
        private readonly config: ConfigService,
    ) {}

    @Post()
    @HttpCode(200)
    handleAlexa(@Body() body: any) {
        // 1) Soft-check de SkillId (nunca lances 400 aquí; responde 200 con mensaje)
        const expectedSkillId = this.config.get<string>('ALEXA_SKILL_ID');
        const receivedSkillId =
            body?.session?.application?.applicationId ??
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

        // 2) Timestamp check (configurable por .env)
        const verifyTs = this.config.get<string>('ALEXA_VERIFY_TIMESTAMP') === 'true';
        const maxSkewMs = Number(this.config.get<string>('ALEXA_MAX_SKEW_MS') ?? '300000'); // 5 min en DEV
        const tsRaw: string | undefined = body?.request?.timestamp;
        const ts = tsRaw ? Date.parse(tsRaw) : NaN;
        const now = Date.now();
        const skewSec = tsRaw && !Number.isNaN(ts) ? Math.round((now - ts) / 1000) : NaN;
        this.logger.log(
            `Alexa ts=${tsRaw} | now=${new Date(now).toISOString()} | skew=${skewSec}s | verify=${verifyTs} | max=${maxSkewMs}ms`,
        );
        if (verifyTs && (!tsRaw || Number.isNaN(ts) || Math.abs(now - ts) > maxSkewMs)) {
            return {
                version: '1.0',
                response: {
                    outputSpeech: { type: 'PlainText', text: 'Petición expirada.' },
                    shouldEndSession: true,
                },
            };
        }

        // 3) Routing por tipo
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
            this.logger.warn(
                `SessionEnded: ${body?.request?.reason} ${
                    body?.request?.error?.type ?? ''
                }`,
            );
            // Alexa no requiere respuesta hablada aquí
            return { version: '1.0', response: { shouldEndSession: true } };
        }

        // Fallback
        return {
            version: '1.0',
            response: {
                outputSpeech: { type: 'PlainText', text: 'Evento no soportado.' },
                shouldEndSession: true,
            },
        };
    }
}