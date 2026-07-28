import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type FormModel<T> = {
    [K in keyof T]: FormControl<T[K] | null>;
};