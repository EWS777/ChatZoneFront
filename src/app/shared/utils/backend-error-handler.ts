import { FormGroup } from '@angular/forms';

export function handleBackendErrors(err: any, form: FormGroup, component: { commonError: string }): void {
  if (err.status === 400 && err.error && err.error.errors) {
    const errors = err.error.errors;
    const unmatched: string[] = [];

    Object.keys(errors).forEach(key => {
      const control = form.get(key.charAt(0).toLowerCase() + key.slice(1));
      if (control) {
        control.setErrors({ backend: errors[key] });
        control.markAsTouched();
      } else {
        unmatched.push(...[].concat(errors[key]));
      }
    });

    if (unmatched.length) component.commonError = unmatched.join(' ');
  } else {
    component.commonError = err.error?.title || 'Unhandled exception. To repair';
  }

}
