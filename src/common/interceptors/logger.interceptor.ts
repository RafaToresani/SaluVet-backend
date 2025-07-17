import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { finalize, Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
    const now = Date.now();
    const res = context.switchToHttp().getResponse();
  
    return next.handle().pipe(
      finalize(() => {
        const statusCode = res.statusCode;
        const duration = Date.now() - now;
        console.log(
          `🐶 ${method} ${url} FROM: ${ip} STATUS: ${statusCode} - ${duration}ms`
        );
      }),
    );
  }
  
}
