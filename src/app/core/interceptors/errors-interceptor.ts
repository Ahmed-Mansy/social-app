import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
export const errorsInterceptor: HttpInterceptorFn = (req, next) => {

  const toaster = inject(ToastrService)

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      toaster.error(error.message)

      return throwError(() => error)
    })


  );
};
