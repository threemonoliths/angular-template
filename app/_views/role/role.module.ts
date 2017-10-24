import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { RoleComponent } from './role.component';
import { RoleFormComponent } from './form/form.component';
import { RoleListComponent } from './list/list.component';
import { RoleRoutes} from './role.routes';
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
//import {GrowlModule} from 'primeng/primeng';

 
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
    //GrowlModule,
    RouterModule.forChild(RoleRoutes)
  ],
  declarations: [
    RoleComponent,
    RoleFormComponent,
    RoleListComponent
  ],
  providers: [
    RoleService,ConfirmationService
  ]
})
export class RoleModule { }
