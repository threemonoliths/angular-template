import {Routes,RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import { AuthGuard } from './_guards/auth.guard';

import {LoginComponent} from './_views/login/login.component';

export const appRoutes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'home',
		loadChildren: './_views/home/home.module#HomeModule',
		canActivate: [AuthGuard]
	},
	{
		path: 'dashboard',
		loadChildren: './_views/dashboard/dashboard.module#DashboardModule'
		//scanActivate: [AuthGuard]
	},
	{
		path: '**', // fallback router must in the last
		component: LoginComponent
	}
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(appRoutes);
