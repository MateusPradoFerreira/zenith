import { catchError } from 'rxjs/operators';
import { of, OperatorFunction, throwError } from 'rxjs';
import { toast } from 'ngx-sonner';

export function errorHandler<T>(): OperatorFunction<T, T> {
  return (source$) => source$.pipe(
    catchError(error => {
      const message = error?.error?.message || error?.message || error;

      if(error?.status && error.status >= 400 && error.status < 500) {
        toast.warning("ATENÇÃO!", { description: message });
      } else {
        toast.error("ERRO!", { description: message });
      };

      return throwError(() => error)
    })
  );
};

type NextErrorData = {
  header?: string;
  next?: (error: any) => void;
};

export function nextErrorHandler<T>({ header, next }: NextErrorData): OperatorFunction<T, T> {
  return (source$) => source$.pipe(
    catchError(error => {
      const message = error?.error?.message || error?.message || error;
      toast.error(header || "ERRO!", { description: message });
      if(next) next(error);
      return of(null);
    })
  );
};