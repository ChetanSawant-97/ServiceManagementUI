import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TableColumn, TableList } from '../../../common/forms/components/table-list/table-list';
import { Area, AreaPayload } from '../../models/Areas';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AreaService } from '../../services/areas.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputText } from '../../../common/forms/components/input-text/input-text';

@Component({
  selector: 'app-areas-component',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, TableList, InputText],
  templateUrl: './areas-component.html',
  styleUrl: './areas-component.scss',
})
export class AreasComponent {
  private areaService = inject(AreaService);
  private cdr = inject(ChangeDetectorRef);

  isOpen = false;
  isLoading = false;
  isSaving = false;

  tableColumns: TableColumn[] = [
    { field: 'areaName', header: 'Area Name', width: '50%', filterable: true },
    { field: 'city', header: 'City', width: '50%', filterable: true }
  ];

  tableData: Area[] = [];

  public areaForm = new FormGroup({
    id: new FormControl(0),
    areaName: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.fetchAreas();
  }

  fetchAreas() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.areaService.getAreas().subscribe({
      next: (res) => {
        if (res.success && res.data) {
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

  saveArea() {
    if (this.areaForm.invalid) {
      this.areaForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValues = this.areaForm.getRawValue();
    const areaId = formValues.id;

    const payload: AreaPayload = {
      areaName: formValues.areaName ?? '',
      city: formValues.city ?? ''
    };

    const saveRequest$ = (areaId && areaId > 0)
      ? this.areaService.updateArea(areaId, payload)
      : this.areaService.createArea(payload);

    saveRequest$.subscribe({
      next: () => {
        this.isSaving = false;
        this.closeForm();
        this.fetchAreas();
      },
      error: () => {
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  editRow(editedRow: Area) {
    this.openForm();
    this.areaForm.patchValue({
      id: editedRow.id,
      areaName: editedRow.areaName,
      city: editedRow.city
    });
  }

  deleteRow(deletedRow: Area) {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.areaService.deleteArea(deletedRow.id).subscribe({
      next: () => {
        this.fetchAreas();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openForm() {
    this.resetForm();
    this.isOpen = true;
  }

  closeForm() {
    this.isOpen = false;
    this.resetForm();
    this.cdr.detectChanges();
  }

  private resetForm() {
    this.areaForm.reset({
      id: 0,
      areaName: '',
      city: ''
    });
  }
}
