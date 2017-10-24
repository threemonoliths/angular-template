import {DepotComponent} from './depot.component';
import {DepotListComponent} from './list/list.component';
import {DepotFormComponent} from './form/form.component';

export const depotRoutes = [{
	path: '',
	component: DepotComponent,
	children: [
		{ path: '', redirectTo: 'page', pathMatch: 'full' },
		{ path: 'page', component: DepotListComponent },
		{ path: 'form', component: DepotFormComponent },
		{ path: 'updateform', component: DepotFormComponent },
	]
}];