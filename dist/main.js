"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_1 = require("express");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true, bodyParser: false });
    app.use('/webhook/alexa', (0, express_1.raw)({ type: '*/*' }));
    app.use((req, res, next) => (req.path === '/webhook/alexa' ? next() : (0, express_1.json)()(req, res, next)));
    app.use((req, res, next) => (req.path === '/webhook/alexa' ? next() : (0, express_1.urlencoded)({ extended: true })(req, res, next)));
    const cfg = app.get(config_1.ConfigService);
    await app.listen(cfg.get('PORT') ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map