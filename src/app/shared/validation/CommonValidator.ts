import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';

const getLength = (c: AbstractControl) => (c.value || '').toString().trim().length

export class CommonValidator {
  static required = (c: AbstractControl) => getLength(c) === 0 ? {required: true} : null

  static minLength = (min: number): ValidatorFn => (c: AbstractControl) => {
    const len = getLength(c);
    return len > 0 && len < min ? { minLength: { requiredLength: min, actualLength: len } } : null;
  };

  static maxLength = (max: number): ValidatorFn => (c: AbstractControl) => {
    const len = getLength(c);
    return len > max ? { maxLength: { requiredLength: max, actualLength: len } } : null;
  };
  static noWhitespace = (c: AbstractControl) => {
    const val = (c.value || '').toString();
    return val.trim().length === 0 && val.length > 0 ? { whitespace: true } : null;
  };
  static noSpaces = (c: AbstractControl) => {
    const value = (c.value || '').toString();
    return value.includes(' ') ? { spaces: true } : null;
  };

  static usernameOrEmailSmart(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const input = value.toString();
    if (input.includes('@')) {
      const emailError = Validators.email(control);
      if (emailError) return emailError;
      const minErr = CommonValidator.minLength(5)(control);
      if (minErr) return minErr;
      const maxErr = CommonValidator.maxLength(254)(control);
      if (maxErr) return maxErr;
    }
    else {
      const minErr = CommonValidator.minLength(8)(control);
      if (minErr) return minErr;
      const maxErr = CommonValidator.maxLength(30)(control);
      if (maxErr) return maxErr;
      const patternErr = Validators.pattern(/^[a-zA-Z0-9_-]+$/)(control);
      if (patternErr) return patternErr;
    }
    return null;
  }
}
