import { Component, inject, OnInit, signal } from "@angular/core";
import { GlobalModule } from "../../../../core/modules/global-module.module";
import { PllFormSchema } from "@pollaris/forms";
import { SignUpData } from "../../models/sign-up-data.model";
import { AuthFacade } from "../../facades/auth.facade";
import { switchMap } from "rxjs";
import { Router, RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-sign-up-form',
  imports: [GlobalModule, RouterLink],
  templateUrl: './sign-up-form.component.html',
})
export class SignUpFormComponent implements OnInit {
  facade = inject(AuthFacade);

  form: PllFormSchema<SignUpData>;
  formReady = signal<boolean>(false);
  router = inject(Router);

  processing = signal<boolean>(false);
  error = signal<string>("");

  async ngOnInit() {
    this._configureFormSchema();
  };

  private _configureFormSchema() {
    this.form = new PllFormSchema(this.facade.signUpSchema);
    this.formReady.set(true);
  };

  onSubmit() {
    if(this.form.invalid) return;
    this.processing.set(true);
    this.error.set("");
    this.form.handleSubmit().pipe(switchMap(response => this.facade.signUp(response))).subscribe({
      next: () => this.router.navigate(["/dashboard"]),
      error: error => {
        this.processing.set(false);
        this.error.set(error?.error?.message?.message || error?.error?.message?.details || error?.error?.message || error?.message || error);
      },
    });
  };

  passwordStrong(): 'LOW' | 'MEDIUM' | 'STRONG' {
    const password = this.form.value.password as string;

    if (!password) return 'LOW';

    let strength = 0;

    // Critérios de avaliação
    const lengthCriteria = password.length >= 8; // tamanho mínimo
    const upperCaseCriteria = /[A-Z]/.test(password);
    const lowerCaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /[0-9]/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Soma os critérios atendidos
    if (lengthCriteria) strength++;
    if (upperCaseCriteria) strength++;
    if (lowerCaseCriteria) strength++;
    if (numberCriteria) strength++;
    if (specialCharCriteria) strength++;

    // Determina a força da senha
    if (strength <= 2) return 'LOW';
    if (strength === 3 || strength === 4) return 'MEDIUM';
    if (strength === 5) return 'STRONG';

    return 'LOW';
  };
  
};