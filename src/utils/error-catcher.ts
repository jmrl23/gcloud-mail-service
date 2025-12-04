import { HttpFunction, Response } from '@google-cloud/functions-framework';
import { HttpError } from 'http-errors';

export function errorCatcher(func: HttpFunction): HttpFunction {
  return async function (request, response) {
    try {
      await func(request, response);
    } catch (error) {
      if (error instanceof HttpError) {
        response.status(error.status).json({
          statusCode: error.status,
          error: `Http Error ${error.status}`,
          message: error.message,
        });
      } else {
        response.status(500).json({
          statusCode: 500,
          error: `Http Error ${500}`,
          message:
            error instanceof Error ? error.message : 'Internal Server Error',
        });
      }
    }
  };
}
