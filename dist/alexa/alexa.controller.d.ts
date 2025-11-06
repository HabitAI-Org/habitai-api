import { ConfigService } from '@nestjs/config';
import { AlexaService } from './alexa.service';
export declare class AlexaController {
    private readonly alexaService;
    private readonly config;
    private readonly logger;
    constructor(alexaService: AlexaService, config: ConfigService);
    handleAlexa(body: any): {
        version: string;
        response: {
            outputSpeech: {
                type: string;
                text: string;
            };
            shouldEndSession: boolean;
            reprompt?: undefined;
        };
    } | {
        version: string;
        response: {
            outputSpeech: {
                type: string;
                text: string;
            };
            reprompt: {
                outputSpeech: {
                    type: string;
                    text: string;
                };
            };
            shouldEndSession: boolean;
        };
    } | {
        version: string;
        response: {
            shouldEndSession: boolean;
            outputSpeech?: undefined;
            reprompt?: undefined;
        };
    };
}
