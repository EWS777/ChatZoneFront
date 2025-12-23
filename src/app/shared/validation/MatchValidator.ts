import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function matchValidator(controlName: string, matchingControlName: string): ValidatorFn{
  return (group: AbstractControl): ValidationErrors | null => {
        const control = group.get(controlName);
    const matchingControl = group.get(matchingControlName);

    if (!control || !matchingControl) return null;

    if (control.value !== matchingControl.value) {
    const currentErrors = matchingControl.errors || {};
    matchingControl.setErrors({ ...currentErrors, passwordMismatch: true });
    return { passwordMismatch: true }
    }

    return null
  }
}
