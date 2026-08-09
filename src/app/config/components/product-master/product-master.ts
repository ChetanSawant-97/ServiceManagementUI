import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { getFormErrorMessages } from '../../../common/Utility';
import { ProductDetails, ProductPayload } from '../../models/ProductMaster';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableColumn, TableList } from '../../../common/forms/components/table-list/table-list';
import { ProductService } from '../../services/Product.service';
import { InputText } from '../../../common/forms/components/input-text/input-text';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-product-master',
  imports: [InputText,TableList,ReactiveFormsModule,ButtonModule],
  templateUrl: './product-master.html',
  styleUrl: './product-master.scss',
})
export class ProductMaster {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  isOpen = false;
  isLoading = false;
  isSaving = false;
  formErrors: string[] = [];

  tableColumns: TableColumn[] = [
    { field: 'productName', header: 'Product Name', width: '50%' },
    { field: 'productCode', header: 'Product Code', width: '50%' }
  ];

  tableData: ProductDetails[] = [];

  public productForm = new FormGroup({
    productId: new FormControl(0), 
    productName: new FormControl('', [Validators.required]),
    productCode: new FormControl('', [Validators.required]),
    isDeleted: new FormControl(false)
  });

  ngOnInit(): void {
    this.fetchProducts();

    this.productForm.valueChanges.subscribe(() => {
      this.computeAllError();
    });  
  }

  fetchProducts() {
    this.isLoading = true;
    this.cdr.detectChanges(); 

    this.productService.getAllProducts().subscribe({
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

  saveProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.computeAllError();
      return;
    }

    this.isSaving = true;
    const formValues = this.productForm.getRawValue();
    const productId = formValues.productId;

    const payload: ProductPayload = {
      productName: formValues.productName ?? '',
      productCode: formValues.productCode ?? ''
    };

    const saveRequest$ = (productId && productId > 0)
      ? this.productService.updateProduct(productId, payload)
      : this.productService.createProduct(payload);

    saveRequest$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeForm(); 
        this.fetchProducts(); 
      },
      error: () => {
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteRow(deletedRow: ProductDetails) {    
    this.isLoading = true;
    this.cdr.detectChanges();

    this.productService.deleteProduct(deletedRow.productId).subscribe({
      next: () => {
        this.fetchProducts(); 
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

  editRow(editedRow: ProductDetails) {
    this.openForm(); 
    this.isLoading = true; 
    this.cdr.detectChanges();

    this.productService.getProductById(editedRow.productId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.productForm.patchValue(res.data);
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
    this.formErrors = getFormErrorMessages(this.productForm);
  }

  private resetFormToDefault() {
    this.productForm.reset({
      productId: 0,
      productName: '',
      productCode: '',
      isDeleted: false
    });
  }
}
