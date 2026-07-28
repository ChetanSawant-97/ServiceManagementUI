import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InputText } from '../../../forms/components/input-text/input-text';
import { InputPasswordComponent } from '../../../forms/components/input-password/input-password-component';
import { CommonModule } from '@angular/common';
import { getFormErrorMessages } from '../../../Utility';
import { AuthService } from '../../services/Authentication.service';
import { UiService } from '../../../UiUtility.service';

@Component({
  selector: 'app-staff-login',
  imports: [InputText,InputPasswordComponent,CommonModule],
  templateUrl: './staff-login.html',
  styleUrl: './staff-login.scss',
})
export class StaffLogin implements OnInit{
  public authenticationService : AuthService = inject(AuthService);

  public uiUtilityService : UiService = inject(UiService);

  public errors : string[] = [];


  ngOnInit(): void {
    this.signingIn.valueChanges.subscribe((value) => {
      this.errors = getFormErrorMessages(this.signingIn);
    });
  }
 
  public signingIn = new FormGroup({
    username: new FormControl('', { 
      validators: [Validators.required,Validators.minLength(10),Validators.maxLength(50)], 
      nonNullable: true 
    }),
    password: new FormControl('', { 
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(50)], 
      nonNullable: true 
    })
  });

  
 
  submit(): void {
    this.uiUtilityService.showLoader();
    setTimeout(()=>{},3000);
    this.uiUtilityService.hideLoader();
    this.uiUtilityService.showSuccess('Snackbar Works');
  }
}
