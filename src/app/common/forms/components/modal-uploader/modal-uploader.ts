import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

export type FileCategory = 'images' | 'pdfs' | 'docs' | 'spreadsheets' | 'all' | string;

@Component({
  selector: 'app-modal-uploader',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TooltipModule],
  templateUrl: './modal-uploader.html',
  styleUrls: ['./modal-uploader.scss']
})
export class ModalUploaderComponent implements OnInit, OnDestroy {
  @Input({ required: true }) control!: FormControl; 

  primeNgAcceptStr: string = 'image/*';

  @Input() set acceptCategory(category: FileCategory) {
    const typeMap: Record<string, string> = {
      'images': 'image/*',
      'pdfs': 'application/pdf',
      'docs': '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'spreadsheets': '.xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'all': '*/*'
    };
    this.primeNgAcceptStr = typeMap[category?.toLowerCase()] || category;
  }

  @Input() buttonLabel: string = 'Upload file';
  @Input() maxFileSize: number = 5000000;

  @Output() validationError = new EventEmitter<string>();

  showPreviewModal = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isImage = false;
  private formSub!: Subscription;

  // Inject ChangeDetectorRef here
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.control.value) {
      this.loadExistingBase64(this.control.value);
    }

    this.formSub = this.control.valueChanges.subscribe(val => {
      if (!val) {
        this.clearUI();
      } else if (!this.selectedFile) {
        this.loadExistingBase64(val);
      }
    });
  }

  onNativeFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > this.maxFileSize) {
      this.validationError.emit(
        `File is too large. Max size is ${(this.maxFileSize / (1024 * 1024)).toFixed(1)} MB.`
      );
      input.value = '';
      return;
    }

    this.selectedFile = file;
    this.isImage = file.type.startsWith('image/');
    this.previewUrl = URL.createObjectURL(file);

    const reader = new FileReader();
    reader.onload = () => {
      const base64Value = typeof reader.result === 'string' ? reader.result : '';
      this.control.setValue(base64Value, { emitEvent: false }); // Prevent infinite loop
      this.cdr.detectChanges(); // Force UI update
    };
    reader.readAsDataURL(file);
  }

  removeFile(fileInputRef: HTMLInputElement) {
    this.clearUI();
    fileInputRef.value = '';
    this.control.setValue('', { emitEvent: false }); 
  }

  viewFile() {
    this.showPreviewModal = true;
  }

  closeModal() {
    this.showPreviewModal = false;
  }

  confirmUpload() {
    this.showPreviewModal = false;
  }

  private clearUI() {
    this.selectedFile = null;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
    this.cdr.detectChanges(); // Force UI to clear
  }

  private loadExistingBase64(val: string) {
    try {
      const isDataUri = val.includes(',');
      const rawBase64 = isDataUri ? val.split(',')[1] : val;
      
      // Strip any whitespace/newlines from DB strings so atob() doesn't crash
      const cleanBase64 = rawBase64.replace(/[^A-Za-z0-9+/=]/g, ""); 
      
      const mimeType = isDataUri ? val.split(',')[0].match(/:(.*?);/)?.[1] || 'image/jpeg' : 'image/jpeg';

      const byteString = atob(cleanBase64);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([int8Array], { type: mimeType });
      
      // Default file name as requested
      this.selectedFile = new File([blob], 'bill_image.jpg', { type: mimeType });
      
      this.isImage = true;
      this.previewUrl = isDataUri ? val : `data:${mimeType};base64,${cleanBase64}`;

      // Force Angular to render the "AFTER upload" HTML template immediately
      this.cdr.detectChanges(); 
      
    } catch (e) {
      console.error('Failed to parse existing base64 image', e);
    }
  }

  ngOnDestroy() {
    this.clearUI();
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }
}