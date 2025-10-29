import { Component, inject, OnInit, signal } from "@angular/core";
import { GlobalModule } from "../../../../core/modules/global-module.module";
import { PllFormSchema } from "@pollaris/forms";
import { SignInData } from "../../models/sign-in-data.model";
import { AuthFacade } from "../../facades/auth.facade";
import { switchMap } from "rxjs";
import { Router, RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-sign-in-form',
  imports: [GlobalModule, RouterLink],
  templateUrl: './sign-in-form.component.html',
})
export class SignInFormComponent implements OnInit {
  facade = inject(AuthFacade);

  form: PllFormSchema<SignInData>;
  formReady = signal<boolean>(false);
  router = inject(Router);

  processing = signal<boolean>(false);
  error = signal<string>("");

  async ngOnInit() {
    this._configureFormSchema();
  };

  private _configureFormSchema() {
    this.form = new PllFormSchema(this.facade.signInSchema);
    this.formReady.set(true);
  };

  onSubmit() {
    this.processing.set(true);
    this.error.set("");
    this.form.handleSubmit().pipe(switchMap(response => this.facade.signIn(response))).subscribe({
      next: () => this.router.navigate(["/dashboard"]),
      error: error => {
        this.processing.set(false);
        this.error.set(error?.error?.message || error?.message || error);
      },
    });
  };
};