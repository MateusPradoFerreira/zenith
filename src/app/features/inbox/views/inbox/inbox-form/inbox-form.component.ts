import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective } from '../../../../../common/directives/base-form-component.directive';
import { Inbox } from '../../../models/inbox.model';
import { InboxFacade, InboxPriorityOptions } from '../../../facades/inbox.facade';

@Component({
  standalone: true,
  selector: 'app-inbox-form',
  host: {
		role: 'div',
		'[class]': '_computedClass()',
	},
  imports: [GlobalModule],
  templateUrl: './inbox-form.component.html',
})
export class InboxFormComponent extends BaseFormComponentDirective<Inbox> {
  override facade = inject(InboxFacade);
  priorityOptions = InboxPriorityOptions;
};