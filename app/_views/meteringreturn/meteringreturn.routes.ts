import {MeteringReturnComponent} from './meteringreturn.component';
import {MeteringReturnListComponent} from './list/list.component';
import {MeteringReturnFormComponent} from './form/form.component';

export const MeteringReturnRoutes = [{
	path: '',
	component: MeteringReturnComponent,
	children: [
		{ path: '', redirectTo: 'page', pathMatch: 'full' },
		{ path: 'page', component: MeteringReturnListComponent },
		{ path: 'form', component: MeteringReturnFormComponent },
		{ path: 'updateform', component: MeteringReturnFormComponent }
	]
}];