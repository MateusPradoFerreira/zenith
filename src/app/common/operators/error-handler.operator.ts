import { catchError } from 'rxjs/operators';
import { of, OperatorFunction, throwError } from 'rxjs';
import { toast } from 'ngx-sonner';

export function errorHandler<T>(showWarning: boolean = false): OperatorFunction<T, T> {
  return (source$) => source$.pipe(
    catchError(error => {
      let message = error?.error?.message?.message || error?.error?.message?.details || error?.error?.message || error?.message || error;
      if (message.includes("Cannot GET")) message = "Rota não implementada!";

      if(error?.status && error.status >= 400 && error.status < 500 && showWarning) {
        if (error.status === 400 && error?.error?.message?.errors) {
          const errors = error?.error?.message?.errors;
          for (let error of errors) {
            for (let err of Object.values(error.constraints)) toast.warning("ATENÇÃO!", { description: err as string });
          };
        } else toast.warning("ATENÇÃO!", { description: message });
      } else {
        toast.error("ERRO!", { description: message });
      };

      return throwError(() => error);
    })
  );
};

type NextErrorHandlerData = {
  header?: string;
  next?: (error: any) => void;
};

export function nextErrorHandler<T>({ header, next }: NextErrorHandlerData): OperatorFunction<T, T> {
  return (source$) => source$.pipe(
    catchError(error => {
      const message = error?.error?.message?.message || error?.error?.message?.details || error?.error?.message || error?.message || error;
      toast.error(header || "ERRO!", { description: message });
      if(next) next(error);
      return of(null);
    })
  );
};