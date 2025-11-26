import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private readonly userService = inject(UserService)
  private readonly router = inject(Router)

  msgErr: WritableSignal<string> = signal("");
  isLoading: WritableSignal<boolean> = signal(false);

  loginForm: FormGroup = new FormGroup({


    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)])


  })



  submitForm(): void {

    if (this.loginForm.valid) {
      this.isLoading.set(true)

      this.userService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res)
          this.isLoading.set(false)

          if (res.message === 'success') {
            localStorage.setItem('token', res.token)
            setTimeout(() => {
              this.router.navigate(['/timeline'])
            }, 1000);
          }

        },
        error: (err) => {
          console.log(err)
          this.isLoading.set(false)

        }
      })


      // console.log(this.loginForm.value)

    }

  }

}
