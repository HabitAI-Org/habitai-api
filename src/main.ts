import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded, raw } from 'express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { cors: true, bodyParser: false });

    // Alexa crudo
    app.use('/webhook/alexa', raw({ type: '*/*' }));

    // Resto normal
    app.use((req, res, next) => (req.path === '/webhook/alexa' ? next() : json()(req, res, next)));
    app.use((req, res, next) => (req.path === '/webhook/alexa' ? next() : urlencoded({ extended: true })(req, res, next)));

    const cfg = app.get(ConfigService);
    await app.listen(cfg.get('PORT') ?? 3000);
}
bootstrap();