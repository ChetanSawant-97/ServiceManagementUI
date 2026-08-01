import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputText } from '../../../forms/components/input-text/input-text';
import { InputPasswordComponent } from '../../../forms/components/input-password/input-password-component';
import { CommonModule } from '@angular/common';
import { getFormErrorMessages } from '../../../Utility';
import { AuthService, LoginRequest } from '../../services/Authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-login',
  imports: [InputText,InputPasswordComponent,CommonModule],
  templateUrl: './staff-login.html',
  styleUrl: './staff-login.scss',
})
export class StaffLogin implements OnInit{
  public authenticationService : AuthService = inject(AuthService);
  public router = inject(Router);

  public errors : string[] = [];


  ngOnInit(): void {
    this.signingIn.valueChanges.subscribe((value) => {
      this.errors = getFormErrorMessages(this.signingIn);
    });
  }
 
  public signingIn = new FormGroup({
    username: new FormControl('', { 
      validators: [Validators.required,Validators.minLength(5),Validators.maxLength(50)], 
      nonNullable: true 
    }),
    password: new FormControl('', { 
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(50)], 
      nonNullable: true 
    })
  });

  
 
  submit(): void {
    if (this.signingIn.invalid) {
      return;
    }

    // Call the login service with the form values
    this.authenticationService.login(this.signingIn.value as LoginRequest,false).subscribe({
      next: (response) => {
        this.router.navigate(['/']); 
      }
    });
  }
}
