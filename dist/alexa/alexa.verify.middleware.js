"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlexaVerifyMiddleware = void 0;
const common_1 = require("@nestjs/common");
const _verifier = require('alexa-verifier');
const alexaVerifier = typeof _verifier === 'function' ? _verifier : _verifier.default;
let AlexaVerifyMiddleware = class AlexaVerifyMiddleware {
    use(req, res, next) {
        const verifyOff = (process.env.ALEXA_VERIFY_SIGNATURE ?? 'false') === 'false';
        if (verifyOff) {
            if (Buffer.isBuffer(req.body)) {
                try {
                    req.body = JSON.parse(req.body.toString('utf8'));
                }
                catch { }
            }
            return next();
        }
        const certUrl = req.headers['signaturecertchainurl'];
        const signature = req.headers['signature'];
        const rawBuf = Buffer.isBuffer(req.body) ? req.body : undefined;
        if (!certUrl || !signature)
            return res.status(400).send('Missing Alexa signature headers');
        if (!rawBuf?.length)
            return res.status(400).send('Missing raw body for Alexa verification');
        alexaVerifier(certUrl, signature, rawBuf, (err) => {
            if (err)
                return res.status(401).send('Invalid Alexa signature');
            try {
                req.body = JSON.parse(rawBuf.toString('utf8'));
            }
            catch { }
            next();
        });
    }
};
exports.AlexaVerifyMiddleware = AlexaVerifyMiddleware;
exports.AlexaVerifyMiddleware = AlexaVerifyMiddleware = __decorate([
    (0, common_1.Injectable)()
], AlexaVerifyMiddleware);
//# sourceMappingURL=alexa.verify.middleware.js.map