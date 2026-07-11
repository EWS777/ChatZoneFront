import { HttpInterceptorFn } from '@angular/common/http';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  }

  const xsrfToken = getCookie('XSRF-TOKEN');

  if (xsrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    req = req.clone({
      headers: req.headers.set('X-XSRF-TOKEN', xsrfToken)
    });
  }

  return next(req);
}
