import { Component } from "@angular/core";
import { GlobalModule } from "../../../../core/modules/global-module.module";

@Component({
  standalone: true,
  selector: 'app-sign-up-form',
  imports: [GlobalModule],
  templateUrl: './sign-up-form.component.html',
})
export class SignUpFormComponent {};