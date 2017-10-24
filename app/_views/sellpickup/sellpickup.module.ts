import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import {SellpickupComponent } from './sellpickup.component';
import { SellpickupFormComponent } from './form/form.component';
import {SellpickupListComponent } from './list/list.component';
import {sellpickupRoutes} from './sellpickup.routes';
import {SellpickupService } from '../../_services/sellpickups';
//import { RoleService } from '../../_services/role.service';

import {DataTableModule} from 'primeng/primeng';
import {BreadcrumbModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';
import {SplitButtonModule} from 'primeng/primeng';
import {ToolbarModule} from 'primeng/primeng';
import {InputTextModule} from 'primeng/primeng';
import {PanelModule} from 'primeng/primeng';
import {PickListModule} from 'primeng/primeng';
import {ConfirmDialogModule, ConfirmationService} from 'primeng/primeng';
import {MessagesModule} from 'primeng/primeng';
import {CalendarModule} from 'primeng/primeng';

 
@NgModule({
  imports: [
    CommonModule,
    DataTableModule,
    BreadcrumbModule,
    ButtonModule,
    SplitButtonModule,
    ToolbarModule,
    InputTextModule,
    PanelModule,
    FormsModule,
    ReactiveFormsModule,
    PickListModule,
    ConfirmDialogModule,
    MessagesModule,
    CalendarModule,
    RouterModule.forChild(sellpickupRoutes)
  ],
  declarations: [
   SellpickupComponent,
   SellpickupFormComponent,
   SellpickupListComponent
  ],
  providers: [
   SellpickupService,
    ConfirmationService
  ]
})
export class SellpickupModule { }
