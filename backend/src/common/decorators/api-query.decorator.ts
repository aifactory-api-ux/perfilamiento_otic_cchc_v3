import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export interface ApiQueryParam {
  name: string;
  required?: boolean;
  type?: any;
  description?: string;
}

export function ApiQueryDecorator(params: ApiQueryParam[]) {
  const decorators = params.map((param) =>
    ApiQuery({
      name: param.name,
      required: param.required ?? false,
      type: param.type ?? String,
      description: param.description ?? '',
    }),
  );
  return applyDecorators(...decorators);
}
