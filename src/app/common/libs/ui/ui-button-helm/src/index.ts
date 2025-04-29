import { NgModule } from '@angular/core';
import { HlmButtonDirective } from './lib/hlm-button.directive';
import { HlmButtonIconDirective } from './lib/hlm-button-icon.directive';
export * from './lib/hlm-button.token';

export * from './lib/hlm-button.directive';

@NgModule({
	imports: [HlmButtonDirective, HlmButtonIconDirective],
	exports: [HlmButtonDirective, HlmButtonIconDirective],
})
export class HlmButtonModule {}
