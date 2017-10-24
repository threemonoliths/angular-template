import {NgModule}      from '@angular/core';
import {LocationStrategy,HashLocationStrategy} from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import {BreadcrumbModule} from 'primeng/primeng';
import {GrowlModule} from 'primeng/primeng';

import {AppMenuComponent,AppSubMenu}  from '../layout-leftmenu/app.menu.component';
import {AppTopBar}  from '../layout-topbar/app.topbar.component';
import {AppFooter}  from '../layout-footer/app.footer.component';
import {AppRightPanel}  from '../layout-rightpanel/app.rightpanel.component';
import {InlineProfileComponent}  from '../layout-leftmenu/app.profile.component';
import {homeRoutes} from './home.routes';
import {HomeComponent} from './home.component';

@NgModule({
    imports: [
        CommonModule,
        BreadcrumbModule,
        GrowlModule,
        RouterModule.forChild(homeRoutes)
    ],
    declarations: [
        AppMenuComponent,
        AppSubMenu,
        AppTopBar,
        AppFooter,
        AppRightPanel,
        InlineProfileComponent,
        HomeComponent
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
    ]
})
export class HomeModule { }
