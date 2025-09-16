import { Component, inject } from '@angular/core';
import { GlobalModule } from '../../../../../core/modules/global-module.module';
import { BaseFormComponentDirective, event, EventObs } from '../../../../../common/directives/base-form-component.directive';
import { Goal } from '../../../models/goal.model';
import { GoalFacade } from '../../../facades/goal.facade';
import { colors, Colors } from '../../../../../common/types/colors.type';
import { tap } from 'rxjs';
import moment from 'moment';
import { faker } from '@faker-js/faker';
import { GoalItemListingComponent } from '../../goal-item/goal-item-listing/goal-item-listing.component';

@Component({
  standalone: true,
  selector: 'app-goal-form',
  imports: [GlobalModule, GoalItemListingComponent],
  templateUrl: './goal-form.component.html',
})
export class GoalFormComponent extends BaseFormComponentDirective<Goal> {
  override facade = inject(GoalFacade);

  colors = Object.entries(colors).map(([key, value]) => ({ key: key as Colors, value }));
  days: { intensity: "HIGH" | "MEDIUM" | "LOW", date: Date }[] = []; 

  override onNgOnInit: EventObs<void> = event(tap(() => {
    let date = moment().startOf("month");
    while (date.isBefore(moment().endOf("month"))) {
      this.days.push({ intensity: faker.helpers.arrayElement(["HIGH", "MEDIUM", "LOW"]), date: date.toDate() });
      date = date.add(1, "day");
    };
  }));

  onChangeColor(color: Colors) {
    this.form.controls.color.setValue(color);
  };

};