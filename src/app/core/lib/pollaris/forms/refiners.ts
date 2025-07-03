import { PllFormRefiner } from ".";

export class TrimRefiner extends PllFormRefiner<string, any> {
  transform(string: string): string {
    if(!string) return string;
    return string.trim();
  };
};

export class EmailRefiner extends PllFormRefiner<string, any> {
  transform(email: string): string {
    if(!email) return null;
    if(!email.includes("@")) return `${email}@gmail.com`;
    return email;
  };
};

export class NullifyZeroRefiner extends PllFormRefiner<number, any> {
  transform(number: number): number {
    if(!number) return null;
    return number;
  };
};

export class Refiners {
  static trim = new TrimRefiner();
  static email = new EmailRefiner();
  static nullifyZero = new NullifyZeroRefiner();
};