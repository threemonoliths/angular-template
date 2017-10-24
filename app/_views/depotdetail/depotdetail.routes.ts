import {DepotDetailComponent} from './depotdetail.component';
import {DepotDetailListComponent} from './list/list.component';
import {DepotDetailFormComponent} from './form/form.component';

export const depotdetailRoutes = [{
	path: '',
	component: DepotDetailComponent,
	children: [
		{ path: '', redirectTo: 'page', pathMatch: 'full' },
		{ path: 'page', component: DepotDetailListComponent },
		{ path: 'form', component: DepotDetailFormComponent },
		{ path: 'updateform', component: DepotDetailFormComponent },
	]
}];