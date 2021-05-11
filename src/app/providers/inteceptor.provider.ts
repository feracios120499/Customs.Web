import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, Subject, interval } from 'rxjs';
import { tap, throttleTime, throttle, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { TokenResponse } from '../models/TokenResponse';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  endpoint: string = 'https://uacustoms.unity-bars.com/api/v1/';
  tokenEndpoint: string = '/Bars.API.Admin.Site/';
  host: string = '';

  constructor(
    private router: Router,
    private translate: TranslateService,
    private authService: AuthService
  ) {
    console.log('AuthInterceptor created');
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const requestFormated = this.formatRequest(request);
    return next.handle(requestFormated).pipe(
      map((data) => {
        return data;
      }),
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (event.body?.StatusCode == 401) {
              this.authService.logOut();
            }
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.authService.logOut();
            }
            return throwError(err);
          }
          return throwError(err);
        }
      )
    );
  }

  formatRequest(request: HttpRequest<any>): HttpRequest<any> {
    // let end_point = this.demoService.isDemo ? `assents/demo/${this.getCurrentLang()}/`:  this.endpoint;
    var language =
      this.translate.currentLang == 'ua'
        ? 'uk-UA'
        : this.translate.currentLang == 'ru'
        ? 'ru-RU'
        : 'en-US';
    if (request.method === 'POST' || request.method === 'PUT') {
      this.shiftDates(request.body);
    }
    const tokenJSON = sessionStorage.getItem('userToken');
    let token = '';
    if (tokenJSON) {
      const accesstoken: TokenResponse = JSON.parse(tokenJSON);
      token = accesstoken.access_token;
    }
    const prefix = request.url.indexOf('?') > 0 ? '&_=' : '?_=';

    if (this.isStaticFileRequest(request.url)) {
      console.log('1:' + this.isStaticFileRequest(request.url));
      request = request.clone({
        url: request.url + prefix + this.customDate(new Date(), '.'),
      });

      return request;
    }

    if (this.isDocs(request.url) || this.isLinks(request.url)) {
      console.log('2:' + this.isDocs(request.url) || this.isLinks(request.url));
      request = request.clone({
        url:
          this.host + request.url + prefix + this.customDate(new Date(), '.'),
      });
      return request;
    }

    if (token != '' && !this.isStaticFileRequest(request.url)) {
      console.log('3:' + !this.isStaticFileRequest(request.url));
      request = request.clone({
        url: this.endpoint + request.url + prefix + this.timeStamp(),
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': language,
        },
      });
    }

    if (token == '' && !this.isStaticFileRequest(request.url)) {
      console.log('4:' + token == '' && !this.isStaticFileRequest(request.url));
      request = request.clone({
        url: this.endpoint + request.url + prefix + this.timeStamp(),
        setHeaders: {
          'Accept-Language': 'en-US',
        },
      });
    }

    console.log(request.headers);
    return request;
  }

  isDocs(url): boolean {
    return url.indexOf('docs') >= 0;
  }

  isLinks(url): boolean {
    return url.indexOf('link') >= 0;
  }

  isStaticFileRequest(url): boolean {
    return url.indexOf('i18n') >= 0 || url.indexOf('.svg') >= 0;
  }

  getCurrentLang(): string {
    return this.translate.currentLang;
  }

  timeStamp(): string {
    return (
      new Date().getDay() +
      new Date().getMilliseconds() +
      new Date().getMonth() +
      new Date().getMilliseconds()
    ).toString();
  }

  customDate(date: Date, separator: string) {
    const mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();
    return [
      (dd > 9 ? '' : '0') + dd,
      (mm > 9 ? '' : '0') + mm,
      date.getFullYear(),
    ].join(separator);
  }

  shiftDates(body) {
    if (body === null || body === undefined) {
      return body;
    }

    if (typeof body !== 'object') {
      return body;
    }

    for (const key of Object.keys(body)) {
      const value = body[key];
      if (typeof value === 'object') {
        body[key] = this.convertDateToString(value);
        this.shiftDates(value);
      }
    }
  }
  convertDateToString(dateObject) {
    if (!dateObject || !dateObject._isAMomentObject) {
      return dateObject;
    }
    var date = dateObject.format('YYYY-MM-DD');
    var time = dateObject.format('HH:mm:ss');
    return `${date}T${time}`;
  }
}
