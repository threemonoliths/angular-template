import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { DepotDetailComponent } from './depotdetail.component';
import { DepotDetailFormComponent } from './form/form.component';
import { DepotDetailListComponent } from './list/list.component';
import { depotdetailRoutes} from './depotdetail.routes';
import { DepotDetailService } from '../../_services/depotdetail.service';
import { RoleService } from '../../_services/role.service';

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
    RouterModule.forChild(depotdetailRoutes)
  ],
  declarations: [
    DepotDetailComponent,
    DepotDetailFormComponent,
    DepotDetailListComponent
  ],
  providers: [
    DepotDetailService,
   ConfirmationService
  ]
})
export class DepotDetailModule { }
