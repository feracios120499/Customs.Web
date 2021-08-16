import { ScrollingModule } from '@angular/cdk/scrolling';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LocaleService, NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { LottieModule } from 'ngx-lottie';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './providers/inteceptor.provider';

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
    ToastrModule.forRoot({
      timeOut: 10000,
      progressBar: true,
      easing: 'ease-out',
    }),
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
    ScrollingModule,
    NgScrollbarModule
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
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
