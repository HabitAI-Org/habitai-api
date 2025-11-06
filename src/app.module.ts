import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlexaModule } from './alexa/alexa.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }), // ⬅️ hace ConfigService disponible en todos los módulos
        AlexaModule,
        OpenaiModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
