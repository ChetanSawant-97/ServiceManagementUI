import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';

// Common Components
import { InputText } from '../../common/forms/components/input-text/input-text';
import { SelectComponent } from '../../common/forms/components/input-select/input-select';
import { TableColumn, TableList } from '../../common/forms/components/table-list/table-list';
import { getFormErrorMessages } from '../../common/Utility';
import { OrderService } from '../services/OrderMaster.service';
import { DealerService } from '../../dealer/dealer.service';
import { OrderMaster } from '../models/OrderMaster';
import { InputDateComponent } from '../../common/forms/components/input-date-component/input-date-component';

@Component({
  selector: 'app-orders-management',
  imports: [
    CommonModule, ReactiveFormsModule, ButtonModule, 
    TableList, InputText, SelectComponent, TabsModule,InputDateComponent

  ],
  templateUrl: './orders-management.html',
  styleUrl: './orders-management.scss',
})
export class OrdersManagement implements OnInit {
  private orderService = inject(OrderService);
  private dealerService = inject(DealerService);
  private cdr = inject(ChangeDetectorRef);

  isOpen = false;
  isLoading = false;
  isSaving = false;
  formErrors: string[] = [];

  // Dropdown options
  statusOptions = ['Pending', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  dealerOptions: { label: string, value: number }[] = []; 

  tableColumns: TableColumn[] = [
    { field: 'customerName', header: 'Customer Name', width: '20%' },
    { field: 'customerNumber', header: 'Mobile No.', width: '15%' },
    { field: 'productName', header: 'Product', width: '20%' },
    { field: 'productSerialNumber', header: 'Product', width: '20%' },
    { field: 'billDate', header: 'Bill Date', width: '15%' },
    { field: 'actions', header: 'Actions', width: '20%' }
  ];

  tableData: OrderMaster[] = [];

 public orderForm = new FormGroup({
    orderId: new FormControl(0), // Keep if needed for frontend logic/edits
    dealerId: new FormControl<number | null>(null, [Validators.required]),
    customerName: new FormControl('', [Validators.required]),
    customerNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    productName: new FormControl('', [Validators.required]),
    productSerialNumber: new FormControl('', [Validators.required]),
    billDate: new FormControl<Date | string | null>(null, [Validators.required])
  });

  ngOnInit(): void {
    this.loadInitialData();

    this.orderForm.valueChanges.subscribe(() => {
      this.computeAllError();
    });  
  }

  // --- API Integrations ---

  loadInitialData() {
    this.isLoading = true;
    this.cdr.detectChanges();

    // Fetch dealers for the dropdown (assuming your SelectComponent accepts standard objects, 
    // you may need to map optionLabel/optionValue inside the SelectComponent HTML if it doesn't automatically)
    this.dealerService.getAllDealers().subscribe(res => {
      if (res.success) {
        this.dealerOptions = res.data.map(d => ({ label: d.dealerName, value: d.dealerId }));
      }
    });

    this.fetchOrders();
  }

  fetchOrders() {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
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
      return;
    }

    this.isSaving = true;
    
    const formValues = this.orderForm.getRawValue();
    const orderId = formValues.orderId;

    // Use fallback values (??) or non-null assertions (!) to satisfy the OrderPayload type
    const payload = {
      dealerId: formValues.dealerId!, 
      customerName: formValues.customerName ?? '',
      customerNumber: formValues.customerNumber ?? '',
      productName: formValues.productName ?? '',
      productSerialNumber: formValues.productSerialNumber ?? '',
      billDate: formValues.billDate ? new Date(formValues.billDate).toISOString().split('T')[0] : ''
    };

    const saveRequest$ = (orderId && orderId > 0)
      ? this.orderService.updateOrder(orderId, payload)
      : this.orderService.createOrder(payload);

    saveRequest$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeForm(); 
        this.fetchOrders(); 
      },
      error: () => {
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

  // --- UI Interactions ---

  openForm() {
    this.resetFormToDefault();
    this.isOpen = true;
    this.formErrors = [];
  }

  closeForm() {
    this.isOpen = false;
    this.resetFormToDefault();
    this.cdr.detectChanges();
  }

  editRow(editedRow: OrderMaster) {
    this.openForm(); 
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

  // 3. Update resetFormToDefault
  private resetFormToDefault() {
    this.orderForm.reset({
      orderId: 0,
      dealerId: null,
      customerName: '',
      customerNumber: '',
      productName: '',
      productSerialNumber: '',
      billDate: new Date() // Sets to today's date
    });
  }
}