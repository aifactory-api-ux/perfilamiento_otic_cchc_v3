import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

interface ApiResponseDecoratorOptions {
  description: string;
  model?: any;
  isArray?: boolean;
}

export function ApiResponseDecorator(options: ApiResponseDecoratorOptions) {
  const { description, model, isArray } = options;
  if (model) {
    return applyDecorators(
      ApiExtraModels(model),
      ApiOkResponse({
        description,
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            timestamp: { type: 'string', example: new Date().toISOString() },
            path: { type: 'string', example: '/api/example' },
            data: isArray
              ? {
                  type: 'array',
                  items: { $ref: getSchemaPath(model) },
                }
              : { $ref: getSchemaPath(model) },
          },
        },
      }),
    );
  }

  return ApiOkResponse({
    description,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        timestamp: { type: 'string', example: new Date().toISOString() },
        path: { type: 'string', example: '/api/example' },
        data: { type: 'object', nullable: true },
      },
    },
  });
}
