import { NgModule } from '@angular/core';
import { HlmInputErrorDirective } from './lib/hlm-input-error.directive';
import { HlmInputDirective } from './lib/hlm-input.directive';
import { HlmInputNumberDirective } from './lib/hlm-input-number.directive';

export * from './lib/hlm-input-error.directive';
export * from './lib/hlm-input.directive';

@NgModule({
	imports: [HlmInputDirective, HlmInputErrorDirective, HlmInputNumberDirective],
	exports: [HlmInputDirective, HlmInputErrorDirective, HlmInputNumberDirective],
})
export class HlmInputModule {}
