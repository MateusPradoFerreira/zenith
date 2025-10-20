import { Component, inject, OnInit, signal } from "@angular/core";
import { GlobalModule } from "../../../../core/modules/global-module.module";
import { PllFormSchema } from "@pollaris/forms";
import { SignInData } from "../../models/sign-in-data.model";
import { AuthFacade } from "../../facades/auth.facade";
import { switchMap } from "rxjs";
import { Router } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-sign-in-form',
  imports: [GlobalModule],
  templateUrl: './sign-in-form.component.html',
})
export class SignInFormComponent implements OnInit {
  facade = inject(AuthFacade);

  form: PllFormSchema<SignInData>;
  formReady = signal<boolean>(false);
  router = inject(Router);

  processing = signal<boolean>(false);

  async ngOnInit() {
    this._configureFormSchema();
  };

  private _configureFormSchema() {
    this.form = new PllFormSchema(this.facade.signInSchema);
    this.formReady.set(true);
  };

  onSubmit() {
    this.form.handleSubmit().pipe(switchMap(response => this.facade.signIn(response))).subscribe({
      next: () => this.router.navigate(["/dashboard"]),
      error: error => console.error(error),
    });
  };
};