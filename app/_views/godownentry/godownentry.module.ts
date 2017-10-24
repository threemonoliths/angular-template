import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { GodownentryComponent } from './godownentry.component';
import { GodownentryFormComponent } from './form/form.component';
import {GodownentryListComponent } from './list/list.component';
import {godownentryRoutes} from './godownentry.routes';
import {GodownentryService } from '../../_services/godownentry.service';
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
    RouterModule.forChild(godownentryRoutes)
  ],
  declarations: [
   GodownentryComponent,
   GodownentryFormComponent,
    GodownentryListComponent
  ],
  providers: [
   GodownentryService,
    ConfirmationService
  ]
})
export class GodownentryModule { }
