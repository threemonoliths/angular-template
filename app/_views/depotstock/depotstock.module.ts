import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import {DepotstockComponent } from './depotstock.component';
import {DepotstockListComponent} from './list/list.component';
import {DepotstockFormComponent} from './form/form.component';
import {depotstockRoutes} from './depotstock.routes';
import {DepotstockService } from '../../_services/depotstock.service';
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
    RouterModule.forChild(depotstockRoutes)
  ],
  declarations: [
    DepotstockComponent,
    DepotstockFormComponent,
    DepotstockListComponent  ],
    providers: [
    DepotstockService,
    RoleService,
    ConfirmationService,
  ]
})
export class DepotstockModule { }
