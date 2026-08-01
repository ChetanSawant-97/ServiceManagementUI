import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

export type FileCategory = 'images' | 'pdfs' | 'docs' | 'spreadsheets' | 'all' | string;

@Component({
  selector: 'app-modal-uploader',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TooltipModule],
  templateUrl: './modal-uploader.html',
  styleUrls: ['./modal-uploader.scss']
})
export class ModalUploaderComponent implements OnDestroy {

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

  @Output() fileChanged = new EventEmitter<File | null>();

  showPreviewModal = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isImage = false;

  @Output() validationError = new EventEmitter<string>();

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

    this.fileChanged.emit(this.selectedFile);
  }

  viewFile() {
    this.showPreviewModal = true;
  }

  closeModal() {
    this.showPreviewModal = false;
  }

  confirmUpload() {
    // selectedFile is already emitted to the parent via fileChanged on select.
    // This just closes the review modal; hook in an actual upload call here
    // if this component should trigger the HTTP request itself.
    this.showPreviewModal = false;
  }

  removeFile(fileInputRef: HTMLInputElement) {
    this.selectedFile = null;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
    // Reset the native input so selecting the same file again still fires 'change'
    fileInputRef.value = '';
    this.fileChanged.emit(null);
  }

  ngOnDestroy() {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }
}