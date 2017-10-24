import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import {MeteringReturnComponent } from './meteringreturn.component';
import {MeteringReturnFormComponent } from './form/form.component';
import {MeteringReturnListComponent } from './list/list.component';
import { MeteringReturnRoutes} from './meteringreturn.routes';
import { MeteringReturnService } from '../../_services/meteringreturn.service';

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
     CalendarModule,
    ConfirmDialogModule,
    MessagesModule,
    //GrowlModule,
    RouterModule.forChild(MeteringReturnRoutes)
  ],
  declarations: [
    MeteringReturnComponent,
    MeteringReturnFormComponent,
    MeteringReturnListComponent
  ],
  providers: [
    MeteringReturnService,ConfirmationService
  ]
})
export class MeteringReturnModule { }
