import { AfterViewInit, Component, inject, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements AfterViewInit {

  private readonly userService = inject(UserService)
  private readonly router = inject(Router)
  msgErr: WritableSignal<string> = signal("");
  isLoading: WritableSignal<boolean> = signal(false);
  ngAfterViewInit(): void {

    initFlowbite();

    // Listen to datepicker changes
    const datepickerEl = document.getElementById('datepicker-autohide');

    if (datepickerEl) {
      // Listen for the changeDate event from Flowbite datepicker
      datepickerEl.addEventListener('changeDate', (event: any) => {
        this.registerForm.patchValue({
          dateOfBirth: event.target.value
        });
      });

      // Also listen for regular change event as a fallback
      datepickerEl.addEventListener('change', (event: any) => {
        this.registerForm.patchValue({
          dateOfBirth: event.target.value
        });
      });
    }


  }


  registerForm: FormGroup = new FormGroup({

    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]),
    rePassword: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]),
    dateOfBirth: new FormControl(null, [Validators.required,]),
    gender: new FormControl(null, [Validators.required])

  }, { validators: [this.confirmPassword] })


  confirmPassword(group: AbstractControl) {

    return group.get('password')?.value === group.get('rePassword')?.value ? null : { mismatch: true }

  }

  submitForm(): void {

    if (this.registerForm.valid) {
      this.isLoading.set(true);
      const formData = { ...this.registerForm.value };

      // Format date if needed (MM/DD/YYYY to D-M-YYYY)
      if (formData.dateOfBirth) {
        const date = new Date(formData.dateOfBirth);
        // formData.dateOfBirth = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        formData.dateOfBirth = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      }

      // console.log(formData);

      this.userService.signUp(formData).subscribe({
        next: (res) => {

          console.log(res)
          if (res.message === 'success') {
            this.isLoading.set(false);
            this.msgErr.set("")
            setTimeout(() => {
              this.router.navigate(['/login'])
            }, 1000);
          }


        },
        error: (err) => {
          this.isLoading.set(false);
          console.log(err)
          this.msgErr.set(err.error.error)
          console.log(this.msgErr)
        },
      })
      // Send to backend
    }
  }






}
