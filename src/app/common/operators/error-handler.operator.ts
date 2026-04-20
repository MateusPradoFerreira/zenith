import { catchError } from 'rxjs/operators';
import { of, OperatorFunction, throwError } from 'rxjs';
import { toast } from 'ngx-sonner';

type ErrorHandlerData = {
  header?: string;
  next?: (error: any) => void;
  showWarning?: boolean;
};

export function errorHandler<T>({ header, next, showWarning }: ErrorHandlerData = {}): OperatorFunction<T, T> {
  return (source$) => source$.pipe(
    catchError(error => {
      let message = error?.error?.message?.message || error?.error?.message?.details || error?.error?.message || error?.message || error;
      if (message.includes("Cannot GET") || message.includes("Cannot POST") || message.includes("Cannot PUT")) message = "Rota não Implementada!";

      if(error?.status && error.status >= 400 && error.status < 500 && showWarning && message !== "Rota não Implementada!") {
        if (error.status === 400 && error?.error?.message?.errors) {
          const errors = error?.error?.message?.errors;
          for (let error of errors) {
            for (let err of Object.values(error.constraints)) toast.warning("ATENÇÃO!", { description: err as string });
          };
        } else toast.warning("ATENÇÃO!", { description: message });
      } else {
        toast.error(header || "ERRO!", { description: message });
      };

      if(next) next(error);
      return throwError(() => error);
    })
  );
};

type NextErrorHandlerData = {
  header?: string;
  next?: (error: any) => void;
};

export function nextErrorHandler<T>({ header, next }: NextErrorHandlerData = {}): OperatorFunction<T, T> {
  return (source$) => source$.pipe(
    catchError(error => {
      let message = error?.error?.message?.message || error?.error?.message?.details || error?.error?.message || error?.message || error;
      if (message.includes("Cannot GET") || message.includes("Cannot POST") || message.includes("Cannot PUT")) message = "Rota não Implementada!";

      toast.error(header || "ERRO!", { description: message });
      if(next) next(error);
      return of(null);
    })
  );
};