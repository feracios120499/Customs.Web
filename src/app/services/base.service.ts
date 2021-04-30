import { Observable, throwError, ReplaySubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export abstract class BaseService {

  loading = false;
  constructor() { }
  public loadingSource = new ReplaySubject<boolean>();
  loading$ = this.loadingSource.asObservable();


  protected handleError(error: HttpErrorResponse) {
    // this.loading = false;
  console.log(error);
    if (error.url) {
      if (error.url.indexOf('demo') > 0 && error.url.indexOf('.json') > 0) {
        if (error.url.indexOf('en-US') > 0) {
          return throwError('Function not available in demo mode!');
        }
        if (error.url.indexOf('ru-RU') > 0) {
          return throwError('Функция не доступна в демо режиме!');
        }
        if (error.url.indexOf('uk-UA') > 0) {
          return throwError('Функція не доступна в демо режимі!');
        }
      }
    }


    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.log(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }

    if (error.status == 401) {
      return throwError('');
    }

    // return an observable with a user-facing error message
    if (typeof (error.error) == 'string') {
      return throwError(error.error);
    }
    if ('DOMException' == error.constructor.name) {
      return throwError(error.message);
    }
    if (error.error instanceof ProgressEvent) {
      return throwError(error.message);
    } else {
      return throwError(error);
    }
    // error
  }

  triggerLoading(loading: boolean) {
    this.loadingSource.next(loading);
  }
}

