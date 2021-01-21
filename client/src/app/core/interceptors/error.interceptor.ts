import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  constructor(private routner: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error=>{
        if(error){
          if(error.status===400){
            if(error.error.errors){
              throw error.error;
            }
            else{
              this.toastr.error(error.error.message,error.error.statusCode);
            }
          }
          if(error.status===401){
            this.toastr.error(error.error.message,error.error.statusCode);
          }
          if(error.status===500){
            const navigationExtras: NavigationExtras={state:{error:error.error}};
            this.routner.navigateByUrl('/server-error',navigationExtras);
          }
          if(error.status===404){
            this.routner.navigateByUrl('/not-found');
          }
        }
        return throwError(error);
      })
    );
  }
}
