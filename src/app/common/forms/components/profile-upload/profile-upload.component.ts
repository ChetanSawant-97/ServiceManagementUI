import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-upload',
  imports: [CommonModule, TooltipModule],
  templateUrl: './profile-upload.html',
  styleUrl: './profile-upload.scss',
})
export class ProfileUpload {
  @Input({ required: true }) control!: FormControl; 
  @Input() label: string = '';
  @Input() maxFileSize: number = 5000000; // Default 5MB

  @Output() validationError = new EventEmitter<string>();

  previewUrl: string | null = null;
  private formSub!: Subscription;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // 1. Check for initial value on load
    if (this.control.value) {
      this.loadExistingBase64(this.control.value);
    }

    // 2. Listen for form resets or programmatic changes
    this.formSub = this.control.valueChanges.subscribe(val => {
      if (!val) {
        this.clearUI();
      } else if (!this.previewUrl) {
        this.loadExistingBase64(val);
      }
    });
  }

  onNativeFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > this.maxFileSize) {
      this.validationError.emit(
        `Image is too large. Max size is ${(this.maxFileSize / (1024 * 1024)).toFixed(1)} MB.`
      );
      input.value = '';
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      this.validationError.emit('Only image files are allowed for profile photos.');
      input.value = '';
      return;
    }

    this.previewUrl = URL.createObjectURL(file);

    const reader = new FileReader();
    reader.onload = () => {
      const base64Value = typeof reader.result === 'string' ? reader.result : '';
      this.control.setValue(base64Value); 
      this.cdr.detectChanges(); 
    };
    reader.readAsDataURL(file);
  }

  removeFile(fileInputRef: HTMLInputElement, event: Event) {
    event.stopPropagation(); // Prevent triggering the upload click
    this.clearUI();
    fileInputRef.value = '';
    this.control.setValue(''); 
  }

  private clearUI() {
    if (this.previewUrl && this.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = null;
    this.cdr.detectChanges();
  }

  private loadExistingBase64(val: string) {
    try {
      const isDataUri = val.includes(',');
      const rawBase64 = isDataUri ? val.split(',')[1] : val;
      const cleanBase64 = rawBase64.replace(/[^A-Za-z0-9+/=]/g, ""); 
      const mimeType = isDataUri ? val.split(',')[0].match(/:(.*?);/)?.[1] || 'image/jpeg' : 'image/jpeg';

      this.previewUrl = isDataUri ? val : `data:${mimeType};base64,${cleanBase64}`;
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
