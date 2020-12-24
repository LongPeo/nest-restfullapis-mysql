import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { CustomLogger } from '../logger/custom-logger.service';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLogger) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const logRequest = `Request ${request.method} ${
      request.url
    } ${JSON.stringify(request.body)} ${JSON.stringify(request.headers)}`;
    return next.handle().pipe(
      catchError((exception) => {
        const statusCode = exception.response
          ? exception.response.status || exception.response.statusCode
          : exception.status;
        const responseError = exception.response
          ? exception.response.data || exception.response
          : exception.message || 'Internal Server Error';

        this.logger.error(
          `${logRequest} Response: ${
            typeof responseError === 'object'
              ? JSON.stringify(responseError)
              : responseError
          }`,
        );

        throw new HttpException(
          responseError,
          statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }
}
