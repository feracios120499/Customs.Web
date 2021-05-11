import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthInterceptor } from './providers/inteceptor.provider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CabinetComponent } from './cabinet/cabinet.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  LocaleService,
  NgxDaterangepickerMd,
} from 'ngx-daterangepicker-material';
import { LottieModule } from 'ngx-lottie';
import { IConfig, NgxMaskModule } from 'ngx-mask';

export function playerFactory() {
  return import(
    /* webpackChunkName: 'lottie-web' */ 'lottie-web/build/player/lottie_light'
  );
}
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    ToastrModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgbModule,
    LottieModule.forRoot({
      player: playerFactory,
      useCache: true,
    }),
    NgxMaskModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    LocaleService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
