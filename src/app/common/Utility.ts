import { FormGroup } from '@angular/forms';

export const getFormErrorMessages = (form: FormGroup): string[] => {
  const errorMessages: string[] = [];

  Object.keys(form.controls).forEach((key) => {
    const control = form.get(key);
    
    // Capitalize the field name (e.g., 'username' -> 'Username')
    const fieldName = key.charAt(0).toUpperCase() + key.slice(1);

    if (control?.errors) {
      if (control.errors['required']) {
        errorMessages.push(`${fieldName} field is strictly required.`);
      }
      if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        errorMessages.push(`${fieldName} needs at least ${requiredLength} characters.`);
      }
      if (control.errors['maxlength']) {
        const requiredLength = control.errors['maxlength'].requiredLength;
        errorMessages.push(`${fieldName} cannot exceed ${requiredLength} characters.`);
      }
    }
  });

  return errorMessages;
};