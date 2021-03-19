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



@NgModule({

  imports: [
    RouterModule.forChild(CabinetRoutes),
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [CabinetComponent, DashboardComponent, NavbarComponent],
})
export class CabinetModule { }
