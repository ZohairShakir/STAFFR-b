"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable CORS
    app.enableCors({
        origin: process.env.APP_URL || 'http://localhost:3000',
        credentials: true,
    });
    // Middleware for cookies
    app.use((0, cookie_parser_1.default)());
    // Intercept and preserve raw body buffer for Slack signing verification
    app.use((0, express_1.json)({
        verify: (req, _res, buf) => {
            if (req.url.startsWith('/slack/events')) {
                req.rawBody = buf.toString();
            }
        },
    }));
    app.use((0, express_1.urlencoded)({ extended: true }));
    // Global Validation
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    const port = process.env.PORT || 4000;
    await app.listen(port);
    console.log(`🚀 CFT API running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map