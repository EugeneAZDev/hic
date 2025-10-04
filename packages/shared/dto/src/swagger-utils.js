"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodToSwagger = void 0;
const zod_openapi_1 = require("@anatine/zod-openapi");
function zodToSwagger(schema) {
    return (0, zod_openapi_1.generateSchema)(schema);
}
exports.zodToSwagger = zodToSwagger;
//# sourceMappingURL=swagger-utils.js.map