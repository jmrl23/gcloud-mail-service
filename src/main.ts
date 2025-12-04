import { MethodNotAllowed, NotImplemented, Unauthorized } from 'http-errors';
import { input } from './schemas/input';
import { errorCatcher } from './utils/error-catcher';
import { sendMail } from './utils/send-mail';
import { validator } from './utils/validator';

export const main = errorCatcher(async function (request, response) {
  if (request.method !== 'POST') {
    throw new MethodNotAllowed(`Method ${request.method} not allowed`);
  }

  if (request.headers['x-api-key'] !== process.env.API_KEY) {
    throw new Unauthorized();
  }

  if (request.url === '/send') {
    const parsed = validator(request.body, input);
    const result = await sendMail(parsed);
    return response.status(200).json({
      data: result,
    });
  }
  throw new NotImplemented();
});
