import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AlexaController } from './alexa.controller';
import { AlexaService } from './alexa.service';
import { AlexaVerifyMiddleware } from './alexa.verify.middleware';

@Module({ controllers: [AlexaController], providers: [AlexaService] })
export class AlexaModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AlexaVerifyMiddleware).forRoutes('webhook/alexa');
    }
}