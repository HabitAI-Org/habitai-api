import { Injectable, NestMiddleware } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _verifier = require('alexa-verifier');
const alexaVerifier = typeof _verifier === 'function' ? _verifier : _verifier.default;

@Injectable()
export class AlexaVerifyMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        const verifyOff = (process.env.ALEXA_VERIFY_SIGNATURE ?? 'false') === 'false';

        if (verifyOff) {
            // 👇 Si está desactivada la firma, parsea el Buffer para que el controller reciba JSON
            if (Buffer.isBuffer(req.body)) {
                try { req.body = JSON.parse(req.body.toString('utf8')); } catch { /* ignore */ }
            }
            return next();
        }

        const certUrl = req.headers['signaturecertchainurl'];
        const signature = req.headers['signature'];
        const rawBuf: Buffer | undefined = Buffer.isBuffer(req.body) ? req.body as Buffer : undefined;

        if (!certUrl || !signature) return res.status(400).send('Missing Alexa signature headers');
        if (!rawBuf?.length)       return res.status(400).send('Missing raw body for Alexa verification');

        // Verifica y luego parsea
        alexaVerifier(certUrl, signature, rawBuf, (err: any) => {
            if (err) return res.status(401).send('Invalid Alexa signature');
            try { req.body = JSON.parse(rawBuf.toString('utf8')); } catch {}
            next();
        });
    }
}