// src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        message: 'Solicitud exitosa',
        timestamp: new Date(),
      })),
    );
  }
}
