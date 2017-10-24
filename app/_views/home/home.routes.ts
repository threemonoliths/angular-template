import { HomeComponent } from './home.component';
import { UserComponent } from '../user/user.component';
import { RoleComponent } from '../role/role.component';
import { ContractComponent } from '../contract/contract.component';
import { CompanyComponent } from '../company/company.component';
import { TransferComponent } from '../transfer/transfer.component';
import { DepotComponent } from '../depot/depot.component';
import {MeteringReturnComponent } from '../meteringreturn/meteringreturn.component';
import { DispatchComponent } from '../dispatch/dispatch.component';
import { DictionaryComponent } from '../dictionary/dictionary.component';

import { DepotDetailComponent } from '../depotdetail/depotdetail.component';


import {GodownentryComponent}from '../godownentry/godownentry.component';
import{SellpickupComponent}from '../sellpickup/sellpickup.component';

export const homeRoutes = [
	{
		path: '',
		component: HomeComponent,
		children: [
             { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			// { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule' },
			 { path: 'user', loadChildren: '../user/user.module#UserModule' },
			 { path: 'role', loadChildren: '../role/role.module#RoleModule' },
			 { path: 'contract', loadChildren: '../contract/contract.module#ContractModule' },
			 { path: 'transfer', loadChildren: '../transfer/transfer.module#TransferModule' },
			{ path: 'company', loadChildren: '../company/company.module#CompanyModule' },
			{path: 'depot',loadChildren:'../depot/depot.module#DepotModule'},
			 { path: 'meteringreturn', loadChildren: '../meteringreturn/meteringreturn.module#MeteringReturnModule' },
			 { path: 'dispatch', loadChildren: '../dispatch/dispatch.module#DispatchModule' },
			 { path: 'dictionary', loadChildren: '../dictionary/dictionary.module#DictionaryModule' },
            { path: 'depotdetail', loadChildren: '../depotdetail/depotdetail.module#DepotDetailModule' },
            { path: 'sellpickup', loadChildren: '../sellpickup/sellpickup.module#SellpickupModule' },
			 { path: 'godownentry', loadChildren: '../godownentry/godownentry.module#GodownentryModule' },
			  { path: 'depotstock', loadChildren: '../depotstock/depotstock.module#DepotstockModule'}
             

		]
	}
];