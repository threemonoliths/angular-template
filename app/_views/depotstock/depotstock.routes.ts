import {DepotstockComponent } from './depotstock.component';
import {DepotstockListComponent} from './list/list.component';
import {DepotstockFormComponent} from './form/form.component';

export const depotstockRoutes = [{
	path: '',
	component: DepotstockComponent,
	children: [
		{ path: '', redirectTo: 'page', pathMatch: 'full' },
		{ path: 'page', component: DepotstockListComponent },
		{ path: 'form', component: DepotstockFormComponent },
		{ path: 'updateform', component: DepotstockFormComponent },
	]
}];