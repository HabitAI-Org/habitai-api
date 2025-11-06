import { NestMiddleware } from '@nestjs/common';
export declare class AlexaVerifyMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): any;
}
