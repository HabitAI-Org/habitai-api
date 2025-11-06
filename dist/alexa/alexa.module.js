"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlexaModule = void 0;
const common_1 = require("@nestjs/common");
const alexa_controller_1 = require("./alexa.controller");
const alexa_service_1 = require("./alexa.service");
const alexa_verify_middleware_1 = require("./alexa.verify.middleware");
let AlexaModule = class AlexaModule {
    configure(consumer) {
        consumer.apply(alexa_verify_middleware_1.AlexaVerifyMiddleware).forRoutes('webhook/alexa');
    }
};
exports.AlexaModule = AlexaModule;
exports.AlexaModule = AlexaModule = __decorate([
    (0, common_1.Module)({ controllers: [alexa_controller_1.AlexaController], providers: [alexa_service_1.AlexaService] })
], AlexaModule);
//# sourceMappingURL=alexa.module.js.map