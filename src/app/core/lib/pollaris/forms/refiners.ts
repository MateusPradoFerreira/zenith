import { PllFormRefiner } from ".";

export class TrimRefiner extends PllFormRefiner<string, any> {
  override transform(string: string): string {
    if(!string) return string;
    return string.trim();
  };
};

export class NullifyZeroRefiner extends PllFormRefiner<number, any> {
  override transform(number: number): number {
    if(!number) return null;
    return number;
  };
};

export class Refiners {
  static trim = new TrimRefiner();
  static nullifyZero = new NullifyZeroRefiner();
};