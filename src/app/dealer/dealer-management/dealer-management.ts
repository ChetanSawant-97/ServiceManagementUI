import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { TuiIcon } from '@taiga-ui/core';
import { InputText } from '../../common/forms/components/input-text/input-text';
import { FormModel } from '../../common/forms/FormsUtility';
import { DealerMaster } from '../models/DealerMaster';

@Component({
  selector: 'app-dealer-management',
  imports: [CommonModule,FormsModule,TuiIcon,InputText],
  templateUrl: './dealer-management.html',
  styleUrl: './dealer-management.scss',
})
export class DealerManagement {
  public isOpen : boolean = false;
  public title : string = '';
  public description :string = '';

  public formGroup :FormGroup<FormModel<DealerMaster>> = new FormGroup<FormModel<DealerMaster>>({
    name : new FormControl('', [Validators.required]),
    address_id : new FormControl('',[Validators.required]),
    email_id : new FormControl('',[Validators.required,Validators.email]),
    mobile_no : new FormControl('',[Validators.required]),
    is_active : new FormControl('',[Validators.required]),
    is_deleted : new FormControl('',[Validators.required]),
    updated_by : new FormControl('',[]),
    created_by : new FormControl('',[]),
    branch_code : new FormControl('',[Validators.required]),
    created_date : new FormControl('',[]),
    updated_date : new FormControl('',[]),
  })
 
  openForm(): void {
    this.isOpen = true;
  }
 
  closeForm(): void {
    this.isOpen = false;
  }



 

}
