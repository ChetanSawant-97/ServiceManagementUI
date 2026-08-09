import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';

// Common Components
import { InputText } from '../../common/forms/components/input-text/input-text';
import { SelectComponent } from '../../common/forms/components/input-select/input-select';
import { TableColumn, TableList } from '../../common/forms/components/table-list/table-list';
import { getFormErrorMessages } from '../../common/Utility';
import { InputDateComponent } from '../../common/forms/components/input-date-component/input-date-component';
import { ModalUploaderComponent } from '../../common/forms/components/modal-uploader/modal-uploader';

// Services & Models
import { OrderService } from '../services/OrderMaster.service';
import { DealerService } from '../../dealer/dealer.service';
import { OrderMaster, OrderPayload } from '../models/OrderMaster';
import { ProductService } from '../../config/services/Product.service';
import { TokenService } from '../../common/auth/services/Token.service';
import { AuthData } from '../../common/auth/services/Authentication.service';

@Component({
  selector: 'app-orders-management',
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, 
    TableList, InputText, SelectComponent, TabsModule, InputDateComponent,
    ModalUploaderComponent
  ],
  templateUrl: './orders-management.html',
  styleUrl: './orders-management.scss',
})
export class OrdersManagement implements OnInit {
  private orderService = inject(OrderService);
  private dealerService = inject(DealerService);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private tokenService = inject(TokenService); 
  public userData : AuthData | null = this.tokenService.getUserData();

  get isDealerUser(): boolean {
    return this.userData?.role?.toUpperCase() === 'DEALER';
  }

  isOpen = false;
  isLoading = false;
  isSaving = false;
  formErrors: string[] = [];

  // Dropdown options
  dealerOptions: { label: string, value: number }[] = []; 
  productOptions: { label: string, value: number }[] = []; // New product options

  tableColumns: TableColumn[] = [
    { field: 'customerName', header: 'Customer Name', width: '20%' },
    { field: 'customerNumber', header: 'Mobile No.', width: '15%' },
    { field: 'productName', header: 'Product', width: '20%' }, // Displaying productName in table
    { field: 'productSerialNumber', header: 'Serial Number', width: '20%' },
    { field: 'billDate', header: 'Bill Date', width: '15%' },
  ];

  tableData: OrderMaster[] = [];

  public orderForm = new FormGroup({
    orderId: new FormControl(0), 
    dealerId: new FormControl<number | null>(
      this.isDealerUser ? this.userData!.dealerId : null, 
      [Validators.required]
    ),
    customerName: new FormControl('', [Validators.required]),
    customerNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    productId: new FormControl<number | null>(null, [Validators.required]), // Changed to productId
    productSerialNumber: new FormControl('', [Validators.required]),
    billDate: new FormControl<Date | string | null>(null, [Validators.required]),
    billPhotoBase64: new FormControl<string | null>('', [Validators.required]), // Updated key
  });

  ngOnInit(): void {
    this.loadInitialData();
    console.warn('User Data:', this.userData); // Log user data for debugging
    this.orderForm.valueChanges.subscribe(() => {
      this.computeAllError();
    });  
  }

  loadInitialData() {
    this.isLoading = true;
    this.cdr.detectChanges();

    // Load Dealers
    if(this.userData!=null && this.userData.role.toLowerCase() !== 'dealer') {
      this.dealerService.getAllDealers().subscribe(res => {
        if (res.success) {
          this.dealerOptions = res.data.map(d => ({ label: d.dealerName, value: d.dealerId }));
        }
      });
    }

    // Load Products for the dropdown
    this.productService.getAllProducts().subscribe(res => {
      if (res.success) {
        // Assuming your product model has productName and productId
        this.productOptions = res.data.map(p => ({ label: p.productName, value: p.productId }));
      }
    });

    this.fetchOrders();
  }

  fetchOrders() {
    this.isLoading = true;
    this.cdr.detectChanges(); 

    const fetchRequest$ = this.isDealerUser 
      ? this.orderService.getOrdersByDealer(this.userData!.dealerId)
      : this.orderService.getAllOrders();

    fetchRequest$.subscribe({
      next: (res) => {
        if (res.success) {
          this.tableData = [...res.data]; 
        }
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveOrder() {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      this.computeAllError();
      return;
    }

    this.isSaving = true;
    
    const formValues = this.orderForm.getRawValue();
    const orderId = formValues.orderId;

    const payload: OrderPayload = {
      dealerId: formValues.dealerId!, 
      customerName: formValues.customerName ?? '',
      customerNumber: formValues.customerNumber ?? '',
      productId: formValues.productId!, // Using the new ID
      productSerialNumber: formValues.productSerialNumber ?? '',
      billDate: formValues.billDate ? new Date(formValues.billDate).toISOString().split('T')[0] : '',
      billPhotoBase64: formValues.billPhotoBase64 ?? '', // Updated key
    };

    const saveRequest$ = (orderId && orderId > 0)
      ? this.orderService.updateOrder(orderId, payload as OrderPayload)
      : this.orderService.createOrder(payload as OrderPayload);

    saveRequest$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeForm(); 
        this.fetchOrders(); 
      },
      error: (err) => {
        console.error('Error saving order', err);
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteRow(deletedRow: OrderMaster) {
    if (!confirm(`Are you sure you want to delete Order #${deletedRow.orderId}?`)) return;

    this.isLoading = true;
    this.cdr.detectChanges();

    this.orderService.deleteOrder(deletedRow.orderId).subscribe({
      next: () => {
        this.fetchOrders(); 
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openForm() {
    this.resetFormToDefault();
    this.isOpen = true;
    this.computeAllError();
  }

  closeForm() {
    this.isOpen = false;
    this.resetFormToDefault();
    this.cdr.detectChanges();
  }

  editRow(editedRow: OrderMaster) {
    this.openForm(); 
    
    // FIX: Disable the Bill Date field when editing an existing record
    this.orderForm.controls.billDate.disable();

    this.isLoading = true; 
    this.cdr.detectChanges();

    this.orderService.getOrderById(editedRow.orderId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.orderForm.patchValue(res.data);
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.closeForm(); 
        this.cdr.detectChanges();
      }
    });
  }

  computeAllError() {
    this.formErrors = getFormErrorMessages(this.orderForm);
  }

  private resetFormToDefault() {
    this.orderForm.controls.billDate.enable();

    this.orderForm.reset({
      orderId: 0,
      dealerId: this.isDealerUser ? this.userData!.dealerId : null,
      customerName: '',
      customerNumber: '',
      productId: null, 
      productSerialNumber: '',
      billDate: new Date(), 
      billPhotoBase64: '' 
    });
  }
}