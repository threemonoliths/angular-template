import {NgModule}      from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule}    from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LocationStrategy,HashLocationStrategy} from '@angular/common';
import {AppRoutes} from './app.routes';
import 'rxjs/add/operator/toPromise';

import {InputTextModule} from 'primeng/primeng';

import {AppComponent}  from './app.component';
import {LoginComponent} from './_views/login/login.component';
import {EventBusService} from './_services/eventbus.service';
import { AuthenticationService } from './_services/authentication.service';
import { AuthGuard } from './_guards/auth.guard';
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutes,
        HttpModule,
        InputTextModule,
        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent,
        LoginComponent
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        EventBusService,
        AuthenticationService,
         AuthGuard
    ],

    bootstrap:[AppComponent]
})
export class AppModule { }
