import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, timer } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const spinner = inject(NgxSpinnerService)

  spinner.show()

  return next(req).pipe(

    finalize(() => {
      timer(1000).subscribe(() => {
        spinner.hide()
      })
    })


  );
};
