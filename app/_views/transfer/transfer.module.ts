import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { TransferComponent } from './transfer.component';
import { TransferFormComponent } from './form/form.component';
import { TransferListComponent } from './list/list.component';
import { transferRoutes} from './transfer.routes';
import { TransferService } from '../../_services/transfer.service';
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
    RouterModule.forChild(transferRoutes)
  ],
  declarations: [
    TransferComponent,
    TransferFormComponent,
    TransferListComponent
  ],
  providers: [
    TransferService,
    ConfirmationService
  ]
})
export class TransferModule { }
