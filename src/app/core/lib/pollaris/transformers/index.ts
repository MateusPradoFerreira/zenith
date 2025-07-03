import { Observable, from, reduce, concatMap, of, map, catchError } from "rxjs";
import { PllRecord } from "..";

export abstract class PllDataTransformer<TValue, TContext extends PllRecord> {
  abstract transform(value: TValue, context: TContext): TValue;
};

export class PllDataTransformHandle {
  
  static transformRawValue<TValue, TContext extends PllRecord>(value: TValue, context: TContext, transformers: PllDataTransformer<TValue, TContext>[]): Observable<{ value: TValue, error: any }> {
    return from(transformers).pipe(
      reduce((acc$, transformer) => acc$.pipe(concatMap(currentValue => of(transformer.transform(currentValue, context)))), of(value)),
      concatMap(final$ => final$),
      map(finalValue => ({ value: finalValue, error: null as any })),
      catchError(error => of({ value, error })),
    );
  };

  static transformContext<TContext extends PllRecord>(data: TContext, transformConfig: Partial<{[Key in keyof TContext]: PllDataTransformer<TContext[Key], TContext>[]}>): Observable<{ data: TContext, errors: {[Key in keyof TContext]: string}}> {
    const transformers: Observable<{ key: string, value: any, error: any }>[] = [];
    for (let [key] of Object.entries(data)) {
      if(transformConfig[key]) transformers.push(this.transformRawValue(data[key], data, transformConfig[key]).pipe(map(response => ({ ...response, key }))));
    };
    
    if(!transformers.length) return of({ data, errors: null as any });

    return from(transformers).pipe(
      reduce(
        (acc$, refinedField) => acc$.pipe(
          concatMap(currentValue => refinedField.pipe(map(({ key, value, error }) => ({
            data: { ...currentValue.data, [key]: value },
            errors: this.concatError(key, error, currentValue.errors),
          })))),
        ),
        of({ data, errors: null as any }),
      ),
      concatMap(final$ => final$),
    );
  };

  static concatError<TContext extends PllRecord>(key: string, error: any, currentErrors: {[Key in keyof TContext]: string}): {[Key in keyof TContext]: string} {
    if(!error) return currentErrors;
    const message = error?.error?.message || error?.message || "Internal Error!";
    if(!currentErrors) return { [key]: message } as any;
    return { ...currentErrors, [key]: message };
  };
};

export type PllDataTransformErrorContext<TContext> = {[ Key in keyof TContext ]: string};
export class PllDataTransformError<TContext> extends Error {
  constructor (
    public readonly errors: PllDataTransformErrorContext<TContext>,
    public readonly errorMessage: string = "Data Transformation Error!",
  ) {
    super(errorMessage);
  };
};