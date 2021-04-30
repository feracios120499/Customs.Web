import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabinetComponent } from './cabinet.component';
import { RouterModule } from '@angular/router';
import { CabinetRoutes } from './cabinet-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BrowserModule } from '@angular/platform-browser';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxSpinnerModule } from 'ngx-spinner';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { DeclarationComponent } from '../declaration/declaration.component';
import { Ng2DeepSearchPipe } from '../directives/filter.pipe';



@NgModule({

  imports: [
    RouterModule.forChild(CabinetRoutes),
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    NgbModule,
    NgxDaterangepickerMd,
    NgxSpinnerModule,
    Ng2SearchPipeModule
  ],
  declarations: [CabinetComponent, DashboardComponent, NavbarComponent, DeclarationComponent,Ng2DeepSearchPipe],
})
export class CabinetModule { }
