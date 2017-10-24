import {SellpickupComponent} from './sellpickup.component';
import {SellpickupListComponent} from './list/list.component';
import {SellpickupFormComponent} from './form/form.component';

export const sellpickupRoutes = [{
	path: '',
	component: SellpickupComponent,
	children: [
		{ path: '', redirectTo: 'page', pathMatch: 'full' },
		{ path: 'page', component: SellpickupListComponent },
		{ path: 'form', component: SellpickupFormComponent},
		{ path: 'updateform', component:SellpickupFormComponent },
	]
}];