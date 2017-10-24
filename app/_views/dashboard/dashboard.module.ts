import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { DashboardDemo } from './dashboarddemo';
import { dashboardRoutes} from './dashboard.routes';

 
@NgModule({
  imports: [
    
    CommonModule,
    RouterModule.forChild(dashboardRoutes)
  ],
  declarations: [
    DashboardDemo
  ],
  providers: [
  ]
})
export class DashboardModule { }
